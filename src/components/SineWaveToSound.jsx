import React, { useState, useEffect } from "react";

const SineWaveToSound = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((t) => (t + 1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  // Generate sine wave points
  const generateSinePoints = (offset = 0) => {
    const points = [];
    for (let i = 0; i < 100; i++) {
      points.push({
        x: i * 3,
        y: 50 + Math.sin((i + offset) * 0.2) * 30,
      });
    }
    return points;
  };

  const points = generateSinePoints(time);
  const speakerOffset = Math.sin(time * 0.2) * 30;

  return (
    <div className="pt-8 ">
      <div className="flex flex-col gap-8">
        {/* Digital Sine Wave */}
        <div className="relative h-36">
          <div className="absolute left-0 top-0 text-sm font-medium pb-4">Digital Signal</div>
          <svg className="w-full h-full pt-10" viewBox="0 0 300 100">
            <path
              d={`M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Speaker Diagram */}
        <div className="relative h-64">
          <div className="absolute left-0 top-0 text-sm font-medium">Speaker Movement</div>
          <svg className="w-full h-full" viewBox="0 0 300 200">
            {/* Speaker housing */}
            <rect x="100" y="50" width="100" height="100" fill="#374151" rx="10" />

            {/* Speaker cone */}
            <path
              d={`M 150,${100 + speakerOffset / 2} 
                   Q 200,${100 + speakerOffset} 220,${100 + speakerOffset / 1.5}`}
              stroke="#6b7280"
              strokeWidth="4"
              fill="none"
            />

            {/* Sound waves */}
            {[0, 1, 2].map((i) => (
              <circle
                key={i}
                cx="220"
                cy="100"
                r={20 + i * 20 + Math.abs(speakerOffset / 2)}
                stroke="#60a5fa"
                strokeWidth="2"
                fill="none"
                opacity={1 - i * 0.2}
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SineWaveToSound;
