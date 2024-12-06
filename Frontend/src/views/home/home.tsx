import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useScrollEffect from "@/lib/useScrollEffect";
import { getActiveAuctions, ActiveAuction } from "@/services/auctionService";
import Spinner from "../../components/ui/spinner";
import Toast from "../../components/ui/toast";
import { usePersistent } from "../../contexts/PersistentContext";
import { getAllArtworks } from "@/services";

const HomePage = () => {
  const bannerRef = useRef<HTMLImageElement>(null);
  const [opacity, setOpacity] = useState(0.7);
  const { getState, setState } = usePersistent(); // Persistent state
  const [ongoingAuctions, setOngoingAuctions] = useState<ActiveAuction[]>(
    () => getState("ongoingAuctions") || [] // Load from localStorage if available
  );
  const [loading, setLoading] = useState(ongoingAuctions.length === 0);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  

  useScrollEffect(bannerRef, setOpacity);
  const [artworks, setArtworks] = useState<Artwork[]>(() => getState("artworks") || []);

  interface Artwork {
    name: string;
    artist: string;
    imgSrc: string;
    link: string;
  }
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

  useEffect(() => {
    if (ongoingAuctions.length > 0) return; 

    const fetchAuctions = async () => {
      try {
        const auctions = await getActiveAuctions();
        setOngoingAuctions(auctions);
        setState("ongoingAuctions", auctions);
        setToast({ message: "Auctions fetched successfully!", type: "success" });
      } catch (error) {
        console.error("Failed to fetch ongoing auctions:", error);
        setToast({ message: "Failed to fetch auctions. Please try again.", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [setState, getState, ongoingAuctions.length]);

  useEffect(() => {
    if (artworks.length > 0) return;

    const fetchArtworks = async () => {
      setLoading(true);
      try {
        const fetchedArtworks = await getAllArtworks();
        const formattedArtworks = fetchedArtworks.map((art) => ({
          name: art.title,
          artist: art.artist,
          imgSrc: art.imageUrl,
          link: `/SingleProductPage/${art.artworkId}`, 
        }));
        setArtworks(formattedArtworks);
        setState("artworks", formattedArtworks);
        setToast({ message: "Artworks fetched successfully!", type: "success" });
      } catch (error) {
        console.error("Failed to fetch artworks:", error);
        setToast({ message: "Failed to fetch artworks. Please try again.", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [artworks, setState]);

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

        {/* Featured Artworks */}
        <div className="container mx-auto px-5 md:px-10 py-10 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Featured Artworks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((art:Artwork, index:  number) => (
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

        {/* Upcoming Auctions */}
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

        {/* Ongoing Auctions */}
        <div className="container mx-auto px-5 md:px-10 py-10 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ongoing Auctions</h2>
          {loading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : ongoingAuctions.length === 0 ? (
            <p className="text-center">No ongoing auctions at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ongoingAuctions.map((auction) => (
                <div
                  key={auction.auctionId}
                  className="shadow-lg rounded-lg overflow-hidden w-full max-w-xs mx-auto"
                >
                  <img
                    src={auction.artwork.imageUrl}
                    alt={auction.artwork.title}
                    className="h-60 w-full object-cover"
                  />
                  <div className="p-4 bg-gray-800">
                    <h3 className="font-bold truncate">{auction.artwork.title}</h3>
                    <p className="text-sm truncate">Artist: {auction.artwork.artist}</p>
                    <p className="text-sm text-yellow-400">
                      Current Bid: {auction.currentBid || auction.startingBid} USD
                    </p>
                    <p className="text-sm text-red-400">
                      Ends At: {new Date(auction.endTime).toLocaleString()}
                    </p>
                    <Link
                      to={`/SingleProductPage`}
                      state={{ auction: auction }}
                    >
                      <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs">
                        Bid Now
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default HomePage;