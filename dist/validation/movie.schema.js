"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteUpdateSchema = exports.favoriteCreateSchema = void 0;
const zod_1 = require("zod");
// Schema for creating a new movie/show
exports.favoriteCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    type: zod_1.z.enum(["Movie", "TV Show"]),
    director: zod_1.z.string().min(1, "Director name is required"),
    budget: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    duration: zod_1.z.string().optional(),
    yearOrTime: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    posterUrl: zod_1.z.string().url("Must be a valid URL").optional(),
});
// Schema for updating an existing entry (partial = all fields optional)
exports.favoriteUpdateSchema = exports.favoriteCreateSchema.partial();
