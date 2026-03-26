import { RequestHandler } from "express";
import z, { ZodError, ZodObject } from "zod"
import ValidationError from "../errors/ValidationError.js";

 const employeeCreateSchema = z.object(
    {
        id:z.string().optional(),
        fullName: z.string().min(5,"fullName must be at least 5 characters"),
        salary: z.number().min(5000, "Salary cannot be less than 5000")
        .max(50000, "Salary cannot be greater than 50000"),
        birthdate: z.iso.date(),
        avatar: z.url().optional(),
        department: z.string()
    }
).strict();
 const employeeUpdateSchema = employeeCreateSchema.omit({id: true, birthdate: true}).partial()
 function validate (schema: ZodObject): RequestHandler {
    return (req, _, next) => {
        try {
            req.body = schema.parse(req.body);
        } catch (error) {
            const zodError = error as ZodError
            throw new ValidationError(zodError.issues.map(issue => `${issue.path}: ${issue.message}`).join(";"))
        }
        next()
    }
 }
 export const validation_create = validate(employeeCreateSchema);
 export const validation_update = validate(employeeUpdateSchema);