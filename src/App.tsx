import { GameBoard } from "./components/GameBoard";
import "./style.css";

const App = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-[600px] height=[600px]">
        <GameBoard />
      </div>
    </div>
  );
};

export default App;
