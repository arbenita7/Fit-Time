import { 
  exercises, 
  workoutPlans, 
  workoutSessions,
  type Exercise, 
  type InsertExercise,
  type WorkoutPlan,
  type InsertWorkoutPlan,
  type WorkoutSession,
  type InsertWorkoutSession
} from "@shared/schema";

export interface IStorage {
  // Exercises
  getExercises(): Promise<Exercise[]>;
  getExercisesByCategory(category: string): Promise<Exercise[]>;
  getExercise(id: number): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  updateExercise(id: number, exercise: Partial<InsertExercise>): Promise<Exercise | undefined>;
  deleteExercise(id: number): Promise<boolean>;

  // Workout Plans
  getWorkoutPlans(): Promise<WorkoutPlan[]>;
  getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined>;
  createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan>;
  updateWorkoutPlan(id: number, plan: Partial<InsertWorkoutPlan>): Promise<WorkoutPlan | undefined>;
  deleteWorkoutPlan(id: number): Promise<boolean>;

  // Workout Sessions
  getWorkoutSessions(): Promise<WorkoutSession[]>;
  getWorkoutSession(id: number): Promise<WorkoutSession | undefined>;
  createWorkoutSession(session: InsertWorkoutSession): Promise<WorkoutSession>;
  updateWorkoutSession(id: number, session: Partial<InsertWorkoutSession>): Promise<WorkoutSession | undefined>;
  deleteWorkoutSession(id: number): Promise<boolean>;
  getRecentWorkoutSessions(limit?: number): Promise<WorkoutSession[]>;
  getWeeklyStats(): Promise<{
    totalWorkouts: number;
    totalTime: number;
    averageWorkoutTime: number;
    workoutsByDay: { day: string; duration: number }[];
  }>;
}

export class MemStorage implements IStorage {
  private exercises: Map<number, Exercise>;
  private workoutPlans: Map<number, WorkoutPlan>;
  private workoutSessions: Map<number, WorkoutSession>;
  private currentExerciseId: number;
  private currentWorkoutPlanId: number;
  private currentWorkoutSessionId: number;

  constructor() {
    this.exercises = new Map();
    this.workoutPlans = new Map();
    this.workoutSessions = new Map();
    this.currentExerciseId = 1;
    this.currentWorkoutPlanId = 1;
    this.currentWorkoutSessionId = 1;
    
    // Initialize with some default exercises
    this.initializeDefaultExercises();
  }

  private initializeDefaultExercises() {
    const defaultExercises: Omit<Exercise, 'id'>[] = [
      { name: "Push-ups", description: "Ushtrim klasik për zhvillimin e forcës së gjoksit dhe krahëve", category: "Krahë", difficulty: "Fillestare", defaultSets: 3, defaultReps: 12, defaultDuration: null, isCustom: false },
      { name: "Squats", description: "Ushtrim bazë për forcimin e këmbëve dhe gluteave", category: "Këmbë", difficulty: "Fillestare", defaultSets: 3, defaultReps: 15, defaultDuration: null, isCustom: false },
      { name: "Deadlifts", description: "Ushtrim kompleks për shpinën dhe këmbët", category: "Shpinë", difficulty: "Përparuar", defaultSets: 4, defaultReps: 8, defaultDuration: null, isCustom: false },
      { name: "Bench Press", description: "Ushtrim me peshë për gjoksin", category: "Gjoks", difficulty: "Mesatare", defaultSets: 4, defaultReps: 10, defaultDuration: null, isCustom: false },
      { name: "Running", description: "Vrapim për kardio", category: "Kardio", difficulty: "Fillestare", defaultSets: 1, defaultReps: 1, defaultDuration: 1800, isCustom: false },
      { name: "Burpees", description: "Ushtrim i plotë për të gjithë trupin", category: "Kardio", difficulty: "Mesatare", defaultSets: 3, defaultReps: 10, defaultDuration: null, isCustom: false },
      { name: "Pull-ups", description: "Ushtrim për shpinën dhe bicepset", category: "Krahë", difficulty: "Mesatare", defaultSets: 3, defaultReps: 8, defaultDuration: null, isCustom: false },
      { name: "Planks", description: "Ushtrim statik për muskujt e barkut", category: "Bark", difficulty: "Fillestare", defaultSets: 3, defaultReps: 1, defaultDuration: 60, isCustom: false },
    ];

    defaultExercises.forEach(exercise => {
      const id = this.currentExerciseId++;
      this.exercises.set(id, { ...exercise, id });
    });

    // Initialize sample workout plans
    this.initializeDefaultWorkoutPlans();
  }

  private initializeDefaultWorkoutPlans() {
    const defaultPlans: Omit<WorkoutPlan, 'id' | 'createdAt'>[] = [
      {
        name: "Upper Body Blast",
        description: "Fokus në krahë, shpinë dhe gjoks për forcë maksimale",
        category: "Krahë",
        estimatedDuration: 45,
        exercises: [
          { exerciseId: 1, sets: 3, reps: 12, restTime: 60 },
          { exerciseId: 4, sets: 4, reps: 10, restTime: 90 },
          { exerciseId: 7, sets: 3, reps: 8, restTime: 90 },
        ]
      },
      {
        name: "Leg Day Power",
        description: "Stërvitje intensive për këmbë dhe glutea",
        category: "Këmbë",
        estimatedDuration: 50,
        exercises: [
          { exerciseId: 2, sets: 4, reps: 15, restTime: 90 },
          { exerciseId: 3, sets: 4, reps: 8, restTime: 120 },
        ]
      },
      {
        name: "Cardio HIIT",
        description: "Stërvitje kardiovaskulare me intensitet të lartë",
        category: "Kardio",
        estimatedDuration: 30,
        exercises: [
          { exerciseId: 6, sets: 3, reps: 10, restTime: 60 },
          { exerciseId: 5, sets: 1, reps: 1, duration: 1200, restTime: 0 },
        ]
      }
    ];

    defaultPlans.forEach(plan => {
      const id = this.currentWorkoutPlanId++;
      this.workoutPlans.set(id, { ...plan, id, createdAt: new Date() });
    });
  }

  // Exercise methods
  async getExercises(): Promise<Exercise[]> {
    return Array.from(this.exercises.values());
  }

  async getExercisesByCategory(category: string): Promise<Exercise[]> {
    return Array.from(this.exercises.values()).filter(ex => ex.category === category);
  }

  async getExercise(id: number): Promise<Exercise | undefined> {
    return this.exercises.get(id);
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const id = this.currentExerciseId++;
    const newExercise: Exercise = { ...exercise, id };
    this.exercises.set(id, newExercise);
    return newExercise;
  }

  async updateExercise(id: number, exercise: Partial<InsertExercise>): Promise<Exercise | undefined> {
    const existing = this.exercises.get(id);
    if (!existing) return undefined;
    
    const updated: Exercise = { ...existing, ...exercise };
    this.exercises.set(id, updated);
    return updated;
  }

  async deleteExercise(id: number): Promise<boolean> {
    return this.exercises.delete(id);
  }

  // Workout Plan methods
  async getWorkoutPlans(): Promise<WorkoutPlan[]> {
    return Array.from(this.workoutPlans.values());
  }

  async getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined> {
    return this.workoutPlans.get(id);
  }

  async createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan> {
    const id = this.currentWorkoutPlanId++;
    const newPlan: WorkoutPlan = { ...plan, id, createdAt: new Date() };
    this.workoutPlans.set(id, newPlan);
    return newPlan;
  }

  async updateWorkoutPlan(id: number, plan: Partial<InsertWorkoutPlan>): Promise<WorkoutPlan | undefined> {
    const existing = this.workoutPlans.get(id);
    if (!existing) return undefined;
    
    const updated: WorkoutPlan = { ...existing, ...plan };
    this.workoutPlans.set(id, updated);
    return updated;
  }

  async deleteWorkoutPlan(id: number): Promise<boolean> {
    return this.workoutPlans.delete(id);
  }

  // Workout Session methods
  async getWorkoutSessions(): Promise<WorkoutSession[]> {
    return Array.from(this.workoutSessions.values());
  }

  async getWorkoutSession(id: number): Promise<WorkoutSession | undefined> {
    return this.workoutSessions.get(id);
  }

  async createWorkoutSession(session: InsertWorkoutSession): Promise<WorkoutSession> {
    const id = this.currentWorkoutSessionId++;
    const newSession: WorkoutSession = { ...session, id };
    this.workoutSessions.set(id, newSession);
    return newSession;
  }

  async updateWorkoutSession(id: number, session: Partial<InsertWorkoutSession>): Promise<WorkoutSession | undefined> {
    const existing = this.workoutSessions.get(id);
    if (!existing) return undefined;
    
    const updated: WorkoutSession = { ...existing, ...session };
    this.workoutSessions.set(id, updated);
    return updated;
  }

  async deleteWorkoutSession(id: number): Promise<boolean> {
    return this.workoutSessions.delete(id);
  }

  async getRecentWorkoutSessions(limit: number = 10): Promise<WorkoutSession[]> {
    const sessions = Array.from(this.workoutSessions.values())
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .slice(0, limit);
    return sessions;
  }

  async getWeeklyStats(): Promise<{
    totalWorkouts: number;
    totalTime: number;
    averageWorkoutTime: number;
    workoutsByDay: { day: string; duration: number }[];
  }> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyWorkouts = Array.from(this.workoutSessions.values())
      .filter(session => new Date(session.startTime) >= oneWeekAgo && session.completed);
    
    const totalWorkouts = weeklyWorkouts.length;
    const totalTime = weeklyWorkouts.reduce((sum, session) => sum + (session.duration || 0), 0);
    const averageWorkoutTime = totalWorkouts > 0 ? totalTime / totalWorkouts : 0;
    
    const dayNames = ['Diel', 'Hënë', 'Martë', 'Mërkurë', 'Enjte', 'Premte', 'Shtunë'];
    const workoutsByDay = Array.from({ length: 7 }, (_, i) => {
      const day = new Date();
      day.setDate(day.getDate() - (6 - i));
      const dayWorkouts = weeklyWorkouts.filter(session => {
        const sessionDate = new Date(session.startTime);
        return sessionDate.toDateString() === day.toDateString();
      });
      return {
        day: dayNames[day.getDay()],
        duration: dayWorkouts.reduce((sum, session) => sum + (session.duration || 0), 0)
      };
    });

    return {
      totalWorkouts,
      totalTime,
      averageWorkoutTime,
      workoutsByDay
    };
  }
}

export const storage = new MemStorage();
