import axios from "axios";

// Define the base URL for the API
const BASE_URL = "http://51.120.6.249:5000/api/Bid";

// DTO for placing a bid
interface BidDto {
  phoneNumber: string;
  auctionId: number;
  bidAmount: number;
}

// Model for a bid response
interface Bid {
  bidId: number;
  auctionId: number;
  userId: number;
  bidAmount: number;
  bidTime: string;
  sessionId?: string | null;
}

// Response structure for placing a bid
interface PlaceBidResponse {
  message: string;
  bidId: number;
}

/**
 * Place a bid for an auction.
 *
 * @param bidDto - The bid data.
 * @returns The response message and bid ID.
 */
export const placeBid = async (bidDto: BidDto): Promise<PlaceBidResponse> => {
  try {
    const response = await axios.post<PlaceBidResponse>(`${BASE_URL}/place`, bidDto, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Bid placed successfully:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error placing bid:", error.response.data);
      throw new Error(error.response.data.message || "Unknown error");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
};

/**
 * Get all bids for a specific auction.
 *
 * @param auctionId - The auction ID.
 * @returns A list of bids for the auction.
 */
export const getBidsForAuction = async (auctionId: number): Promise<Bid[]> => {
  try {
    const response = await axios.get<Bid[]>(`${BASE_URL}/auction/${auctionId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Bids fetched successfully for auction:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error fetching bids:", error.response.data);
      throw new Error(error.response.data.message || "Unknown error");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
};
