import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const waveTypes = ["sine", "square", "sawtooth", "triangle"];

export default function SineWaveExplainer() {
  const [frequency, setFrequency] = useState(440);
  const [amplitude, setAmplitude] = useState(0.5);
  const [waveType, setWaveType] = useState("sine");
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = "hsl(200, 100%, 50%)";
      ctx.lineWidth = 2;

      for (let x = 0; x < canvas.width; x++) {
        const t = (x / canvas.width) * Math.PI * 2;
        let y;

        switch (waveType) {
          case "sine":
            y = Math.sin(t);
            break;
          case "square":
            y = Math.sign(Math.sin(t));
            break;
          case "sawtooth":
            y = (t % (Math.PI * 2)) / Math.PI - 1;
            break;
          case "triangle":
            y = Math.abs((t % (Math.PI * 2)) / (Math.PI / 2) - 2) - 1;
            break;
          default:
            y = Math.sin(t);
        }

        y = y * amplitude * (canvas.height / 2) + canvas.height / 2;
        ctx.lineTo(x, y);
      }

      ctx.stroke();
    };

    const animationFrame = requestAnimationFrame(function animate() {
      drawWave();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [frequency, amplitude, waveType]);

  const playSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioContextRef.current;

    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    oscillatorRef.current = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillatorRef.current.type = waveType;
    oscillatorRef.current.frequency.setValueAtTime(frequency, ctx.currentTime);
    gainNode.gain.setValueAtTime(amplitude, ctx.currentTime);

    oscillatorRef.current.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillatorRef.current.start();
  };

  const stopSound = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Representing Sound as Waves</h1>

      <p className="mb-4">
        Sound can be represented as waves, with sine waves being the most fundamental. Other wave shapes like square,
        sawtooth, and triangle are composed of multiple sine waves at different frequencies and amplitudes.
      </p>

      <div className="mb-6">
        <canvas ref={canvasRef} width={800} height={300} className="w-full border rounded" />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Frequency: {frequency} Hz</h2>
          <Slider
            value={[frequency]}
            onValueChange={(values) => setFrequency(values[0])}
            min={20}
            max={2000}
            step={1}
            className="mb-4"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Amplitude: {amplitude.toFixed(2)}</h2>
          <Slider
            value={[amplitude]}
            onValueChange={(values) => setAmplitude(values[0])}
            min={0}
            max={1}
            step={0.01}
            className="mb-4"
          />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Wave Type</h2>
        <Select value={waveType} onValueChange={(value) => setWaveType(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select wave type" />
          </SelectTrigger>
          <SelectContent>
            {waveTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={playSound}>Play Sound</Button>
        <Button onClick={stopSound} variant="outline">
          Stop Sound
        </Button>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Understanding Sound Waves</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Frequency:</strong> The number of cycles per second, measured in Hertz (Hz). It determines the pitch
            of the sound.
          </li>
          <li>
            <strong>Amplitude:</strong> The height of the wave, which determines the volume or loudness of the sound.
          </li>
          <li>
            <strong>Wave Shape:</strong> Different wave shapes produce different timbres or tone colors:
          </li>
          <ul className="list-circle pl-6 space-y-1">
            <li>
              <strong>Sine:</strong> The purest tone, containing only the fundamental frequency.
            </li>
            <li>
              <strong>Square:</strong> Contains only odd harmonics, producing a hollow sound.
            </li>
            <li>
              <strong>Sawtooth:</strong> Contains all harmonics, producing a bright, buzzy sound.
            </li>
            <li>
              <strong>Triangle:</strong> Contains odd harmonics with rapidly decreasing amplitude, producing a softer
              sound than square waves.
            </li>
          </ul>
        </ul>
      </div>
    </div>
  );
}
