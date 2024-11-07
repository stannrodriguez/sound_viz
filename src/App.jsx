import { useState } from "react";
import SineWaveToSound from "./components/SineWaveToSound";
import AirMolecule from "./components/AirMolecule";
import SoundProcessing from "./components/SoundProcessing";
import ComputerSoundProcessing from "./components/ComputerSoundProcessing";
import "./App.css";

function App() {
  const [showStage, setShowStage] = useState(0);
  const stages = [0, 1, 2, 3, 4];

  return (
    <>
      <AirMolecule />
      {stages.map((stage) => (
        <button
          key={stage}
          onClick={() => setShowStage(stage)}
          className={`px-3 py-1 text-sm rounded ${
            showStage === stage ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          Stage {stage + 1}
        </button>
      ))}
      <div className="flex flex-row gap-4 w-full" style={{ display: "flex" }}>
        <SoundProcessing showStage={showStage} />
        <ComputerSoundProcessing showStage={showStage} />
      </div>
      <SineWaveToSound />
    </>
  );
}

export default App;
