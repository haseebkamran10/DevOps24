import axios from "axios";

// Define the base URL for the API
const BASE_URL = "http://51.120.6.249:5000/api/Artwork";

// DTO for creating an artwork
interface CreateArtworkDto {
  phoneNumber: string;
  title: string;
  description: string;
  artist: string;
  imageFile: File; // File upload for the artwork image
}

// Model for artwork data
interface Artwork {
  artworkId: number;
  title: string;
  description: string;
  artist: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user?: {
    userId: number;
    firstName: string;
    lastName: string;
  };
}

/**
 * Create a new artwork.
 *
 * @param artworkDto - The artwork data to be created.
 * @returns The response containing the artwork ID and success message.
 */
export const createArtwork = async (artworkDto: CreateArtworkDto): Promise<{ artworkId: number; message: string; imageUrl: string }> => {
  try {
    const formData = new FormData();
    formData.append("phoneNumber", artworkDto.phoneNumber);
    formData.append("title", artworkDto.title);
    formData.append("description", artworkDto.description);
    formData.append("artist", artworkDto.artist);
    formData.append("imageFile", artworkDto.imageFile);

    const response = await axios.post<{ artworkId: number; message: string; imageUrl: string }>(`${BASE_URL}/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Artwork created successfully:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error creating artwork:", error.response.data);
      throw new Error(error.response.data.message || "Unknown error");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
};

/**
 * Get all artworks.
 *
 * @returns A list of all artworks.
 */
export const getAllArtworks = async (): Promise<Artwork[]> => {
  try {
    const response = await axios.get<Artwork[]>(`${BASE_URL}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("All artworks fetched successfully:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error fetching all artworks:", error.response.data);
      throw new Error(error.response.data.message || "Unknown error");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
};

/**
 * Get a specific artwork by ID.
 *
 * @param id - The ID of the artwork to fetch.
 * @returns The details of the specified artwork.
 */
export const getArtworkById = async (id: number): Promise<Artwork> => {
  try {
    const response = await axios.get<Artwork>(`${BASE_URL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Artwork fetched successfully by ID:", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error fetching artwork by ID:", error.response.data);
      throw new Error(error.response.data.message || "Unknown error");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
};
