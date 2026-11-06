import React from "react";
import { Link } from "react-router-dom";
import SiteHeader from "@/components/layout/SiteHeader";
import Hero from "@/components/home/Hero";
import FeatureGrid from "@/components/home/FeatureGrid";

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <Hero />
        <FeatureGrid />

        <section className="mx-auto max-w-[1600px] px-4 pb-24 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-[#171512] via-[#131313] to-[#0e0e0f] px-6 py-10 shadow-panel sm:px-12 sm:py-14">
            <div className="pointer-events-none absolute inset-0 grid-backdrop opacity-40" />
            <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-gold/10 blur-[90px]" />
            <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <h2 className="font-heading text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                  Ready to run a match?
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-neutral-400">
                  Spin up the field, dial in your drivetrain, and let the telemetry stream tell you
                  exactly where the autonomous breaks.
                </p>
              </div>
              <Link
                to="/simulator"
                className="shrink-0 rounded-lg bg-gold px-6 py-3.5 text-sm font-semibold text-black shadow-glow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow"
              >
                Launch Simulator
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06] py-8">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-2 px-4 font-mono text-[11px] uppercase tracking-wider text-neutral-600 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>FTC Sim v2.0 — field training environment</span>
          <span>Not affiliated with FIRST®</span>
        </div>
      </footer>
    </div>
  );
}
