import { Link, useNavigate } from "react-router-dom";
import { LogOut, PenSquare,  Menu } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 glassmorphism border-b border-white/10 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gradient tracking-tighter hover:opacity-80 transition-opacity">
          BlogDev
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-white transition-colors">
            Feed
          </Link>
          {user ? (
            <div className="flex items-center gap-6">
              <Link to="/create" className="flex items-center gap-2 text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-white/90 transition-all">
                <PenSquare size={16} />
                Write
              </Link>
              <div className="flex items-center gap-3 pl-6 border-l border-white/10">
                <span className="text-sm font-medium">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-white/5 rounded-full text-muted-foreground hover:text-destructive transition-all"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-white/90 transition-all">
                Get Started
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden p-2 hover:bg-white/5 rounded-lg">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
