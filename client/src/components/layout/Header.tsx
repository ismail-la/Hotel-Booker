import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { HotelIcon, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Header() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Get user initials for avatar
  const getInitials = () => {
    if (!user) return "G";
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-heading font-bold text-primary text-xl">
          <HotelIcon className="h-6 w-6" />
          <span>StayEase</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className={`font-medium ${location === '/' ? 'text-primary' : 'text-neutral-600 hover:text-primary transition-colors'}`}>
            Home
          </Link>
          <Link href="/hotels" className={`font-medium ${location === '/hotels' ? 'text-primary' : 'text-neutral-600 hover:text-primary transition-colors'}`}>
            Hotels
          </Link>
          {user && (
            <Link href="/dashboard" className={`font-medium ${location === '/dashboard' ? 'text-primary' : 'text-neutral-600 hover:text-primary transition-colors'}`}>
              My Bookings
            </Link>
          )}
          {user && user.isAdmin && (
            <Link href="/admin" className={`font-medium ${location === '/admin' ? 'text-primary' : 'text-neutral-600 hover:text-primary transition-colors'}`}>
              Admin
            </Link>
          )}
        </nav>

        {/* Desktop Auth Buttons/User Menu */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-white">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">My Bookings</Link>
                </DropdownMenuItem>
                {user.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth?mode=login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/auth?mode=register">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-neutral-800 focus:outline-none" 
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-4 border-t">
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            <Link href="/" className={`py-2 font-medium ${location === '/' ? 'text-primary' : 'text-neutral-600'}`} onClick={closeMobileMenu}>
              Home
            </Link>
            <Link href="/hotels" className={`py-2 font-medium ${location === '/hotels' ? 'text-primary' : 'text-neutral-600'}`} onClick={closeMobileMenu}>
              Hotels
            </Link>
            {user && (
              <Link href="/dashboard" className={`py-2 font-medium ${location === '/dashboard' ? 'text-primary' : 'text-neutral-600'}`} onClick={closeMobileMenu}>
                My Bookings
              </Link>
            )}
            {user && user.isAdmin && (
              <Link href="/admin" className={`py-2 font-medium ${location === '/admin' ? 'text-primary' : 'text-neutral-600'}`} onClick={closeMobileMenu}>
                Admin
              </Link>
            )}
            <div className="pt-2 flex flex-col space-y-3">
              {user ? (
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                >
                  Log Out
                </Button>
              ) : (
                <>
                  <Link href="/auth?mode=login" onClick={closeMobileMenu}>
                    <Button variant="outline" className="w-full">Log In</Button>
                  </Link>
                  <Link href="/auth?mode=register" onClick={closeMobileMenu}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
