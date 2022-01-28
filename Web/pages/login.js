import React, { useState } from "react";
import { withPublic } from "../firebase/hook/route";

function Login({ auth }) {
  const { user, login, error } = auth;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    login(email, password);
  };
  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          type="email"
          placeholder="Email"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        {error && <p>{error}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default withPublic(Login);
