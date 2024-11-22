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



export const registerUser = async (user: RegisterUserDto): Promise<RegisterResponse>  => {
  try {
    const response = await axios.post<RegisterResponse>(
      'http://localhost:5000/api/user/register',
      user,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Registration successful:', response.data);
    return response.data;

  } catch (error: any) {
    if (error.response) {
      console.error('Error registering user:', error.response.data);
    } else {
      console.error('Error registering user:', error.message);
    }
    throw error;
  }
};