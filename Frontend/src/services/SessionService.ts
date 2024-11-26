import axios from "axios";

// Define DTO for starting a session
interface StartSessionDto {
  phoneNumber: string;
}

// Define the base URL for the API
const BASE_URL = "https://localhost:5001/api/Session";

/**
 * Start a new session.
 *
 * @param sessionDto - The data required to start a session.
 * @returns The session ID.
 */
export const startSession = async (sessionDto: StartSessionDto): Promise<string> => {
  try {
    const response = await axios.post<{ sessionId: string }>(`${BASE_URL}/start`, sessionDto, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Session started successfully:", response.data);
    return response.data.sessionId;
  } catch (error: any) {
    if (error.response) {
      console.error("Error starting session:", error.response.data);
      throw new Error(error.response.data.message || "Unknown error");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
};

/**
 * End an existing session.
 *
 * @param sessionId - The session ID to end.
 * @returns A success message.
 */
export const endSession = async (sessionId: string): Promise<string> => {
  try {
    const response = await axios.post<{ message: string }>(`${BASE_URL}/end`, null, {
      headers: {
        "Content-Type": "application/json",
      },
      params: { sessionId },
    });
    console.log("Session ended successfully:", response.data);
    return response.data.message; // Explicitly return the message
  } catch (error: any) {
    if (error.response) {
      console.error("Error ending session:", error.response.data);
      throw new Error(error.response.data.message || "Unknown error");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
};
