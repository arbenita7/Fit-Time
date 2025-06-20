import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertExerciseSchema, insertWorkoutPlanSchema, insertWorkoutSessionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Exercise routes
  app.get("/api/exercises", async (req, res) => {
    try {
      const { category } = req.query;
      if (category && typeof category === 'string') {
        const exercises = await storage.getExercisesByCategory(category);
        res.json(exercises);
      } else {
        const exercises = await storage.getExercises();
        res.json(exercises);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  app.get("/api/exercises/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const exercise = await storage.getExercise(id);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercise" });
    }
  });

  app.post("/api/exercises", async (req, res) => {
    try {
      const exerciseData = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(exerciseData);
      res.status(201).json(exercise);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid exercise data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create exercise" });
    }
  });

  app.put("/api/exercises/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const exerciseData = insertExerciseSchema.partial().parse(req.body);
      const exercise = await storage.updateExercise(id, exerciseData);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.json(exercise);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid exercise data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update exercise" });
    }
  });

  app.delete("/api/exercises/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteExercise(id);
      if (!deleted) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete exercise" });
    }
  });

  // Workout Plan routes
  app.get("/api/workout-plans", async (req, res) => {
    try {
      const plans = await storage.getWorkoutPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workout plans" });
    }
  });

  app.get("/api/workout-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const plan = await storage.getWorkoutPlan(id);
      if (!plan) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workout plan" });
    }
  });

  app.post("/api/workout-plans", async (req, res) => {
    try {
      const planData = insertWorkoutPlanSchema.parse(req.body);
      const plan = await storage.createWorkoutPlan(planData);
      res.status(201).json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workout plan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create workout plan" });
    }
  });

  app.put("/api/workout-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const planData = insertWorkoutPlanSchema.partial().parse(req.body);
      const plan = await storage.updateWorkoutPlan(id, planData);
      if (!plan) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      res.json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workout plan data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update workout plan" });
    }
  });

  app.delete("/api/workout-plans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteWorkoutPlan(id);
      if (!deleted) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete workout plan" });
    }
  });

  // Workout Session routes
  app.get("/api/workout-sessions", async (req, res) => {
    try {
      const { recent } = req.query;
      if (recent) {
        const limit = parseInt(recent as string) || 10;
        const sessions = await storage.getRecentWorkoutSessions(limit);
        res.json(sessions);
      } else {
        const sessions = await storage.getWorkoutSessions();
        res.json(sessions);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workout sessions" });
    }
  });

  app.get("/api/workout-sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const session = await storage.getWorkoutSession(id);
      if (!session) {
        return res.status(404).json({ message: "Workout session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workout session" });
    }
  });

  app.post("/api/workout-sessions", async (req, res) => {
    try {
      const sessionData = insertWorkoutSessionSchema.parse(req.body);
      const session = await storage.createWorkoutSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workout session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create workout session" });
    }
  });

  app.put("/api/workout-sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const sessionData = insertWorkoutSessionSchema.partial().parse(req.body);
      const session = await storage.updateWorkoutSession(id, sessionData);
      if (!session) {
        return res.status(404).json({ message: "Workout session not found" });
      }
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workout session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update workout session" });
    }
  });

  app.delete("/api/workout-sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteWorkoutSession(id);
      if (!deleted) {
        return res.status(404).json({ message: "Workout session not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete workout session" });
    }
  });

  // Statistics routes
  app.get("/api/statistics/weekly", async (req, res) => {
    try {
      const stats = await storage.getWeeklyStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weekly statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
