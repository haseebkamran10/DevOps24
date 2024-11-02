import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function SubmitTicketComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", { name, email, message });
    // Reset form fields
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center space-y-4 w-8/12 mx-auto text-foreground"
    >
      <h2 className="text-2xl font-semibold">Submit a Ticket</h2>
      <Input
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Textarea
        placeholder="How can we help you?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <Button type="submit">Submit Ticket</Button>
    </form>
  );
}
