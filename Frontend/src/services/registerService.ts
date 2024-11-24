import axios from 'axios';

interface RegisterUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  zip: string;
  country: string;
  password: string;
  confirmPassword: string;
}

interface RegisterResponse {
  message: string; // Example: "Registration successful"
  firstName: string; // Include this if the API returns the user's first name
}

export const registerUser = async (user: RegisterUserDto): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>(
      'https://localhost:5001/api/user/register',
      user,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Ensures cookies or authentication credentials are sent
      }
    );

    console.log('Registration successful:', response.data);
    return response.data;

  } catch (error: any) {
    if (error.response) {
      // Handle specific HTTP errors
      if (error.response.status === 409) {
        console.error('Conflict Error:', error.response.data);
        throw new Error('User with this email already exists. Please log in or use a different email.');
      } else if (error.response.status === 400) {
        console.error('Bad Request:', error.response.data);
        throw new Error(error.response.data.message || 'Invalid registration data.');
      } else if (error.response.status === 500) {
        console.error('Internal Server Error:', error.response.data);
        throw new Error('An unexpected error occurred on the server.');
      }
    } else {
      console.error('Network error:', error.message);
      throw new Error('Network error. Please try again later.');
    }
    throw error;
  }
};
