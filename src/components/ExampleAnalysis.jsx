"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const BEETHOVEN_CLIP_URL = "https://example.com/beethoven_5th_10s.mp3"; // Replace with actual URL

export default function BeethovenClipAnalysis() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10); // 10-second clip

  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const spectrogramCanvasRef = useRef(null);
  const waveformCanvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(BEETHOVEN_CLIP_URL);
    audioRef.current.addEventListener("loadedmetadata", () => {
      setDuration(audioRef.current.duration);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const initializeAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      cancelAnimationFrame(animationRef.current);
    } else {
      initializeAudioContext();
      audioRef.current.play();
      updateAnalysis();
    }
    setIsPlaying(!isPlaying);
  };

  const updateAnalysis = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    drawSpectrogram(dataArray);
    drawWaveform();

    setCurrentTime(audioRef.current.currentTime);

    animationRef.current = requestAnimationFrame(updateAnalysis);
  };

  const drawSpectrogram = (dataArray) => {
    const canvas = spectrogramCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const sliceWidth = width / dataArray.length;

    ctx.drawImage(ctx.canvas, -1, 0);

    for (let i = 0; i < dataArray.length; i++) {
      const value = dataArray[i];
      const percent = value / 255;
      const hue = ((1 - percent) * 120).toString(10);
      ctx.fillStyle = "hsl(" + hue + ",100%,50%)";
      ctx.fillRect(width - 1, height - i * sliceWidth, 1, sliceWidth);
    }
  };

  const drawWaveform = () => {
    const canvas = waveformCanvasRef.current;
    if (!canvas || !analyserRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyserRef.current.getByteTimeDomainData(dataArray);

    ctx.fillStyle = "rgb(200, 200, 200)";
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.beginPath();

    const sliceWidth = (width * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = dataArray[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
  };

  const handleTimeChange = (newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime[0];
      setCurrentTime(newTime[0]);
    }
  };

  const formatTime = (time) => {
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    return `${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Beethoven&apos;s 5th Symphony - 10-Second Analysis</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Spectrogram</CardTitle>
            <CardDescription>Frequency content over time</CardDescription>
          </CardHeader>
          <CardContent>
            <canvas ref={spectrogramCanvasRef} width={400} height={200} className="w-full border rounded" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Waveform</CardTitle>
            <CardDescription>Amplitude over time</CardDescription>
          </CardHeader>
          <CardContent>
            <canvas ref={waveformCanvasRef} width={400} height={200} className="w-full border rounded" />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Button onClick={togglePlayPause}>{isPlaying ? "Pause" : "Play"}</Button>
        <div>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      <Slider
        value={[currentTime]}
        min={0}
        max={duration}
        step={0.01}
        onValueChange={handleTimeChange}
        className="mb-6"
      />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Understanding the Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Spectrogram:</strong> The colorful graph shows the frequency content of the music over time.
              Brighter colors (towards yellow) indicate stronger presence of a frequency, while darker colors (towards
              blue) indicate weaker presence.
            </li>
            <li>
              <strong>Waveform:</strong> This graph shows the amplitude of the sound wave over time. The peaks and
              troughs represent the loudness of the audio at each moment.
            </li>
            <li>
              <strong>Beethoven&apos;s 5th:</strong> The famous opening motif (&quot;da da da DUM&quot;) is
              characterized by strong low frequencies, followed by a brief pause, and then a sustained mid-range
              frequency. You should be able to see this pattern in both the spectrogram and waveform.
            </li>
            <li>
              <strong>Frequency Range:</strong> The vertical axis of the spectrogram represents frequency, with lower
              frequencies at the bottom and higher frequencies at the top. You might notice that most of the energy is
              concentrated in the lower to mid-range frequencies, which is typical for orchestral music.
            </li>
            <li>
              <strong>Time Domain:</strong> The horizontal axis of both graphs represents time. As you play the audio,
              you&apos;ll see the graphs update in real-time, showing how the frequency content and amplitude change
              throughout the clip.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
