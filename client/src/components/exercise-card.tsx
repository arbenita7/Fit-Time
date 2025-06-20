import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Repeat, Signal, Plus, Bookmark } from "lucide-react";
import type { Exercise } from "@shared/schema";

interface ExerciseCardProps {
  exercise: Exercise;
  onAddToPlan?: (exerciseId: number) => void;
}

export default function ExerciseCard({ exercise, onAddToPlan }: ExerciseCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "fillestare":
        return "bg-green-500";
      case "mesatare":
        return "bg-yellow-500";
      case "përparuar":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "krahë":
        return "bg-primary";
      case "këmbë":
        return "bg-secondary";
      case "gjoks":
        return "bg-purple-500";
      case "shpinë":
        return "bg-accent";
      case "kardio":
        return "bg-red-500";
      case "bark":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{exercise.name}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={`${getCategoryColor(exercise.category)} text-white text-xs`}>
              {exercise.category}
            </Badge>
            <Button variant="ghost" size="sm" className="p-1 h-auto">
              <Bookmark className="h-4 w-4 text-neutral-medium hover:text-primary" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-neutral-medium text-sm mb-4 line-clamp-2">
          {exercise.description}
        </p>
        
        <div className="flex justify-between items-center text-sm text-neutral-medium mb-4">
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {exercise.defaultSets} sets
          </span>
          <span className="flex items-center">
            <Repeat className="h-4 w-4 mr-1" />
            {exercise.defaultReps} reps
          </span>
          <span className="flex items-center">
            <Signal className="h-4 w-4 mr-1" />
            <Badge className={`${getDifficultyColor(exercise.difficulty)} text-white text-xs`}>
              {exercise.difficulty}
            </Badge>
          </span>
        </div>

        {exercise.defaultDuration && (
          <div className="text-sm text-neutral-medium mb-4">
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              Kohëzgjatja: {exercise.defaultDuration}s
            </span>
          </div>
        )}

        <Button 
          className="w-full bg-primary hover:bg-primary/90"
          onClick={() => onAddToPlan?.(exercise.id)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Shto në Plan
        </Button>
      </CardContent>
    </Card>
  );
}
