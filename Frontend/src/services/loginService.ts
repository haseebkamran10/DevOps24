import axios from "axios";

interface LoginUserDto {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  name: string;
  userId: number; // Ensure userId is part of the response
}

export const loginUser = async (credentials: LoginUserDto): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(
      "https://localhost:5001/api/User/login",
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Login successful:", response.data);
    return response.data; // userId must be part of this object
  } catch (error: any) {
    if (error.response) {
      console.error("Error logging in user:", error.response.data);
    } else {
      console.error("Error logging in user:", error.message);
    }
    throw error;
  }
};
