import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation and useNavigate
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { GoShare } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import {
  MdFavorite,
  MdFavoriteBorder,
  MdOutlineStarOutline,
} from "react-icons/md";
import { VscVerified } from "react-icons/vsc";
import { placeBid, getBidsForAuction } from "../../services/BidService"; // Add API functions

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
    try {
      const fetchedBids = await getBidsForAuction(auction.auctionId);
      setBids(fetchedBids);
    } catch (error) {
      console.error("Error fetching bids:", error);
    }
  };

  // Handle bid placement
  const handlePlaceBid = async () => {
    if (!bidAmount || isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
      alert("Please enter a valid bid amount.");
      return;
    }

    try {
      const bidData = {
        phoneNumber: "31856527", // Replace with user phone number
        auctionId: auction.auctionId,
        bidAmount: Number(bidAmount),
      };

      const response = await placeBid(bidData);
      alert(response.message);

      if (Number(bidAmount) >= auction.secretThreshold) {
        navigate("/winner", {
          state: {
            winnerName: "Your Name", // Replace with user's name
            itemTitle: auction.artwork.title,
            auctionEndDate: new Date(auction.endTime).toLocaleDateString(),
          },
        });
      } else {
        fetchBids();
      }
    } catch (error) {
      console.error("Error placing bid:", error);
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
      {/* Conditional Overlay */}
      {isOverlayOpen && (
        <div className="fixed top-32 left-1/2 transform -translate-x-1/2 right-0 bottom-0 border border-gray-300 bg-white rounded-lg shadow-lg w-full sm:w-60 max-h-60 overflow-y-auto z-10 p-4">
          <div className="text-center">
            <button
              className="absolute top-4 right-4 text-xl text-black"
              onClick={toggleOverlay}
            >
              <IoMdClose />
            </button>
            <h2 className="mb-2 text-black">Bids</h2>
            <ul className="text-black">
            {bids.map((bid) => (
          <li key={bid.bidId}>
            {bid.bidAmount} USD at {new Date(bid.bidTime).toLocaleString()}
          </li>
        ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default SingleProductPage;
