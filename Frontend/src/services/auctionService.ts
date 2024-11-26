import axios from "axios";

// Define the base URL for the API
const BASE_URL = "https://localhost:5001/api/Auction";

// DTO for starting an auction
interface AuctionDto {
  phoneNumber: string; // To validate user and session
  artworkId: number;   // Artwork to be auctioned
  startingBid: number; // Starting bid for the auction
  secretThreshold: number; // Minimum acceptable price
  durationHours: number; // Auction duration in hours
}

// Model for active auctions
interface ActiveAuction {
  auctionId: number;
  artworkId: number;
  startingBid: number;
  currentBid: number | null;
  minimumPrice: number;
  startTime: string;
  endTime: string;
  isClosed: boolean;
  createdAt: string;
  updatedAt: string;
  artwork: {
    artworkId: number;
    title: string;
    description: string;
    imageUrl: string; // Assuming Artwork has an image
    userId: number;
  };
}

// Response structure for starting an auction
interface StartAuctionResponse {
  auctionId: number;
  message: string;
}

/**
 * Start an auction for a specific artwork.
 *
 * @param auctionDto - The auction data.
 * @returns The response with auction ID and success message.
 */
export const startAuction = async (auctionDto: AuctionDto): Promise<StartAuctionResponse> => {
  try {
    const response = await axios.post<StartAuctionResponse>(`${BASE_URL}/start`, auctionDto, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Auction started successfully:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error starting auction:", error.response.data);
      throw new Error(error.response.data.message || "Unknown error");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
};

/**
 * Get all active auctions.
 *
 * @returns A list of active auctions.
 */
export const getActiveAuctions = async (): Promise<ActiveAuction[]> => {
  try {
    const response = await axios.get<ActiveAuction[]>(`${BASE_URL}/active`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Active auctions fetched successfully:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error fetching active auctions:", error.response.data);
      throw new Error(error.response.data.message || "Unknown error");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
};
