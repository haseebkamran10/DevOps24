import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import art1 from "@/assets/art_placeholder1.webp";
import art2 from "@/assets/art_placeholder2.jpg";
import art3 from "@/assets/art_placeholder3.png";
import { Link } from "react-router-dom";

function ProfileOverview() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>John Doe</CardTitle>
          <CardDescription>johndoe@mail.com</CardDescription>
          <CardDescription>+45 12345678</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="m-2" type="submit">
            Favorited auctions
          </Button>
          <Button className="m-2" type="submit">
            My items
          </Button>
          <Button className="m-2" type="submit">
            Profile settings
          </Button>
          <Link to="/new-auction">
            <Button className="m-2" type="submit">
              New auction
            </Button>
          </Link>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>

      <hr className="rounded"></hr>
      <Card>
        <CardHeader>
          <CardTitle>Current auctions you lead</CardTitle>
          <CardDescription>
            We will notify you if you are outbid
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
}

export default ProfileOverview;
