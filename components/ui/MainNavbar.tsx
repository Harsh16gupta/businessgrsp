"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { IconMenu2, IconX, IconUser, IconUserCheck, IconSearch } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { LocationSearch } from "./LocationSearch";

// Types
interface User {
  id: string;
  phone: string;
  name: string;
  role: 'USER' | 'WORKER' | 'ADMIN';
  isVerified: boolean;
}

interface NavItem {
  name: string;
  link: string;
}

interface Location {
  id: string;
  name: string;
  address: string;
  type: 'current' | 'saved';
}

// User Status Indicator Component
function UserStatusIndicator() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
    );
  }

  return (
    <Link
      href={user ? (user.role === 'WORKER' ? '/worker/dashboard' : '/business/dashboard') : '/login'}
      className="relative block"
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 hover:scale-110",
        user
          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
          : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
      )}>
        {user ? (
          <IconUserCheck className="w-4 h-4" />
        ) : (
          <IconUser className="w-4 h-4" />
        )}
      </div>

      {/* Online indicator dot */}
      {user && (
        <div className="absolute -top-1 -right-1">
          <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-background" />
        </div>
      )}
    </Link>
  );
}

// Navbar Search Component
function NavbarSearch() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search logic here
      console.log('Searching for:', searchQuery);
      // Redirect to search results page or perform search
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className="relative">
      {/* Search Button - Visible on desktop */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsSearchOpen(true)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
          "text-foreground/70 hover:text-foreground hover:bg-accent/50",
          "border border-transparent hover:border-border"
        )}
      >
        <IconSearch className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:block">Search</span>
      </motion.button>

      {/* Expanded Search Bar - Appears when clicked */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-xl z-50 p-2"
          >
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="flex-1 relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services, providers..."
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                size="sm"
                className="rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200"
              >
                Search
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// User Menu Component
function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-sm rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105"
      >
        <Link href="/login?action=register">Sign Up as User</Link>
      </Button>

      <Button
        size="sm"
        className="rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-200 hover:scale-105"
      >
        <Link href="/worker-register">Sign Up as Worker</Link>
      </Button>
    </div>
  );
}

// Navbar Logo Component
function NavbarLogo() {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 px-2 py-1 group"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center space-x-2"
      >

        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">G</span>
        </div>
        <span className="text-xl font-bold text-foreground">GRSP</span>

      </motion.div>
    </Link>
  );
}

// NavItems Component
function NavItems({
  items,
  className,
  onItemClick
}: {
  items: NavItem[];
  className?: string;
  onItemClick?: () => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "flex flex-1 flex-row items-center justify-center space-x-1 text-sm font-medium",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-2 text-foreground/70 hover:text-foreground transition-colors duration-200 rounded-lg"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-lg bg-accent/50"
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            />
          )}
          <span className="relative z-20 font-medium">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
}

// Mobile Nav Toggle Component
function MobileNavToggle({
  isOpen,
  onClick
}: {
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center justify-center w-10 h-10 transition-all text-foreground rounded-lg hover:bg-accent/50"
    >
      {isOpen ? (
        <IconX className="w-5 h-5" />
      ) : (
        <IconMenu2 className="w-5 h-5" />
      )}
    </motion.button>
  );
}

// Main Navbar Component
export function MainNavbar() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const navItems: NavItem[] = [
    { name: "Services", link: "/services" },
    { name: "Features", link: "#features" },
    { name: "Testimonials", link: "#testimonials" },
  ];

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    // You can save the location to context/state management or localStorage
    localStorage.setItem('selectedLocation', JSON.stringify(location));
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 80) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  const handleItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full transition-all duration-300",
        visible
          ? "bg-background/90 backdrop-blur-xl border-b border-border/40 shadow-sm"
          : "bg-background/95 backdrop-blur-lg border-b border-border/20"
      )}
    >
      {/* Desktop Navigation */}
      <motion.div
        animate={{
          y: visible ? 0 : -10,
          opacity: visible ? 1 : 0.95,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 30,
        }}
        className={cn(
          "hidden lg:flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 mt-3",
        )}
      >
        <NavbarLogo />

        {/* Location Search in Navbar */}
        <div className="flex-1 max-w-xs mx-8">
          <LocationSearch
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
            placeholder="Select location"
          />
        </div>

        <NavItems items={navItems} />
        <div className="flex items-center gap-4">
          <NavbarSearch />
          <ThemeToggle />
          <UserStatusIndicator />
          <UserMenu />
        </div>
      </motion.div>

      {/* Mobile Navigation */}
      <div className="lg:hidden">
        <motion.div
          animate={{
            y: visible ? 0 : -10,
            opacity: visible ? 1 : 0.95,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 30,
          }}
          className="flex items-center justify-between w-full h-16 px-4 sm:px-6"
        >
          <NavbarLogo />
          <div className="flex items-center gap-3">
            <NavbarSearch />
            <UserStatusIndicator />
            <ThemeToggle />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-background/95 backdrop-blur-xl border-b border-border/40 overflow-hidden"
            >
              <div className="px-4 sm:px-6 py-6 space-y-6">
                {/* Location Search for Mobile */}
                <div className="pb-4 border-b border-border/40">
                  <LocationSearch
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={selectedLocation}
                    placeholder="Select your location"
                  />
                </div>

                {/* Search Bar for Mobile */}
                <div className="pb-4 border-b border-border/40">
                  <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search services..."
                        className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="sm"
                      className="rounded-lg bg-blue-600 hover:bg-blue-700"
                    >
                      Go
                    </Button>
                  </form>
                </div>

                {/* Navigation Items */}
                <div className="space-y-2">
                  {navItems.map((item, idx) => (
                    <Link
                      key={`mobile-link-${idx}`}
                      href={item.link}
                      onClick={handleItemClick}
                      className="block py-3 px-4 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* User Menu for Mobile */}
                <div className="pt-4 border-t border-border/40">
                  <div className="flex flex-col gap-3">
                    <UserMenu />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}