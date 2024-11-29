import axios from "axios";

// Define the user DTO interface
interface RegisterUserDto {
  firstName: string;
  lastName: string;
  username?: string;
  email: string;
  phoneNumber?: string;
  addressLine?: string;
  city?: string;
  zip?: string;
  country: string;
}

// Base URL for the API
const BASE_URL = "http://51.120.6.249:5000/api/User";

/**
 * Add a new user.
 *
 * @param user - The user data to be added.
 * @returns A success message.
 */
export const addUser = async (user: RegisterUserDto): Promise<string> => {
  try {
    const response = await axios.post<{ message: string }>(`${BASE_URL}/add`, user, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("User added successfully:", response.data);
    return response.data.message;
  } catch (error: any) {
    if (error.response) {
      console.error("Error adding user:", error.response.data);
      throw new Error(error.response.data.message || "Unknown error");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
};

/**
 * Fetch user data by ID.
 *
 * @param userId - The ID of the user to fetch.
 * @returns The user data.
 */
export const getUser = async (userId: number): Promise<RegisterUserDto> => {
  try {
    const response = await axios.get<RegisterUserDto>(`${BASE_URL}/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("User fetched successfully:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error fetching user:", error.response.data);
      throw new Error(error.response.data.message || "Unknown error");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
};
/**
 * Fetch user data by phone number.
 *
 * @param phoneNumber - The phone number of the user to fetch.
 * @returns The user data.
 */
export const getUserByPhoneNumber = async (
  phoneNumber: string
): Promise<RegisterUserDto> => {
  try {
    const response = await axios.get<RegisterUserDto>(
      `http://51.120.6.249:5000/api/User/by-phone/${phoneNumber}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("User fetched successfully:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error fetching user:", error.response.data);
      throw new Error(error.response.data.message || "Unknown error");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
};
