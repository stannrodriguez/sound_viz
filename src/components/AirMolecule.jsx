import React, { useState, useEffect } from "react";

const AirMoleculeVis = () => {
  const [time, setTime] = useState(0);
  const [frequency, setFrequency] = useState(1);
  const [amplitude, setAmplitude] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTime((t) => (t + 1) % 1000);
    }, 50);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Create air molecules grid
  const rows = 8;
  const cols = 15;
  const molecules = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const baseX = col * 40 + 20;
      const baseY = row * 40 + 20;

      // Calculate displacement based on sine wave
      const displacement = Math.sin(time * 0.1 * frequency + col * 0.5) * 15 * amplitude;

      molecules.push({
        x: baseX + displacement,
        y: baseY,
        opacity: 0.3 + Math.cos(time * 0.1 * frequency + col * 0.5) * 0.2 * amplitude,
      });
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Air Molecule Movement</h2>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm w-20">Frequency:</span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={frequency}
            onChange={(e) => setFrequency(parseFloat(e.target.value))}
            className="flex-grow"
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm w-20">Amplitude:</span>
          <input
            type="range"
            min="0.2"
            max="2"
            step="0.1"
            value={amplitude}
            onChange={(e) => setAmplitude(parseFloat(e.target.value))}
            className="flex-grow"
          />
        </div>
      </div>

      <div className="relative h-80 border border-gray-200 rounded-lg overflow-hidden">
        {/* Molecules */}
        <svg width="100%" height="100%" viewBox="0 0 600 320">
          {molecules.map((molecule, i) => (
            <g key={i}>
              {/* Compression indicator */}
              <circle cx={molecule.x} cy={molecule.y} r={12} fill="#60a5fa" opacity={molecule.opacity * 0.2} />
              {/* Air molecule */}
              <circle cx={molecule.x} cy={molecule.y} r={4} fill="#2563eb" opacity={molecule.opacity} />
            </g>
          ))}
        </svg>

        {/* Labels */}
        <div className="absolute top-2 left-2 text-sm">
          Areas of:
          <div className="flex items-center gap-2 mt-1">
            <div className="w-3 h-3 bg-blue-500 opacity-30 rounded-full"></div>
            <span>Compression</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span>Rarefaction</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <strong>What you're seeing:</strong>
        <ul className="list-disc ml-5 mt-2">
          <li>Blue dots represent air molecules</li>
          <li>Higher frequency = faster oscillation</li>
          <li>Higher amplitude = greater displacement</li>
          <li>Dark areas show compression (molecules closer together)</li>
          <li>Light areas show rarefaction (molecules farther apart)</li>
        </ul>
      </div>
    </div>
  );
};

export default AirMoleculeVis;
