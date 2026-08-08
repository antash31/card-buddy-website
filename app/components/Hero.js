/* #genai */
"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import CurvedInput from "./CurvedInput";

const ART = "/hero-hands.png";
const ART_SIZES =
  "(min-width: 1024px) 1200px, (min-width: 640px) 160vw, 190vw";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATUS_MESSAGE = {
  idle: "Works with 400+ cards · No card numbers stored",
  error: "That email looks off. Check it and try again.",
  done: "You are on the list. Your invite lands in your inbox soon.",
};

export default function Hero() {
  const stageRef = useRef(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [isWide, setIsWide] = useState(false);

  // The curved bar is drawn at real pixel sizes, so its proportions are set
  // per breakpoint rather than by CSS.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 640px)");
    const sync = () => setIsWide(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  // Pointer position is written straight to CSS vars so the parallax never
  // triggers a React re-render.
  const handlePointerMove = useCallback((event) => {
    const stage = stageRef.current;
    if (!stage || event.pointerType !== "mouse") return;

    const { innerWidth, innerHeight } = window;
    stage.style.setProperty("--mx", (event.clientX / innerWidth - 0.5).toFixed(3));
    stage.style.setProperty("--my", (event.clientY / innerHeight - 0.5).toFixed(3));
  }, []);

  const handlePointerLeave = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    stage.style.setProperty("--mx", "0");
    stage.style.setProperty("--my", "0");
  }, []);

  const handleEmailChange = useCallback((next) => {
    setEmail(next);
    setStatus("idle");
  }, []);

  const handleJoin = useCallback((next) => {
    setStatus(EMAIL_PATTERN.test(next.trim()) ? "done" : "error");
  }, []);

  return (
    <section
      className="hero flex h-[100svh] flex-col overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="hero-rings" aria-hidden="true" />
      <div className="hero-halo" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-grain" aria-hidden="true" />

      <header className="rise rise-1 relative z-20 mx-auto flex w-full max-w-7xl shrink-0 items-center justify-between gap-3 px-5 py-4 sm:px-10 sm:py-6">
        <a href="#" className="flex items-center gap-2.5 sm:gap-3">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-cream/25 bg-cream/10 font-display text-base text-cream backdrop-blur-sm sm:h-9 sm:w-9 sm:rounded-xl sm:text-lg">
            C
          </span>
          <span className="text-xs font-semibold tracking-[0.2em] text-cream/90 sm:text-sm sm:tracking-[0.28em]">
            CARD BUDDY
          </span>
        </a>

        <nav className="hidden items-center gap-9 text-sm text-cream/70 md:flex">
          <a className="transition-colors hover:text-cream" href="#">How it works</a>
          <a className="transition-colors hover:text-cream" href="#">Rewards</a>
          <a className="transition-colors hover:text-cream" href="#">Security</a>
        </nav>
      </header>

      <div className="hero-stack relative z-10 mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col items-center justify-center px-5 text-center sm:px-6">
        <h1 className="rise rise-2 font-display text-[clamp(2rem,min(7vw,8.6svh),4.75rem)] leading-[1.02] font-medium tracking-[-0.02em] text-cream text-balance sm:leading-[0.95]">
          Swipe the right card,
          <br />
          <span className="shine italic">every single time.</span>
        </h1>

        <p className="rise rise-3 max-w-sm text-[15px] leading-relaxed text-cream/75 text-pretty sm:max-w-xl sm:text-base lg:text-lg">
          Card Buddy reads the checkout and tells you which card pays the most,
          a heartbeat before you tap.
        </p>

        <div
          id="waitlist"
          className="rise rise-4 flex w-full max-w-[470px] flex-col items-center"
        >
          {/* Height is reserved so the artwork does not jump when the curved
              bar measures itself on mount. */}
          <div className="flex min-h-[85px] w-full justify-center sm:min-h-[104px]">
            <CurvedInput
              value={email}
              onChange={handleEmailChange}
              onSubmit={handleJoin}
              name="email"
              type="email"
              ariaLabel="Email address for the Card Buddy waitlist"
              placeholder={isWide ? "you@yourmail.com" : "Your email"}
              buttonText={isWide ? "Join waitlist" : "Join"}
              width={470}
              bend={isWide ? 26 : 15}
              height={isWide ? 64 : 56}
              cornerRadius={22}
              fontSize={isWide ? 16 : 15}
              backgroundColor="#f8ead6"
              textColor="#3d0206"
              placeholderColor="#a1736a"
              borderColor="#e0c39c"
              buttonColor="#c01018"
              buttonTextColor="#f8ead6"
              iconColor="#c01018"
              shadowSize="lg"
              shadowColor="#2a0104"
            />
          </div>

          <p
            aria-live="polite"
            className={`mt-4 text-[10px] tracking-[0.14em] uppercase transition-colors sm:mt-5 sm:text-xs sm:tracking-[0.18em] ${
              status === "done"
                ? "text-gold"
                : status === "error"
                  ? "text-ember"
                  : "text-cream/50"
            }`}
          >
            {STATUS_MESSAGE[status]}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex w-full shrink-0 justify-center overflow-hidden">
        <div ref={stageRef} className="art-stage art-scale art-float">
          <div className="art-layer art-left">
            <Image
              src={ART}
              alt=""
              fill
              priority
              sizes={ART_SIZES}
              aria-hidden="true"
            />
          </div>

          <div className="art-layer art-card">
            <Image
              src={ART}
              alt="Two hands reaching toward each other, passing a credit card"
              fill
              priority
              sizes={ART_SIZES}
            />
          </div>

          <div className="art-layer art-right">
            <Image
              src={ART}
              alt=""
              fill
              priority
              sizes={ART_SIZES}
              aria-hidden="true"
            />
          </div>

          <div className="art-spark" aria-hidden="true" />

          <div className="chip-float-a absolute top-[6%] left-[2%] hidden rounded-2xl border border-cream/20 bg-red-950/45 px-4 py-3 text-left backdrop-blur-md lg:block">
            <p className="text-[10px] tracking-[0.2em] text-cream/55 uppercase">
              Best card
            </p>
            <p className="mt-1 text-sm font-semibold text-cream">
              Sapphire · 5% back
            </p>
          </div>

          <div className="chip-float-b absolute top-[10%] right-[2%] hidden rounded-2xl border border-cream/20 bg-red-950/45 px-4 py-3 text-left backdrop-blur-md lg:block">
            <p className="text-[10px] tracking-[0.2em] text-cream/55 uppercase">
              Decided in
            </p>
            <p className="mt-1 text-sm font-semibold text-cream">
              0.4 seconds
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
