import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; 
import { createArtwork } from "@/services/ArtworkService";
import { startAuction } from "@/services/auctionService";
import {useNavigate } from "react-router-dom";
import Spinner from "../components/ui/spinner"; 
import Toast from  "../components/ui/toast"; 

function NewAuctionPage() {
  const [step, setStep] = useState(1);
  const [artworkId, setArtworkId] = useState<number | null>(null); 
  const [loading, setLoading] = useState(false); 
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);


  const [phoneNumber, setPhoneNumber] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [artist, setArtist] = useState("");
  const [image, setImage] = useState<File | null>(null);


  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startingBid, setStartingBid] = useState("");
  const [secretThreshold, setSecretThreshold] = useState("");
  const navigate = useNavigate();
   const showToast = (message: string, type: "success" | "error") => {
    setToast(null);
    setTimeout(() => setToast({ message, type }), 50);
  };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) setImage(file);
    };
    const handleArtworkSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (!image) {
        showToast("Please upload an image.", "error");
        return;
      }
  
      setLoading(true);
      try {
        const response = await createArtwork({
          phoneNumber,
          title,
          description,
          artist,
          imageFile: image,
        });
        setArtworkId(response.artworkId);
        setStep(2);
        showToast("Artwork created successfully!", "success");
      } catch (error) {
        console.error("Error creating artwork:", error);
        showToast("Failed to create artwork. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    };
    const handleAuctionSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    
      if (!artworkId) {
        showToast("No artwork ID found. Please create an artwork first.", "error");
        return;
      }
    
      if (!startDate || !endDate || !startingBid || !secretThreshold) {
        showToast("Please fill out all fields.", "error");
        return;
      }
      if (endDate <= startDate) {
        showToast("End date must be after the start date.", "error");
        return;
      }
      const durationHours = Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
      );
    
      if (durationHours <= 0) {
        showToast("End date must be after the start date.", "error");
        return;
      }
      const auctionDto = {
        phoneNumber,
        artworkId,
        startingBid: parseFloat(startingBid),
        secretThreshold: parseFloat(secretThreshold),
        durationHours,
      };
    
      setLoading(true);
      try {
        const response = await startAuction(auctionDto);
        localStorage.setItem("auctionId", response.auctionId.toString());
        localStorage.setItem("secretThreshold", secretThreshold);
    
        showToast("Auction started successfully!", "success");
        setTimeout(() => navigate("/"), 2000);
      } catch (error) {
        console.error("Error starting auction:", error);
        showToast("Failed to start auction. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    };
    

  return (
    <div className="w-full mx-auto bg-white flex justify-center px-4 sm:px-6 lg:px-8">
       {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <form
        onSubmit={step === 1 ? handleArtworkSubmit : handleAuctionSubmit}
        className="border rounded-3xl w-full max-w-3xl p-6 sm:p-8 m-8 bg-gray-100 shadow-lg"
      >
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          {step === 1 ? "Create Artwork" : "Start Auction"}
        </h1>

        {step === 1 ? (
          <>
            {/* Artwork Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-white text-black border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your phone number..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white text-black border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter artwork title..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white text-black border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter artwork description..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Artist
                </label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full bg-white text-black border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter artist name..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full bg-white text-black border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  accept="image/*"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Create Artwork"}
            </button>
          </>
        ) : (
          <>
            {/* Auction Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Start Date
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  placeholderText="Select start date"
                  className="w-full bg-white text-black border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  End Date
                </label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  showTimeSelect
                  dateFormat="Pp"
                  placeholderText="Select end date"
                  className="w-full bg-white text-black border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Starting Bid
                </label>
                <input
                  type="number"
                  value={startingBid}
                  onChange={(e) => setStartingBid(e.target.value)}
                  className="w-full bg-white text-black border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter starting bid..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Secret Threshold (Minimum Price)
                </label>
                <input
                  type="number"
                  value={secretThreshold}
                  onChange={(e) => setSecretThreshold(e.target.value)}
                  className="w-full bg-white text-black border border-gray-400 p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter minimum acceptable price..."
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6"
              disabled={loading}
            >
               {loading ? <Spinner /> : "Start Auction"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default NewAuctionPage;
