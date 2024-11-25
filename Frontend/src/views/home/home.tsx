import useScrollEffect from "@/lib/useScrollEffect";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import CreateAuctionForm from "../createAuction";
import { getAllArtworks } from "../../services/artworkService"; // Import the API call function

const HomePage = () => {
  const bannerRef = useRef<HTMLImageElement>(null);
  const [opacity, setOpacity] = useState(0.7);
  const [artworks, setArtworks] = useState<any[]>([]); // State for artworks
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for error handling

  useScrollEffect(bannerRef, setOpacity);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const data = await getAllArtworks(); // Fetch artworks
        setArtworks(data);
      } catch (err: any) {
        console.error("Error fetching artworks:", err.message);
        setError(err.message);
      } finally {
        setLoading(false); // Always stop loading after fetching
      }
    };

    fetchArtworks();
  }, []);

  const auctions = [
    {
      name: "Modern Masterpiece",
      date: "Preview on 2024-09-27",
      imgSrc: "artwork_4.jpg",
      link: "/1",
    },
    {
      name: "Renaissance Revival",
      date: "Preview on 2024-09-28",
      imgSrc: "artwork_5.jpg",
      link: "/1",
    },
    {
      name: "Classical Expression",
      date: "Preview on 2024-09-29",
      imgSrc: "artwork_6.jpg",
      link: "/1",
    },
  ];

  return (
    <>
      {/* Home Banner */}
      <img
        ref={bannerRef}
        src="home_banner.jpg"
        alt="Home Banner"
        className="fixed inset-0 w-full h-dvh object-cover transition-transform duration-300"
        style={{ opacity }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white">
        {/* Header Section */}
        <div className="text-center py-20">
          <h1 className="text-4xl font-bold">Home Page</h1>
          <p className="mt-4 text-xl">Discover and bid on exquisite artworks.</p>
        </div>

        {/* Featured Artworks */}
        <div className="container mx-auto px-10 py-20">
          <h2 className="text-3xl font-bold mb-6">Featured Artworks</h2>
          {loading && <p>Loading artworks...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
         <div className="grid grid-cols-3 gap-6" style={{ justifyContent: "space-evenly" }}>
         {artworks.map((art, index) => (
           <div
             key={index}
             className="shadow-lg rounded-lg overflow-hidden"
             style={{ height: "420px", width: "300px" }}
           >
             <img
               src={art.image_url}
               alt={art.title}
               className="h-3/4 w-full object-cover"
             />
             <div className="p-4 bg-gray-800 h-1/4">
               <h3 className="font-bold truncate">{art.title}</h3>
               <p className="text-sm truncate">{art.artist}</p>
               {/* Dynamic Link */}
               <Link to={`/products/${art.artwork_id}`}>
                 <button className="mt-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-xs rounded">
                   View Details
                 </button>
               </Link>
             </div>
           </div>
         ))}
       </div>
       
          )}
        </div>

        {/* Upcoming Auctions */}
        <div className="container mx-auto px-10 py-20">
          <h2 className="text-3xl font-bold mb-6">Upcoming Auctions</h2>
          <div className="grid grid-cols-3 gap-6" style={{ justifyContent: "space-evenly" }}>
            {auctions.map((auction, index) => (
              <div
                key={index}
                className="shadow-lg rounded-lg overflow-hidden"
                style={{ height: "420px", width: "300px" }}
              >
                <img
                  src={auction.imgSrc}
                  alt={auction.name}
                  className="h-3/4 w-full object-cover"
                />
                <div className="p-4 bg-gray-800 h-1/4">
                  <h3 className="font-bold truncate">{auction.name}</h3>
                  <p className="text-sm truncate">{auction.date}</p>
                  <Link to={auction.link}>
                    <button className="mt-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 text-xs rounded">
                      Auction Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create Auction Form */}
        <div className="container mx-auto px-10 py-20">
          <h2 className="text-3xl font-bold mb-6">Create a New Auction</h2>
          <CreateAuctionForm />
        </div>
      </div>
    </>
  );
};

export default HomePage;
