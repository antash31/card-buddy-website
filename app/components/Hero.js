/* #genai */
"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import CurvedInput from "./CurvedInput";
import { StepIcon } from "./WaitlistIcons";

const ART = "/hero-hands.png";
const ART_SIZES =
  "(min-width: 1024px) 1200px, (min-width: 640px) 160vw, 190vw";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// One curved bar, asked three times. Keeping it to a single field at a time
// is what lets the hero stay inside one viewport.
const STEPS = [
  {
    key: "name",
    type: "text",
    label: "Your name",
    placeholder: "Your name",
    placeholderWide: "Your full name",
    button: "Next",
    buttonWide: "Continue",
    hint: "First up, what should we call you?",
    error: "Enter your name so we can greet you properly.",
    isValid: (v) => v.trim().length >= 2,
  },
  {
    key: "email",
    type: "email",
    label: "Your email",
    placeholder: "Your email",
    placeholderWide: "you@yourmail.com",
    button: "Next",
    buttonWide: "Continue",
    hint: "Where should we send your invite?",
    error: "That email looks off. Check it and try again.",
    isValid: (v) => EMAIL_PATTERN.test(v.trim()),
  },
  {
    key: "phone",
    type: "tel",
    label: "Your number",
    placeholder: "Your number",
    placeholderWide: "+91 98765 43210",
    button: "Join",
    buttonWide: "Join waitlist",
    hint: "Last one. We text you the moment your invite is live.",
    error: "That number does not look right. Try again.",
    isValid: (v) => {
      const digits = v.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15;
    },
  },
];

export default function Hero() {
  const stageRef = useRef(null);
  const waitlistRef = useRef(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState("idle");
  const [joined, setJoined] = useState(false);
  const [swapFrom, setSwapFrom] = useState("right");
  const [isWide, setIsWide] = useState(false);

  const step = STEPS[stepIndex];

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

  // CurvedInput keeps its own hidden field, so after advancing a step we hand
  // focus back to it rather than making the visitor tap the bar again.
  const focusField = useCallback(() => {
    waitlistRef.current?.querySelector(".curved-input__field")?.focus();
  }, []);

  const handleAnswerChange = useCallback(
    (next) => {
      setAnswers((prev) => ({ ...prev, [step.key]: next }));
      setStatus("idle");
    },
    [step.key],
  );

  const handleStepSubmit = useCallback(
    (next) => {
      if (!step.isValid(next)) {
        setStatus("error");
        return;
      }

      setStatus("idle");
      setSwapFrom("right");

      if (stepIndex < STEPS.length - 1) {
        setStepIndex(stepIndex + 1);
        requestAnimationFrame(focusField);
        return;
      }

      setJoined(true);
    },
    [focusField, step, stepIndex],
  );

  const handleStepBack = useCallback(
    (index) => {
      if (joined || index >= stepIndex) return;
      setSwapFrom("left");
      setStepIndex(index);
      setStatus("idle");
      requestAnimationFrame(focusField);
    },
    [focusField, joined, stepIndex],
  );

  const firstName = answers.name.trim().split(/\s+/)[0];
  const statusMessage = joined
    ? `You are on the list${firstName ? `, ${firstName}` : ""}. Watch your inbox.`
    : status === "error"
      ? step.error
      : step.hint;

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
          ref={waitlistRef}
          className="rise rise-4 flex w-full max-w-[470px] flex-col items-center"
        >
          {/* Height is reserved so the artwork does not jump when the curved
              bar measures itself on mount. */}
          <div
            className={`flex min-h-[85px] w-full justify-center sm:min-h-[104px] ${
              joined ? "pointer-events-none" : ""
            }`}
          >
            <CurvedInput
              value={joined ? "" : answers[step.key]}
              onChange={handleAnswerChange}
              onSubmit={handleStepSubmit}
              name={step.key}
              type={joined ? "text" : step.type}
              ariaLabel={`${step.label} for the Card Buddy waitlist`}
              placeholder={
                joined
                  ? `Welcome aboard${firstName ? `, ${firstName}` : ""}`
                  : isWide
                    ? step.placeholderWide
                    : step.placeholder
              }
              buttonText={isWide ? step.buttonWide : step.button}
              showButton={!joined}
              contentKey={joined ? "done" : step.key}
              swapFrom={swapFrom}
              icon={
                <StepIcon
                  step={joined ? "done" : step.key}
                  barHeight={isWide ? 64 : 56}
                />
              }
              width={470}
              bend={isWide ? 26 : 15}
              height={isWide ? 64 : 56}
              cornerRadius={22}
              fontSize={isWide ? 16 : 15}
              backgroundColor="#f8ead6"
              textColor="#3d0206"
              placeholderColor={joined ? "#3d0206" : "#a1736a"}
              borderColor="#e0c39c"
              buttonColor="#c01018"
              buttonTextColor="#f8ead6"
              iconColor="#c01018"
              shadowSize="lg"
              shadowColor="#2a0104"
            />
          </div>

          {!joined && (
            <div className="mt-3 flex items-center gap-2 sm:mt-4">
              {STEPS.map((entry, index) => {
                const reachable = index < stepIndex;
                return (
                  <button
                    key={entry.key}
                    type="button"
                    onClick={() => handleStepBack(index)}
                    disabled={!reachable}
                    aria-label={
                      reachable ? `Back to ${entry.label}` : entry.label
                    }
                    aria-current={index === stepIndex ? "step" : undefined}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === stepIndex
                        ? "w-6 bg-cream/80"
                        : reachable
                          ? "w-1.5 cursor-pointer bg-cream/45 hover:bg-cream/80"
                          : "w-1.5 bg-cream/20"
                    }`}
                  />
                );
              })}
            </div>
          )}

          <p
            aria-live="polite"
            className={`mt-3 text-[10px] tracking-[0.14em] uppercase transition-colors sm:mt-4 sm:text-xs sm:tracking-[0.18em] ${
              joined
                ? "text-gold"
                : status === "error"
                  ? "text-ember"
                  : "text-cream/50"
            }`}
          >
            <span key={statusMessage} className="status-swap">
              {statusMessage}
            </span>
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
