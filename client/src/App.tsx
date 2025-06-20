import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Dashboard from "@/pages/dashboard";
import WorkoutCreator from "@/pages/workout-creator";
import ExerciseLibrary from "@/pages/exercise-library";
import Statistics from "@/pages/statistics";
import WorkoutHistory from "@/pages/workout-history";
import ActiveWorkout from "@/pages/active-workout";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/workout-creator" component={WorkoutCreator} />
      <Route path="/exercise-library" component={ExerciseLibrary} />
      <Route path="/statistics" component={Statistics} />
      <Route path="/history" component={WorkoutHistory} />
      <Route path="/active-workout/:id" component={ActiveWorkout} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-neutral-light">
          <Navigation />
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
