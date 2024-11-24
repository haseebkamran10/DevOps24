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

export const getUserData = async (userId: number, token: string): Promise<UserDto> => {
  try {
    const response = await axios.get<UserDto>(`https://localhost:5001/api/User/getUser`, {
      params: { userId },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('User data retrieved successfully:', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error('Error fetching user data:', error.response.data);
    } else {
      console.error('Error fetching user data:', error.message);
    }
    throw error;
  }
};
