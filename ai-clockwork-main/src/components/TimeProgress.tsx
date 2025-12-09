import { Progress } from "@/components/ui/progress";
import { Clock, Check } from "lucide-react";

interface TimeProgressProps {
  totalMinutes: number;
  remainingMinutes: number;
}

export const TimeProgress = ({ totalMinutes, remainingMinutes }: TimeProgressProps) => {
  const percentage = (totalMinutes / 1440) * 100;
  const isComplete = remainingMinutes <= 0;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isComplete ? "bg-primary" : "bg-muted"
          }`}>
            {isComplete ? (
              <Check className="w-5 h-5 text-primary-foreground" />
            ) : (
              <Clock className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-semibold">Daily Progress</p>
            <p className="text-sm text-muted-foreground">
              {formatTime(totalMinutes)} of 24h logged
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold gradient-text">{percentage.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">
            {remainingMinutes > 0 ? `${formatTime(remainingMinutes)} left` : "Complete!"}
          </p>
        </div>
      </div>
      
      <Progress value={percentage} className="h-3" />
      
      {isComplete && (
        <p className="text-sm text-primary font-medium mt-3 animate-fade-up">
          ✨ You've logged a full 24 hours! Click "Analyse Day" to view your insights.
        </p>
      )}
    </div>
  );
};
