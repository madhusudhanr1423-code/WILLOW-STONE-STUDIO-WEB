import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Flower2, LogOut, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Tips" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { session, role, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    setOpen(false);
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Flower2 className="size-5" />
          </span>
          <span className="truncate font-display text-lg font-semibold sm:text-xl">
            Willow &amp; Stone
          </span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-secondary text-secondary-foreground" }}
              className="rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              {item.label}
            </Link>
          ))}

          {session && role === "owner" ? (
            <Link
              to="/admin"
              className="ml-1 flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              <LayoutDashboard className="size-4" /> Dashboard
            </Link>
          ) : session ? (
            <Link
              to="/my-bookings"
              className="ml-1 flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              <User className="size-4" /> My bookings
            </Link>
          ) : (
            <Link
              to="/login"
              className="ml-1 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
            >
              Log in
            </Link>
          )}

          {session && (
            <Button variant="ghost" size="icon" className="rounded-lg" onClick={handleLogout} aria-label="Log out">
              <LogOut className="size-4" />
            </Button>
          )}

          <Button asChild size="sm" className="ml-1 rounded-lg">
            <Link to="/book">Book now</Link>
          </Button>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-lg xl:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[min(20rem,85vw)]">
            <SheetTitle className="font-display text-lg">Menu</SheetTitle>
            <nav className="mt-6 flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: item.to === "/" }}
                  activeProps={{ className: "bg-secondary text-secondary-foreground" }}
                  className="rounded-lg px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary"
                >
                  {item.label}
                </Link>
              ))}

              <div className="my-1 border-t border-border/70" />

              {session && role === "owner" ? (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary"
                >
                  <LayoutDashboard className="size-4" /> Dashboard
                </Link>
              ) : session ? (
                <Link
                  to="/my-bookings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary"
                >
                  <User className="size-4" /> My bookings
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary"
                >
                  Log in
                </Link>
              )}

              {session && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg px-3 py-3 text-left text-base font-medium text-muted-foreground transition-colors hover:bg-secondary"
                >
                  <LogOut className="size-4" /> Log out
                </button>
              )}

              <Button asChild className="mt-2 w-full rounded-lg">
                <Link to="/book" onClick={() => setOpen(false)}>
                  Book an appointment
                </Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-secondary/40">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 text-sm sm:grid-cols-3 sm:px-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Flower2 className="size-4" />
            </span>
            <span className="font-display text-base font-semibold text-foreground">
              Willow &amp; Stone
            </span>
          </div>
          <p className="mt-3 max-w-xs text-muted-foreground">
            Personalised massage therapy and bodywork in a calm, unhurried studio.
          </p>
        </div>

        <div>
          <p className="font-medium text-foreground">Explore</p>
          <nav className="mt-3 flex flex-col gap-2 text-muted-foreground">
            <Link to="/about" className="w-fit hover:text-foreground">About</Link>
            <Link to="/services" className="w-fit hover:text-foreground">Services</Link>
            <Link to="/gallery" className="w-fit hover:text-foreground">Gallery</Link>
            <Link to="/blog" className="w-fit hover:text-foreground">Wellness tips</Link>
            <Link to="/contact" className="w-fit hover:text-foreground">Contact</Link>
            <Link to="/book" className="w-fit hover:text-foreground">Book an appointment</Link>
          </nav>
        </div>

        <div className="text-muted-foreground">
          <p className="font-medium text-foreground">Visit or reach us</p>
          <p className="mt-3">123 Example Street, Suite 4</p>
          <p>Open Monday to Friday, 9:00 AM – 5:00 PM</p>
          <p className="mt-2">
            <a href="tel:+15551234567" className="hover:text-foreground">(555) 123-4567</a>
          </p>
          <p>
            <a href="mailto:hello@willowandstone.example" className="hover:text-foreground">
              hello@willowandstone.example
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-border/70 px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
        &copy; {new Date().getFullYear()} Willow &amp; Stone Studio. All rights reserved.
        <span className="block sm:inline sm:before:content-['_·_']">
          A fictional business built as a portfolio demo — not a real company.
        </span>
      </div>
    </footer>
  );
}