import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dumbbell, Menu, BarChart3, Archive, Library, Plus } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/workout-creator", label: "Krijo Plan", icon: Plus },
    { href: "/exercise-library", label: "Biblioteka", icon: Library },
    { href: "/statistics", label: "Statistikat", icon: BarChart3 },
    { href: "/history", label: "Histori", icon: Archive },
  ];

  const NavLinks = ({ mobile = false }) => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={`${mobile ? "w-full justify-start" : ""} ${
                isActive ? "bg-primary text-white" : "text-neutral-medium hover:text-primary"
              }`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </>
  );

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <div className="bg-primary text-white rounded-lg p-2">
                <Dumbbell className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-dark">FitTime</h1>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-2">
            <NavLinks />
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  <NavLinks mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
