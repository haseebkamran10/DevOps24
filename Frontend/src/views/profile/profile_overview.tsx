import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import art1 from "@/assets/art_placeholder1.webp";
import art2 from "@/assets/art_placeholder2.jpg";
import art3 from "@/assets/art_placeholder3.png";
import { getUserByPhoneNumber } from "../../services/UserService"; // Import the getUser function

const ProfileOverview = () => {
  const [userDetails, setUserDetails] = useState(() => {
    const savedDetails = localStorage.getItem("userDetails");
    return savedDetails
      ? JSON.parse(savedDetails)
      : { name: "Guest", email: "guest@example.com", phone: "+00 00000000" };
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError(null);
  
        // Retrieve the phone number from localStorage
        const phoneNumber = localStorage.getItem("phoneNumber");
        if (!phoneNumber) {
          throw new Error("No phone number found. Please log in again.");
        }
  
        // Use the phone number to fetch user details
        const user = await getUserByPhoneNumber(phoneNumber);
        setUserDetails({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phoneNumber || "+00 00000000",
        });
  
        // Save the fetched details to localStorage for later use
        localStorage.setItem("userDetails", JSON.stringify(user));
      } catch (err: any) {
        setError(err.message || "Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserDetails();
  }, []);
  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Welcome {userDetails.name === "Guest" ? "Guest" : userDetails.name}
        </h1>
      </div>

      {/* User Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>{userDetails.name}</CardTitle>
          <CardDescription>{userDetails.email}</CardDescription>
          <CardDescription>{userDetails.phone}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="m-2" type="submit">
            Favorited Auctions
          </Button>
          <Button className="m-2" type="submit">
            My Items
          </Button>
          <Link to="/artwork">
          <Button className="m-2" type="submit">
           Add Artwork
          </Button>
          </Link>
          
          <Button className="m-2" type="submit">
            Profile Settings
          </Button>
          <Link to="/new-auction">
            <Button className="m-2" type="submit">
              New Auction
            </Button>
          </Link>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>

      <hr className="rounded" />

      {/* User's Auctions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Current Auctions You Lead</CardTitle>
          <CardDescription>
            We will notify you if you are outbid.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Carousel className="m-10">
            <CarouselContent>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <img
                  className="h-full w-full object-cover"
                  src={art1}
                  alt="Art placeholder 1"
                />
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <img
                  className="h-full w-full object-cover"
                  src={art2}
                  alt="Art placeholder 2"
                />
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <img
                  className="h-full w-full object-cover"
                  src={art3}
                  alt="Art placeholder 3"
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
};

export default ProfileOverview;
