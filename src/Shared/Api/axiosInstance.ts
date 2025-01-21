import axios, { AxiosInstance } from 'axios';
import axiosErrorResponseHandler from '../Api/axiosErrorResponseHandler';

axios.defaults.withCredentials = true;

const createAxiosInstance = (): AxiosInstance => {
  // Read the base URL from the environment variables
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);

  if (!baseURL) {
    throw new Error("REACT_APP_BACKEND_URL is not defined in the environment variables!");
  }

  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add a response interceptor
  instance.interceptors.response.use(
    (response) => response, // Pass through successful responses
    (error) => {
      handleAxiosError(error); // Handle errors
      return Promise.reject(error); // Reject the error so it can be handled by callers
    }
  );

  return instance;
};

// Function to handle Axios errors
const handleAxiosError = (error: unknown): void => {
  if (axios.isAxiosError(error)) {
    // Extract status code if available
    const statusCode = error.response?.status ?? 0;
    // Use the custom error handler
    axiosErrorResponseHandler(error, statusCode);
  } else {
    // Log unexpected non-Axios errors
    console.error('An unexpected error occurred:', error);
  }
};

// Create and export the Axios instance
const axiosInstance = createAxiosInstance();
export default axiosInstance;