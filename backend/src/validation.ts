import * as z from "zod"; 
import { Request, Response, NextFunction } from 'express';

export const projectSchema = z.strictObject({
    name: z.string().min(1),
    description: z.string().optional(),
})

export const taskSchema = z.object({
    title: z.string().min(1),
    status: z.enum(["todo", "in_progress", "done"]),
    priority: z.enum(["low", "medium", "high"]),
    description: z.string().optional(),
    dueDate: z.string().nullable().optional()
    
})

export type projectSchemaInput = z.infer<typeof projectSchema>;
export type taskSchemaInput = z.infer<typeof taskSchema>;


export function validateBody<T extends z.ZodTypeAny>(schema: T) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({error: 'Validation failed', details: error.issues})
            }

            next(error);
            }
        }
}