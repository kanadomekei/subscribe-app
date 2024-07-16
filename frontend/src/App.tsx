import Header from "./components/header";
import YearCart from "./components/yearCart";

function App() {
  return (
    <>
      <Header />
      <div className="grid grid-cols-3 container mt-10 gap-8">
        <YearCart />
        <div className="col-span-2"></div>
      </div>
    </>
  );
}

export default App;
