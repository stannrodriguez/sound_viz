import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const SoundProcessing = () => {
  const [time, setTime] = useState(0);
  const [showStage, setShowStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const viewportWidth = window.innerWidth;
  const isSmallScreen = viewportWidth < 768;

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTime((t) => (t + 1) % 1000);
    }, 50);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Generate sine wave points
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

  // Generate neural spike train
  const generateSpikeTrain = (offset, frequency) => {
    const spikes = [];
    for (let i = 0; i < 10; i++) {
      if (Math.sin((i * 30 + offset) * 0.1 * frequency) > 0.7) {
        spikes.push(i * 30);
      }
    }
    return spikes;
  };

  const stages = [
    { title: "Air Pressure Waves", active: showStage >= 0 },
    { title: "Eardrum Vibration", active: showStage >= 1 },
    { title: "Cochlear Movement", active: showStage >= 2 },
    { title: "Hair Cell Response", active: showStage >= 3 },
    { title: "Neural Signals", active: showStage >= 4 },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-left text-xl font-semibold mb-6">How the brain processes sound</h2>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>

        {isSmallScreen ? (
          <div className="flex flex-col gap-2">
            <h3 className="text-medium font-medium">Stages</h3>

            <div className="flex flex-wrap justify-center gap-2">
              {stages.map((stage, index) => (
                <Button
                  key={stage}
                  variant={showStage === index ? "default" : "secondary"}
                  onClick={() => setShowStage(index)}
                  className="text-sm"
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {stages.map((stage, index) => (
              <Button
                key={stage}
                variant={showStage === index ? "default" : "secondary"}
                onClick={() => setShowStage(index)}
                className="text-sm"
              >
                Stage {index + 1}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Description Panel */}
      <div className="flex flex-col justify-center items-center bottom-0 left-0 right-0 bg-white p-4 ">
        <h3 className="font-medium mb-2">{stages[showStage].title}</h3>
        <p className="text-sm text-gray-600">
          {showStage === 0 &&
            "Sound waves create areas of high and low air pressure that travel through the air to your ear."}
          {showStage === 1 && "These pressure waves cause your eardrum (tympanic membrane) to vibrate back and forth."}
          {showStage === 2 &&
            "The vibrations travel through the middle ear bones into the cochlea, creating waves in the fluid."}
          {showStage === 3 &&
            "These fluid waves bend tiny hair cells, which convert mechanical motion into electrical signals."}
          {showStage === 4 &&
            "Hair cells trigger neurons to fire in patterns that match the original sound wave frequency."}
        </p>
      </div>

      <div className="relative flex flex-col border border-gray-200 rounded-lg">
        {/* Stage 1: Air Pressure Waves */}
        {stages[0].active && (
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium mb-2">Air Pressure Waves</h3>
            <svg className="w-full h-20" viewBox="0 0 300 60">
              {/* Air molecules */}
              {generateWavePoints(time).map((point, i) => (
                <circle key={i} cx={point.x} cy={point.y} r="3" fill="#2563eb" opacity="0.6" />
              ))}
            </svg>
          </div>
        )}

        {/* Stage 2: Eardrum Vibration */}
        {stages[1].active && (
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium mb-2">Eardrum Movement</h3>
            <svg className="w-full h-20" viewBox="0 0 300 60">
              {/* Eardrum membrane */}
              <path
                d={`M 150,${30 + Math.sin(time * 0.1) * 15} 
                   Q ${170 + Math.sin(time * 0.1) * 5},30 
                     ${180 + Math.sin(time * 0.1) * 2},30`}
                stroke="#4b5563"
                strokeWidth="2"
                fill="none"
              />
              <circle cx={150} cy={30 + Math.sin(time * 0.1) * 15} r="4" fill="#4b5563" />
            </svg>
          </div>
        )}

        {/* Stage 3: Cochlear Movement */}
        {stages[2].active && (
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium mb-2">Cochlear Fluid Waves</h3>
            <svg className="w-full h-20" viewBox="0 0 300 60">
              {/* Cochlear chamber */}
              <path d="M 50,10 L 250,10 L 250,50 L 50,50 Z" fill="#e5e7eb" stroke="#9ca3af" />
              {/* Fluid wave */}
              <path
                d={`M ${generateWavePoints(time, 0.5)
                  .map((p) => `${p.x},${p.y}`)
                  .join(" L ")}`}
                stroke="#60a5fa"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>
        )}

        {/* Stage 4: Hair Cell Response */}
        {stages[3].active && (
          <div className="p-4 border-b">
            <h3 className="text-sm font-medium mb-2">Hair Cell Activation</h3>
            <svg className="w-full h-20" viewBox="0 0 300 60">
              {[...Array(10)].map((_, i) => {
                const bend = Math.sin((time + i * 20) * 0.1) * 10;
                return (
                  <g key={i} transform={`translate(${i * 30 + 30}, 30)`}>
                    <line x1="0" y1="0" x2={bend} y2="-15" stroke="#059669" strokeWidth="2" />
                    <circle cx="0" cy="0" r="3" fill="#059669" />
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* Stage 5: Neural Signals */}
        {stages[4].active && (
          <div className="p-4">
            <h3 className="text-sm font-medium mb-2">Neural Firing Pattern</h3>
            <svg className="w-full h-20" viewBox="0 0 300 60">
              {/* Baseline */}
              <line x1="0" y1="30" x2="300" y2="30" stroke="#9ca3af" />

              {/* Spikes */}
              {generateSpikeTrain(time, 1).map((x, i) => (
                <path
                  key={i}
                  d={`M ${x},30 L ${x + 10},10 L ${x + 20},30`}
                  stroke="#dc2626"
                  strokeWidth="2"
                  fill="none"
                />
              ))}
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoundProcessing;
