import { Activity, getCategoryColor, CATEGORIES } from "@/lib/activities";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Clock } from "lucide-react";

interface ActivityListProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (activityId: string) => void;
}

export const ActivityList = ({ activities, onEdit, onDelete }: ActivityListProps) => {
  if (activities.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
          <Clock className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">No activities logged yet. Add your first activity above!</p>
      </div>
    );
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <h3 className="font-semibold">Today's Activities</h3>
      </div>
      <div className="divide-y divide-border/50">
        {activities.map((activity, index) => {
          const categoryLabel = CATEGORIES.find(c => c.value === activity.category)?.label || "Other";
          
          return (
            <div 
              key={activity.id} 
              className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div 
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: getCategoryColor(activity.category) }}
              />
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{activity.name}</p>
                <p className="text-sm text-muted-foreground">{categoryLabel}</p>
              </div>

              <div className="text-right shrink-0">
                <p className="font-semibold">{formatDuration(activity.duration)}</p>
                <p className="text-xs text-muted-foreground">{activity.duration} min</p>
              </div>

              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => onEdit(activity)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(activity.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
