import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { insertWorkoutPlanSchema } from "@shared/schema";
import type { Exercise, InsertWorkoutPlan } from "@shared/schema";

const workoutPlanFormSchema = insertWorkoutPlanSchema.extend({
  exercises: z.array(z.object({
    exerciseId: z.number(),
    sets: z.number().min(1).max(10),
    reps: z.number().min(1).max(100),
    duration: z.number().optional(),
    restTime: z.number().min(0).max(600).optional(),
  })).min(1, "Duhet të kesh të paktën një ushtrim"),
});

type WorkoutPlanFormData = z.infer<typeof workoutPlanFormSchema>;

export default function WorkoutCreator() {
  const { toast } = useToast();
  const [selectedExercises, setSelectedExercises] = useState<Array<{
    exerciseId: number;
    sets: number;
    reps: number;
    duration?: number;
    restTime?: number;
  }>>([]);

  const { data: exercises } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  const form = useForm<WorkoutPlanFormData>({
    resolver: zodResolver(workoutPlanFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      estimatedDuration: 30,
      exercises: [],
    },
  });

  const createWorkoutPlanMutation = useMutation({
    mutationFn: async (data: InsertWorkoutPlan) => {
      const response = await apiRequest("POST", "/api/workout-plans", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Plani u Krijua!",
        description: "Plani i stërvitjes u krijua me sukses.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/workout-plans"] });
      form.reset();
      setSelectedExercises([]);
    },
    onError: () => {
      toast({
        title: "Gabim",
        description: "Nuk mund të krijohet plani i stërvitjes.",
        variant: "destructive",
      });
    },
  });

  const addExercise = (exerciseId: number) => {
    const exercise = exercises?.find(ex => ex.id === exerciseId);
    if (!exercise) return;

    const newExercise = {
      exerciseId: exercise.id,
      sets: exercise.defaultSets || 3,
      reps: exercise.defaultReps || 10,
      duration: exercise.defaultDuration || undefined,
      restTime: 60,
    };

    setSelectedExercises(prev => [...prev, newExercise]);
    form.setValue("exercises", [...selectedExercises, newExercise]);
  };

  const removeExercise = (index: number) => {
    const updated = selectedExercises.filter((_, i) => i !== index);
    setSelectedExercises(updated);
    form.setValue("exercises", updated);
  };

  const updateExercise = (index: number, field: string, value: number) => {
    const updated = selectedExercises.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    );
    setSelectedExercises(updated);
    form.setValue("exercises", updated);
  };

  const onSubmit = (data: WorkoutPlanFormData) => {
    createWorkoutPlanMutation.mutate(data);
  };

  const categories = ["Krahë", "Këmbë", "Gjoks", "Shpinë", "Kardio", "Bark", "Të Plotë"];

  return (
    <div className="min-h-screen bg-neutral-light py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-dark mb-2">Krijo Plan Stërvitjesh</h1>
          <p className="text-neutral-medium">Përshkruaj planin tënd të stërvitjes dhe shto ushtrimet</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Informacioni Bazik</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emri i Planit</FormLabel>
                        <FormControl>
                          <Input placeholder="p.sh. Upper Body Blast" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Përshkrimi</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Përshkruaj qëllimin dhe fokusin e planit"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategoria</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Zgjidh kategorinë" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estimatedDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kohëzgjatja e Vlerësuar (minuta)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="5" 
                            max="180"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shto Ushtrime</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select onValueChange={value => addExercise(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Zgjidh një ushtrim për të shtuar" />
                    </SelectTrigger>
                    <SelectContent>
                      {exercises?.map(exercise => (
                        <SelectItem key={exercise.id} value={exercise.id.toString()}>
                          {exercise.name} ({exercise.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Ushtrimet e Zgjedhura ({selectedExercises.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedExercises.length === 0 ? (
                  <div className="text-center py-8 text-neutral-medium">
                    <p>Nuk ka ushtrime të zgjedhura ende.</p>
                    <p className="text-sm">Zgjidh ushtrime nga lista më sipër.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedExercises.map((exercise, index) => {
                      const exerciseDetails = exercises?.find(ex => ex.id === exercise.exerciseId);
                      return (
                        <div key={index} className="border rounded-lg p-4 bg-white">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <GripVertical className="h-4 w-4 text-neutral-medium" />
                              <h4 className="font-semibold">{exerciseDetails?.name}</h4>
                              <span className="text-sm text-neutral-medium bg-gray-100 px-2 py-1 rounded">
                                {exerciseDetails?.category}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExercise(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <label className="text-sm font-medium text-neutral-dark">Sets</label>
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                value={exercise.sets}
                                onChange={e => updateExercise(index, 'sets', parseInt(e.target.value))}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium text-neutral-dark">Reps</label>
                              <Input
                                type="number"
                                min="1"
                                max="100"
                                value={exercise.reps}
                                onChange={e => updateExercise(index, 'reps', parseInt(e.target.value))}
                              />
                            </div>
                            {exerciseDetails?.defaultDuration && (
                              <div>
                                <label className="text-sm font-medium text-neutral-dark">Kohëzgjatja (s)</label>
                                <Input
                                  type="number"
                                  min="10"
                                  max="3600"
                                  value={exercise.duration || exerciseDetails.defaultDuration}
                                  onChange={e => updateExercise(index, 'duration', parseInt(e.target.value))}
                                />
                              </div>
                            )}
                            <div>
                              <label className="text-sm font-medium text-neutral-dark">Pushim (s)</label>
                              <Input
                                type="number"
                                min="0"
                                max="600"
                                value={exercise.restTime || 60}
                                onChange={e => updateExercise(index, 'restTime', parseInt(e.target.value))}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setSelectedExercises([]);
                }}
              >
                Anulo
              </Button>
              <Button
                type="submit"
                disabled={createWorkoutPlanMutation.isPending || selectedExercises.length === 0}
                className="bg-primary hover:bg-primary/90"
              >
                {createWorkoutPlanMutation.isPending ? "Duke krijuar..." : "Krijo Planin"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
