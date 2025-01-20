import express from 'express';
import axios from 'axios';
import { z } from 'zod';
import cors from 'cors';

// Configuration and constants
const MAX_BATCH_SIZE = 50;
const RATE_LIMIT_DELAY = 100; // ms between requests

// Asana API configuration
const AMP_PROXY_BASE_URL = "https://proxy.withampersand.com";

// Individual task validation schema
const TaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    dueDate: z.string().datetime().optional(),
    projectId: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

// Bulk task creation request schema
const BulkTaskRequestSchema = z.object({
    tasks: z.array(TaskSchema).min(1).max(MAX_BATCH_SIZE),
    workspaceId: z.string(),
    assigneeId: z.string(),
    meetingId: z.string().uuid()
});

type BulkTaskRequest = z.infer<typeof BulkTaskRequestSchema>;
type TaskRequest = z.infer<typeof TaskSchema>;

export class AsanaTaskService {
    private axiosInstance;

    constructor(private accessToken: string) {
        this.axiosInstance = axios.create({
            baseURL: AMP_PROXY_BASE_URL,
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "x-api-key": `${accessToken}`,
                "x-amp-proxy-version": 1,
                "x-amp-project-id": `${process.env.AMP_PROJECT_ID}`,
                "x-amp-installation-id": `${process.env.AMP_INSTALLATION_ID}`,
            }
        });
    }

    async createTask(taskData: any) {
        try {
            const response = await this.axiosInstance.post('/1.0/tasks', {
                data: taskData
            });
            return response.data.data;
        } catch (error :any) {
          console.log("Error creating task", error, error?.response?.data)
            throw this.handleAsanaError(error);
        }
    }

    private handleAsanaError(error: any) {
        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                case 401:
                    throw new Error('Invalid Asana access token');
                case 403:
                    throw new Error('Insufficient permissions in Asana');
                case 429:
                    throw new Error('Rate limit exceeded');
                default:
                    throw new Error(data.errors?.[0]?.message || 'Asana API error');
            }
        }
        throw error;
    }
}

export class TaskController {
    constructor(private asanaService: AsanaTaskService) {}

    async createBulkTasks(req: express.Request, res: express.Response) {
        try {
            // Validate request body
            const bulkRequest = BulkTaskRequestSchema.parse(req.body);
            
            // Process tasks in parallel with rate limiting
            const results = await this.processBulkTasks(bulkRequest);

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
                // Format task according to Asana API specs
                const asanaTask = {
                    name: task.title,
                    notes: this.formatDescription(task, bulkRequest.meetingId),
                    workspace: bulkRequest.workspaceId,
                    assignee: bulkRequest.assigneeId,
                    due_on: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : undefined,
                    projects: task.projectId ? [task.projectId] : [],
                    tags: task.tags || []
                };

                // Create task in Asana
                const createdTask = await this.asanaService.createTask(asanaTask);

                results.push({
                    success: true,
                    taskId: createdTask.gid,
                    title: task.title,
                    asanaUrl: createdTask.permalink_url
                });

                // Add delay between requests
                await delay(RATE_LIMIT_DELAY);

            } catch (error:any) {
                results.push({
                    success: false,
                    title: task.title,
                    error: error.message
                });

                // Handle rate limiting
                if (error.message === 'Rate limit exceeded') {
                    await delay(1000); // Longer delay for rate limits
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

// Express app setup
const app = express();
const port = 4001;

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json());

// Router setup
const router = express.Router();

const asanaService = new AsanaTaskService(process.env.AMP_API_KEY!);
const taskController = new TaskController(asanaService);

router.post('/create-tasks', taskController.createBulkTasks.bind(taskController));

// Mount router
app.use('/api', router);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
