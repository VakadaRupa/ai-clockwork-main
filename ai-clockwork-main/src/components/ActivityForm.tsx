import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES, Activity } from "@/lib/activities";
import { Plus, X } from "lucide-react";

interface ActivityFormProps {
  onSubmit: (activity: Omit<Activity, "id">) => void;
  onCancel?: () => void;
  remainingMinutes: number;
  initialData?: Activity;
  isEditing?: boolean;
}

export const ActivityForm = ({ 
  onSubmit, 
  onCancel, 
  remainingMinutes, 
  initialData,
  isEditing 
}: ActivityFormProps) => {
  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState(initialData?.category || "work");
  const [duration, setDuration] = useState(initialData?.duration?.toString() || "");

  const maxDuration = isEditing 
    ? remainingMinutes + (initialData?.duration || 0) 
    : remainingMinutes;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const durationNum = parseInt(duration);
    if (durationNum > maxDuration) {
      return;
    }

    onSubmit({ name, category, duration: durationNum });
    
    if (!isEditing) {
      setName("");
      setDuration("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 animate-scale-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-lg">
          {isEditing ? "Edit Activity" : "Add Activity"}
        </h3>
        {onCancel && (
          <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
          <Label htmlFor="name">Activity Name</Label>
          <Input
            id="name"
            placeholder="e.g., Morning workout"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: cat.color }}
                    />
                    {cat.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            placeholder="60"
            min={1}
            max={maxDuration}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Max: {maxDuration} min
          </p>
        </div>

        <div className="flex items-end">
          <Button type="submit" className="w-full" disabled={maxDuration <= 0}>
            <Plus className="w-4 h-4" />
            {isEditing ? "Update" : "Add"}
          </Button>
        </div>
      </div>
    </form>
  );
};
