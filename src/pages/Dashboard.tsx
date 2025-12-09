import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { ActivityForm } from "@/components/ActivityForm";
import { ActivityList } from "@/components/ActivityList";
import { TimeProgress } from "@/components/TimeProgress";
import { NoDataView } from "@/components/NoDataView";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { 
  Activity, 
  getActivities, 
  addActivity, 
  updateActivity, 
  deleteActivity,
  getTotalMinutes,
  getRemainingMinutes 
} from "@/lib/activities";
import { format } from "date-fns";
import { CalendarIcon, BarChart3, Plus, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type View = "logging" | "analytics";

export const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>("logging");
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showForm, setShowForm] = useState(false);

  const dateStr = format(date, "yyyy-MM-dd");
  const totalMinutes = getTotalMinutes(activities);
  const remainingMinutes = getRemainingMinutes(activities);
  const canAnalyse = totalMinutes > 0;

  const fetchActivities = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getActivities(user.uid, dateStr);
      setActivities(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load activities", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, dateStr, toast]);

  useEffect(() => {
    fetchActivities();
    setView("logging");
  }, [fetchActivities]);

  const handleAddActivity = async (activityData: Omit<Activity, "id">) => {
    if (!user) return;
    try {
      await addActivity(user.uid, dateStr, activityData);
      toast({ title: "Activity added!", description: `${activityData.name} logged successfully.` });
      fetchActivities();
      setShowForm(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to add activity", variant: "destructive" });
    }
  };

  const handleUpdateActivity = async (activityData: Omit<Activity, "id">) => {
    if (!user || !editingActivity) return;
    try {
      await updateActivity(user.uid, dateStr, editingActivity.id, activityData);
      toast({ title: "Activity updated!", description: `${activityData.name} updated successfully.` });
      setEditingActivity(null);
      fetchActivities();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update activity", variant: "destructive" });
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!user) return;
    try {
      await deleteActivity(user.uid, dateStr, activityId);
      toast({ title: "Activity deleted", description: "Activity removed from your log." });
      fetchActivities();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete activity", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Date Picker & View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="glass" className="justify-start text-left font-normal w-full sm:w-auto">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "EEEE, MMMM d, yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          <div className="flex gap-2 w-full sm:w-auto">
            {view === "analytics" && (
              <Button variant="outline" onClick={() => setView("logging")} className="flex-1 sm:flex-none">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Logging
              </Button>
            )}
            {view === "logging" && canAnalyse && (
              <Button variant="accent" onClick={() => setView("analytics")} className="flex-1 sm:flex-none">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analyse Day
              </Button>
            )}
          </div>
        </div>

        {view === "logging" ? (
          <div className="space-y-6">
            {/* Time Progress */}
            <TimeProgress totalMinutes={totalMinutes} remainingMinutes={remainingMinutes} />

            {/* Add Activity Button or Form */}
            {!showForm && !editingActivity && remainingMinutes > 0 && (
              <Button onClick={() => setShowForm(true)} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            )}

            {showForm && (
              <ActivityForm
                onSubmit={handleAddActivity}
                onCancel={() => setShowForm(false)}
                remainingMinutes={remainingMinutes}
              />
            )}

            {editingActivity && (
              <ActivityForm
                onSubmit={handleUpdateActivity}
                onCancel={() => setEditingActivity(null)}
                remainingMinutes={remainingMinutes}
                initialData={editingActivity}
                isEditing
              />
            )}

            {/* Activity List */}
            <ActivityList
              activities={activities}
              onEdit={(activity) => {
                setEditingActivity(activity);
                setShowForm(false);
              }}
              onDelete={handleDeleteActivity}
            />
          </div>
        ) : activities.length === 0 ? (
          <NoDataView date={dateStr} onStartLogging={() => setView("logging")} />
        ) : (
          <AnalyticsDashboard activities={activities} date={dateStr} />
        )}
      </main>
    </div>
  );
};
