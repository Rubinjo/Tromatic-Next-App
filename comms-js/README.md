## Setup Environment

1. Install all node modules with the `npm install` command
2. Create `.env` file in the `Comms-js` directory
3. Add the following firebase api key details, company name and login credentials for the company of choice:
    - APIKEY
    - AUTHDOMAIN
    - DATABASEURL
    - PROJECTID
    - STORAGEBUCKET
    - MESSAGINGSENDERID
    - APPID
    - EMAIL
    - PASSWORD
    - CID

## Run in background (Windows only)
1. Execute all instruction in the `Setup Environment`
2. Add the receiver and sender service as Windows services with the `node startup.js` command