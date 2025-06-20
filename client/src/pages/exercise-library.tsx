import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ExerciseCard from "@/components/exercise-card";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Filter, Search } from "lucide-react";
import { insertExerciseSchema } from "@shared/schema";
import type { Exercise, InsertExercise } from "@shared/schema";

const categories = ["Të Gjitha", "Krahë", "Këmbë", "Gjoks", "Shpinë", "Kardio", "Bark"];
const difficulties = ["Fillestare", "Mesatare", "Përparuar"];

export default function ExerciseLibrary() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("Të Gjitha");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: exercises, isLoading } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
  });

  const form = useForm<InsertExercise>({
    resolver: zodResolver(insertExerciseSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      difficulty: "",
      defaultSets: 3,
      defaultReps: 10,
      defaultDuration: undefined,
      isCustom: true,
    },
  });

  const createExerciseMutation = useMutation({
    mutationFn: async (data: InsertExercise) => {
      const response = await apiRequest("POST", "/api/exercises", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Ushtrim i Krijuar!",
        description: "Ushtrim i ri u shtua me sukses në bibliotekë.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/exercises"] });
      form.reset();
      setIsCreateDialogOpen(false);
    },
    onError: () => {
      toast({
        title: "Gabim",
        description: "Nuk mund të krijohet ushtrim i ri.",
        variant: "destructive",
      });
    },
  });

  const filteredExercises = exercises?.filter(exercise => {
    const matchesCategory = selectedCategory === "Të Gjitha" || exercise.category === selectedCategory;
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const onSubmit = (data: InsertExercise) => {
    createExerciseMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-neutral-medium">Duke ngarkuar ushtrimet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-dark mb-2">Biblioteka e Ushrimeve</h1>
            <p className="text-neutral-medium">Zbulo dhe menaxho ushtrimet e disponueshme</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Shto Ushrim
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Krijo Ushrim të Ri</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emri i Ushtrimit</FormLabel>
                        <FormControl>
                          <Input placeholder="p.sh. Push-ups" {...field} />
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
                            placeholder="Përshkruaj ushtrimin..."
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
                            {categories.slice(1).map(category => (
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
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vështirësia</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Zgjidh vështirësinë" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {difficulties.map(difficulty => (
                              <SelectItem key={difficulty} value={difficulty}>
                                {difficulty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="defaultSets"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sets</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="10"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="defaultReps"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reps</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              max="100"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="defaultDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kohëzgjatja (sekonda, opsionale)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="10" 
                            max="3600"
                            {...field}
                            onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Anulo
                    </Button>
                    <Button
                      type="submit"
                      disabled={createExerciseMutation.isPending}
                    >
                      {createExerciseMutation.isPending ? "Duke krijuar..." : "Krijo"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-medium" />
              <Input
                placeholder="Kërko ushtrime..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="sm:w-auto">
              <Filter className="h-4 w-4 mr-2" />
              Filtro
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-primary" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises?.map(exercise => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          )) || (
            <div className="col-span-full text-center py-8">
              <p className="text-neutral-medium">Nuk u gjetën ushtrime që përputhen me kërkesën.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
