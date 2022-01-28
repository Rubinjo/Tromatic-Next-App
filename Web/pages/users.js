import React from "react";
import { withProtected } from "../firebase/hook/route";

function users() {
  return <div></div>;
}

export default withProtected(users);
