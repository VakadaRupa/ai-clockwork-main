import { Activity, CATEGORIES, getCategoryColor } from "@/lib/activities";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Clock, Activity as ActivityIcon, TrendingUp, Calendar } from "lucide-react";

interface AnalyticsDashboardProps {
  activities: Activity[];
  date: string;
}

export const AnalyticsDashboard = ({ activities, date }: AnalyticsDashboardProps) => {
  const totalMinutes = activities.reduce((sum, a) => sum + a.duration, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Aggregate by category
  const categoryData = CATEGORIES.map((cat) => {
    const categoryActivities = activities.filter((a) => a.category === cat.value);
    const totalDuration = categoryActivities.reduce((sum, a) => sum + a.duration, 0);
    return {
      name: cat.label,
      value: totalDuration,
      color: cat.color,
      hours: (totalDuration / 60).toFixed(1),
    };
  }).filter((d) => d.value > 0);

  // Bar chart data
  const barData = activities.map((a) => ({
    name: a.name.length > 15 ? a.name.slice(0, 15) + "..." : a.name,
    duration: a.duration,
    category: CATEGORIES.find((c) => c.value === a.category)?.label || "Other",
    fill: getCategoryColor(a.category),
  }));

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stats = [
    { 
      label: "Total Time", 
      value: `${totalHours}h`, 
      subtext: `${totalMinutes} minutes`,
      icon: Clock,
      color: "text-primary"
    },
    { 
      label: "Activities", 
      value: activities.length.toString(), 
      subtext: "logged today",
      icon: ActivityIcon,
      color: "text-accent"
    },
    { 
      label: "Categories", 
      value: categoryData.length.toString(), 
      subtext: "used today",
      icon: TrendingUp,
      color: "text-chart-study"
    },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Date Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
          <Calendar className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">{formattedDate}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div 
            key={stat.label} 
            className="stat-card animate-fade-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-muted-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="chart-container">
          <h3 className="font-semibold mb-4">Time by Category</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, hours }) => `${name}: ${hours}h`}
                  labelLine={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} minutes`, "Duration"]}
                  contentStyle={{ 
                    borderRadius: "12px", 
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-sm text-muted-foreground">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="chart-container">
          <h3 className="font-semibold mb-4">Activity Duration</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <XAxis type="number" unit=" min" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value} minutes`, "Duration"]}
                  contentStyle={{ 
                    borderRadius: "12px", 
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                  }}
                />
                <Bar 
                  dataKey="duration" 
                  radius={[0, 8, 8, 0]}
                >
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="chart-container">
        <h3 className="font-semibold mb-4">Activity Timeline</h3>
        <div className="space-y-3">
          {activities.map((activity, index) => {
            const widthPercent = (activity.duration / totalMinutes) * 100;
            const categoryLabel = CATEGORIES.find(c => c.value === activity.category)?.label;
            
            return (
              <div 
                key={activity.id} 
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{activity.name}</span>
                  <span className="text-muted-foreground">{activity.duration} min</span>
                </div>
                <div className="h-8 bg-muted rounded-lg overflow-hidden">
                  <div 
                    className="h-full rounded-lg flex items-center px-3 transition-all duration-500"
                    style={{ 
                      width: `${Math.max(widthPercent, 10)}%`,
                      backgroundColor: getCategoryColor(activity.category)
                    }}
                  >
                    <span className="text-xs font-medium text-primary-foreground truncate">
                      {categoryLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
