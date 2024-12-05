import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation and useNavigate
import {useEffect, useState } from "react";
import { GoShare } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import {
  MdFavorite,
  MdFavoriteBorder,
  MdOutlineStarOutline,
} from "react-icons/md";
import { VscVerified } from "react-icons/vsc";
import { placeBid, getBidsForAuction } from "../../services/BidService";
import  {endAuction} from "../../services/auctionService";
import Spinner from "../../components/ui/spinner"; // Adjust the path as needed
import Toast from  "../../components/ui/toast"; // Adjust the path as needed

function SingleProductPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const auction = state?.auction; // Get the auction data passed from HomePage
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(""); // Time remaining until auction ends
  const [bids, setBids] = useState(auction?.bids || []);
  const [bidAmount, setBidAmount] = useState("");
  const [isBidding, setIsBidding] = useState(false);
  const [loading, setLoading] = useState(false); // For Spinner
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" }>({
    message: "",
    type: "success",
  });
  
 

  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Fetch bids for the auction
  useEffect(() => {
    if (auction?.auctionId) {
      fetchBids();
    }
  }, [auction?.auctionId]);

  const fetchBids = async () => {
    setLoading(true); // Show spinner
    try {
      const fetchedBids = await getBidsForAuction(auction.auctionId);
      setBids(fetchedBids);
      //setToast({ message: "Bids fetched successfully.", type: "success" }); // Success Toast
    } catch (error) {
      console.error("Error fetching bids:", error);
      setToast({ message: "Failed to fetch bids.", type: "error" }); // Error Toast
    } finally {
      setLoading(false); // Hide spinner
    }
  };

  console.log("auction id = "+auction.auctionId)


 const handlePlaceBid = async () => {
  const phoneNumber = localStorage.getItem("phoneNumber");
  const username = localStorage.getItem("username");

  if (!phoneNumber) {
    setToast({ message: "You must be logged in to place a bid.", type: "error" });
    return;
  }

  if (!bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
    setToast({ message: "Please enter a valid bid amount.", type: "error" });
    return;
  }

  setLoading(true); // Show spinner
  try {
    const bidData = {
      phoneNumber,
      auctionId: auction.auctionId,
      bidAmount: Number(bidAmount),
    };

    const response = await placeBid(bidData);
    setToast({ message: response.message, type: "success" }); // Success Toast
    fetchBids(); // Refresh bids after placing a bid

    const storedSecretThreshold = localStorage.getItem("secretThreshold");
    if (storedSecretThreshold) {
      const threshold = parseFloat(storedSecretThreshold);
      if (threshold && Number(bidAmount) >= threshold) {
        const auctionEndDate = new Date().toLocaleDateString();
        await endAuction({ auctionId: auction.auctionId }); // End the auction
        navigate("/winners", {
          state: {
            winnerName: username,
            itemTitle: auction.artwork.title,
            auctionEndDate,
            imageUrl: auction.artwork.imageUrl,
          },
        });
      }
    }
  } catch (error) {
    console.error("Error placing bid:", error);
    setToast({ message: "Failed to place bid.", type: "error" }); // Error Toast
  } finally {
    setLoading(false); // Hide spinner
  }
};


  // Calculate time remaining
  useEffect(() => {
    if (!auction?.endTime) return;

    const updateTimeRemaining = () => {
      const endTime = new Date(auction.endTime).getTime();
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeRemaining("Auction ended");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeRemaining(
        `${days}d ${hours}h ${minutes}m ${seconds}s`
      );
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [auction?.endTime]);

  if (!auction) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Auction Not Found</h1>
        <p>Please go back and select a valid auction.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
         {/* Show Spinner */}
    {loading && <Spinner />}

{/* Show Toast Notifications */}
{toast.message && (
  <Toast
    message={toast.message}
    type={toast.type}
    onClose={() => setToast({ message: "", type: "success" })}
  />
)}
      {/* Content Container */}
      <div className="flex flex-col lg:flex-row justify-center items-center flex-grow p-4 lg:p-8">
        <div className="w-full lg:w-4/5 flex flex-col lg:flex-row justify-between">
          {/* Left Section */}
          <div className="w-full lg:w-2/5 flex flex-col items-center lg:items-start">
            <div className="relative w-full max-w-lg mx-auto lg:mx-0">
              <img
                src={auction.artwork.imageUrl}
                alt={auction.artwork.title}
                className="h-60 w-full object-cover rounded-lg shadow-md"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-1/2 mt-4 lg:mt-0 lg:ml-8 grid gap-4">
            {/* Date and Action Buttons */}
            <div className="flex justify-between items-center mb-2 text-center lg:text-left">
              <p className="text-sm text-gray-500">
                Ends At: {new Date(auction.endTime).toLocaleString()}
              </p>
              <div className="flex items-center">
                <button className="mr-4 text-2xl">
                  <GoShare />
                </button>
                <button className="text-2xl" onClick={toggleFavorite}>
                  {!isFavorite ? <MdFavoriteBorder /> : <MdFavorite />}
                </button>
              </div>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold mb-2 text-center lg:text-left">
              {auction.artwork.title}
            </h1>
            <p className="text-gray-500 mb-2 text-center lg:text-left">
              {auction.artwork.description}
            </p>
            <p className="text-gray-500 mb-2 text-center lg:text-left">
              Artist: {auction.artwork.artist}
            </p>

            {/* Price and Time */}
            <div className="flex justify-between mb-2 text-center lg:text-left">
            <p className="text-red-500">Ends in: {timeRemaining}</p>
              <div className="flex items-center">
                <button className="ml-2 underline" onClick={toggleOverlay}>
                  {bids.length} bids
                </button>
              </div>

            </div>
            <div>
                       
            <p className="text-xl font-bold">
            Price : {auction.currentBid || auction.startingBid} USD
              </p>
              
            </div>
            {/* Place a Bid */}
            <div>
              <button
                className="bg-indigo-700 text-white py-2 px-4 rounded hover:bg-blue-500 active:bg-indigo-700 w-full lg:w-auto"
                onClick={() => setIsBidding(!isBidding)}
              >
                Place a Bid
              </button>
              {isBidding && (
                <div className="mt-4">
                  <input
                    type="number"
                    placeholder="Enter your bid"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="border border-gray-300 rounded p-2 w-full lg:w-auto"
                  />
                  <button
                    className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-500 active:bg-green-700 mt-2 w-full lg:w-auto"
                    onClick={handlePlaceBid}
                  >
                    Submit Bid
                  </button>
                </div>
              )}
            </div>

            {/* Accordion */}
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="item-1">
                <AccordionTrigger>Shipping</AccordionTrigger>
                <AccordionContent>
                  <p>Shipping price within Denmark </p>
                  <p>DKK 36 DHL</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Local Pickup</AccordionTrigger>
                <AccordionContent>Can be picked up in</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Payment</AccordionTrigger>
                <AccordionContent>
                  All payments are reviewed by Tradera for your security.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {/* Seller Info */}
            <div className="grid mt-2">
              <div className="flex items-center mb-2 justify-center lg:justify-start">
                <p className="font-bold underline mr-4">{auction.artwork.artist}</p>
                <img
                  src="Marius.jpg" 
                  className="w-12 h-12 rounded-full border-black border"
                  alt="Seller Profile"
                />
              </div>
              <p className="text-gray-500 mb-2 text-center lg:text-right">
                Rødovre, Denmark
              </p>

              <div className="flex items-center mb-2 justify-center lg:justify-start">
                <VscVerified />
                <p className="ml-2">Verified</p>
              </div>
              <div className="flex items-center mb-2 justify-center lg:justify-start">
                <MdOutlineStarOutline />
                <p className="ml-2">44 reviews</p>
              </div>

              <div className="flex justify-between mt-4">
                <button className="w-1/3 py-2 border border-gray-400 hover:bg-gray-400 hover:text-white">
                  Contact
                </button>
                <button className="w-1/3 py-2 border border-gray-400 hover:bg-gray-400 hover:text-white">
                  Reviews
                </button>
                <button className="w-1/3 py-2 border border-gray-400 hover:bg-gray-400 hover:text-white">
                  Follow
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOverlayOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
    <div className="bg-white w-full max-w-sm mx-auto rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Bids</h2>
        <button
          className="text-gray-500 hover:text-gray-800"
          onClick={toggleOverlay}
        >
          <IoMdClose size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-72 overflow-y-auto">
        {bids.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {bids.map((bid) => (
              <li key={bid.bidId} className="py-3 flex justify-between items-center">
                <span className="text-gray-800 font-medium">{bid.bidAmount} USD</span>
                <span className="text-gray-500 text-sm">{new Date(bid.bidTime).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm text-center">No bids available</p>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default SingleProductPage;
