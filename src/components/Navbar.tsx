import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, X, Home, BarChart2, Search, User, BriefcaseIcon, 
  FileText, LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const routes = [
    { name: "Home", path: "/", icon: Home },
    { name: "Job Swipe", path: "/job-swipe", icon: Search },
    { name: "Dashboard", path: "/dashboard", icon: BarChart2 },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2"
            >
              <BriefcaseIcon className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold">TyranAI</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {routes.map((route) => (
              <Link key={route.path} to={route.path}>
                <Button 
                  variant={isActive(route.path) ? "default" : "ghost"} 
                  className={`flex items-center space-x-2 ${isActive(route.path) ? '' : 'hover:bg-secondary'}`}
                >
                  <route.icon className="h-4 w-4" />
                  <span>{route.name}</span>
                </Button>
              </Link>
            ))}
            <Button className="ml-4 bg-accent hover:bg-accent/90 gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="pt-2 pb-4 space-y-1 px-4 sm:px-6">
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                onClick={() => setIsOpen(false)}
                className={`${
                  isActive(route.path)
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                } flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors`}
              >
                <route.icon className="h-5 w-5" />
                <span>{route.name}</span>
              </Link>
            ))}
            <Button 
              className="w-full mt-4 bg-accent hover:bg-accent/90 gap-2"
              onClick={() => setIsOpen(false)}
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
