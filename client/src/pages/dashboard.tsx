import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WorkoutCard from "@/components/workout-card";
import { Plus, Play, Clock, TrendingUp, Calendar, Target, Archive } from "lucide-react";
import type { WorkoutPlan, WorkoutSession } from "@shared/schema";

export default function Dashboard() {
  const { data: workoutPlans } = useQuery<WorkoutPlan[]>({
    queryKey: ["/api/workout-plans"],
  });

  const { data: recentSessions } = useQuery<WorkoutSession[]>({
    queryKey: ["/api/workout-sessions?recent=5"],
  });

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

  return (
    <div className="min-h-screen bg-neutral-light">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Mirë se erdhe në FitTime!
              </h2>
              <p className="text-xl mb-6 opacity-90">
                Krijo planet e stërvitjes dhe ndjek progresin tënd me timer të avancuar dhe statistika të detajuara.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/workout-creator">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                    <Plus className="h-5 w-5 mr-2" />
                    Krijo Plan të Ri
                  </Button>
                </Link>
                <Link href="/exercise-library">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                    <Play className="h-5 w-5 mr-2" />
                    Fillo Stërvitje
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Person exercising with weights" 
                className="rounded-xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-primary to-orange-400 text-white border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{weeklyStats?.totalWorkouts || 0}</div>
                <div className="text-sm opacity-90">Stërvitje Javore</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-secondary to-blue-500 text-white border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {weeklyStats ? formatTime(weeklyStats.totalTime) : "0m"}
                </div>
                <div className="text-sm opacity-90">Kohë Totale</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-accent to-green-500 text-white border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {weeklyStats ? Math.round(weeklyStats.averageWorkoutTime / 60) : 0}
                </div>
                <div className="text-sm opacity-90">Min Mesatare</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{recentSessions?.length || 0}</div>
                <div className="text-sm opacity-90">Sesione të Fundit</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Workout Plans */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold text-neutral-dark">Planet e Stërvitjes</h3>
            <Link href="/workout-creator">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Krijo Plan të Ri
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workoutPlans?.map((plan) => (
              <WorkoutCard key={plan.id} plan={plan} />
            )) || (
              <div className="col-span-full text-center py-8">
                <p className="text-neutral-medium">Nuk ka plane stërvitjesh të disponueshme.</p>
                <Link href="/workout-creator">
                  <Button className="mt-4">Krijo Plan të Parë</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-12 bg-neutral-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold text-neutral-dark">Aktiviteti i Fundit</h3>
            <Link href="/history">
              <Button variant="outline">
                <Archive className="h-4 w-4 mr-2" />
                Shiko Gjithçka
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentSessions?.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary text-white rounded-lg p-3">
                        <Target className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-dark">
                          Stërvitje #{session.id}
                        </h4>
                        <p className="text-sm text-neutral-medium">
                          {new Date(session.startTime).toLocaleDateString('sq-AL', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-neutral-medium">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {session.duration ? formatTime(session.duration) : "N/A"}
                      </span>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        session.completed 
                          ? "bg-accent text-white" 
                          : "bg-yellow-500 text-white"
                      }`}>
                        {session.completed ? "Kompletuar" : "Në Progres"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-neutral-medium">Nuk ka aktivitet të fundit për të treguar.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
