import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  QrCode, Monitor, Zap, Users, ShieldCheck,
  ChefHat, LayoutGrid, ArrowRight, CheckCircle2,
  Flame, Globe, Database, Send, Menu, X,
} from "lucide-react";

// ─── Email CTA ────────────────────────────────────────────────────────────────
function RequestSetupButton({ className = "" }) {
  const subject = encodeURIComponent("QR Kiosk Setup Request");
  const body = encodeURIComponent(
    `Hi Naman,\n\nI'd like to request a setup for the QR Kiosk system.\n\nBusiness name: \nLocation / canteen type: \nEstimated daily orders: \nBest time to connect: \n\nLooking forward to hearing from you.`
  );
  const href = `mailto:namanchaturvedi@hotmail.com?subject=${subject}&body=${body}`;

  return (
    <a href={href} className={className}>
      <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white gap-2 h-10 rounded-lg px-6">
        <Send className="w-4 h-4" />
        Request Setup
      </Button>
    </a>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: "How it works", href: "#how" },
    { label: "Features", href: "#features" },
    { label: "Tech", href: "#tech" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center">
            <QrCode className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight text-sm">QServe</span>
        </div>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a key={l.href} href={l.href}
              className="text-sm text-zinc-400 hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
        <RequestSetupButton />
        <Button
            asChild
            size="lg"
            variant="outline"
            className="ml-2 h-10 gap-2 rounded-lg border-zinc-700 text-zinc-300 bg-zinc-800 hover:bg-zinc-900 hover:text-zinc-200"
        >
            <NavLink to="/r/signin">
                Vendor Login
                <ArrowRight className="w-4 h-4" />
            </NavLink>
        </Button>
        </div>
        

        {/* Mobile toggle */}
        <button className="md:hidden text-zinc-400 hover:text-white" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 px-5 py-4 space-y-3">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block text-sm text-zinc-400 hover:text-white transition-colors py-1">
              {l.label}
            </a>
          ))}
          <RequestSetupButton className="block pt-2" />
          <Button asChild size="lg" variant="outline" className="h-10 gap-2 rounded-lg border-zinc-700 text-zinc-300 bg-zinc-800 hover:bg-zinc-900 hover:text-zinc-200">
            <NavLink to="/r/signin">
              Vendor Login
              <ArrowRight className="w-4 h-4" />
            </NavLink>
          </Button>
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Grid bg */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      {/* Orange glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-100 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 pt-20 pb-24 text-center">
        <Badge className="mb-6 bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/10">
          <Flame className="w-3 h-3 mr-1.5" />
          Live-tested in real canteen environments
        </Badge>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.08] mb-6">
          Scan. Order. Done.
          <br />
          <span className="text-orange-400">No queues. No friction.</span>
        </h1>

        <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          A QR-based self-service kiosk system for canteens and quick-service restaurants.
          Customers order from their phones — the kitchen sees it instantly on a live screen.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <RequestSetupButton />
          <a href="#how">
            <Button size="lg" variant="outline"
              className="h-11 px-6 border-zinc-700 text-zinc-300 bg-zinc-800 hover:bg-zinc-900 hover:text-zinc-200 gap-2">
              See How It Works
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>

        {/* Stat pills */}
        <div className="mt-14 flex flex-wrap justify-center gap-3">
          {[
            { label: "Zero queue wait at counter" },
            { label: "Real-time kitchen screen" },
            { label: "No app download needed" },
            { label: "Multi-vendor ready" },
          ].map((s) => (
            <span key={s.label}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5">
              <CheckCircle2 className="w-3 h-3 text-orange-400" />
              {s.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      icon: QrCode,
      title: "Print & place QR codes",
      desc: "We onboard your business, generate unique QR codes, and you stick them on tables or counters — or run them on a kiosk screen.",
    },
    {
      icon: Monitor,
      title: "Customers scan & order",
      desc: "Customers scan with any phone camera — no app download, no login. They browse your menu and place orders in seconds.",
    },
    {
      icon: ChefHat,
      title: "Kitchen gets it instantly",
      desc: "Orders appear live on the kitchen screen the moment they're placed. A token number keeps preparation and pickup organised.",
    },
    {
      icon: Zap,
      title: "Token called, order picked up",
      desc: "The token display tells customers when their order is ready. No shouting, no missed orders, no confusion.",
    },
  ];

  return (
    <section id="how" className="max-w-6xl mx-auto px-5 py-20">
      <div className="text-center mb-12">
        <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-3">
          The Flow
        </p>
        <h2 className="text-3xl font-bold text-white tracking-tight">
          How it works — start to finish
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-800 rounded-xl overflow-hidden border border-zinc-800">
        {steps.map(({ icon: Icon, title, desc }, i) => (
          <div key={title} className="bg-zinc-950 p-7 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-orange-400" />
              </div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm mb-1.5">{title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      icon: QrCode,
      title: "QR-based ordering",
      desc: "Mobile-first ordering. No app, no login for customers. Works with any phone camera.",
    },
    {
      icon: Monitor,
      title: "Live kitchen screen",
      desc: "Orders appear in real time on a dedicated kitchen display. Token-based tracking for prep and pickup.",
    },
    {
      icon: LayoutGrid,
      title: "Multi-vendor support",
      desc: "Run multiple outlets or food stalls from a single system. Each vendor sees only their orders.",
    },
    {
      icon: ChefHat,
      title: "Menu management",
      desc: "Veg / non-veg classification, item availability toggles, pricing with tax and currency support.",
    },
    {
      icon: Database,
      title: "Optimised for traffic",
      desc: "Caching reduces Firestore read costs. Designed for concurrent users and high-volume order bursts.",
    },
    {
      icon: ShieldCheck,
      title: "Role-based access",
      desc: "Clean separation between customer view, admin panel, and kitchen screen. Secured with Firebase rules.",
    },
  ];

  return (
    <section id="features" className="bg-zinc-900/50 border-y border-zinc-800">
      <div className="max-w-6xl mx-auto px-5 py-20">
        <div className="text-center mb-12">
          <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-3">
            What's included
          </p>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Everything a food operation needs
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title}
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 hover:border-zinc-700 transition-colors">
              <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center mb-4">
                <Icon className="w-4 h-4 text-orange-400" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1.5">{title}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Tech ─────────────────────────────────────────────────────────────────────
function Tech() {
  const stack = [
    { label: "React + Vite", sub: "Frontend" },
    { label: "Tailwind CSS", sub: "Styling" },
    { label: "shadcn/ui", sub: "Components" },
    { label: "Firebase Auth", sub: "Authentication" },
    { label: "Firestore", sub: "Real-time database" },
    { label: "Security Rules", sub: "Access control" },
    { label: "React Context", sub: "State management" },
    { label: "Firestore Indexes", sub: "Query optimisation" },
  ];

  return (
    <section id="tech" className="max-w-6xl mx-auto px-5 py-20">
      <div className="grid md:grid-cols-2 gap-14 items-center">
        <div>
          <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-3">
            Engineering
          </p>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-4">
            Built for real-world scale
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-5">
            The system is designed around Firestore's real-time capabilities — live order updates,
            concurrent users, and optimised reads through caching all work out of the box.
          </p>
          <ul className="space-y-2.5">
            {[
              "Firestore real-time listeners for instant kitchen updates",
              "Caching layer to reduce read costs at high volume",
              "Firestore security rules for role isolation",
              "Indexing and query optimisation for fast menu loads",
              "Tested live in a real canteen — kitchen flow validated",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-400">
                <CheckCircle2 className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {stack.map(({ label, sub }) => (
            <div key={label}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Views ────────────────────────────────────────────────────────────────────
function Views() {
  const views = [
    {
      icon: Globe,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
      label: "Customer View",
      desc: "Scan QR → browse menu → place order. No account needed. Works on any phone.",
    },
    {
      icon: LayoutGrid,
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/20",
      label: "Admin Panel",
      desc: "Manage menu items, outlets, pricing, taxes, and availability. Full control.",
    },
    {
      icon: ChefHat,
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/20",
      label: "Kitchen Screen",
      desc: "Live order queue with token numbers. Mark orders ready. No paper, no shouting.",
    },
  ];

  return (
    <section className="bg-zinc-900/50 border-y border-zinc-800">
      <div className="max-w-6xl mx-auto px-5 py-20 text-center">
        <p className="text-orange-400 text-xs font-semibold uppercase tracking-widest mb-3">
          Three roles, one system
        </p>
        <h2 className="text-3xl font-bold text-white tracking-tight mb-10">
          Everyone sees exactly what they need
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {views.map(({ icon: Icon, color, bg, label, desc }) => (
            <div key={label}
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-7 text-left">
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-4 ${bg}`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="font-semibold text-white mb-2">{label}</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="max-w-6xl mx-auto px-5 py-20">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-8 py-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-48 bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative">
          <Badge className="mb-5 bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/10">
            <Zap className="w-3 h-3 mr-1.5" />
            Quick setup, we handle onboarding
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Ready to cut the queue?
          </h2>
          <p className="text-zinc-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
            We sign you up, walk you through onboarding, and get your QR codes ready to print.
            Hit request setup and we'll reach out to get you started.
          </p>
          <RequestSetupButton />
          <p className="mt-4 text-xs text-zinc-600">
            Clicking opens your email client with a pre-filled message.
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between text-xs text-zinc-600">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-orange-500 rounded-sm flex items-center justify-center">
            <QrCode className="w-3 h-3 text-white" />
          </div>
          <span className="text-zinc-400 font-medium">QServe</span>
        </div>
        <span>QR-based kiosk ordering for canteens &amp; quick-service restaurants</span>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Nav />
      <Hero />
      <HowItWorks />
      <Features />
      <Views />
      <Tech />
      <CTA />
      <Footer />
    </div>
  );
}
