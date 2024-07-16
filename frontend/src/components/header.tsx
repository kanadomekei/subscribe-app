import { EnterIcon, ExitIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { useState } from "react";

const Header = () => {
  const [auth, setAuth] = useState(false);
  return (
    <div className="bg-primary-foreground">
      <div className="flex justify-between h-20 items-center container">
        <h1 className="text-lg font-semibold">Subscribe App</h1>
        <div className="flex items-center gap-4">
          <ModeToggle />
          {auth ? (
            <Button variant={"outline"} onClick={() => setAuth(false)}>
              Logout
              <ExitIcon className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => setAuth(true)}>
              Login
              <EnterIcon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
