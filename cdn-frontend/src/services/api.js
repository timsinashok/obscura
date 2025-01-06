import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

export const websiteService = {
    getWebsites: async () => {
        const response = await api.get('/websites');
        return response.data;
    },
    
    addWebsite: async (domain) => {
        const response = await api.post('/websites', { domain });
        return response.data;
    },
    
    removeWebsite: async (id) => {
        const response = await api.delete(`/websites/${id}`);
        return response.data;
    }
};

export const fileService = {
    uploadFile: async (file, websiteId) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('websiteId', websiteId);
        
        const response = await api.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                // You can use this for progress indication
                console.log('Upload progress:', percentCompleted);
            }
        });
        return response.data;
    },
    
    listFiles: async (websiteId = null) => {
        const params = websiteId ? { websiteId } : {};
        const response = await api.get('/files/list', { params });
        return response.data;
    },
    
    deleteFile: async (id) => {
        const response = await api.delete(`/files/${id}`);
        return response.data;
    }
}; 