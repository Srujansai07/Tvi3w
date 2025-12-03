import { z } from 'zod'

// User validation schemas
export const createUserSchema = z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
})

export const updateUserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email address').optional(),
    image: z.string().url('Invalid image URL').optional(),
})

// Meeting validation schemas
export const createMeetingSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date().optional(),
})

export const updateMeetingSchema = z.object({
    title: z.string().min(1, 'Title is required').optional(),
    description: z.string().optional(),
    status: z.enum(['scheduled', 'active', 'completed', 'cancelled']).optional(),
    transcript: z.string().optional(),
    summary: z.string().optional(),
    actionItems: z.array(z.string()).optional(),
    questions: z.array(z.string()).optional(),
})

// Analysis validation schemas
export const createAnalysisSchema = z.object({
    type: z.enum(['email', 'linkedin', 'twitter', 'content']),
    content: z.string().min(1, 'Content is required'),
})

// Login/Signup schemas
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
})

// Type exports
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type CreateMeetingInput = z.infer<typeof createMeetingSchema>
export type UpdateMeetingInput = z.infer<typeof updateMeetingSchema>
export type CreateAnalysisInput = z.infer<typeof createAnalysisSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
