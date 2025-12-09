import { ref, set, get, remove, push } from "firebase/database";
import { db } from "./firebase";

export interface Activity {
  id: string;
  name: string;
  category: string;
  duration: number;
}

export const CATEGORIES = [
  { value: "work", label: "Work", color: "hsl(200, 80%, 50%)" },
  { value: "sleep", label: "Sleep", color: "hsl(260, 60%, 55%)" },
  { value: "study", label: "Study", color: "hsl(174, 72%, 45%)" },
  { value: "exercise", label: "Exercise", color: "hsl(340, 75%, 55%)" },
  { value: "entertainment", label: "Entertainment", color: "hsl(45, 90%, 55%)" },
  { value: "other", label: "Other", color: "hsl(210, 20%, 60%)" },
];

export const getCategoryColor = (category: string): string => {
  return CATEGORIES.find(c => c.value === category)?.color || CATEGORIES[5].color;
};

export const addActivity = async (
  userId: string, 
  date: string, 
  activity: Omit<Activity, "id">
): Promise<string> => {
  const activitiesRef = ref(db, `users/${userId}/days/${date}/activities`);
  const newActivityRef = push(activitiesRef);
  await set(newActivityRef, activity);
  return newActivityRef.key!;
};

export const getActivities = async (
  userId: string, 
  date: string
): Promise<Activity[]> => {
  const snapshot = await get(ref(db, `users/${userId}/days/${date}/activities`));
  
  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();
  return Object.entries(data).map(([id, activity]: [string, any]) => ({
    id,
    ...activity,
  }));
};

export const updateActivity = async (
  userId: string,
  date: string,
  activityId: string,
  activity: Omit<Activity, "id">
): Promise<void> => {
  await set(ref(db, `users/${userId}/days/${date}/activities/${activityId}`), activity);
};

export const deleteActivity = async (
  userId: string,
  date: string,
  activityId: string
): Promise<void> => {
  await remove(ref(db, `users/${userId}/days/${date}/activities/${activityId}`));
};

export const getTotalMinutes = (activities: Activity[]): number => {
  return activities.reduce((sum, activity) => sum + activity.duration, 0);
};

export const getRemainingMinutes = (activities: Activity[]): number => {
  return 1440 - getTotalMinutes(activities);
};
