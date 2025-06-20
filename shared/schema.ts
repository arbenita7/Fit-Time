import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // Krahë, Këmbë, Gjoks, Shpinë, Kardio
  difficulty: text("difficulty").notNull(), // Fillestare, Mesatare, Përparuar
  defaultSets: integer("default_sets").default(3),
  defaultReps: integer("default_reps").default(10),
  defaultDuration: integer("default_duration"), // in seconds
  isCustom: boolean("is_custom").default(false),
});

export const workoutPlans = pgTable("workout_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  estimatedDuration: integer("estimated_duration").notNull(), // in minutes
  exercises: json("exercises").$type<{ exerciseId: number; sets: number; reps: number; duration?: number; restTime?: number }[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workoutSessions = pgTable("workout_sessions", {
  id: serial("id").primaryKey(),
  workoutPlanId: integer("workout_plan_id").references(() => workoutPlans.id),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  duration: integer("duration"), // in seconds
  completed: boolean("completed").default(false),
  exercisesCompleted: json("exercises_completed").$type<{ exerciseId: number; setsCompleted: number; actualReps?: number[] }[]>().default([]),
  notes: text("notes"),
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
});

export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans).omit({
  id: true,
  createdAt: true,
});

export const insertWorkoutSessionSchema = createInsertSchema(workoutSessions).omit({
  id: true,
});

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type WorkoutPlan = typeof workoutPlans.$inferSelect;
export type InsertWorkoutPlan = z.infer<typeof insertWorkoutPlanSchema>;
export type WorkoutSession = typeof workoutSessions.$inferSelect;
export type InsertWorkoutSession = z.infer<typeof insertWorkoutSessionSchema>;
