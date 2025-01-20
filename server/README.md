## How to use the task creation API 


```sh

POST /api/create-tasks
Content-Type: application/json

{
    "tasks": [
        {
            "title": "Review Q1 metrics",
            "description": "Analyze marketing campaign performance",
            "dueDate": "2025-02-01T00:00:00Z",
            "projectId": "5555555555",
            "tags": ["marketing", "quarterly-review"]
        },
        {
            "title": "Update social media calendar",
            "description": "Incorporate feedback from meeting",
            "dueDate": "2025-02-03T00:00:00Z",
            "projectId": "5555555555",
            "tags": ["social-media"]
        }
    ],
    "workspaceId": "9876543210",
    "assigneeId": "1234567890",
    "meetingId": "123e4567-e89b-12d3-a456-426614174000"
}
```