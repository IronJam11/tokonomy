'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { ModeToggle } from "@/components/buttons/toggleThemeButton"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import Image from "next/image"
import { useSidebar } from "@/components/ui/sidebar"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { WEBSITE_LOGO_PATH as LOGO_PATH, WEBSITE_NAME, WEBSITE_TITLE_FONT as WEBSITE_FONT } from "@/utils/constants/navbar-constants"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { href: "/docs", label: "Documentation" },
  ];

  const serviceItems = [
    {
      href: "/create-coin",
      title: "Create a coin",
      description: "Tokenise digital content"
    },
    {
      href: "/chatbot",
      title: "Tokebot Sonnet",
      description: "Talk to ai agent"
    },
    {
      href: "/moodbot",
      title: "Tokebot Mood",
      description: "Tokenise your thoughts"
    },
    {
      href: "/profile",
      title: "Profile",
      description: "View your profile"
    },
    {
      href: "/coin",
      title: "Coins",
      description: "Search for your favorite coins"
    },
     {
      href: "/coin-explorer",
      title: "Coin Explorer",
      description: "Discover and trade new coins"
    },
  ];

  return (
    <nav className="sticky top-0 h-18 w-full border-b bg-background z-50">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-3">
          <Link href="/" className="flex items-center space-x-2 md:space-x-3">
            <Image 
              src={LOGO_PATH} 
              alt="Logo" 
              width={120} 
              height={120}
              className="w-12 h-12 md:w-20 md:h-20"
            />
            <span className={`text-2xl md:text-4xl text-foreground font-bold ${WEBSITE_FONT} hidden sm:block`}>
              {WEBSITE_NAME}
            </span>
          </Link>
        </div>
        <div className="hidden lg:flex flex-1 items-center justify-end gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link 
                      href={item.href} 
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}

              <NavigationMenuItem>
                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                    {serviceItems.map((service) => (
                      <NavigationMenuLink key={service.href} asChild>
                        <Link
                          href={service.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{service.title}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {service.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="hidden md:block">
            <ConnectButton />
          </div>
          
          <ModeToggle />
        </div>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden flex-1 items-center justify-end gap-2">
          <div className="md:hidden">
            <ConnectButton />
          </div>
          <div className="hidden md:block">
            <ConnectButton />
          </div>
          <ModeToggle />
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col space-y-4 mt-4">
                <Link
                  href="/"
                  className="flex items-center space-x-2 pb-4 border-b"
                  onClick={() => setIsOpen(false)}
                >
                  <Image 
                    src={LOGO_PATH} 
                    alt="Logo" 
                    width={40} 
                    height={40}
                    className="w-10 h-10"
                  />
                  <span className={`text-xl text-foreground font-bold ${WEBSITE_FONT}`}>
                    {WEBSITE_NAME}
                  </span>
                </Link>
                
                <div className="flex flex-col space-y-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  <div className="pt-2 border-t">
                    <div className="text-sm font-medium text-muted-foreground px-3 py-2">
                      Services
                    </div>
                    {serviceItems.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="block px-6 py-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="font-medium">{service.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {service.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}