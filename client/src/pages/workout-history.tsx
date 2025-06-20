import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Target, TrendingUp } from "lucide-react";
import type { WorkoutSession } from "@shared/schema";

export default function WorkoutHistory() {
  const { data: workoutSessions, isLoading } = useQuery<WorkoutSession[]>({
    queryKey: ["/api/workout-sessions"],
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('sq-AL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const sortedSessions = workoutSessions?.sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-neutral-medium">Duke ngarkuar historinë...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-dark mb-2">Historia e Stërvitjeve</h1>
            <p className="text-neutral-medium">Shiko të gjitha stërvitjet e kryera</p>
          </div>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Filtro sipas Datës
          </Button>
        </div>

        <div className="space-y-4">
          {sortedSessions?.length ? (
            sortedSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center space-x-4 mb-4 md:mb-0">
                      <div className="bg-primary text-white rounded-lg p-3">
                        <Target className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-neutral-dark">
                          Stërvitje #{session.id}
                        </h4>
                        <p className="text-neutral-medium text-sm">
                          {formatDate(session.startTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-4 text-sm text-neutral-medium">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {session.duration ? formatTime(session.duration) : "N/A"}
                        </span>
                        <span className="flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          {session.exercisesCompleted?.length || 0} ushtrime
                        </span>
                      </div>
                      <Badge 
                        className={`${
                          session.completed 
                            ? "bg-accent text-white" 
                            : "bg-yellow-500 text-white"
                        }`}
                      >
                        {session.completed ? "Kompletuar" : "Në Progres"}
                      </Badge>
                    </div>
                  </div>
                  
                  {session.notes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-neutral-medium">
                        <strong>Shënim:</strong> {session.notes}
                      </p>
                    </div>
                  )}
                  
                  {session.exercisesCompleted && session.exercisesCompleted.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-semibold text-neutral-dark mb-2">
                        Ushtrimet e Kompletuar:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {session.exercisesCompleted.map((exercise, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            Ushtrim #{exercise.exerciseId} - {exercise.setsCompleted} sets
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Target className="h-16 w-16 text-neutral-medium mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-neutral-dark mb-2">
                  Nuk ka histori stërvitjesh
                </h3>
                <p className="text-neutral-medium">
                  Kur të fillosh stërvitjet, ato do të shfaqen këtu.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {sortedSessions && sortedSessions.length > 10 && (
          <div className="text-center mt-8">
            <Button className="bg-primary hover:bg-primary/90">
              Ngarko më shumë
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
