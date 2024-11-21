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
}

export const registerUser = async (user: RegisterUserDto) => {
  try {
    const response = await axios.post('http://localhost:5000/api/user/register', user, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Registration successful:', response.data);
    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.response) {
      console.error('Error registering user:', error.response.data);
    } else {
      console.error('Error registering user:', error.message);
    }
    throw error;
  }
};