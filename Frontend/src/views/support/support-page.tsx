import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useScrollEffect from "@/lib/useScrollEffect";
import { useRef, useState } from "react";
import { ContactUsComponent } from "./contact-us";
import { SubmitTicketComponent } from "./submit-ticket";

export default function SupportPage() {
  const imageRef = useRef<HTMLImageElement>(null);
  const [opacity, setOpacity] = useState(0.6); // To control the opacity of the background image

  useScrollEffect(imageRef, setOpacity);

  return (
    <>
      <img
        ref={imageRef}
        src="support_banner.jpg"
        alt="Background"
        className="fixed inset-0 w-full h-dvh object-cover transition-transform duration-300"
        style={{ opacity }} // Bind the opacity state to the image
      />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-foreground">
        <div className=" py-20">
          <h1>Support Page</h1>
          <p>How can we help you?</p>
        </div>
        <div className=" py-80 px-3 min-w-72 max-w-72">
          <h1>FAQ</h1>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>How do i pay for an item?</AccordionTrigger>
              <AccordionContent>
                You will recieve and email with a payment link. Alternatively
                you can log in to your account and pay from there.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is it responsive?</AccordionTrigger>
              <AccordionContent>
                Yes. It is designed to work on all devices.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className=" py-80" id="contact">
          <h1>Contact Us</h1>
          <SubmitTicketComponent />
          <ContactUsComponent />
          <div className=" flex w-screen items-center justify-center space-x-20 space-y-5">
            <img
              src="costumer_rep1.png"
              alt="Costumer support Representative 1"
              className="w-1/4"
            />
            <img
              src="costumer_rep2.png"
              alt="Costumer support Representative 2"
              className="w-1/4 scale-90"
            />
          </div>
        </div>
      </div>
    </>
  );
}
