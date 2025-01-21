import { Request, Response } from 'express';
import { z } from 'zod';
import { AsanaTaskService } from '../services/asana-service';
import { BulkTaskRequestSchema, BulkTaskRequest, TaskRequest } from '../schemas/task-schemas';

const RATE_LIMIT_DELAY = 100; // ms between requests

export class TaskController {
    constructor(private asanaService: AsanaTaskService) {}

    async createBulkTasks(req: Request, res: Response) {
        try {
            // Validate request body
            const bulkRequest = BulkTaskRequestSchema.parse(req.body);
            
            // Process tasks in parallel with rate limiting
            const results = await this.processBulkTasks(bulkRequest);

            console.log("Successfully created tasks", results);
            // Return response with results
            res.status(201).json({
                success: true,
                results: results,
                summary: {
                    total: results.length,
                    successful: results.filter(r => r.success).length,
                    failed: results.filter(r => !r.success).length
                }
            });

        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    success: false,
                    error: 'Invalid request body',
                    details: error.errors
                });
                return;
            }

            console.error('Error creating tasks:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    private async processBulkTasks(bulkRequest: BulkTaskRequest) {
        const results = [];
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        for (const task of bulkRequest.tasks) {
            try {
                const asanaTask = {
                    name: task.title,
                    notes: this.formatDescription(task, bulkRequest.meetingId),
                    workspace: bulkRequest.workspaceId,
                    assignee: bulkRequest.assigneeId,
                    due_on: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : undefined,
                    projects: task.projectId ? [task.projectId] : [],
                    tags: task.tags || []
                };

                const createdTask = await this.asanaService.createTask(asanaTask);

                results.push({
                    success: true,
                    taskId: createdTask.gid,
                    title: task.title,
                    asanaUrl: createdTask.permalink_url
                });

                await delay(RATE_LIMIT_DELAY);

            } catch (error: any) {
                results.push({
                    success: false,
                    title: task.title,
                    error: error.message
                });

                if (error.message === 'Rate limit exceeded') {
                    await delay(1000);
                }
            }
        }

        return results;
    }

    private formatDescription(task: TaskRequest, meetingId: string): string {
        return `
${task.description || ''}

---
Created from Meeting: ${meetingId}
Created via Meeting Recorder
        `.trim();
    }
} 