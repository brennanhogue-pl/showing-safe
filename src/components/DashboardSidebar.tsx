"use client";

import { usePathname, useRouter } from "next/navigation";
import { Shield, FileText, LogOut, User, LayoutDashboard, Users, Mail, BarChart3, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/login");
  };

  // Determine menu items based on user role
  const isAgent = profile?.role === "agent";
  const isAdmin = profile?.role === "admin";

  const menuItems = isAdmin
    ? [
        {
          title: "Overview",
          icon: LayoutDashboard,
          url: "/dashboard/admin",
        },
        {
          title: "Users",
          icon: Users,
          url: "/dashboard/admin/users",
        },
        {
          title: "Invitations",
          icon: Mail,
          url: "/dashboard/admin/invites",
        },
        {
          title: "Policies",
          icon: Shield,
          url: "/dashboard/admin/policies",
        },
        {
          title: "Claims",
          icon: FileText,
          url: "/dashboard/admin/claims",
        },
        {
          title: "Reports",
          icon: BarChart3,
          url: "/dashboard/admin/reports",
        },
        {
          title: "Settings",
          icon: Settings,
          url: "/dashboard/admin/settings",
        },
      ]
    : isAgent
    ? [
        {
          title: "Dashboard",
          icon: LayoutDashboard,
          url: "/dashboard/agent",
        },
        {
          title: "Subscription",
          icon: Shield,
          url: "/dashboard/agent",
        },
        {
          title: "Protected Listings",
          icon: Shield,
          url: "/dashboard/agent/listings",
        },
        {
          title: "Claims",
          icon: FileText,
          url: "/dashboard/agent/claims",
        },
      ]
    : [
        {
          title: "Dashboard",
          icon: LayoutDashboard,
          url: "/dashboard/homeowner",
        },
        {
          title: "Policies",
          icon: Shield,
          url: "/dashboard/homeowner/policies",
        },
        {
          title: "Claims",
          icon: FileText,
          url: "/dashboard/homeowner/claims",
        },
      ];

  const portalTitle = isAdmin ? "Admin Portal" : isAgent ? "Agent Portal" : "Homeowner Portal";

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">ShowingSafe</h2>
            <p className="text-xs text-muted-foreground">{portalTitle}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                  >
                    <a href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="flex items-center gap-2 px-2 py-1.5">
                <div className="p-1.5 bg-gray-100 rounded-full">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {profile?.full_name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {profile?.email}
                  </p>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
