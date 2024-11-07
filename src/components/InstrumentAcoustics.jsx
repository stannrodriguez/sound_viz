import React, { useState, useEffect } from "react";

const InstrumentAcoustics = () => {
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedInstrument, setSelectedInstrument] = useState("string");
  const [frequency, setFrequency] = useState(1);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTime((t) => (t + 1) % 1000);
    }, 50);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Generate wave points
  const generateWavePoints = (offset = 0, amplitude = 1) => {
    return Array.from({ length: 50 }, (_, i) => ({
      x: i * 6,
      y: 30 + Math.sin((i + offset) * 0.2 * frequency) * 20 * amplitude,
    }));
  };

  const StringInstrument = () => (
    <div className="relative h-64">
      <svg width="100%" height="100%" viewBox="0 0 300 100">
        {/* Bridge */}
        <rect x="140" y="60" width="20" height="30" fill="#8b5cf6" />

        {/* String */}
        <path
          d={`M 50,75 Q 150,${75 + Math.sin(time * 0.1 * frequency) * 10} 250,75`}
          stroke="#000"
          strokeWidth="2"
          fill="none"
        />

        {/* Standing wave visualization */}
        {[...Array(3)].map((_, i) => (
          <path
            key={i}
            d={generateWavePoints(time + i * 20, 0.5 - i * 0.1).map(
              (p, j) => `${j === 0 ? "M" : "L"} ${p.x + 50},${p.y + 30}`
            )}
            stroke="#8b5cf6"
            strokeWidth="1"
            fill="none"
            opacity={0.3}
          />
        ))}
      </svg>
    </div>
  );

  const WindInstrument = () => (
    <div className="relative h-64">
      <svg width="100%" height="100%" viewBox="0 0 300 100">
        {/* Tube */}
        <path d="M 50,50 L 250,50 L 270,70 L 30,70 Z" fill="#2563eb" opacity="0.2" />

        {/* Air column visualization */}
        {[...Array(5)].map((_, i) => {
          const offset = time * 0.1 * frequency + i * 10;
          return (
            <circle
              key={i}
              cx={50 + i * 50}
              cy={60 + Math.sin(offset) * 5}
              r={3 + Math.cos(offset) * 2}
              fill="#2563eb"
              opacity={0.6}
            />
          );
        })}

        {/* Standing wave in tube */}
        <path
          d={`M 50,60 ${generateWavePoints(time, 0.3)
            .map((p) => `L ${p.x + 50},${p.y + 30}`)
            .join(" ")}`}
          stroke="#2563eb"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  );

  const Percussion = () => (
    <div className="relative h-64">
      <svg width="100%" height="100%" viewBox="0 0 300 100">
        {/* Drum head */}
        <ellipse
          cx="150"
          cy="60"
          rx={80 + Math.sin(time * 0.1 * frequency) * 2}
          ry={40 + Math.sin(time * 0.1 * frequency) * 2}
          fill="#dc2626"
          opacity="0.2"
        />

        {/* Vibration patterns */}
        {[...Array(3)].map((_, i) => (
          <ellipse
            key={i}
            cx="150"
            cy="60"
            rx={60 - i * 15 + Math.sin((time + i * 20) * 0.1 * frequency) * 5}
            ry={30 - i * 7 + Math.sin((time + i * 20) * 0.1 * frequency) * 2}
            fill="none"
            stroke="#dc2626"
            strokeWidth="1"
            opacity={0.5 - i * 0.1}
          />
        ))}
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
            value={selectedInstrument}
            onChange={(e) => setSelectedInstrument(e.target.value)}
            className="px-4 py-2 border rounded"
          >
            <option value="string">String Instruments</option>
            <option value="wind">Wind Instruments</option>
            <option value="percussion">Percussion</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm">Vibration Speed:</span>
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
        {/* Instrument Visualization */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Physical Design</h3>
          {selectedInstrument === "string" && <StringInstrument />}
          {selectedInstrument === "wind" && <WindInstrument />}
          {selectedInstrument === "percussion" && <Percussion />}
        </div>

        {/* Design Principles */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4">Design Principles</h3>
          <div className="space-y-4 text-sm">
            {selectedInstrument === "string" && (
              <>
                <p>
                  <strong>Bridge Design:</strong> Transfers string vibrations to the body
                </p>
                <p>
                  <strong>String Tension:</strong> Affects fundamental frequency
                </p>
                <p>
                  <strong>Body Shape:</strong> Creates resonant chamber for amplification
                </p>
                <p>
                  <strong>Material Choice:</strong> Influences tone quality and sustain
                </p>
              </>
            )}
            {selectedInstrument === "wind" && (
              <>
                <p>
                  <strong>Tube Length:</strong> Determines fundamental pitch
                </p>
                <p>
                  <strong>Bore Shape:</strong> Affects harmonic content
                </p>
                <p>
                  <strong>Material:</strong> Impacts resonance and tone color
                </p>
                <p>
                  <strong>Air Column:</strong> Creates standing waves inside tube
                </p>
              </>
            )}
            {selectedInstrument === "percussion" && (
              <>
                <p>
                  <strong>Membrane Tension:</strong> Controls pitch and response
                </p>
                <p>
                  <strong>Shell Design:</strong> Shapes resonance and projection
                </p>
                <p>
                  <strong>Size:</strong> Influences fundamental frequency
                </p>
                <p>
                  <strong>Material:</strong> Affects tone and sustain
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Key Acoustic Principles</h3>
        <div className="text-sm text-gray-600">
          {selectedInstrument === "string" &&
            "String instruments use tension and length to create specific frequencies. The bridge transfers these vibrations to a resonant body, which amplifies the sound through sympathetic vibration. Different materials and shapes create unique tonal characteristics."}
          {selectedInstrument === "wind" &&
            "Wind instruments use columns of air to create standing waves. The length of the tube determines the fundamental pitch, while the shape of the bore affects the harmonic content. Materials and construction influence the tone quality and projection."}
          {selectedInstrument === "percussion" &&
            "Percussion instruments use vibrating membranes or materials to create sound. The size and tension of the membrane determine pitch, while the shell or body shapes the resonance and sustain. Different materials create unique tonal characteristics."}
        </div>
      </div>
    </div>
  );
};

export default InstrumentAcoustics;
