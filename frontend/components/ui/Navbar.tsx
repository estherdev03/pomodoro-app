"use client";
import { useAuthStore } from "@/lib/store/authStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { logoutUser } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, Timer, LogOut, User, LayoutDashboard } from "lucide-react";
import { hasToken } from "@/lib/utils";

const navLink =
  "text-slate-600 hover:text-indigo-600 font-medium transition-colors";
const navLinkActive = "text-indigo-600 font-semibold";

function getLinkClass(href: string, pathname: string, base = navLink): string {
  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");
  return `${base} ${isActive ? navLinkActive : ""}`.trim();
}

export default function Navbar() {
  const { loggedIn, setLoggedIn } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Skip check on OAuth callback so we don't overwrite setLoggedIn(true) with a stale false
    if (pathname === "/auth/callback") return;
    const checkLoggedIn = async () => {
      const isToken = await hasToken();
      // Don't overwrite with false right after OAuth (hasToken can be stale)
      if (typeof window !== "undefined" && sessionStorage.getItem("auth_just_logged_in")) {
        sessionStorage.removeItem("auth_just_logged_in");
        if (isToken) setLoggedIn(true);
        return;
      }
      setLoggedIn(isToken);
    };
    checkLoggedIn();
  }, [pathname, setLoggedIn]);

  const handleLogout = async () => {
    setLoggedIn(false);
    await logoutUser();
    router.push("/login");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-slate-800 hover:text-indigo-600 transition-colors"
        >
          <Timer className="w-6 h-6 text-indigo-500" />
          Pomodoro
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className={getLinkClass("/", pathname)}>
            Home
          </Link>
          {loggedIn ? (
            <>
              <Link href="/dashboard" className={`${getLinkClass("/dashboard", pathname)} flex items-center gap-1.5`}>
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/profile" className={`${getLinkClass("/profile", pathname)} flex items-center gap-1.5`}>
                <User className="w-4 h-4" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className={`${navLink} flex items-center gap-1.5`}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/register" className={getLinkClass("/register", pathname)}>
                Register
              </Link>
              <Link
                href="/login"
                className={
                  pathname === "/login"
                    ? "px-4 py-2 rounded-lg bg-indigo-700 text-white font-semibold"
                    : "px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                }
              >
                Login
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 py-4 space-y-2 border-t border-slate-100 bg-white">
          <Link href="/" className={`block py-2 ${getLinkClass("/", pathname)}`} onClick={() => setIsOpen(false)}>
            Home
          </Link>
          {loggedIn ? (
            <>
              <Link href="/dashboard" className={`block py-2 ${getLinkClass("/dashboard", pathname)}`} onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
              <Link href="/profile" className={`block py-2 ${getLinkClass("/profile", pathname)}`} onClick={() => setIsOpen(false)}>
                Profile
              </Link>
              <button onClick={handleLogout} className={`block py-2 w-full text-left ${navLink}`}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/register" className={`block py-2 ${getLinkClass("/register", pathname)}`} onClick={() => setIsOpen(false)}>
                Register
              </Link>
              <Link href="/login" className={`block py-2 ${getLinkClass("/login", pathname)}`} onClick={() => setIsOpen(false)}>
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
