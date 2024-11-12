import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function HarmonicsExplainer() {
  const [fundamentalFrequency, setFundamentalFrequency] = useState(440);
  const [harmonicAmplitudes, setHarmonicAmplitudes] = useState([1, 0.5, 0.33, 0.25, 0.2]);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawWaves = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw fundamental frequency
      drawWave(ctx, fundamentalFrequency, 1, "hsl(200, 100%, 50%)");

      // Draw harmonics
      harmonicAmplitudes.forEach((amplitude, index) => {
        if (index > 0) {
          drawWave(ctx, fundamentalFrequency * (index + 1), amplitude, `hsl(${200 + index * 30}, 100%, 50%)`);
        }
      });

      // Draw combined wave
      drawCombinedWave(ctx, fundamentalFrequency, harmonicAmplitudes, "hsl(0, 0%, 0%)");
    };

    const animationFrame = requestAnimationFrame(function animate() {
      drawWaves();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [fundamentalFrequency, harmonicAmplitudes]);

  const drawWave = (ctx, frequency, amplitude, color) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    for (let x = 0; x < ctx.canvas.width; x++) {
      const y =
        Math.sin((x / ctx.canvas.width) * Math.PI * 2 * (frequency / 10)) * amplitude * 50 + ctx.canvas.height / 2;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  const drawCombinedWave = (ctx, fundamental, amplitudes, color) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    for (let x = 0; x < ctx.canvas.width; x++) {
      let y = 0;
      amplitudes.forEach((amplitude, index) => {
        y += Math.sin((x / ctx.canvas.width) * Math.PI * 2 * ((fundamental * (index + 1)) / 10)) * amplitude * 50;
      });
      ctx.lineTo(x, y + ctx.canvas.height / 2);
    }
    ctx.stroke();
    ctx.lineWidth = 1;
  };

  const playSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    oscillatorsRef.current.forEach((osc) => osc.stop());
    oscillatorsRef.current = [];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.5, ctx.currentTime);
    masterGain.connect(ctx.destination);

    harmonicAmplitudes.forEach((amplitude, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.setValueAtTime(fundamentalFrequency * (index + 1), ctx.currentTime);
      gain.gain.setValueAtTime(amplitude, ctx.currentTime);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start();
      oscillatorsRef.current.push(osc);
    });
  };

  const stopSound = () => {
    oscillatorsRef.current.forEach((osc) => osc.stop());
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Understanding Harmonics</h1>

      <p className="mb-4">
        Harmonics are integer multiples of a fundamental frequency. They contribute to the timbre or color of a sound,
        making different instruments sound unique even when playing the same note.
      </p>

      <div className="mb-6">
        <canvas ref={canvasRef} width={800} height={400} className="w-full border rounded" />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Fundamental Frequency: {fundamentalFrequency} Hz</h2>
        <Slider
          value={[fundamentalFrequency]}
          onValueChange={(values) => setFundamentalFrequency(values[0])}
          min={220}
          max={880}
          step={1}
          className="mb-4"
        />
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Harmonic Amplitudes</h2>
        {harmonicAmplitudes.map((amplitude, index) => (
          <div key={index} className="flex items-center gap-4 mb-2">
            <span className="w-32">Harmonic {index + 1}:</span>
            <Slider
              value={[amplitude]}
              onValueChange={(values) => {
                const newAmplitudes = [...harmonicAmplitudes];
                newAmplitudes[index] = values[0];
                setHarmonicAmplitudes(newAmplitudes);
              }}
              max={1}
              step={0.01}
              className="flex-grow"
            />
            <span className="w-12 text-right">{amplitude.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={playSound}>Play Sound</Button>
        <Button onClick={stopSound} variant="outline">
          Stop Sound
        </Button>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">How Harmonics Work</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>The fundamental frequency is the lowest and usually the strongest component of a sound.</li>
          <li>Harmonics are integer multiples of the fundamental frequency (2x, 3x, 4x, etc.).</li>
          <li>The presence and strength of different harmonics give instruments their unique timbres.</li>
          <li>
            Adjust the sliders above to see and hear how changing the amplitude of different harmonics affects the
            overall sound wave and tone.
          </li>
        </ul>
      </div>
    </div>
  );
}
