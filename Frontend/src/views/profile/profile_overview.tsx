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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";

import art1 from "@/assets/art_placeholder1.webp";
import art2 from "@/assets/art_placeholder2.jpg";
import art3 from "@/assets/art_placeholder3.png";

const ProfileOverview = () => {
  const [userDetails, setUserDetails] = useState({
    name: "Guest",
    email: "guest@example.com",
    phone: "+00 00000000",
  });

  useEffect(() => {
    const storedName = localStorage.getItem("userName") || "Guest";
    const storedEmail = localStorage.getItem("email") || "guest@example.com";
    const storedPhone = localStorage.getItem("phone") || "+00 00000000";

    setUserDetails({
      name: storedName,
      email: storedEmail,
      phone: storedPhone,
    });
  }, []);

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
