import { AuthContext } from "@/components/authProvider";
import List from "@/components/list";
import YearCart from "@/components/yearCart";
import { useContext } from "react";

const Home = () => {
  // const { isAuthenticated } = useContext(AuthContext);

  // if (!isAuthenticated) {
  //   return (
  //     <div className="container">
  //       <p>You are not logged in.</p>
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 container my-10 md:gap-10 gap-y-10">
        <YearCart />
        <div className="col-span-2">
          <List />
        </div>
      </div>
    </div>
  );
};

export default Home;
