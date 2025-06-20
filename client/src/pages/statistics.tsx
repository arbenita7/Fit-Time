import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Calendar, Clock, Target, TrendingUp } from "lucide-react";

export default function Statistics() {
  const { data: weeklyStats } = useQuery<{
    totalWorkouts: number;
    totalTime: number;
    averageWorkoutTime: number;
    workoutsByDay: { day: string; duration: number }[];
  }>({
    queryKey: ["/api/statistics/weekly"],
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDuration = (seconds: number) => {
    return Math.floor(seconds / 60); // Convert to minutes for display
  };

  const chartData = weeklyStats?.workoutsByDay.map(day => ({
    ...day,
    duration: formatDuration(day.duration)
  })) || [];

  const monthlyGoal = 20; // 20 workouts per month
  const monthlyProgress = weeklyStats ? (weeklyStats.totalWorkouts * 4 / monthlyGoal) * 100 : 0;

  return (
    <div className="min-h-screen bg-neutral-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-dark mb-2">Statistikat Javore</h1>
          <p className="text-neutral-medium">Analizon performancën dhe progresin tënd</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Weekly Activity Chart */}
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 mr-2" />
                Aktiviteti Javor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} min`, "Kohëzgjatja"]} />
                    <Bar dataKey="duration" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Progress */}
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Progresi Mujor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="8"/>
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="40" 
                      fill="none" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth="8"
                      strokeDasharray="251" 
                      strokeDashoffset={251 - (251 * Math.min(monthlyProgress, 100)) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neutral-dark">
                        {Math.round(monthlyProgress)}%
                      </div>
                      <div className="text-xs text-neutral-medium">Synimi</div>
                    </div>
                  </div>
                </div>
                <p className="text-neutral-medium">
                  {weeklyStats?.totalWorkouts || 0} nga {monthlyGoal} stërvitje në muaj
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {weeklyStats ? formatTime(weeklyStats.totalTime) : "0m"}
                    </div>
                    <div className="text-sm text-neutral-medium">Min/Javë</div>
                  </CardContent>
                </Card>
                <Card className="bg-white">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-secondary">
                      {weeklyStats?.totalWorkouts || 0}
                    </div>
                    <div className="text-sm text-neutral-medium">Stërvitje</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totali Javore</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyStats?.totalWorkouts || 0}</div>
              <p className="text-xs text-muted-foreground">stërvitje të kompletuar</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kohë Totale</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weeklyStats ? formatTime(weeklyStats.totalTime) : "0m"}
              </div>
              <p className="text-xs text-muted-foreground">kohë aktiviteti</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mesatarja</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weeklyStats ? Math.round(weeklyStats.averageWorkoutTime / 60) : 0}min
              </div>
              <p className="text-xs text-muted-foreground">për stërvitje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objektivi</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(monthlyProgress)}%</div>
              <p className="text-xs text-muted-foreground">nga objektivi mujor</p>
              <Progress value={monthlyProgress} className="mt-2" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
