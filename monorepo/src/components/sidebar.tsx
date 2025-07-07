'use client';

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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Home,
  Users,
  Settings,
  FileText,
  BarChart3,
  Mail,
  Calendar,
  Search,
  Bell,
  User,
  ChevronRight,
  ChevronLeft,
  LogOut,
  HelpCircle,
  BatteryPlusIcon,
} from "lucide-react"

import { useAccount, useChainId } from "wagmi";

import { Button } from "@/components/ui/button"

const mainNavItems = [
  {
    title: "Coin explorer",
    icon: Home,
    url: "/coin-explorer",
  },
  {
    title: "Users",
    icon: Users,
    url: "/users",
    items: [
      { title: "Your Profile", url: "/profile" },
      { title: "User Profile Search", url: "/users/new" },
      { title: "User Roles", url: "/users/roles" },
    ],
  },
  {
    title: "Coins",
    icon: FileText,
    url: "/coin",
    items: [
      { title: "Explore coins", url: "/coin" },
      { title: "Create coin", url: "/create-coin" },
    ],
  },
  {
    title: "Tokebot",
    icon: BatteryPlusIcon,
    url: "/chatbot",
    items: [
      { title: "Chatbot Sonnet", url: "/chatbot" },
      { title: "Yap coin", url: "/create-coin" },
    ],
  },
  {
    title: "Messages",
    icon: Mail,
    url: "/messages",
    badge: "12",
  },
]

const quickActions = [
  {
    title: "Search",
    icon: Search,
    url: "/search",
  },
  {
    title: "Notifications",
    icon: Bell,
    url: "/notifications",
    badge: "3",
  },
  {
    title: "Help Center",
    icon: HelpCircle,
    url: "/help",
  },
]

export function AppSidebar() {
  const { open, toggleSidebar } = useSidebar()
  const {address} = useAccount();
  const chainId = useChainId();


  return (
    <div className="relative">
      <Sidebar>
        {/* <SidebarHeader className="border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold"><img src="/tokonomy-logo.png" alt="Tokonomy Logo" /></span>
            </div>
            <span className="text-lg font-semibold">Tokonomy</span>
          </div>
        </SidebarHeader> */}

        <SidebarContent className="px-4 py-4">
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mainNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                            {item.badge}
                          </span>
                        )}
                        {item.items && <ChevronRight className="ml-auto h-4 w-4" />}
                      </a>
                    </SidebarMenuButton>
                    {item.items && (
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Quick Actions */}
          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickActions.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">
                            {item.badge}
                          </span>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="h-auto p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{address ? address : "Connect Wallet"}</p>
                    <p className="text-xs text-muted-foreground">{chainId ? `Chain ID: ${chainId}` : ""}</p>
                    <p className="text-xs text-muted-foreground"> (Advisable chain: Base mainnet)</p>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/settings" className="flex items-center gap-3">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button className="flex w-full items-center gap-3 text-destructive">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      
      <Button
        variant="outline"
        size="sm"
        className="absolute -right-3 top-1/2 z-10 h-6 w-6 -translate-y-1/2 rounded-full border bg-background p-0 shadow-md hover:bg-accent"
        onClick={toggleSidebar}
      >
        {open ? (
          <ChevronLeft className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
      </Button>
    </div>
  )
}