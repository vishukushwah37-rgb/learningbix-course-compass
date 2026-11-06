import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LayoutDashboard, LogOut, Menu, ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { homeForRoles, primaryRole, ROLE_LABEL } from "@/lib/roles";
import { PROGRAMS } from "@/data/programs";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const NAV = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Programs", to: "/programs", children: true },
  { label: "For Schools", to: "/school" },
  { label: "Franchise", to: "/franchisee" },
  { label: "Learning Center", to: "/learning-center" },
  { label: "BixCode", to: "/bixcode" },
  { label: "Shop", to: "/shop" },
  { label: "Contact Us", to: "/contact-us" },
] as const;

function isActive(pathname: string, to: string) {
  return to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);
}

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { count } = useCart();
  const { user, roles, profile, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setProgramsOpen(false);
  }, [pathname]);

  const role = primaryRole(roles);

  return (
    <header className={cn("sticky top-0 z-50 transition-all", scrolled ? "glass shadow-soft" : "bg-transparent")}>
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
        <Logo />

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
          {NAV.map((item) =>
            "children" in item ? (
              <div key={item.to} className="relative" onMouseEnter={() => setProgramsOpen(true)} onMouseLeave={() => setProgramsOpen(false)}>
                <Link
                  to="/programs"
                  className={cn("flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium transition-colors hover:text-primary", isActive(pathname, item.to) && "text-primary")}
                  aria-haspopup="true"
                  aria-expanded={programsOpen}
                  onFocus={() => setProgramsOpen(true)}
                >
                  {item.label}
                  <ChevronDown className={cn("size-3.5 transition-transform", programsOpen && "rotate-180")} />
                </Link>
                <AnimatePresence>
                  {programsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-1/2 top-full w-[34rem] -translate-x-1/2 pt-3"
                    >
                      <div className="grid grid-cols-2 gap-1 rounded-2xl border bg-popover p-3 shadow-lift">
                        {PROGRAMS.map((p) => (
                          <Link
                            key={p.slug}
                            to="/programs/$slug"
                            params={{ slug: p.slug }}
                            className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-secondary"
                            onBlur={() => setProgramsOpen(false)}
                          >
                            <img src={p.image} alt="" className="size-12 shrink-0 rounded-lg object-cover" loading="lazy" />
                            <span>
                              <span className="block text-sm font-semibold group-hover:text-primary">{p.name}</span>
                              <span className="line-clamp-2 text-xs text-muted-foreground">{p.short}</span>
                            </span>
                          </Link>
                        ))}
                        <Link to="/programs" className="flex items-center justify-center rounded-xl bg-secondary p-3 text-sm font-semibold text-primary hover:bg-secondary/70">
                          View all programs →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={cn("whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium transition-colors hover:text-primary", isActive(pathname, item.to) && "bg-secondary text-primary")}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-secondary" aria-label={`Cart, ${count} items`}>
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <motion.span
                key={count}
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-sun px-1 text-[11px] font-bold text-sun-foreground"
              >
                {count}
              </motion.span>
            )}
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden h-10 sm:inline-flex">
                  <User /> {profile?.full_name?.split(" ")[0] || "Account"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="truncate">{profile?.full_name || user.email}</div>
                  {role && <div className="text-xs font-normal text-muted-foreground">{ROLE_LABEL[role]}</div>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href={homeForRoles(roles)}>
                    <LayoutDashboard /> Dashboard
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/orders">
                    <ShoppingCart /> My orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => void signOut()}>
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" size="sm" className="hidden h-10 sm:inline-flex">
              <Link to="/login">Login</Link>
            </Button>
          )}
          <Button asChild variant="brand" className="hidden md:inline-flex">
            <Link to="/book-free-trial">Book a Free Trial</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="xl:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1 px-4 pb-6" aria-label="Mobile">
                {NAV.map((item) => (
                  <div key={item.to}>
                    <Link
                      to={item.to}
                      className={cn("block rounded-xl px-3 py-2.5 font-medium hover:bg-secondary", isActive(pathname, item.to) && "bg-secondary text-primary")}
                    >
                      {item.label}
                    </Link>
                    {"children" in item && (
                      <div className="ml-3 border-l pl-3">
                        {PROGRAMS.map((p) => (
                          <Link key={p.slug} to="/programs/$slug" params={{ slug: p.slug }} className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-primary">
                            {p.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="mt-4 grid gap-2">
                  <Button asChild variant="brand">
                    <Link to="/book-free-trial">Book a Free Trial</Link>
                  </Button>
                  {user ? (
                    <>
                      <Button asChild variant="outline">
                        <a href={homeForRoles(roles)}>Dashboard</a>
                      </Button>
                      <Button variant="ghost" onClick={() => void signOut()}>
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <Button asChild variant="outline">
                      <Link to="/login">Login</Link>
                    </Button>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
