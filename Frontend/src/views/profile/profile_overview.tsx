import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData } from "../../services/UserService";
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
import { useAuth } from "../../../contexts/AuthContext";
import art1 from "@/assets/art_placeholder1.webp";
import art2 from "@/assets/art_placeholder2.jpg";
import art3 from "@/assets/art_placeholder3.png";

const ProfileOverview = () => {
  const [userDetails, setUserDetails] = useState({
    name: "Guest",
    email: "guest@example.com",
    phone: "+00 00000000",
  });

  const { userName, setUserName,triggerForceRender } = useAuth(); // Use AuthContext
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        alert("You are not logged in. Redirecting to login.");
        navigate("/login");
        return;
      }

      try {
        const userData = await getUserData(parseInt(userId, 10), token);
        const fullName = `${userData.firstName} ${userData.lastName}`;

        setUserDetails({
          name: fullName,
          email: userData.email,
          phone: userData.phoneNumber || "+00 00000000",
        });

        // Update AuthContext to reflect user information globally
        setUserName(fullName);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        alert("Unable to fetch user details.");
      }
    };

    if (userName !== "Guest") {
      // Only fetch details if the user is logged in
      fetchUserDetails();
    }
  }, [userName, navigate, setUserName,triggerForceRender ]); // Depend on `userName` to re-fetch when it changes

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
