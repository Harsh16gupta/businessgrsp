"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState, useEffect, useRef } from "react";
import { 
  IconHome, 
  IconTool, 
  IconUser, 
  IconUserCheck, 
  IconSun, 
  IconMoon,
  IconLogin,
  IconLogout
} from "@tabler/icons-react";

// Types
interface User {
  id: string;
  phone: string;
  name: string;
  role: 'USER' | 'WORKER' | 'ADMIN';
  isVerified: boolean;
}

// Custom Button Component
function CustomButton({ 
  children, 
  variant = "primary", 
  className = "",
  onClick,
  ...props 
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "gradient";
  className?: string;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const baseStyles = "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2";
  
  const variantStyles = {
    primary: "bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700",
    secondary: "bg-transparent text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
    gradient: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-sm hover:shadow-md"
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

// Helper function for class names
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Theme Toggle Component
function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300",
        "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
        "border border-gray-200 dark:border-gray-700",
        "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white",
        "hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm",
        "hover:scale-105 active:scale-95"
      )}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <IconSun className="w-5 h-5" />
      ) : (
        <IconMoon className="w-5 h-5" />
      )}
    </button>
  );
}

// User Status Indicator Component
function UserStatusIndicator({ user }: { user: User | null }) {
  if (!user) {
    return (
      <a
        href="/login"
        className="relative block"
      >
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 hover:scale-110",
          "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
        )}>
          <IconUser className="w-4 h-4" />
        </div>
      </a>
    );
  }

  return (
    <a
      href={user.role === 'WORKER' ? '/worker/dashboard' : '/business/dashboard'}
      className="relative block"
    >
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 hover:scale-110",
        "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20"
      )}>
        <IconUserCheck className="w-4 h-4" />
      </div>

      {/* Online indicator dot */}
      <div className="absolute -top-1 -right-1">
        <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
      </div>
    </a>
  );
}

export function NavbarLanding() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasBackground, setHasBackground] = useState(false);
  const lastScrollY = useRef(0);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  // Updated nav items with proper home icon
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="w-4 h-4" />
    },
    {
      name: "Services",
      link: "/services",
      icon: <IconTool className="w-4 h-4" />
    },
  ];

  // Sync user state across all pages
  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    // Initial check
    updateUser();

    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        updateUser();
      }
    };

    // Listen for custom login/logout events
    const handleAuthChange = () => {
      updateUser();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);

    // Initialize theme from localStorage
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroSection = heroSectionRef.current;
      
      if (!heroSection) return;

      const heroSectionBottom = heroSection.offsetTop + heroSection.offsetHeight;

      // Check if we've scrolled past the hero section
      if (currentScrollY > heroSectionBottom) {
        setIsNavbarVisible(false);
        setHasBackground(false);
      } else {
        setIsNavbarVisible(true);
        
        // Handle background and collapse states
        if (currentScrollY > 50) {
          // Scrolled a bit - show background and handle collapse
          setHasBackground(true);
          
          if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            // Scrolling down - collapse
            setIsCollapsed(true);
          } else if (currentScrollY < lastScrollY.current) {
            // Scrolling up - expand
            setIsCollapsed(false);
          }
        } else {
          // At the very top - no background, expanded
          setHasBackground(false);
          setIsCollapsed(false);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    if (user) {
      // User is logged in - handle logout
      localStorage.removeItem('user');
      setUser(null);
      // Dispatch event to sync across tabs
      window.dispatchEvent(new Event('authChange'));
      window.location.href = '/';
    } else {
      // User is not logged in - redirect to login
      window.location.href = '/login';
    }
  };

  return (
    <>
      {/* Hero Section Reference */}
      <div ref={heroSectionRef} className="" />
      
      {/* Navbar */}
      <div 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
          isNavbarVisible 
            ? "translate-y-0 opacity-100" 
            : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 transition-all duration-500 ease-in-out",
            hasBackground && !isCollapsed
              ? "opacity-100 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50"
              : "opacity-0 backdrop-blur-none border-transparent"
          )}
        />

        <Navbar>
          {/* Desktop Navigation */}
          <NavBody visible={isCollapsed}>
            <NavbarLogo />
            <NavItems items={navItems} />
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <CustomButton 
                variant={user ? "secondary" : hasBackground ? "gradient" : "primary"}
                onClick={handleLoginClick}
                className="hidden sm:flex"
              >
                {user ? (
                  <>
                    <IconLogout className="w-4 h-4" />
                    Logout
                  </>
                ) : (
                  <>
                    <IconLogin className="w-4 h-4" />
                    Login
                  </>
                )}
              </CustomButton>
              <UserStatusIndicator user={user} />
            </div>
          </NavBody>

          {/* Mobile Navigation */}
          <MobileNav visible={isCollapsed}>
            <MobileNavHeader>
              <NavbarLogo />
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <UserStatusIndicator user={user} />
                <MobileNavToggle
                  isOpen={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
              </div>
            </MobileNavHeader>

            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              {/* Navigation Items */}
              <div className="w-full space-y-2">
                {navItems.map((item, idx) => (
                  <a
                    key={`mobile-link-${idx}`}
                    href={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors duration-200 w-full"
                  >
                    {item.icon}
                    {item.name}
                  </a>
                ))}
              </div>

              {/* User Info Section */}
              {user && (
                <div className="w-full pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <IconUserCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.role === 'WORKER' ? 'Professional' : 'Customer'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Theme Toggle for Mobile */}
              <div className="w-full pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    const isDark = document.documentElement.classList.contains('dark');
                    if (isDark) {
                      document.documentElement.classList.remove('dark');
                      localStorage.setItem('theme', 'light');
                    } else {
                      document.documentElement.classList.add('dark');
                      localStorage.setItem('theme', 'dark');
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 py-3 px-4 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors duration-200 w-full"
                >
                  <IconSun className="w-4 h-4 dark:hidden" />
                  <IconMoon className="w-4 h-4 hidden dark:block" />
                  <span>Toggle Theme</span>
                </button>
              </div>

              {/* Login/Logout Button for Mobile */}
              <div className="w-full pt-4 border-t border-gray-200 dark:border-gray-700">
                <CustomButton
                  onClick={() => {
                    handleLoginClick();
                    setIsMobileMenuOpen(false);
                  }}
                  variant={user ? "secondary" : "gradient"}
                  className="w-full justify-center"
                >
                  {user ? (
                    <>
                      <IconLogout className="w-4 h-4" />
                      Logout
                    </>
                  ) : (
                    <>
                      <IconLogin className="w-4 h-4" />
                      Login
                    </>
                  )}
                </CustomButton>
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
      </div>
    </>
  );
}