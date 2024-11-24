import axios from 'axios';

interface LoginUserDto {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  name: string; // Add the user's name
}

export const loginUser = async (credentials: LoginUserDto): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      'https://localhost:5001/api/User/login',
      credentials,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    

    console.log('Login successful:', response.data);
    return response.data; // TypeScript now knows the structure of response.data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      console.error('Error logging in user:', error.response.data);
    } else {
      console.error('Error logging in user:', error.message);
    }
    throw error;
  }
};
