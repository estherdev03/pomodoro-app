"use client";
import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { logoutUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { hasToken } from "@/lib/utils";

export default function Navbar() {
  const { loggedIn, setLoggedIn } = useAuthStore();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const isToken = await hasToken();
      setLoggedIn(isToken);
    };
    checkLoggedIn();
  }, []);

  const handleLogout = async () => {
    Cookie.remove("access_token");
    setLoggedIn(false);
    await logoutUser();
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800 ">
          AI Pomodoro
        </Link>
        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="text-gray-700 hover:text-gray-600">
            Home
          </Link>
          {loggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-gray-600"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="text-gray-700 hover:text-gray-600"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-gray-600 focus:outline-none"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="text-gray-700 hover:text-gray-600"
              >
                Register
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-gray-600">
                Login
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-800 focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 pb-4">
          <Link href="/" className="block text-gray-700 hover:text-gray-600">
            Home
          </Link>
          {loggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="block text-gray-700 hover:text-gray-600"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="block text-gray-700 hover:text-gray-600"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block text-gray-700 hover:text-gray-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="block text-gray-700 hover:text-gray-600"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="block text-gray-700 hover:text-gray-600"
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
