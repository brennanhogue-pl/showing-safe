"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Shield, User, LogOut, LayoutDashboard, Menu, X, FileText } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Don't show navbar on auth pages or dashboard pages
  if (pathname?.startsWith("/auth/") || pathname?.startsWith("/dashboard/")) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const getDashboardPath = () => {
    if (!profile) return "/dashboard";
    return profile.role === "admin"
      ? "/dashboard/admin"
      : profile.role === "agent"
      ? "/dashboard/agent"
      : "/dashboard/homeowner";
  };

  const getDashboardMenuItems = () => {
    if (!profile) return [];

    const basePath = getDashboardPath();

    // For homeowner role, return all three menu items
    if (profile.role === "homeowner") {
      return [
        {
          title: "Dashboard",
          icon: LayoutDashboard,
          url: basePath,
        },
        {
          title: "Policies",
          icon: Shield,
          url: `${basePath}/policies`,
        },
        {
          title: "Claims",
          icon: FileText,
          url: `${basePath}/claims`,
        },
      ];
    }

    // For other roles, just return dashboard for now
    return [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: basePath,
      },
    ];
  };

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Shield className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ShowingSafe</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {user && profile ? (
              <>
                {/* Dashboard Link */}
                <Button
                  variant="ghost"
                  onClick={() => router.push(getDashboardPath())}
                  className="flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <User className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{profile.full_name || "User"}</p>
                        <p className="text-xs text-muted-foreground">{profile.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          Role: {profile.role}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => router.push(getDashboardPath())}
                      className="cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/auth/login")}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push("/auth/register")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-[280px] p-0">
            <div className="flex flex-col h-full">
              {/* Header */}
              <SheetHeader className="border-b px-6 py-4 text-left">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <SheetTitle className="text-lg font-bold">ShowingSafe</SheetTitle>
                    <p className="text-xs text-muted-foreground">
                      {profile?.role === "homeowner" ? "Homeowner Portal" : "Portal"}
                    </p>
                  </div>
                </div>
              </SheetHeader>

              {/* Content */}
              <div className="flex-1 overflow-y-auto py-4">
                {user && profile ? (
                  <div className="flex flex-col gap-1 px-3">
                    {/* Navigation Links */}
                    {getDashboardMenuItems().map((item) => (
                      <Button
                        key={item.title}
                        variant={pathname === item.url ? "secondary" : "ghost"}
                        onClick={() => {
                          router.push(item.url);
                          setMobileMenuOpen(false);
                        }}
                        className="justify-start gap-3 h-11"
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 px-3">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        router.push("/auth/login");
                        setMobileMenuOpen(false);
                      }}
                      className="justify-start"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        router.push("/auth/register");
                        setMobileMenuOpen(false);
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>

              {/* Footer - User Info & Sign Out */}
              {user && profile && (
                <div className="border-t">
                  {/* User Info */}
                  <div className="px-6 py-3 border-b">
                    <p className="text-sm font-medium">{profile.full_name || "User"}</p>
                    <p className="text-xs text-muted-foreground">{profile.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      Role: {profile.role}
                    </p>
                  </div>

                  {/* Sign Out Button */}
                  <div className="p-3">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="justify-start gap-3 text-red-600 w-full h-11"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
