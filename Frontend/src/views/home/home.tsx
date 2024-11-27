import useScrollEffect from "@/lib/useScrollEffect";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import CreateAuctionForm from "../createAuction";
import CreateAuction from "../createAuction";

const HomePage = () => {
  const bannerRef = useRef<HTMLImageElement>(null);
  const [opacity, setOpacity] = useState(0.7);
  useScrollEffect(bannerRef, setOpacity);

  const artworks = [
    {
      name: "Lion Magnifiqué",
      artist: "Marius Picasso",
      imgSrc: "lion-painting.png",
      link: "/SingleProductPage",
    },
    {
      name: "Sunset Overdrive",
      artist: "Artist B",
      imgSrc: "lion-painting2.jpg",
      link: "/SingleProductPage",
    },
    {
      name: "Abstract Delight",
      artist: "Artist C",
      imgSrc: "artwork_3.jpg",
      link: "/SingleProductPage",
    },
  ];

  const auctions = [
    {
      name: "Modern Masterpiece",
      date: "Preview on 2024-09-27",
      imgSrc: "artwork_4.jpg",
      link: "/SingleProductPage",
    },
    {
      name: "Renaissance Revival",
      date: "Preview on 2024-09-28",
      imgSrc: "artwork_5.jpg",
      link: "/SingleProductPage",
    },
    {
      name: "Classical Expression",
      date: "Preview on 2024-09-29",
      imgSrc: "artwork_6.jpg",
      link: "/SingleProductPage",
    },
  ];

  return (
    <>
      <img
        ref={bannerRef}
        src="home_banner.jpg"
        alt="Home Banner"
        className="fixed inset-0 w-full h-screen object-cover transition-opacity duration-300"
        style={{ opacity }}
      />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white">
        <div className="text-center py-20">
          <h1 className="text-4xl md:text-5xl font-bold">Welcome to Our Art Auction</h1>
          <p className="mt-4 text-lg md:text-xl">
            Discover and bid on exquisite artworks.
          </p>
        </div>

        <div className="container mx-auto px-5 md:px-10 py-10 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Featured Artworks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((art, index) => (
              <div
                key={index}
                className="shadow-lg rounded-lg overflow-hidden w-full max-w-xs mx-auto"
              >
                <img
                  src={art.imgSrc}
                  alt={art.name}
                  className="h-60 w-full object-cover"
                />
                <div className="p-4 bg-gray-800">
                  <h3 className="font-bold truncate">{art.name}</h3>
                  <p className="text-sm truncate">{art.artist}</p>
                  <Link to={art.link}>
                    <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-5 md:px-10 py-10 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Upcoming Auctions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.map((auction, index) => (
              <div
                key={index}
                className="shadow-lg rounded-lg overflow-hidden w-full max-w-xs mx-auto"
              >
                <img
                  src={auction.imgSrc}
                  alt={auction.name}
                  className="h-60 w-full object-cover"
                />
                <div className="p-4 bg-gray-800">
                  <h3 className="font-bold truncate">{auction.name}</h3>
                  <p className="text-sm truncate">{auction.date}</p>
                  <Link to={auction.link}>
                    <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs">
                      Auction Details
                    </button>
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </div>
        <div className="container mx-auto px-5 md:px-10 py-10 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">On-going Auctions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((art, index) => (
              <div
                key={index}
                className="shadow-lg rounded-lg overflow-hidden w-full max-w-xs mx-auto"
              >
                <img
                  src={art.imgSrc}
                  alt={art.name}
                  className="h-60 w-full object-cover"
                />
                <div className="p-4 bg-gray-800">
                  <h3 className="font-bold truncate">{art.name}</h3>
                  <p className="text-sm truncate">{art.artist}</p>
                  <Link to={art.link}>
                    <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </>
  );
};

export default HomePage;