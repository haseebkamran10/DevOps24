import axios from "axios";


const BASE_URL = "http://51.120.6.249:5001/api/Auction";


interface AuctionDto {
  phoneNumber: string; 
  artworkId: number; 
  startingBid: number; 
  secretThreshold: number; 
  durationHours: number; 
}


interface EndAuctionDto {
  auctionId: number; 
}

export interface ActiveAuction {
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
    imageUrl: string;
    artist: string; 
    userId: number;
  };
}


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

/**
 * End an auction by auction ID.
 *
 * @param endAuctionDto - The auction ID to be closed.
 * @returns The response message indicating the result of the auction closure.
 */
export const endAuction = async (endAuctionDto: EndAuctionDto): Promise<{ message: string }> => {
  try {
    const response = await axios.post<{ message: string }>(`${BASE_URL}/end`, endAuctionDto, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Auction ended successfully:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error ending auction:", error.response.data);
      throw new Error(error.response.data.message || "Unknown error");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
};
