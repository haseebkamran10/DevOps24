import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Menu } from "lucide-react";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { getUserByPhoneNumber } from "../services/UserService";
import { endSession } from "../services/SessionService"; 
import navItems from "./navItems";

const NavigationMenu = () => {
  const [userName, setUserName] = useState("Guest");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const phoneNumber = localStorage.getItem("phoneNumber"); 
        if (!phoneNumber) {
          throw new Error("No phone number found. Please log in again.");
        }

        const user = await getUserByPhoneNumber(phoneNumber); 
        setUserName(`${user.firstName} ${user.lastName}`);
        setUserAvatar(null); 
      } catch (error: any) {
        console.error("Failed to fetch user details:", error.message);
        setUserName("Guest");
      }
    };

    fetchUserDetails();
  }, []);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY < 0) return;

    if (currentScrollY > lastScrollY) {
      setIsVisible(false);
    } else if (currentScrollY < lastScrollY) {
      setIsVisible(true); 
    }

    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    const debounceScroll = () => {
      window.removeEventListener("scroll", handleScroll);
      window.addEventListener("scroll", handleScroll);
    };
    debounceScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);


  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
   
    localStorage.removeItem("sessionId");
    localStorage.removeItem("phoneNumber");
    setUserName("Guest");
    setUserAvatar(null);
    navigate("/"); 
    try {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        throw new Error("No session ID found. Please log in again.");
      }

      await endSession(sessionId);
      console.log("Session ended successfully.");


    } catch (error: any) {
      console.error("Error ending session:", error.message);
    }
  };

  return (
    <nav
      className={`sticky top-0 w-screen z-50 transition-transform duration-300 ${
        isVisible ? "transform translate-y-0" : "transform -translate-y-full"
      }`}
    >
      <div className="flex h-16 items-center px-4">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="text-2xl font-bold">KunstHavn</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <div key={item.name} className="relative group">
              <Link
                to={item.href}
                className="text-base text-popover-foreground hover:text-gray-900"
              >
                {item.name}
              </Link>
              {item.subItems && (
                <div className="absolute -left-16 mt-0 w-48 rounded-md text-sm shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition ease-out duration-200">
                  <div className="py-1" role="menu">
                    {item.subItems.map((subItem) => (
                      <HashLink
                        key={subItem.name}
                        to={subItem.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        {subItem.name}
                      </HashLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* User Section */}
        <div className="ml-auto flex items-center space-x-4">
          {userName !== "Guest" ? (
            <div className="flex items-center space-x-4">
              <Avatar onClick={() => navigate("/profile")} className="cursor-pointer">
                {userAvatar ? (
                  <AvatarImage src="/Frontend/src/assets/batman.png" alt={userName} />
                ) : (
                  <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                )}
              </Avatar>
              <span className="text-base font-medium">Welcome, {userName}</span>
              <Button variant="ghost" onClick={handleLogout}>
                Log out
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="hidden md:inline-flex"
              onClick={handleLoginClick}
            >
              Log in
            </Button>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        <div className="md:hidden ml-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              style={{
                top: 0,
                maxHeight: "100vh",
                overflowY: "auto",
                position: "fixed",
              }}
            >
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <React.Fragment key={item.name}>
                    <Link to={item.href} className="text-lg font-medium">
                      {item.name}
                    </Link>
                    {item.subItems && (
                      <div className="ml-4 flex flex-col space-y-2">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="text-sm text-gray-600"
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                ))}
                {userName !== "Guest" ? (
                  <Button variant="ghost" onClick={handleLogout}>
                    Log out
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={handleLoginClick}>
                    Log in
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default NavigationMenu;
