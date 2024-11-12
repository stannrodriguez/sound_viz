import React, { useState, useEffect } from "react";

const SoundCreation = () => {
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedExample, setSelectedExample] = useState("vibration");
  const [frequency, setFrequency] = useState(1);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTime((t) => (t + 1) % 1000);
    }, 50);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const VibrationExample = () => (
    <div className="relative h-64">
      <svg width="100%" height="100%" viewBox="0 0 300 150">
        {/* Vibrating object */}
        <rect x={140} y={60 + Math.sin(time * 0.1 * frequency) * 10} width="20" height="30" fill="#2563eb" />

        {/* Air molecules */}
        {[...Array(5)].map((_, row) =>
          [...Array(8)].map((_, col) => {
            const offset = time * 0.1 * frequency + col * 0.5;
            const displacement = Math.sin(offset) * (5 - col * 0.5);
            return (
              <circle
                key={`${row}-${col}`}
                cx={180 + col * 30}
                cy={75 + row * 20 + displacement}
                r={4 - col * 0.3}
                fill="#60a5fa"
                opacity={0.6 - col * 0.1}
              />
            );
          })
        )}
      </svg>
    </div>
  );

  const CompressionExample = () => (
    <div className="relative h-64">
      <svg width="100%" height="100%" viewBox="0 0 300 150">
        {/* Compression waves */}
        {[...Array(10)].map((_, i) => {
          const x = (time * frequency + i * 30) % 300;
          const compression = Math.sin(time * 0.1 * frequency + i);
          return (
            <g key={i}>
              <line x1={x} y1="30" x2={x} y2="120" stroke="#2563eb" strokeWidth={1 + compression * 2} opacity={0.3} />
              {[...Array(5)].map((_, j) => (
                <circle key={j} cx={x} cy={40 + j * 20} r={3 + compression * 2} fill="#60a5fa" opacity={0.6} />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );

  const WaveExample = () => (
    <div className="relative h-64">
      <svg width="100%" height="100%" viewBox="0 0 300 150">
        {/* Multiple frequency components */}
        {[
          { freq: 1, amp: 20, color: "#2563eb" },
          { freq: 2, amp: 10, color: "#7c3aed" },
          { freq: 3, amp: 5, color: "#db2777" },
        ].map((wave, i) => (
          <path
            key={i}
            d={`M 0,75 ${[...Array(50)]
              .map((_, j) => {
                const x = j * 6;
                const y = 75 + Math.sin((j + time * 0.1) * 0.2 * frequency * wave.freq) * wave.amp;
                return `L ${x},${y}`;
              })
              .join(" ")}`}
            fill="none"
            stroke={wave.color}
            strokeWidth="2"
            opacity="0.5"
          />
        ))}

        {/* Combined wave */}
        <path
          d={`M 0,75 ${[...Array(50)]
            .map((_, j) => {
              const x = j * 6;
              const y =
                75 +
                Math.sin((j + time * 0.1) * 0.2 * frequency) * 20 +
                Math.sin((j + time * 0.1) * 0.4 * frequency) * 10 +
                Math.sin((j + time * 0.1) * 0.6 * frequency) * 5;
              return `L ${x},${y}`;
            })
            .join(" ")}`}
          fill="none"
          stroke="#000"
          strokeWidth="2"
        />
      </svg>
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6 flex justify-between items-center">
        <div className="space-x-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>

          <select
            value={selectedExample}
            onChange={(e) => setSelectedExample(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="vibration">Vibration & Air Movement</option>
            <option value="compression">Compression Waves</option>
            <option value="wave">Wave Components</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm">Speed:</span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={frequency}
            onChange={(e) => setFrequency(parseFloat(e.target.value))}
            className="w-32"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Visualization */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Visual Demonstration</h3>
          {selectedExample === "vibration" && <VibrationExample />}
          {selectedExample === "compression" && <CompressionExample />}
          {selectedExample === "wave" && <WaveExample />}
        </div>

        {/* Explanation */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Key Concepts</h3>
          <div className="space-y-4 text-sm">
            {selectedExample === "vibration" && (
              <>
                <p>
                  <strong>Source Vibration:</strong> Objects vibrate due to:
                </p>
                <ul className="list-disc ml-5">
                  <li>Mechanical force (striking, plucking)</li>
                  <li>Air flow (wind instruments)</li>
                  <li>Electromagnetic force (speakers)</li>
                </ul>
                <p>
                  <strong>Energy Transfer:</strong> Vibrating object pushes air molecules
                </p>
              </>
            )}
            {selectedExample === "compression" && (
              <>
                <p>
                  <strong>Air Pressure Changes:</strong>
                </p>
                <ul className="list-disc ml-5">
                  <li>Areas of high pressure (compression)</li>
                  <li>Areas of low pressure (rarefaction)</li>
                  <li>Creates alternating pattern</li>
                </ul>
                <p>
                  <strong>Wave Propagation:</strong> Pressure changes travel through air
                </p>
              </>
            )}
            {selectedExample === "wave" && (
              <>
                <p>
                  <strong>Wave Components:</strong>
                </p>
                <ul className="list-disc ml-5">
                  <li>Fundamental frequency (blue)</li>
                  <li>Harmonics (purple, pink)</li>
                  <li>Combined wave (black)</li>
                </ul>
                <p>
                  <strong>Characteristics:</strong> Frequency, amplitude, and phase shape the sound
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Real-World Examples</h3>
        <div className="text-sm text-gray-600">
          {selectedExample === "vibration" &&
            "Examples: Guitar string vibrating, drum head moving, vocal cords oscillating, speaker cone moving. The faster the vibration, the higher the pitch."}
          {selectedExample === "compression" &&
            "Examples: Clapping creates a pressure wave, thunder is a large pressure disturbance, speaking pushes air in patterns, explosions create shock waves."}
          {selectedExample === "wave" &&
            "Examples: Musical notes contain multiple frequencies, voice has fundamental and overtones, different instruments create unique harmonic patterns."}
        </div>
      </div>
    </div>
  );
};

export default SoundCreation;
