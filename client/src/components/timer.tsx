import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, Square } from "lucide-react";
import { useTimer } from "@/hooks/use-timer";

interface TimerProps {
  onStart?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  className?: string;
}

export default function Timer({ onStart, onPause, onStop, className }: TimerProps) {
  const { time, isRunning, isPaused, start, pause, resume, stop, formatTime } = useTimer();

  const handleStart = () => {
    start();
    onStart?.();
  };

  const handlePause = () => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
    onPause?.();
  };

  const handleStop = () => {
    stop();
    onStop?.();
  };

  const progress = Math.min((time % 60) / 60 * 100, 100);

  return (
    <Card className={className}>
      <CardContent className="p-8 text-center">
        <div className="mb-8">
          <div className="relative w-48 h-48 mx-auto">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="hsl(var(--border))" 
                strokeWidth="8"
              />
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="hsl(var(--primary))" 
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * progress) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-neutral-dark">
                  {formatTime()}
                </div>
                <div className="text-sm text-neutral-medium">min:sec</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={handleStart}
            disabled={isRunning && !isPaused}
            className="bg-accent hover:bg-accent/90"
          >
            <Play className="h-4 w-4 mr-2" />
            Start
          </Button>
          <Button
            onClick={handlePause}
            disabled={!isRunning}
            className="bg-yellow-500 hover:bg-yellow-600"
          >
            <Pause className="h-4 w-4 mr-2" />
            {isPaused ? "Resume" : "Pause"}
          </Button>
          <Button
            onClick={handleStop}
            disabled={!isRunning}
            className="bg-red-500 hover:bg-red-600"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
