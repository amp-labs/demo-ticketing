import { z } from 'zod';

const MAX_BATCH_SIZE = 50;

// Individual task validation schema
export const TaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    projectId: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

// Bulk task creation request schema
export const BulkTaskRequestSchema = z.object({
    tasks: z.array(TaskSchema).min(1).max(MAX_BATCH_SIZE),
    workspaceId: z.string(),
    assigneeId: z.string(),
    meetingId: z.string().uuid()
});

export type BulkTaskRequest = z.infer<typeof BulkTaskRequestSchema>;
export type TaskRequest = z.infer<typeof TaskSchema>; 