import React from "react";
import SoundProcessing from "./SoundProcessing";
import ComputerSoundProcessing from "./ComputerSoundProcessing";
import AirMolecule from "./AirMolecule";
import SineWaveToSound from "./SineWaveToSound";

export default function SoundChainReaction() {
  return (
    <div>
      <h2 className="text-left text-xl font-semibold mb-4">How sound is created</h2>
      <p className="text-left text-sm text-gray-600">
        Sound begins when a vibrating object creates pressure waves in the air. Those waves travel outward until they
        reach your ears.
      </p>
      <AirMolecule />

      {/* <SoundCreation /> */}
      {/* <SineWaveToSound /> */}
      <SoundProcessing />
      <ComputerSoundProcessing />
    </div>
  );
}
