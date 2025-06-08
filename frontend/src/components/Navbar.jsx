import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = (
    <>
      <Link to="/" className="hover:text-primary transition">
        Home
      </Link>
      {user && (
        <Link to="/dashboard" className="hover:text-primary transition">
          Dashboard
        </Link>
      )}
      <Link to="/contact" className="hover:text-primary transition">
        Contact
      </Link>
    </>
  );

  return (
    <nav className="bg-white shadow-sm px-4 py-3 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-primary">
          EventMVP
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks}
          {user ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none text-muted-foreground"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden mt-3 px-4 flex flex-col gap-3 text-sm font-medium">
          {navLinks}
          {user ? (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
