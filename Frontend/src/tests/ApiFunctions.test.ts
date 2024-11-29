/*
import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios"

// Mock Axios
vi.mock("axios");
const mockedAxios = axios as vi.Mocked<typeof axios>;


// Import API functions
import {
  createArtwork,
  getAllArtworks,
  getArtworkById,
  startAuction,
  getActiveAuctions,
  endAuction,
  placeBid,
  getBidsForAuction,
  startSession,
  endSession,
  addUser,
  getUser,
  getUserByPhoneNumber,
} from "@/services";

describe("API Functions", () => {
  beforeEach(() => {
    vi.resetAllMocks(); // Reset mocks before each test
  });

  // --- Artwork APIs ---
  describe("Artwork APIs", () => {
    it("should create artwork successfully", async () => {
      const mockResponse = {
        data: { artworkId: 1, message: "Artwork created", imageUrl: "/image.jpg" },
      };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const artworkDto = {
        phoneNumber: "123456789",
        title: "Art Title",
        description: "Art Description",
        artist: "Artist Name",
        imageFile: new File(["content"], "image.jpg"),
      };
      const response = await createArtwork(artworkDto);

      expect(response).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://localhost:5001/api/Artwork/create",
        expect.any(FormData),
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    });

    it("should fetch all artworks", async () => {
      const mockResponse = { data: [{ artworkId: 1, title: "Art 1" }] };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const artworks = await getAllArtworks();

      expect(artworks).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://localhost:5001/api/Artwork",
        { headers: { "Content-Type": "application/json" } }
      );
    });

    it("should fetch artwork by ID", async () => {
      const mockResponse = { data: { artworkId: 1, title: "Art 1" } };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const artwork = await getArtworkById(1);

      expect(artwork).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://localhost:5001/api/Artwork/1",
        { headers: { "Content-Type": "application/json" } }
      );
    });
  });

  // --- Auction APIs ---
  describe("Auction APIs", () => {
    it("should start an auction successfully", async () => {
      const mockResponse = { data: { auctionId: 1, message: "Auction started" } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const auctionDto = {
        phoneNumber: "123456789",
        artworkId: 1,
        startingBid: 100,
        secretThreshold: 200,
        durationHours: 24,
      };
      const response = await startAuction(auctionDto);

      expect(response).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://localhost:5001/api/Auction/start",
        auctionDto,
        { headers: { "Content-Type": "application/json" } }
      );
    });

    it("should fetch active auctions", async () => {
      const mockResponse = { data: [{ auctionId: 1, artworkId: 1 }] };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const auctions = await getActiveAuctions();

      expect(auctions).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://localhost:5001/api/Auction/active",
        { headers: { "Content-Type": "application/json" } }
      );
    });

    it("should end an auction successfully", async () => {
      const mockResponse = { data: { message: "Auction ended" } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const endAuctionDto = { auctionId: 1 };
      const response = await endAuction(endAuctionDto);

      expect(response).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://localhost:5001/api/Auction/end",
        endAuctionDto,
        { headers: { "Content-Type": "application/json" } }
      );
    });
  });

  // --- Bid APIs ---
  describe("Bid APIs", () => {
    it("should place a bid successfully", async () => {
      const mockResponse = { data: { message: "Bid placed", bidId: 1 } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const bidDto = { phoneNumber: "123456789", auctionId: 1, bidAmount: 100 };
      const response = await placeBid(bidDto);

      expect(response).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://localhost:5001/api/Bid/place",
        bidDto,
        { headers: { "Content-Type": "application/json" } }
      );
    });

    it("should fetch bids for an auction", async () => {
      const mockResponse = { data: [{ bidId: 1, bidAmount: 100 }] };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const bids = await getBidsForAuction(1);

      expect(bids).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://localhost:5001/api/Bid/auction/1",
        { headers: { "Content-Type": "application/json" } }
      );
    });
  });

  // --- Session APIs ---
  describe("Session APIs", () => {
    it("should start a session successfully", async () => {
      const mockResponse = { data: { sessionId: "abc123" } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const sessionDto = { phoneNumber: "123456789" };
      const sessionId = await startSession(sessionDto);

      expect(sessionId).toBe(mockResponse.data.sessionId);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://localhost:5001/api/Session/start",
        sessionDto,
        { headers: { "Content-Type": "application/json" } }
      );
    });

    it("should end a session successfully", async () => {
      const mockResponse = { data: { message: "Session ended" } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const message = await endSession("abc123");

      expect(message).toBe(mockResponse.data.message);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://localhost:5001/api/Session/end",
        null,
        { headers: { "Content-Type": "application/json" }, params: { sessionId: "abc123" } }
      );
    });
  });

  // --- User APIs ---
  describe("User APIs", () => {
    it("should add a user successfully", async () => {
      const mockResponse = { data: { message: "User added" } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const userDto = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        country: "US",
      };
      const message = await addUser(userDto);

      expect(message).toBe(mockResponse.data.message);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://localhost:5001/api/User/add",
        userDto,
        { headers: { "Content-Type": "application/json" } }
      );
    });

    it("should fetch user by ID", async () => {
      const mockResponse = { data: { firstName: "John", lastName: "Doe" } };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const user = await getUser(1);

      expect(user).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://localhost:5001/api/User/1",
        { headers: { "Content-Type": "application/json" } }
      );
    });

    it("should fetch user by phone number", async () => {
      const mockResponse = { data: { firstName: "John", lastName: "Doe" } };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const user = await getUserByPhoneNumber("123456789");

      expect(user).toEqual(mockResponse.data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "https://localhost:5001/api/User/by-phone/123456789",
        { headers: { "Content-Type": "application/json" } }
      );
    });
  });
});
*/