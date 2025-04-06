
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md px-6 py-12 bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold text-health-500 mb-6">404</h1>
        <p className="text-xl text-gray-800 mb-6">Oops! Page not found</p>
        <p className="text-gray-600 mb-8">
          We couldn't find the page you're looking for. The page might have been removed, renamed, or doesn't exist.
        </p>
        <Link to="/">
          <Button className="bg-health-500 hover:bg-health-600">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
