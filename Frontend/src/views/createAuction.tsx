// src/components/CreateAuctionForm.tsx

import { Auction, createAuction } from "@/services/auctionService";
import React, { useState } from "react";

const CreateAuctionForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const auction: Auction = {
      title,
      description,
      startingPrice: parseFloat(startingPrice),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };
    try {
      const createdAuction = await createAuction(auction);
      console.log("Created Auction:", createdAuction);
      // Handle the created auction as needed, e.g., navigate to the auction details page
    } catch (error) {
      console.error("Error creating auction:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Title"
          required
        />
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Description"
          required
        />
      </div>
      <div>
        <label
          htmlFor="startingPrice"
          className="block text-sm font-medium text-gray-700"
        >
          Starting Price
        </label>
        <input
          type="number"
          id="startingPrice"
          value={startingPrice}
          onChange={(e) => setStartingPrice(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Starting Price"
          required
        />
      </div>
      <div>
        <label
          htmlFor="startDate"
          className="block text-sm font-medium text-gray-700"
        >
          Start Date
        </label>
        <input
          type="datetime-local"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="endDate"
          className="block text-sm font-medium text-gray-700"
        >
          End Date
        </label>
        <input
          type="datetime-local"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>
      <button
        type="submit"
        className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Auction
      </button>
    </form>
  );
};

export default CreateAuctionForm;
