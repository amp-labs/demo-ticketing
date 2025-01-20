import axios, { AxiosInstance } from 'axios';

const AMP_PROXY_BASE_URL = "https://proxy.withampersand.com";

export class AsanaTaskService {
    private axiosInstance: AxiosInstance;

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
        } catch (error: any) {
            console.log("Error creating task", error, error?.response?.data);
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