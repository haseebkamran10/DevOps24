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

function LionPainting() {
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
    <div className="flex justify-center items-center">
      <div className="w-4/5 flex justify-between">
        <div className="flex flex-col w-2/5 justify-start max-w-1/2">
          <div className="relative">
            <div className="max-w-lg">
              <Carousel slides={slides} />
            </div>
          </div>
        </div>

        <div className="grid w-1/2 ml-8">
          <div className="flex justify-between mb-2">
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
          <h1 className="text-2xl font-bold mb-2">Lion Magnifiqué</h1>
          <p className="text-gray-500 mb-2">
            Water color painting in wood frame
          </p>

          <div className="flex justify-between mb-2">
            <div className="flex items-center">
              <p className="text-gray-500">Price |</p>
              <button className="ml-2 underline" onClick={toggleOverlay}>
                3 bids
              </button>
            </div>
            <p className="text-gray-500">Ends in</p>
          </div>

          <div className="flex justify-between mb-2">
            <p className="text-xl font-bold">$750</p>
            <p className="text-gray-500">3 days 22 hours</p>
          </div>
          <p className="flex items-center text-gray-500 mb-4">
            $764 including buyer protection
            <FaShieldAlt className="ml-2" />
          </p>
          <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 active:bg-blue-700">
            Place a bid
          </button>

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

          <div className="grid mt-4">
            <div className="flex items-center mb-2">
              <p className="font-bold underline mr-4">Marius Picasso</p>
              <img
                src="Marius.jpg"
                className="w-12 h-12 rounded-full border-black border"
              />
            </div>
            <p className="text-gray-500 mb-2">Rødovre, Denmark</p>

            <div className="flex items-center mb-2">
              <VscVerified />
              <p className="ml-2">Verified</p>
            </div>
            <div className="flex items-center mb-2">
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

      {/* Conditional rendering of the overlay */}
      {isOverlayOpen && (
        <div className="fixed top-32 left-2/3 right-0 bottom-0 border border-gray-300 bg-white rounded-lg shadow-lg w-60 max-h-60 overflow-y-auto z-10">
          <div className="text-center p-4">
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

export default LionPainting;
