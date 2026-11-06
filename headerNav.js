import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X, Zap } from "lucide-react";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/simulator", label: "3D Simulator" },
  { to: "/pedro-pathing", label: "PedroPathing Generator" },
  { to: "/ai-code-bot", label: "AI Code Bot" },
];

function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-2.5">
      <span className="relative grid h-9 w-9 place-items-center rounded-lg border border-gold/40 bg-gold/10 shadow-glow-sm">
        <Zap className="h-[18px] w-[18px] text-gold" strokeWidth={2.4} />
      </span>
      <span className="flex items-baseline gap-2">
        <span className="font-heading text-[17px] font-semibold tracking-tight text-white">
          FTC<span className="text-gold">Sim</span>
        </span>
        <span className="rounded border border-gold/30 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest text-gold/90">
          v2.0
        </span>
      </span>
    </Link>
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linkClass = ({ isActive }) =>
    [
      "relative rounded-md px-3 py-2 text-[13.5px] font-medium tracking-tight transition-colors duration-300",
      isActive ? "text-gold" : "text-neutral-400 hover:text-neutral-100",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0c0c0d]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass} end={link.to === "/"}>
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`absolute inset-x-2.5 -bottom-[1px] h-[2px] rounded-full bg-gold transition-all duration-300 ${
                      isActive ? "opacity-100 shadow-[0_0_12px_2px_hsl(51_100%_50%/0.55)]" : "opacity-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            to="/simulator"
            className="rounded-md border border-gold/50 bg-gold px-4 py-2 text-[13px] font-semibold text-black transition-all duration-300 hover:shadow-glow"
          >
            Launch Simulator
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          className="grid h-9 w-9 place-items-center rounded-md border border-white/10 text-neutral-200 transition-colors hover:border-gold/40 hover:text-gold md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-white/[0.06] transition-[max-height,opacity] duration-300 md:hidden ${
          open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="space-y-1 px-4 py-3">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-gold/10 text-gold" : "text-neutral-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
