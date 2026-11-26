import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const waveTypes = ["sine", "square", "sawtooth", "triangle"];

export default function FourierTransform() {
  const [waveType, setWaveType] = useState("sine");
  const [frequency, setFrequency] = useState(440);
  const [numHarmonics, setNumHarmonics] = useState(10);
  const timeCanvasRef = useRef(null);
  const freqCanvasRef = useRef(null);

  useEffect(() => {
    const timeCanvas = timeCanvasRef.current;
    const freqCanvas = freqCanvasRef.current;
    if (!timeCanvas || !freqCanvas) return;

    const timeCtx = timeCanvas.getContext("2d");
    const freqCtx = freqCanvas.getContext("2d");
    if (!timeCtx || !freqCtx) return;

    const drawWave = () => {
      timeCtx.clearRect(0, 0, timeCanvas.width, timeCanvas.height);
      timeCtx.beginPath();
      timeCtx.strokeStyle = "hsl(200, 100%, 50%)";
      timeCtx.lineWidth = 2;

      for (let x = 0; x < timeCanvas.width; x++) {
        const t = (x / timeCanvas.width) * Math.PI * 2;
        let y = 0;

        for (let n = 1; n <= numHarmonics; n++) {
          const amplitude = getHarmonicAmplitude(waveType, n);
          y += amplitude * Math.sin(n * frequency * t);
        }

        y = -y * (timeCanvas.height / 4) + timeCanvas.height / 2;
        timeCtx.lineTo(x, y);
      }

      timeCtx.stroke();
    };

    const drawFrequencyDomain = () => {
      freqCtx.clearRect(0, 0, freqCanvas.width, freqCanvas.height);
      freqCtx.fillStyle = "hsl(200, 100%, 50%)";

      for (let n = 1; n <= numHarmonics; n++) {
        const amplitude = getHarmonicAmplitude(waveType, n);
        const x = (n / numHarmonics) * freqCanvas.width;
        const height = amplitude * (freqCanvas.height / 2);
        freqCtx.fillRect(x - 2, freqCanvas.height - height, 4, height);
      }
    };

    drawWave();
    drawFrequencyDomain();
  }, [waveType, frequency, numHarmonics]);

  const getHarmonicAmplitude = (type, n) => {
    switch (type) {
      case "sine":
        return n === 1 ? 1 : 0;
      case "square":
        return n % 2 === 1 ? 4 / (n * Math.PI) : 0;
      case "sawtooth":
        return 2 / (n * Math.PI);
      case "triangle":
        return n % 2 === 1 ? 8 / (n * n * Math.PI * Math.PI) : 0;
      default:
        return 0;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Fourier Transform and Sound</h1>

      <p className="mb-4">
        The Fourier Transform breaks a complex wave into the individual sine waves that make it up. Audio processing
        relies on this to analyze how different wave shapes are built from simple sine waves.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Time Domain</h2>
          <canvas
            ref={timeCanvasRef}
            role="img"
            aria-label={`${waveType} wave in the time domain`}
            width={400}
            height={200}
            className="w-full border rounded"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Frequency Domain</h2>
          <canvas
            ref={freqCanvasRef}
            role="img"
            aria-label={`${waveType} wave harmonic spectrum in the frequency domain`}
            width={400}
            height={200}
            className="w-full border rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Wave Shape</h2>
          <Select value={waveType} onValueChange={setWaveType}>
            <SelectTrigger aria-label="Wave shape" className="w-[180px]">
              <SelectValue placeholder="Select wave shape" />
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
        <div>
          <h2 className="text-xl font-semibold mb-2">Number of Harmonics: {numHarmonics}</h2>
          <Slider
            aria-label="Number of harmonics"
            value={[numHarmonics]}
            onValueChange={(values) => setNumHarmonics(values[0])}
            min={1}
            max={20}
            step={1}
            className="mb-4"
          />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Understanding the Fourier Transform</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Time Domain:</strong> Shows how the wave&apos;s amplitude changes over time.
          </li>
          <li>
            <strong>Frequency Domain:</strong> Shows the amplitude of each frequency component after applying the
            Fourier Transform.
          </li>
          <li>
            <strong>Harmonics:</strong> Complex waves are made up of multiple sine waves at different frequencies
            (harmonics). The fundamental frequency is the first harmonic, and subsequent harmonics are integer multiples
            of the fundamental.
          </li>
          <li>
            <strong>Wave Shapes:</strong> Different wave shapes have different harmonic content:
            <ul className="list-circle pl-6 space-y-1">
              <li>
                <strong>Sine:</strong> Contains only the fundamental frequency.
              </li>
              <li>
                <strong>Square:</strong> Contains only odd harmonics, with amplitudes decreasing as 1/n.
              </li>
              <li>
                <strong>Sawtooth:</strong> Contains all harmonics, with amplitudes decreasing as 1/n.
              </li>
              <li>
                <strong>Triangle:</strong> Contains only odd harmonics, with amplitudes decreasing as 1/n².
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
}
