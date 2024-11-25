import axios from 'axios';

interface UserDto {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber?: string;
  addressLine?: string;
  city?: string;
  zip?: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

// Base URL for the API
const BASE_URL ="https://localhost:5001/api/User";

/**
 * Fetch user data from the backend.
 * 
 * @param userId - The user ID to fetch data for.
 * @param token - Bearer token for authentication.
 * @returns The user data in UserDto format.
 */
export const getUserData = async (userId: string, token: string): Promise<UserDto> => {
  try {
    console.log(`Fetching user data for userId: ${userId}`);

    const response = await axios.get<UserDto>(`${BASE_URL}/getUser`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: { userId },
    });

    console.log('User data retrieved successfully:', response.data);
    return response.data;
  } catch (error: any) {
    // Log specific response or request errors
    if (error.response) {
      console.error(
        `Error fetching user data: HTTP ${error.response.status}`,
        error.response.data
      );
      throw new Error(`Failed to fetch user data: ${error.response.data.message || "Unknown error"}`);
    } else if (error.request) {
      console.error('No response received from server:', error.request);
      throw new Error('No response received from the server. Please check your network connection.');
    } else {
      console.error('Unexpected error occurred:', error.message);
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};
