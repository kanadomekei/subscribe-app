import { EnterIcon, ExitIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "./authProvider";

const Header = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <div className="bg-primary-foreground">
      <div className="flex justify-between h-20 items-center container">
        <Link to={"/"}>
          <h1 className="text-lg font-semibold">Subscribe App</h1>
        </Link>
        <div className="flex items-center gap-4">
          <ModeToggle />
          {isAuthenticated ? (
            <Button variant={"outline"} onClick={() => logout()}>
              Logout
              <ExitIcon className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button asChild>
              <Link to={"/login"}>
                Login
                <EnterIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
