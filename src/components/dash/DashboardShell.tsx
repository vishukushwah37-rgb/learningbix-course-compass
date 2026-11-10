import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Award, BarChart3, Bell, BookOpen, Building2, CalendarCheck, ClipboardList, GraduationCap, Home, LayoutDashboard, LogOut, Mail, Menu, Package,
  School, ShoppingBag, Store, Users, type LucideIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/auth";
import { homeForRoles, ROLE_LABEL, type AppRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

type NavItem = { label: string; href: string; icon: LucideIcon };

export const DASH_NAV: Record<AppRole, NavItem[]> = {
  student: [
    { label: "Overview", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "My Courses", href: "/student/courses", icon: BookOpen },
    { label: "Quizzes", href: "/student/quizzes", icon: ClipboardList },
    { label: "Certificates", href: "/student/certificates", icon: Award },
    { label: "My Orders", href: "/orders", icon: ShoppingBag },
  ],
  parent: [
    { label: "Overview", href: "/parent/dashboard", icon: LayoutDashboard },
    { label: "My Orders", href: "/orders", icon: ShoppingBag },
  ],
  teacher: [{ label: "Overview", href: "/teacher/dashboard", icon: LayoutDashboard }],
  school_admin: [{ label: "Overview", href: "/school/dashboard", icon: LayoutDashboard }],
  franchise: [
    { label: "Overview", href: "/franchise/dashboard", icon: LayoutDashboard },
    { label: "Enquiries", href: "/franchise/enquiries", icon: Mail },
  ],
  admin: [
    { label: "Overview", href: "/admin/dashboard", icon: BarChart3 },
    { label: "Free Trials", href: "/admin/trials", icon: CalendarCheck },
    { label: "Enquiries", href: "/admin/enquiries", icon: Mail },
    { label: "School Leads", href: "/admin/schools", icon: School },
    { label: "Franchise Leads", href: "/admin/franchises", icon: Store },
    { label: "Orders", href: "/admin/orders", icon: Package },
    { label: "Users & Roles", href: "/admin/users", icon: Users },
  ],
};

const ROLE_ICON: Record<AppRole, LucideIcon> = { student: GraduationCap, parent: Users, teacher: BookOpen, school_admin: Building2, franchise: Store, admin: BarChart3 };

function NavLinks({ items, pathname, onNavigate }: { items: NavItem[]; pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1" aria-label="Dashboard">
      {items.map((i) => {
        const active = pathname === i.href || pathname.startsWith(`${i.href}/`);
        return (
          <a key={i.href} href={i.href} onClick={onNavigate} aria-current={active ? "page" : undefined}
            className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition", active ? "bg-primary text-primary-foreground shadow-soft" : "text-sidebar-foreground hover:bg-sidebar-accent")}>
            <i.icon className="size-4" /> {i.label}
          </a>
        );
      })}
      <a href="/" className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-sidebar-accent"><Home className="size-4" /> Back to website</a>
    </nav>
  );
}

function Notifications() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const router = useRouter();
  const { data = [] } = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data } = await supabase.from("notifications").select("id, title, body, link, read_at, created_at").order("created_at", { ascending: false }).limit(15);
      return data ?? [];
    },
    refetchInterval: 60_000,
  });
  const unread = data.filter((n) => !n.read_at).length;
  async function open(n: (typeof data)[number]) {
    if (!n.read_at) {
      await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", n.id);
      void qc.invalidateQueries({ queryKey: ["notifications"] });
    }
    if (n.link?.startsWith("/")) void router.navigate({ href: n.link });
  }
  async function markAll() {
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).is("read_at", null);
    void qc.invalidateQueries({ queryKey: ["notifications"] });
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`} className="relative">
          <Bell />
          {unread > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">{unread}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications {unread > 0 && <button onClick={markAll} className="text-xs font-medium text-primary">Mark all read</button>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {data.length === 0 && <p className="p-4 text-center text-sm text-muted-foreground">You're all caught up.</p>}
        {data.map((n) => (
          <DropdownMenuItem key={n.id} onSelect={() => void open(n)} className="flex flex-col items-start gap-0.5 py-2">
            <span className="flex w-full items-center gap-2 font-semibold">{!n.read_at && <span className="size-2 rounded-full bg-primary" />}{n.title}</span>
            {n.body && <span className="line-clamp-2 text-xs text-muted-foreground">{n.body}</span>}
            <span className="text-[10px] text-muted-foreground">{new Date(n.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** App shell for every role dashboard. Shows a notice when the account lacks the role (data is still protected server-side). */
export function DashboardShell({ role, title, subtitle, actions, children }: { role: AppRole; title: string; subtitle?: ReactNode; actions?: ReactNode; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { roles, profile, user, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const items = DASH_NAV[role];
  const RoleIcon = ROLE_ICON[role];
  const allowed = roles.includes(role) || roles.includes("admin");

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-5">
      <Logo />
      <div className="flex items-center gap-3 rounded-2xl bg-sidebar-accent p-3">
        <span className="grid size-10 place-items-center rounded-xl bg-gradient-brand text-primary-foreground"><RoleIcon className="size-5" /></span>
        <div className="min-w-0"><div className="truncate text-sm font-bold">{profile?.full_name || user?.email}</div><div className="text-xs text-muted-foreground">{ROLE_LABEL[role]}</div></div>
      </div>
      <NavLinks items={items} pathname={pathname} onNavigate={() => setOpen(false)} />
      <Button variant="ghost" className="mt-auto justify-start" onClick={() => void signOut()}><LogOut /> Sign out</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r bg-sidebar lg:block">{sidebar}</aside>
      <div className="min-w-0">
        <header className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild><Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu"><Menu /></Button></SheetTrigger>
            <SheetContent side="left" className="w-72 bg-sidebar p-0"><SheetHeader className="sr-only"><SheetTitle>Menu</SheetTitle></SheetHeader>{sidebar}</SheetContent>
          </Sheet>
          <div className="min-w-0 flex-1"><div className="truncate font-display text-lg font-bold">{title}</div></div>
          <Notifications />
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="space-y-4"><div className="h-28 animate-pulse rounded-3xl bg-muted" /><div className="h-64 animate-pulse rounded-3xl bg-muted" /></div>
          ) : !allowed ? (
            <div className="mx-auto max-w-md rounded-3xl border bg-card p-8 text-center shadow-soft">
              <h1 className="text-xl font-bold">This area is for {ROLE_LABEL[role]} accounts</h1>
              <p className="mt-2 text-sm text-muted-foreground">Your account doesn't have access here. If you think it should, ask a LearningBIX admin.</p>
              <Button asChild className="mt-5"><a href={homeForRoles(roles)}>Go to my dashboard</a></Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1>
                  {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
                </div>
                {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
              </div>
              {children}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, tone = "primary", hint }: { label: string; value: ReactNode; icon: LucideIcon; tone?: "primary" | "violet" | "sun" | "mint"; hint?: string }) {
  const map = { primary: "bg-primary/10 text-primary", violet: "bg-violet/10 text-violet", sun: "bg-sun/15 text-sun-foreground", mint: "bg-mint/15 text-mint" };
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={cn("grid size-10 place-items-center rounded-xl", map[tone])}><Icon className="size-5" /></span>
      </div>
      <div className="mt-3 font-display text-3xl font-extrabold">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-3xl border bg-card p-5 shadow-soft", className)}>
      <div className="mb-4 flex items-center justify-between gap-2"><h2 className="font-bold">{title}</h2>{action}</div>
      {children}
    </section>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">{children}</p>;
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-gradient-brand transition-all duration-700" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
