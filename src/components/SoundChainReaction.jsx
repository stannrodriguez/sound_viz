import React from "react";
import SoundProcessing from "./SoundProcessing";
import ComputerSoundProcessing from "./ComputerSoundProcessing";
import AirMolecule from "./AirMolecule";
import SineWaveToSound from "./SineWaveToSound";

export default function SoundChainReaction() {
  return (
    <div>
      <h2 className="text-left text-xl font-semibold mb-4">How is sound created?</h2>
      <p className="text-left text-sm text-gray-600">
        Sound is created when an object vibrates, creating pressure waves in the air. These waves travel through the air
        and are detected by your ears.
      </p>
      <AirMolecule />

      {/* <SoundCreation /> */}
      {/* <SineWaveToSound /> */}
      <SoundProcessing />
      <ComputerSoundProcessing />
    </div>
  );
}
