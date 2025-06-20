import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Timer from "@/components/timer";
import { useTimer } from "@/hooks/use-timer";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Circle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { WorkoutPlan, Exercise, InsertWorkoutSession } from "@shared/schema";

export default function ActiveWorkout() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [workoutSessionId, setWorkoutSessionId] = useState<number | null>(null);
  const { time, isRunning, start, stop, formatTime } = useTimer();

  const { data: workoutPlan, isLoading } = useQuery<WorkoutPlan>({
    queryKey: ["/api/workout-plans", id],
    enabled: !!id,
  });

  const { data: exercises } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: InsertWorkoutSession) => {
      const response = await apiRequest("POST", "/api/workout-sessions", sessionData);
      return response.json();
    },
    onSuccess: (data) => {
      setWorkoutSessionId(data.id);
      queryClient.invalidateQueries({ queryKey: ["/api/workout-sessions"] });
    },
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertWorkoutSession> }) => {
      const response = await apiRequest("PUT", `/api/workout-sessions/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workout-sessions"] });
    },
  });

  const startWorkout = () => {
    if (!workoutPlan) return;
    
    start();
    const sessionData: InsertWorkoutSession = {
      workoutPlanId: workoutPlan.id,
      startTime: new Date(),
      completed: false,
      exercisesCompleted: [],
    };
    
    createSessionMutation.mutate(sessionData);
  };

  const completeExercise = (exerciseIndex: number) => {
    setCompletedExercises(prev => new Set([...prev, exerciseIndex]));
    if (exerciseIndex < (workoutPlan?.exercises.length || 0) - 1) {
      setCurrentExerciseIndex(exerciseIndex + 1);
    }
  };

  const finishWorkout = () => {
    if (!workoutSessionId) return;
    
    stop();
    const updateData = {
      endTime: new Date(),
      duration: time,
      completed: true,
      exercisesCompleted: Array.from(completedExercises).map(index => ({
        exerciseId: workoutPlan!.exercises[index].exerciseId,
        setsCompleted: workoutPlan!.exercises[index].sets,
      })),
    };
    
    updateSessionMutation.mutate({ id: workoutSessionId, data: updateData });
    toast({
      title: "Stërvitja u Kompletua!",
      description: `Kohëzgjatja: ${formatTime()}`,
    });
  };

  const getExerciseDetails = (exerciseId: number) => {
    return exercises?.find(ex => ex.id === exerciseId);
  };

  const progress = workoutPlan ? (completedExercises.size / workoutPlan.exercises.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-neutral-medium">Duke ngarkuar stërvitjen...</p>
        </div>
      </div>
    );
  }

  if (!workoutPlan) {
    return (
      <div className="min-h-screen bg-neutral-light flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-neutral-dark mb-4">Plan i Stërvitjes Nuk u Gjet</h2>
            <Link href="/">
              <Button>Kthehu në Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kthehu
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-neutral-dark mb-2">{workoutPlan.name}</h1>
          <p className="text-neutral-medium">{workoutPlan.description}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <Timer
              onStart={startWorkout}
              onStop={finishWorkout}
              className="mb-8"
            />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Progresi i Stërvitjes</span>
                  <span className="text-sm text-neutral-medium">
                    {completedExercises.size} / {workoutPlan.exercises.length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="mb-4" />
                <div className="text-center">
                  <p className="text-sm text-neutral-medium">
                    {Math.round(progress)}% Kompletuar
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Ushtrimet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workoutPlan.exercises.map((exercise, index) => {
                    const exerciseDetails = getExerciseDetails(exercise.exerciseId);
                    const isCompleted = completedExercises.has(index);
                    const isCurrent = index === currentExerciseIndex;
                    
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isCurrent
                            ? "border-primary bg-primary/5"
                            : isCompleted
                            ? "border-accent bg-accent/5"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => completeExercise(index)}
                              disabled={isCompleted || !isRunning}
                              className="p-0 h-auto"
                            >
                              {isCompleted ? (
                                <CheckCircle className="h-6 w-6 text-accent" />
                              ) : (
                                <Circle className="h-6 w-6 text-neutral-medium" />
                              )}
                            </Button>
                            <div>
                              <h4 className="font-semibold text-neutral-dark">
                                {exerciseDetails?.name || `Ushtrim ${exercise.exerciseId}`}
                              </h4>
                              <p className="text-sm text-neutral-medium">
                                {exercise.sets} sets × {exercise.reps} reps
                                {exercise.duration && ` × ${exercise.duration}s`}
                              </p>
                            </div>
                          </div>
                          {isCurrent && isRunning && (
                            <div className="text-sm font-semibold text-primary">
                              Aktual
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {completedExercises.size === workoutPlan.exercises.length && isRunning && (
                  <div className="mt-6 text-center">
                    <Button
                      onClick={finishWorkout}
                      className="bg-accent hover:bg-accent/90"
                      size="lg"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Përfundo Stërvitjen
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
