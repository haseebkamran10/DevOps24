import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from "@/components/ui/sheet";
import Spinner from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import Toast from "@/components/ui/toast";
import { describe, expect, it, vi } from "vitest";

describe("Component Tests", () => {
  // --- Button Tests ---
  describe("Button Component", () => {
    it("renders correctly with default props", () => {
      render(<Button>Click Me</Button>);
      const button = screen.getByRole("button", { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("bg-primary");
    });

    it("applies variant and size props", () => {
      render(<Button variant="destructive" size="lg">Delete</Button>);
      const button = screen.getByRole("button", { name: /delete/i });
      expect(button).toHaveClass("bg-destructive h-10 px-8");
    });

    it("handles clicks", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      const button = screen.getByRole("button", { name: /click me/i });
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // --- Card Tests ---
  describe("Card Component", () => {
    it("renders card with content", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Description")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
      expect(screen.getByText("Footer")).toBeInTheDocument();
    });
  });

  // --- Carousel Tests ---
 // Mocking useEmblaCarousel
vi.mock("embla-carousel-react", () => ({
  __esModule: true,
  default: vi.fn(),
  useEmblaCarousel: vi.fn(() => [vi.fn(), null]), // Mock the hook's return values
}));


  // --- Input Tests ---
  describe("Input Component", () => {
    it("renders input with placeholder", () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByPlaceholderText(/enter text/i);
      expect(input).toBeInTheDocument();
    });

    it("handles typing", () => {
      render(<Input placeholder="Type here" />);
      const input = screen.getByPlaceholderText(/type here/i);
      fireEvent.change(input, { target: { value: "Hello" } });
      expect(input).toHaveValue("Hello");
    });
  });

  // --- Sheet Tests ---
  describe("Sheet Component", () => {
    it("opens and closes the sheet", () => {
      render(
        <Sheet>
          <SheetTrigger>Open Sheet</SheetTrigger>
          <SheetContent>Sheet Content</SheetContent>
        </Sheet>
      );

      const trigger = screen.getByRole("button", { name: /open sheet/i });
      fireEvent.click(trigger);
      expect(screen.getByText("Sheet Content")).toBeInTheDocument();

      const closeButton = screen.getByRole("button", { name: /close/i });
      fireEvent.click(closeButton);
      expect(screen.queryByText("Sheet Content")).not.toBeInTheDocument();
    });
  });

  // --- Spinner Tests ---
  describe("Spinner Component", () => {
    it("renders spinner", () => {
      const { container } = render(<Spinner />);
      expect(container.querySelector(".animate-spin")).toBeInTheDocument();
    });
  });

  // --- Textarea Tests ---
  describe("Textarea Component", () => {
    it("renders textarea with placeholder", () => {
      render(<Textarea placeholder="Enter text" />);
      const textarea = screen.getByPlaceholderText(/enter text/i);
      expect(textarea).toBeInTheDocument();
    });

    it("handles typing", () => {
      render(<Textarea placeholder="Type here" />);
      const textarea = screen.getByPlaceholderText(/type here/i);
      fireEvent.change(textarea, { target: { value: "Hello" } });
      expect(textarea).toHaveValue("Hello");
    });
  });

  // --- Toast Tests ---
  describe("Toast Component", () => {
    it("renders toast with success message", () => {
      render(<Toast message="Success!" type="success" />);
      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass("bg-green-100");
    });
    
    it("renders toast with error message", () => {
      render(<Toast message="Error occurred!" type="error" />);
      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveClass("bg-red-100");
    });
    
  });
});
