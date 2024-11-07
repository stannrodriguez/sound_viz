import React, { useState, useEffect } from "react";

const DigitalSoundProcessing = ({ showStage }) => {
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTime((t) => (t + 1) % 1000);
    }, 50);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Generate analog wave points
  const generateWavePoints = (offset = 0, amplitude = 1, frequency = 1) => {
    const points = [];
    for (let i = 0; i < 50; i++) {
      points.push({
        x: i * 6,
        y: 30 + Math.sin((i + offset) * 0.2 * frequency) * 20 * amplitude,
      });
    }
    return points;
  };

  // Generate sample points
  const generateSamplePoints = (offset = 0) => {
    const points = [];
    for (let i = 0; i < 12; i++) {
      points.push({
        x: i * 24,
        y: 30 + Math.sin((i * 4 + offset) * 0.2) * 20,
      });
    }
    return points;
  };

  // Generate binary data
  const generateBinary = (sample) => {
    // Convert sample to 8-bit binary
    const normalized = Math.floor(((sample - 10) / 40) * 255);
    return normalized.toString(2).padStart(8, "0");
  };

  const stages = [
    { title: "1. Microphone (Analog)", active: showStage >= 0 },
    { title: "2. Sampling (ADC)", active: showStage >= 1 },
    { title: "3. Quantization", active: showStage >= 2 },
    { title: "4. Binary Encoding", active: showStage >= 3 },
    { title: "5. Digital Processing", active: showStage >= 4 },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        {/* <div className="space-x-2">
          {stages.map((stage, i) => (
            <button
              key={i}
              onClick={() => setShowStage(i)}
              className={`px-3 py-1 text-sm rounded ${
                showStage === i ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Stage {i + 1}
            </button>
          ))}
        </div> */}
      </div>

      <div className="relative h-[32rem] border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
        {/* Stage 1: Microphone/Analog */}
        {stages[0].active && (
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium mb-2">Analog Sound Wave</h3>
            <svg className="w-full h-20" viewBox="0 0 300 60">
              <path
                d={`M ${generateWavePoints(time)
                  .map((p) => `${p.x},${p.y}`)
                  .join(" L ")}`}
                stroke="#2563eb"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        )}

        {/* Stage 2: Sampling */}
        {stages[1].active && (
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium mb-2">Sampling (44,100 times/second)</h3>
            <svg className="w-full h-20" viewBox="0 0 300 60">
              {/* Original wave */}
              <path
                d={`M ${generateWavePoints(time)
                  .map((p) => `${p.x},${p.y}`)
                  .join(" L ")}`}
                stroke="#2563eb"
                strokeWidth="1"
                opacity="0.3"
                fill="none"
              />
              {/* Sample points */}
              {generateSamplePoints(time).map((point, i) => (
                <g key={i}>
                  <line
                    x1={point.x}
                    y1="0"
                    x2={point.x}
                    y2="60"
                    stroke="#dc2626"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                    opacity="0.3"
                  />
                  <circle cx={point.x} cy={point.y} r="3" fill="#dc2626" />
                </g>
              ))}
            </svg>
          </div>
        )}

        {/* Stage 3: Quantization */}
        {stages[2].active && (
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium mb-2">Quantization (16-bit Resolution)</h3>
            <svg className="w-full h-20" viewBox="0 0 300 60">
              {/* Amplitude levels */}
              {[...Array(8)].map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={i * 8 + 4}
                  x2="300"
                  y2={i * 8 + 4}
                  stroke="#9ca3af"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  opacity="0.3"
                />
              ))}
              {/* Quantized samples */}
              {generateSamplePoints(time).map((point, i) => {
                const quantizedY = Math.round(point.y / 8) * 8;
                return (
                  <g key={i}>
                    <circle cx={point.x} cy={quantizedY} r="3" fill="#059669" />
                    <text x={point.x + 5} y={quantizedY - 5} className="text-xs" fill="#059669">
                      {Math.round(quantizedY)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* Stage 4: Binary Encoding */}
        {stages[3].active && (
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium mb-2">Binary Data</h3>
            <div className="grid grid-cols-2 gap-4">
              {generateSamplePoints(time)
                .slice(0, 4)
                .map((point, i) => (
                  <div key={i} className="text-sm font-mono">
                    Sample {i + 1}: {generateBinary(point.y)}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Stage 5: Digital Processing */}
        {stages[4].active && (
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium mb-2">Digital Signal Processing</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded p-2">
                <div className="text-xs font-medium mb-1">Filtering</div>
                <svg className="w-full h-10" viewBox="0 0 100 30">
                  <path
                    d={`M ${generateWavePoints(time, 0.5, 2)
                      .map((p) => `${p.x / 3},${p.y / 2}`)
                      .join(" L ")}`}
                    stroke="#2563eb"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="border rounded p-2">
                <div className="text-xs font-medium mb-1">Amplification</div>
                <svg className="w-full h-10" viewBox="0 0 100 30">
                  <path
                    d={`M ${generateWavePoints(time, 1.5)
                      .map((p) => `${p.x / 3},${p.y / 2}`)
                      .join(" L ")}`}
                    stroke="#dc2626"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="border rounded p-2">
                <div className="text-xs font-medium mb-1">Effects</div>
                <svg className="w-full h-10" viewBox="0 0 100 30">
                  <path
                    d={`M ${generateWavePoints(time, 1, 3)
                      .map((p) => `${p.x / 3},${p.y / 2}`)
                      .join(" L ")}`}
                    stroke="#059669"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Description Panel */}
        <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t">
          <h3 className="font-medium mb-2">{stages[showStage].title}</h3>
          <p className="text-sm text-gray-600">
            {showStage === 0 &&
              "The microphone converts sound pressure waves into an analog electrical signal - a continuous wave that mirrors the air pressure changes."}
            {showStage === 1 &&
              "The analog signal is sampled at regular intervals (typically 44,100 times per second for CD-quality audio) to capture the wave's shape."}
            {showStage === 2 &&
              "Each sample is rounded to the nearest allowed amplitude value. 16-bit audio has 65,536 possible levels for high accuracy."}
            {showStage === 3 &&
              "The quantized values are converted to binary numbers. Each sample becomes a sequence of 1s and 0s."}
            {showStage === 4 &&
              "The digital signal can now be processed - filtered, amplified, or modified with effects - all through mathematical operations."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DigitalSoundProcessing;
