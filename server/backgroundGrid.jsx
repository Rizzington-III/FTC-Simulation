import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Bot, Boxes, Route } from "lucide-react";

const FEATURES = [
  {
    to: "/simulator",
    tag: "Engine",
    title: "3D Physics Engine",
    body: "A full 12×12 ft competition field rendered in WebGL. Tune robot mass, motor friction and wheel grip, then watch acceleration change live.",
    icon: Boxes,
    meta: "Real-time · 60 fps",
  },
  {
    to: "/pedro-pathing",
    tag: "Autonomy",
    title: "PedroPathing Integration",
    body: "Drop waypoints on a top-down field and a smooth Bezier spline is fitted instantly, then exported as clean FTC-ready Java.",
    icon: Route,
    meta: "Bezier splines · heading aware",
  },
  {
    to: "/ai-code-bot",
    tag: "Assistant",
    title: "AI Code Bot",
    body: "Ask the co-pilot to optimise your path, explain heading interpolation, or scaffold a TeleOp — right beside your editor.",
    icon: Bot,
    meta: "Context aware · FTC SDK",
  },
];

export default function FeatureGrid() {
  return (
    <section className="relative mx-auto max-w-[1600px] px-4 pb-24 lg:px-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-gold/80">System modules</p>
          <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Three tools, one workflow
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-neutral-500">
          Design the path, stress-test the physics, ship the code — without leaving the browser.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {FEATURES.map(({ to, tag, title, body, icon: Icon, meta }, index) => (
          <Link
            key={title}
            to={to}
            style={{ animationDelay: `${index * 90}ms` }}
            className="group panel-surface animate-fade-up relative overflow-hidden rounded-xl p-6 shadow-panel transition-all duration-300 hover:-translate-y-1 hover:border-gold/45 hover:shadow-glow"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gold/0 blur-3xl transition-all duration-500 group-hover:bg-gold/15" />

            <div className="relative flex items-start justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-lg border border-gold/25 bg-gold/[0.08] text-gold transition-colors duration-300 group-hover:border-gold/60">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <ArrowUpRight className="h-4 w-4 text-neutral-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold" />
            </div>

            <p className="relative mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500">
              {tag}
            </p>
            <h3 className="relative mt-2 font-heading text-lg font-semibold tracking-tight text-white">
              {title}
            </h3>
            <p className="relative mt-2.5 text-[13.5px] leading-relaxed text-neutral-400">{body}</p>
            <p className="relative mt-6 border-t border-white/[0.07] pt-4 font-mono text-[10.5px] uppercase tracking-wider text-gold/70">
              {meta}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}