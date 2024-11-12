import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import SineWaveToSound from "./SineWaveToSound";

const notes = [
  { name: "C4", frequency: 261.63 },
  { name: "D4", frequency: 293.66 },
  { name: "E4", frequency: 329.63 },
  { name: "F4", frequency: 349.23 },
  { name: "G4", frequency: 392.0 },
  { name: "A4", frequency: 440.0 },
  { name: "B4", frequency: 493.88 },
];

export default function NotesAndWaves() {
  const [selectedNote, setSelectedNote] = useState(notes[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [harmonics, setHarmonics] = useState([1, 0.5, 0.25]);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const oscillatorsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawWave = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);

      for (let x = 0; x < canvas.width; x++) {
        let y = 0;
        harmonics.forEach((amplitude, index) => {
          const frequency = selectedNote.frequency * (index + 1);
          y += Math.sin((x / canvas.width) * Math.PI * 2 * frequency) * amplitude * 50;
        });
        ctx.lineTo(x, canvas.height / 2 + y);
      }

      ctx.strokeStyle = "hsl(200, 100%, 50%)";
      ctx.stroke();
    };

    const animationFrame = requestAnimationFrame(function animate() {
      drawWave();
      requestAnimationFrame(animate);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [selectedNote, harmonics]);

  const playNote = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const ctx = audioContextRef.current;

    oscillatorsRef.current.forEach((osc) => osc.stop());
    oscillatorsRef.current = [];

    harmonics.forEach((amplitude, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.frequency.setValueAtTime(selectedNote.frequency * (index + 1), ctx.currentTime);
      gain.gain.setValueAtTime(amplitude, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscillatorsRef.current.push(osc);
    });

    setIsPlaying(true);
  };

  const stopNote = () => {
    oscillatorsRef.current.forEach((osc) => osc.stop());
    setIsPlaying(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sound Physics Visualizer</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        {notes.map((note) => (
          <Button
            key={note.name}
            onClick={() => setSelectedNote(note)}
            variant={selectedNote.name === note.name ? "default" : "outline"}
          >
            {note.name}
          </Button>
        ))}
      </div>
      <div className="mb-6">
        <canvas ref={canvasRef} width={800} height={200} className="w-full border rounded" />
      </div>
      <div className="flex justify-center mb-6">
        <Button onClick={isPlaying ? stopNote : playNote}>
          {isPlaying ? "Stop" : "Play"} {selectedNote.name}
        </Button>
      </div>
      <div className="space-y-4">
        {harmonics.map((amplitude, index) => (
          <div key={index} className="flex items-center gap-4">
            <span className="w-24">Harmonic {index + 1}:</span>
            <Slider
              value={[amplitude]}
              onValueChange={(values) => {
                const newHarmonics = [...harmonics];
                newHarmonics[index] = values[0];
                setHarmonics(newHarmonics);
              }}
              max={1}
              step={0.01}
              className="flex-grow"
            />
            <span className="w-12 text-right">{amplitude.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
