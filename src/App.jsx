import { useState, useEffect } from "react";
import SineWaveToSound from "./components/SineWaveToSound";
import AirMolecule from "./components/AirMolecule";
import SoundProcessing from "./components/SoundProcessing";
import ComputerSoundProcessing from "./components/ComputerSoundProcessing";
import "./App.css";
import InstrumentAcoustics from "./components/InstrumentAcoustics";
import SoundCreation from "./components/SoundCreation";
import { Button } from "@/components/ui/button";
import NotesAndWaves from "./components/NotesAndWaves";
import HarmonicsExplainer from "./components/Harmonics";
import SineWaveExplainer from "./components/SineWaveExplainer";
import FourierTransform from "./components/FourierTransform";
import ExampleAnalysis from "./components/ExampleAnalysis";

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
      <InstrumentAcoustics />
      <SoundCreation />
      <SineWaveToSound />
    </>
  );
}

function SoundPhysicsApp() {
  const [currentView, setCurrentView] = useState("chain");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-primary text-primary-foreground p-4">
        <div className="max-w-4xl mx-auto flex flex-wrap">
          <h1 className="text-2xl p-3 font-bold mb-2 md:mb-0">Sound Physics Visualizer</h1>
          <div className="px-2 py-2 flex flex-row gap-2">
            <Button variant={currentView === "chain" ? "secondary" : "default"} onClick={() => setCurrentView("chain")}>
              Sound Chain
            </Button>
            <Button variant={currentView === "notes" ? "secondary" : "default"} onClick={() => setCurrentView("notes")}>
              Notes & Waves
            </Button>
            <Button
              variant={currentView === "harmonics" ? "secondary" : "default"}
              onClick={() => setCurrentView("harmonics")}
            >
              Harmonics
            </Button>
            <Button
              variant={currentView === "sinewave" ? "secondary" : "default"}
              onClick={() => setCurrentView("sinewave")}
            >
              Sine Waves
            </Button>
            <Button
              variant={currentView === "fourier" ? "secondary" : "default"}
              onClick={() => setCurrentView("fourier")}
            >
              Fourier Transform
            </Button>
            <Button
              variant={currentView === "Example" ? "secondary" : "default"}
              onClick={() => setCurrentView("Example")}
            >
              Example Analysis
            </Button>
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto mt-8">
        {currentView === "notes" && <NotesAndWaves />}
        {currentView === "chain" && (
          <>
            <SoundProcessing />
            <ComputerSoundProcessing />
          </>
        )}
        {currentView === "harmonics" && <HarmonicsExplainer />}
        {currentView === "sinewave" && <SineWaveExplainer />}
        {currentView === "fourier" && <FourierTransform />}
        {currentView === "Example" && <ExampleAnalysis />}
      </main>
    </div>
  );
}

export default SoundPhysicsApp;
