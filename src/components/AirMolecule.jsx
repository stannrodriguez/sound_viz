import { useState, useEffect, useCallback } from "react";

const AirMoleculeVis = () => {
  const [time, setTime] = useState(0);
  const [frequency, setFrequency] = useState(1);
  const [amplitude, setAmplitude] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const isSmallScreen = dimensions.width < 768;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTime((t) => (t + 1) % 1000);
    }, 50);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Adjust grid size based on screen width
  const getGridSize = useCallback(() => {
    if (dimensions.width < 480) {
      // Mobile
      return { rows: 6, cols: 8 };
    } else if (dimensions.width < 768) {
      // Tablet
      return { rows: 7, cols: 10 };
    }
    return { rows: 8, cols: 15 }; // Desktop
  }, [dimensions.width]);

  // Create air molecules grid
  const { rows, cols } = getGridSize();
  const molecules = [];
  const spacing = Math.min(40, (dimensions.width - 40) / cols);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const baseX = col * spacing + spacing / 2;
      const baseY = row * spacing + spacing / 2;

      // Calculate displacement based on sine wave
      const displacement = Math.sin(time * 0.1 * frequency + col * 0.5) * (spacing / 3) * amplitude;

      molecules.push({
        x: baseX + displacement,
        y: baseY,
        opacity: 0.3 + Math.cos(time * 0.1 * frequency + col * 0.5) * 0.2 * amplitude,
      });
    }
  }

  const viewBoxWidth = cols * spacing;
  const viewBoxHeight = rows * spacing;

  return (
    <div className="pt-5">
      <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h2 className="text-left text-lg sm:text-xl font-medium">Air Molecule Movement</h2>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-xs sm:text-sm w-16 sm:w-20">Frequency:</span>
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

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-xs sm:text-sm w-16 sm:w-20">Amplitude:</span>
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

      <div className="relative h-60 sm:h-80 border border-gray-200 rounded-lg overflow-hidden">
        <svg width="100%" height="100%" viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
          {molecules.map((molecule, i) => (
            <g key={i}>
              <circle cx={molecule.x} cy={molecule.y} r={spacing / 4} fill="#60a5fa" opacity={molecule.opacity * 0.2} />
              <circle cx={molecule.x} cy={molecule.y} r={spacing / 12} fill="#2563eb" opacity={molecule.opacity} />
            </g>
          ))}
        </svg>

        {!isSmallScreen && (
          <div className="absolute top-2 left-2 text-xs sm:text-sm">
            Areas of:
            <div className="flex items-center gap-1 sm:gap-2 mt-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 opacity-30 rounded-full"></div>
              <span>Compression</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
              <span>Rarefaction</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600">
        <strong>What you&apos;re seeing:</strong>
        <ul className="list-disc ml-4 sm:ml-5 mt-1 sm:mt-2">
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
