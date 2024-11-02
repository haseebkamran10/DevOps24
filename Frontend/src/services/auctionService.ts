// Frontend/src/services/auctionService.js
import axios from "axios";

export interface Auction {
  title: string;
  description: string;
  startingPrice: number;
  startDate: Date;
  endDate: Date;
}

export interface CreatedAuction extends Auction {
  id: number;
}

const API_URL = "http://localhost:8080/api/auctions";

export const createAuction = async (auction: Auction) => {
  const response = await axios.post(API_URL, auction);
  return response.data;
};

export const getAuctions = async (id: number) => {
  const url = id ? `${API_URL}/${id}` : API_URL;
  const response = await axios.get(url);
  return response.data;
};
