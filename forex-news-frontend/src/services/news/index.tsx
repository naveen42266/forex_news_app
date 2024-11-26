import axios from 'axios';

// Set up base URL and Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api/news', // replace with your backend API URL
  // baseURL: 'http://localhost:8080/api/todo/', // replace with your backend API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add token for authorization
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('authToken'); // or sessionStorage.getItem('authToken')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Get all notes for the authenticated user
export const getAllNews = async () => {
  try {
    const response = await api.get('/getAll');
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

// Add a new note
export const addTask = async (taskData: any) => {
  try {
    const response = await api.post('/addTask', {
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      priority: taskData.priority,
      deadline: taskData.deadline,
      createdAt: taskData.createdAt,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

// Update a note by ID
export const updateTask = async (taskId: string, updatedTask: any) => {
  try {
    const response = await api.put('/updateTask', {
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      deadline: updatedTask.deadline,
      updatedAt: updatedTask.updatedAt,  // Send only the updated fields
    }, {
      params: { id: taskId }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};


// Update a note by ID
export const updateStatus = async (taskId: string, status: any) => {
  try {
    const response = await api.put('/updateStatus', {
      status: status,
    }, {
      params: { id: taskId }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};



// Delete a note by ID
export const deleteTask = async (taskId: any) => {
  try {
    const response = await api.delete('/deleteTask', {
      params: { id: taskId }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};