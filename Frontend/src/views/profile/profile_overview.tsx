import { useEffect, useState } from "react";
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
import { getUserByPhoneNumber } from "../../services/UserService";
import Spinner from "../../components/ui/spinner"; // Adjust the path as needed
import Toast from  "../../components/ui/toast"; // Adjust the path as needed

const ProfileOverview = () => {
  const [userDetails, setUserDetails] = useState(() => {
    const savedDetails = localStorage.getItem("userDetails");
    return savedDetails
      ? JSON.parse(savedDetails)
      : { name: "Guest", email: "guest@example.com", phone: "+00 00000000" };
  });

  const [loading, setLoading] = useState(true);
  const [ ,setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const phoneNumber = localStorage.getItem("phoneNumber");
        if (!phoneNumber) {
          throw new Error("No phone number found. Please log in again.");
        }

        const user = await getUserByPhoneNumber(phoneNumber);
        setUserDetails({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phoneNumber || "+00 00000000",
        });

        localStorage.setItem("userDetails", JSON.stringify(user));
        setToast({ message: "User details loaded successfully!", type: "success" });
      } catch (err: any) {
        setError(err.message || "Failed to fetch user details.");
        setToast({ message: err.message || "Failed to fetch user details.", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
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
          <Button className="m-2" type="button">
            Favorited Auctions
          </Button>
          <Button className="m-2" type="button">
            My Items
          </Button>
          <Link to="/artwork">
            <Button className="m-2" type="button">
              Add Artwork
            </Button>
          </Link>
          <Button className="m-2" type="button">
            Profile Settings
          </Button>
          <Link to="/new-auction">
            <Button className="m-2" type="button">
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

export default ProfileOverview;
