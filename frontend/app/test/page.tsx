"use client";
import React from "react";

const page = () => {
  return (
    <div>
      <main className="relative min-h-screen overflow-hidden bg-[#f7f3ef] text-[#1b1b1b]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffb677,transparent_60%)] opacity-70 blur-3xl animate-float" />
          <div className="absolute -right-28 bottom-10 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_70%_70%,#8dd7c5,transparent_60%)] opacity-70 blur-3xl animate-float-slow" />
          <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#f4e1c1,#e5f2ee,#f7f3ef)] opacity-50 blur-2xl" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[#4a3d2a] shadow-sm">
                Get Started
              </span>
              <h1 className="animate-rise text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Choose your path to build with your team.
              </h1>
              <p className="animate-rise-delay max-w-xl text-base text-[#3f3a35] sm:text-lg">
                Join an existing company space with an invite code, or create a
                new company to set up your workspace, roles, and approval flow.
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                <button
                  type="button"
                  className="group animate-rise-delay-2 relative flex h-full flex-col gap-4 rounded-2xl border border-[#e4ddd3] bg-white/90 p-6 text-left shadow-[0_12px_40px_-30px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b1b1b]"
                  aria-describedby="join-description"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#1b1b1b] text-sm font-semibold text-white">
                      JC
                    </span>
                    <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#6b635d]">
                      Join
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Join a company</h2>
                    <p
                      id="join-description"
                      className="mt-2 text-sm text-[#5a524b]"
                    >
                      Use your invite code to enter the team space and start
                      requesting resources.
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between text-sm font-semibold text-[#1b1b1b]">
                    <span className="rounded-full bg-[#f0ebe3] px-3 py-1 text-xs uppercase tracking-[0.18em]">
                      I have a code
                    </span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      Continue -&gt;
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  className="group animate-rise-delay-2 relative flex h-full flex-col gap-4 rounded-2xl border border-[#e4ddd3] bg-[#fff7ef] p-6 text-left shadow-[0_12px_40px_-30px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b1b1b]"
                  aria-describedby="create-description"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#ff7a3d] text-sm font-semibold text-white">
                      CC
                    </span>
                    <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#6b635d]">
                      Create
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Create a company</h2>
                    <p
                      id="create-description"
                      className="mt-2 text-sm text-[#5a524b]"
                    >
                      Start fresh with a new company, set roles, and invite your
                      first employees.
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between text-sm font-semibold text-[#1b1b1b]">
                    <span className="rounded-full bg-[#ffe5d3] px-3 py-1 text-xs uppercase tracking-[0.18em]">
                      New workspace
                    </span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      Continue -&gt;
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div className="animate-rise-delay rounded-3xl border border-[#e4ddd3] bg-white/80 p-8 shadow-[0_24px_60px_-45px_rgba(0,0,0,0.5)]">
              <div className="space-y-6">
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[#6b635d]">
                    What happens next
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">
                    Set up in minutes.
                  </h3>
                </div>
                <ol className="space-y-4 text-sm text-[#4a433c]">
                  <li className="flex gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1b1b1b] text-[0.7rem] font-semibold text-white">
                      1
                    </span>
                    Pick your path and confirm your details.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1b1b1b] text-[0.7rem] font-semibold text-white">
                      2
                    </span>
                    Add teammates, roles, and approval rules.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1b1b1b] text-[0.7rem] font-semibold text-white">
                      3
                    </span>
                    Start submitting and reviewing requests.
                  </li>
                </ol>
                <div className="rounded-2xl border border-[#e4ddd3] bg-[#f7f3ef] p-4 text-xs text-[#5a524b]">
                  Need help? Contact support and we will guide the setup.
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-14px);
            }
          }
          @keyframes rise {
            from {
              opacity: 0;
              transform: translateY(16px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-float {
            animation: float 7s ease-in-out infinite;
          }
          .animate-float-slow {
            animation: float 10s ease-in-out infinite;
          }
          .animate-rise {
            animation: rise 650ms ease-out both;
          }
          .animate-rise-delay {
            animation: rise 800ms ease-out 120ms both;
          }
          .animate-rise-delay-2 {
            animation: rise 900ms ease-out 240ms both;
          }
        `}</style>
      </main>
    </div>
  );
};

export default page;
