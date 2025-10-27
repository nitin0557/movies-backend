import { z } from "zod";

// Schema for creating a new movie/show
export const favoriteCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["Movie", "TV Show"]),
  director: z.string().min(1, "Director name is required"),
  budget: z.string().optional(),
  location: z.string().optional(),
  duration: z.string().optional(),
  yearOrTime: z.string().optional(),
  notes: z.string().optional(),
  posterUrl: z.string().url("Must be a valid URL").optional(),
});

// Schema for updating an existing entry (partial = all fields optional)
export const favoriteUpdateSchema = favoriteCreateSchema.partial();

// Type inference for TypeScript
export type FavoriteCreate = z.infer<typeof favoriteCreateSchema>;
export type FavoriteUpdate = z.infer<typeof favoriteUpdateSchema>;
