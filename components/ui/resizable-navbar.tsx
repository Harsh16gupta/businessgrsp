"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX, IconUser, IconUserCheck, IconSearch, IconBuilding, IconTool } from "@tabler/icons-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
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
  icon?: React.ReactNode;
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
          ? "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20"
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
          <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900" />
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
      console.log('Searching for:', searchQuery);
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
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsSearchOpen(true)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200",
          "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-950/30",
          "border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
        )}
      >
        <IconSearch className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:block">Search</span>
      </motion.button>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 p-2"
          >
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="flex-1 relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search services, workers..."
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium"
              >
                Go
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// User Menu Component - Simplified with only one login button
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
      <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors text-gray-600 dark:text-gray-300"
        >
          Logout
        </button>
      </div>
    );
  }

  // Single login button
  return (
    <Link
      href="/login"
      className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium transition-all duration-200 hover:scale-105 shadow-sm"
    >
      Login
    </Link>
  );
}

// Navbar Logo Component
export const NavbarLogo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 px-2 py-1 group"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center space-x-2"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-lg">G</span>
        </div>
        <span className="font-medium text-black dark:text-white text-xl">GRS WORKER BUSINESS</span>
      </motion.div>
    </Link>
  );
};

// NavItems Component
export const NavItems = ({ items, className, onItemClick }: any) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "flex flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-gray-600 dark:text-gray-300",
        className,
      )}
    >
      {items.map((item: NavItem, idx: number) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-4 py-2 flex items-center gap-2 transition-colors duration-200 hover:text-gray-900 dark:hover:text-white"
          key={`link-${idx}`}
          href={item.link}
        >
          {hovered === idx && (
            <motion.div
              layoutId="hovered"
              className="absolute inset-0 h-full w-full rounded-full bg-blue-50 dark:bg-blue-950/30"
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            />
          )}
          <span className="relative z-20 flex items-center gap-2 font-medium">
            {item.icon}
            {item.name}
          </span>
        </a>
      ))}
    </motion.div>
  );
};

// Mobile Nav Toggle Component
export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex items-center justify-center w-10 h-10 transition-all text-gray-600 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30"
    >
      {isOpen ? (
        <IconX className="w-5 h-5" />
      ) : (
        <IconMenu2 className="w-5 h-5" />
      )}
    </motion.button>
  );
};

// Main Navbar Component using your existing structure
export function MainNavbar() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Updated nav items with business and services sections
  const navItems: NavItem[] = [
    { 
      name: "For Business", 
      link: "/business",
      icon: <IconBuilding className="w-4 h-4" />
    },
    { 
      name: "Services", 
      link: "/services",
      icon: <IconTool className="w-4 h-4" />
    },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
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
    <Navbar>
      <NavBody visible={visible}>
        <NavbarLogo />
        
        {/* Location Search */}
        <div className="flex-1 max-w-md mx-8">
          <LocationSearch
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
            placeholder="Enter your location"
          />
        </div>

        <NavItems items={navItems} />
        
        <div className="flex items-center gap-4">
          <NavbarSearch />
          <UserStatusIndicator />
          <UserMenu />
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav visible={visible}>
        <MobileNavHeader>
          <NavbarLogo />
          <div className="flex items-center gap-3">
            <NavbarSearch />
            <UserStatusIndicator />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
          {/* Location Search for Mobile */}
          <div className="w-full pb-4 border-b border-gray-200 dark:border-gray-700">
            <LocationSearch
              onLocationSelect={handleLocationSelect}
              selectedLocation={selectedLocation}
              placeholder="Enter your location"
            />
          </div>

          {/* Navigation Items */}
          <div className="w-full space-y-2">
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={handleItemClick}
                className="flex items-center gap-3 py-3 px-4 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors duration-200 w-full"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Menu for Mobile */}
          <div className="w-full pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-3">
              <UserMenu />
            </div>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

// Your existing component exports (keep these as they are)
export const Navbar = ({ children, className }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      className={cn("sticky inset-x-0 top-0 z-40 w-full", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible },
            )
          : child,
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: any) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "40%" : "100%",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      style={{
        minWidth: "800px",
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 lg:flex dark:bg-transparent",
        visible && "bg-white/80 dark:bg-gray-950/80",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: any) => {
  return (
    <motion.div
      animate={{
        backdropFilter: visible ? "blur(10px)" : "none",
        boxShadow: visible
          ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
          : "none",
        width: visible ? "90%" : "100%",
        paddingRight: visible ? "12px" : "0px",
        paddingLeft: visible ? "12px" : "0px",
        borderRadius: visible ? "4px" : "2rem",
        y: visible ? 20 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 50,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-0 py-2 lg:hidden",
        visible && "bg-white/80 dark:bg-gray-950/80",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: any) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
  onClose,
}: any) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "absolute inset-x-0 top-16 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-lg bg-white dark:bg-gray-900 px-4 py-8 shadow-xl border border-gray-200 dark:border-gray-700",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};