import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Layers, Star, Play } from "lucide-react";
import type { WorkoutPlan } from "@shared/schema";

interface WorkoutCardProps {
  plan: WorkoutPlan;
}

export default function WorkoutCard({ plan }: WorkoutCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "krahë":
        return "from-primary to-orange-400";
      case "këmbë":
        return "from-secondary to-blue-500";
      case "kardio":
        return "from-accent to-green-500";
      case "gjoks":
        return "from-purple-500 to-pink-500";
      case "shpinë":
        return "from-yellow-500 to-orange-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "krahë":
        return "💪";
      case "këmbë":
        return "🦵";
      case "kardio":
        return "❤️";
      case "gjoks":
        return "🔥";
      case "shpinë":
        return "⚡";
      default:
        return "🏋️";
    }
  };

  return (
    <Card className={`bg-gradient-to-br ${getCategoryColor(plan.category)} text-white hover:shadow-lg transition-shadow cursor-pointer`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h4 className="text-xl font-bold">{plan.name}</h4>
          <span className="text-2xl">{getCategoryIcon(plan.category)}</span>
        </div>
        
        <p className="opacity-90 mb-4 line-clamp-2">{plan.description}</p>
        
        <div className="flex justify-between items-center text-sm opacity-90 mb-4">
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {plan.estimatedDuration} min
          </span>
          <span className="flex items-center">
            <Layers className="h-4 w-4 mr-1" />
            {plan.exercises.length} ushtrime
          </span>
          <span className="flex items-center">
            <Star className="h-4 w-4 mr-1" />
            {plan.category}
          </span>
        </div>
        
        <Link href={`/active-workout/${plan.id}`}>
          <Button className="w-full bg-white text-primary hover:bg-gray-100 font-semibold">
            <Play className="h-4 w-4 mr-2" />
            Fillo Tani
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
