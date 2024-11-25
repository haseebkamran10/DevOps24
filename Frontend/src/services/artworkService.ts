import axios from "axios";

export interface ArtworkDto {
  artwork_id: number;
  title: string;
  description: string;
  artist: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  user_id: number | null;
}

// Base URL for the API
const BASE_URL = "https://localhost:5001/api/Artwork";

/**
 * Fetch all artworks from the backend.
 */
export const getAllArtworks = async (): Promise<ArtworkDto[]> => {
  try {
    const response = await axios.get<ArtworkDto[]>(BASE_URL, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Artworks fetched successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching artworks:", error.response || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch artworks");
  }
};

/**
 * Fetch a single artwork by ID from the backend.
 */
export const getArtworkById = async (artworkId: number): Promise<ArtworkDto> => {
  try {
    const response = await axios.get<ArtworkDto>(`${BASE_URL}/${artworkId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Artwork retrieved successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching artwork:", error.response || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch artwork");
  }
};
