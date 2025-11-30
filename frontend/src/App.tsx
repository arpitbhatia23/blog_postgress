import { useState } from "react";

function App() {
  let [count, setcount] = useState<number>(0);

  const increment = () => {
    setcount((prev) => prev + 1);
  };
  return (
    <>
      <div
        className="bg-black text-white min-h-screen w-screen text-center"
        onClick={increment}
      >
        count:{count}
      </div>
    </>
  );
}

export default App;
