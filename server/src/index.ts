import express from 'express';
import cors from 'cors';
import { AsanaTaskService } from './services/asana-service';
import { TaskController } from './routes/task-controller';

// Express app setup
const app = express();
const port = 4001;

// Middleware
app.use(cors());
app.use(express.json());

// Router setup
const router = express.Router();

// Asana service setup powered by Ampersand 
const asanaService = new AsanaTaskService(process.env.AMP_API_KEY!);
const taskController = new TaskController(asanaService);

router.post('/create-tasks', taskController.createBulkTasks.bind(taskController));

// Mount router
app.use('/api', router);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
