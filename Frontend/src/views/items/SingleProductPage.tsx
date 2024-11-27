import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Carousel from "@/lib/carousel";
import { useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { GoShare } from "react-icons/go";
import { IoMdClose } from "react-icons/io";
import {
  MdFavorite,
  MdFavoriteBorder,
  MdOutlineStarOutline,
} from "react-icons/md";
import { VscVerified } from "react-icons/vsc";

const slides = ["lion-painting.png", "lion-painting2.jpg"];

function SingleProductPage() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const bids = [
    { time: "16 Sep 2024 15:04", amount: "$250" },
    { time: "18 Sep 2024 17:43", amount: "$253" },
    { time: "19 Sep 2024 08:19", amount: "$254" },
    { time: "20 Sep 2024 12:54", amount: "$254" },
    { time: "21 Sep 2024 09:32", amount: "$254" },
    { time: "21 Sep 2024 12:54", amount: "$254" },
    { time: "21 Sep 2024 15:04", amount: "$254" },
    { time: "21 Sep 2024 17:43", amount: "$750" },
  ];

  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Content Container */}
      <div className="flex flex-col lg:flex-row justify-center items-center flex-grow p-4 lg:p-8">
        <div className="w-full lg:w-4/5 flex flex-col lg:flex-row justify-between">
          {/* Left Section */}
          <div className="w-full lg:w-2/5 flex flex-col items-center lg:items-start">
            <div className="relative w-full max-w-lg mx-auto lg:mx-0">
              <Carousel slides={slides} />
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-1/2 mt-4 lg:mt-0 lg:ml-8 grid gap-4">
            {/* Date and Action Buttons */}
            <div className="flex justify-between items-center mb-2 text-center lg:text-left">
              <p className="text-sm text-gray-500">Sun 22 Sep 2024 12:54</p>
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
              Lion Magnifiqué
            </h1>
            <p className="text-gray-500 mb-2 text-center lg:text-left">
              Water color painting in wood frame
            </p>

            {/* Price and Time */}
            <div className="flex justify-between mb-2 text-center lg:text-left">
              <div className="flex items-center">
                <p className="text-gray-500">Price |</p>
                <button className="ml-2 underline" onClick={toggleOverlay}>
                  3 bids
                </button>
              </div>
              <p className="text-gray-500">Ends in</p>
            </div>
            <div className="flex justify-between mb-2 text-center lg:text-left">
              <p className="text-xl font-bold">$750</p>
              <p className="text-gray-500">3 days 22 hours</p>
            </div>
            <p className="flex items-center justify-center lg:justify-start text-gray-500 mb-4">
              $764 including buyer protection
              <FaShieldAlt className="ml-2" />
            </p>
            <button className="bg-indigo-700 text-white py-2 px-4 rounded hover:bg-blue-500 active:bg-indigo-700 w-full lg:w-auto">
              Place a bid
            </button>

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
            <div className="grid mt-4">
              <div className="flex items-center mb-2 justify-center lg:justify-start">
                <p className="font-bold underline mr-4">Marius Picasso</p>
                <img
                  src="Marius.jpg"
                  className="w-12 h-12 rounded-full border-black border"
                  alt="Seller Profile"
                />
              </div>
              <p className="text-gray-500 mb-2 text-center lg:text-left">
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
              {bids.map((bid, index) => (
                <li key={index}>
                  <strong>{bid.time}</strong>: {bid.amount}
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