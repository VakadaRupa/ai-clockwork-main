import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoDataViewProps {
  date: string;
  onStartLogging: () => void;
}

export const NoDataView = ({ date, onStartLogging }: NoDataViewProps) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-up">
      <div className="w-24 h-24 rounded-3xl bg-muted flex items-center justify-center mb-6">
        <Calendar className="w-12 h-12 text-muted-foreground" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-center">No Data Available</h2>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        You haven't logged any activities for <span className="font-medium text-foreground">{formattedDate}</span>. 
        Start tracking your time to see detailed analytics!
      </p>

      <Button size="lg" onClick={onStartLogging}>
        <Plus className="w-5 h-5" />
        Start Logging Your Day
      </Button>

      <div className="mt-12 grid grid-cols-3 gap-4 max-w-md">
        {["Work", "Sleep", "Exercise"].map((category, i) => (
          <div 
            key={category}
            className="glass-card rounded-xl p-4 text-center animate-fade-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="w-8 h-8 rounded-lg bg-muted mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">{category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
