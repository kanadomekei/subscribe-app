import Header from "@/components/header";
import List from "@/components/list";
import YearCart from "@/components/yearCart";

const Home = () => {
  return (
    <div>
      <Header />
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
