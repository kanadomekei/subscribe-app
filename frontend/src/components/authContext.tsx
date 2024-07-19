import { createContext } from "react";

export const LoggedInContext = createContext<boolean>(false);

const AuthContext = () => {
  return <div>AuthContext</div>;
};

export default AuthContext;
