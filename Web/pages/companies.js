import React from 'react';
import { withProtected } from "../firebase/hook/route";

function companies() {
  return <div></div>;
}

export default withProtected(companies);
