# Firebase rule review

The rules in `Functions/database.rules.json` and `Functions/firestore.rules` are hardened versions of the supplied rules. `Functions/firebase.json` references both. They have not been deployed. No automated authorization tests were added, as requested.

## Confirmed issues in the supplied rules

| Original condition | Effect | Change |
| --- | --- | --- |
| Firestore `sameCompany(request.auth.uid)` | Compares the caller's user record to itself; does not scope the requested machine or company | Check the company in the requested path or trusted machine metadata |
| RTDB machine read checks only caller membership | A member can read a known machine ID from another company | Require the machine's `CID` and its company-machine registration to match the caller |
| Firestore user access allowed when `passwordToken != null` | Anyone knowing the user ID can read or write that document while a token exists, without presenting the token | Remove anonymous access; keep token-bearing account documents private |
| Users can write their whole profile | A client can change `cid`, or edit account-action tokens in Firestore | Limit client profile updates to specific fields; reserve tenancy and token fields for trusted provisioning |
| Authorization writes check existing keys, not proposed owner value | An admin can introduce `isOwner` on a record where the key was absent | Validate proposed role keys/types and require `isOwner == false` for non-owner writes |
| Company-level RTDB write grant | Grants writes to all descendants, bypassing narrower child `.write` checks | Grant admin writes only to specific company children |
| Missing semicolons in Firestore role helpers | Invalid function return syntax | Correct return statements |

See Firebase's [Realtime Database cascading rules](https://firebase.google.com/docs/database/security) and [Firestore rule conditions](https://firebase.google.com/docs/firestore/security/rules-conditions). Firestore reads return documents, not filtered subsets of their fields.

## Intended policy

- Unauthenticated database access is denied.
- Owners retain cross-company administration. Bootstrap owner records through a trusted administrative environment, not a client.
- RTDB members can read their own company and registered machines. Existing company admins can write their company's live machine state without changing its `CID` or deleting the whole machine.
- Users can edit the allowed profile fields but cannot create their own company assignment. Company admins can manage supported fields and non-owner roles for existing users in their company.
- Firestore history is read-only for ordinary clients. A caller must have an approved viewer, editor, or admin role and match the machine's trusted parent `CID`.
- Firestore account documents contain action tokens and are readable only by owners (and trusted Admin SDK code). Client profile displays use RTDB. Client Firestore profile edits are restricted to name/email.
- Company provisioning, user creation/deletion, company transfers, and machine creation are owner/Admin SDK operations. Rules do not let an unprovisioned user claim a company by knowing its identifier.

## Integration changes before deployment

The history scheduler now writes `{CID}` to `machines/{machineID}` alongside each history sample. Parent and sample writes share a batch; batches are capped at 450 writes. Existing history needs trusted parent metadata before non-owner history queries can succeed. Populate it from verified machine-company mappings or allow the updated scheduler to run first. Machines with missing `CID` are skipped.

The current mobile self-registration and non-owner portal account creation/deletion flows previously wrote directly to protected paths. Those writes are deliberately denied. Route these operations through a properly authorized provisioning service or an owner account before adopting these rules in a running installation. Do not restore broad client grants to work around permission errors.

Server/Admin SDK operations bypass these rules. The existing callable functions require a separate authorization review: token actions need nonempty, unexpired tokens, requested roles must be allowlisted, and administrative user actions must validate the target company. These rule changes do not claim to fix those server endpoints or to be a complete backend security audit.

No emulator compile or end-to-end authorization run is claimed. JSON parsing and static review can establish structure, not complete runtime correctness. Deploy only after reviewing these intentional behavior changes in a development project.
