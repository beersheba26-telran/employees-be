import z from "zod"
export const employeeCreateSchema = z.object(
    {
        id:z.string().optional(),
        fullName: z.string().min(5,"fullName must be at least 5 characters"),
        salary: z.number().min(5000, "Salary cannot be less than 5000")
        .max(50000, "Salary cannot be greater than 50000"),
        birthdate: z.iso.date(),
        avatar: z.url().optional()
    }
).strict();
export const employeeUpdateSchema = employeeCreateSchema.omit({id: true, birthdate: true}).partial()