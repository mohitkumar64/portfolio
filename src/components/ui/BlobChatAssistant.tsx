"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JellyBlobMascot, type JellyBlobMood } from "feral-blob";
import { Send } from "lucide-react";

export default function BlobChatAssistant() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [mood, setMood] = useState<JellyBlobMood>("happy");
  const [speech, setSpeech] = useState<string>("i am a blob! 🫧 ask me anything");
  const [isTyping, setIsTyping] = useState(false);
  const [pokeCount, setPokeCount] = useState(0);
  const [celebrateCount, setCelebrateCount] = useState(0);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const [idleBlink, setIdleBlink] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Autonomous idle behavior: gentle glances and natural blinks
  useEffect(() => {
    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.65) {
        setIdleBlink((b) => b + 1);
      } else if (rand > 0.3) {
        setGaze({
          x: Math.round((Math.random() - 0.5) * 18),
          y: Math.round((Math.random() - 0.5) * 10),
        });
      } else {
        setGaze({ x: 0, y: 0 });
      }
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Subtle interactive gaze tracking when moving mouse over blob stage
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = (e.clientX - centerX) / (rect.width / 2);
    const dy = (e.clientY - centerY) / (rect.height / 2);
    setGaze({
      x: Math.max(-20, Math.min(20, Math.round(dx * 18))),
      y: Math.max(-14, Math.min(14, Math.round(dy * 12))),
    });
  };

  const handleMouseLeave = () => {
    setGaze({ x: 0, y: 0 });
  };

  const getBlobAnswer = (rawQuery: string): { reply: string; mood: JellyBlobMood; celebrate?: boolean } => {
    // Input is converted to lowercase for easy identification
    const q = rawQuery.trim().toLowerCase();

    // 1. Who are you
    if (
      q.includes("who are you") ||
      q.includes("what are you") ||
      q === "who r u" ||
      q === "who are u" ||
      q === "your name" ||
      q.includes("what is your name")
    ) {
      return {
        reply: "i am a blob! 🫧 a squishy jelly mascot living in mohit's portfolio.",
        mood: "happy",
        celebrate: true,
      };
    }

    // 2. Who is Mohit
    if (
      q.includes("who is mohit") ||
      q.includes("who is he") ||
      q.includes("about mohit") ||
      q.includes("mohit kumar") ||
      q.includes("creator") ||
      q.includes("who made you")
    ) {
      return {
        reply: "mohit is a software engineer who builds high-performance web apps and 3d digital experiences!",
        mood: "love",
        celebrate: true,
      };
    }

    // 3. Skills / Tech Stack
    if (
      q.includes("skill") ||
      q.includes("tech") ||
      q.includes("stack") ||
      q.includes("technolog") ||
      q.includes("what do you use")
    ) {
      return {
        reply: "mohit works with next.js, react, typescript, tailwind css, python & 3d animations!",
        mood: "curious",
      };
    }

    // 4. Projects
    if (
      q.includes("project") ||
      q.includes("portfolio") ||
      q.includes("work") ||
      q.includes("what did you build")
    ) {
      return {
        reply: "check out atlas, edgeids, ats resume analyzer, and 3d portfolios right above! 🚀",
        mood: "happy",
        celebrate: true,
      };
    }

    // 5. Contact / Email / Reach
    if (
      q.includes("contact") ||
      q.includes("email") ||
      q.includes("reach") ||
      q.includes("hire") ||
      q.includes("call")
    ) {
      return {
        reply: "email mohit at mohitkumar.dev@gmail.com, or use the dock on the left!",
        mood: "wave",
      };
    }

    // 6. Location
    if (
      q.includes("where") ||
      q.includes("location") ||
      q.includes("live") ||
      q.includes("city") ||
      q.includes("roorkee") ||
      q.includes("uttarakhand")
    ) {
      return {
        reply: "chilling in roorkee, uttarakhand, india! 🏔️",
        mood: "curious",
      };
    }

    // 7. Joke
    if (q.includes("joke") || q.includes("funny")) {
      return {
        reply: "why do programmers prefer dark mode? because light attracts bugs! 🐛",
        mood: "surprised",
      };
    }

    // 8. Greetings
    if (
      q.includes("hello") ||
      q.includes("hi") ||
      q.includes("hey") ||
      q.includes("yo") ||
      q.includes("sup")
    ) {
      return {
        reply: "hey there! 👋 ask me who i am!",
        mood: "wave",
      };
    }

    // 9. Poke / Tickle
    if (q.includes("poke") || q.includes("tickle") || q.includes("squish")) {
      return {
        reply: "hehe! you can click directly on me to poke me! 🫧",
        mood: "surprised",
      };
    }

    // Fallback: When blob doesn't know the answer
    return {
      reply: "i dont know that i just a blob 🫧",
      mood: "hmm",
    };
  };

  const handleSubmit = () => {
    // Convert to lowercase and trim
    const clean = input.trim().toLowerCase();
    if (!clean) return;

    setIsTyping(false);
    setInput("");

    // Quick thinking pause
    setMood("hmm");
    setSpeech("...");

    setTimeout(() => {
      const { reply, mood: newMood, celebrate } = getBlobAnswer(clean);
      setSpeech(reply);
      setMood(newMood);
      if (celebrate) {
        setCelebrateCount((c) => c + 1);
      }
    }, 350);
  };

  const handlePoke = () => {
    const nextCount = pokeCount + 1;
    setPokeCount(nextCount);

    const pokeReplies: { text: string; mood: JellyBlobMood }[] = [
      { text: "boop! that tickles! 🫧", mood: "surprised" },
      { text: "wheee! squishy jelly! ✨", mood: "happy" },
      { text: "stop poking my tummy! 😆", mood: "shy" },
      { text: "blob loves you! ❤️", mood: "love" },
      { text: "poke detected! ⚡", mood: "curious" },
    ];

    const pick = pokeReplies[nextCount % pokeReplies.length];
    setSpeech(pick.text);
    setMood(pick.mood);
  };

  const handleOverpoke = () => {
    setMood("shy");
    setSpeech("woah! give a blob some personal space! 🙈");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Text input is converted to lower case as requested
    setInput(e.target.value.toLowerCase());
    setIsTyping(true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 600);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex w-full flex-col items-center justify-center py-4"
    >
      {/* ── 1. BLOB'S SPEECH MESSAGE (THE ANSWER) WITH GENTLE IDLE FLOAT ──── */}
      <motion.div
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.15,
        }}
        className="flex min-h-[64px] items-end justify-center pb-2"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={speech}
            initial={{ opacity: 0, scale: 0.88, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: -6 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            className="relative max-w-[340px] rounded-2xl border border-white/[0.12] bg-[#141419]/90 px-4 py-2.5 text-center shadow-[0_12px_30px_rgba(0,0,0,0.55)] backdrop-blur-md"
          >
            <p className="text-[13px] font-mono leading-snug tracking-wide text-neutral-100">
              {speech}
            </p>
            {/* Speech bubble downward pointer tail */}
            <div className="absolute left-1/2 -bottom-2 h-0 w-0 -translate-x-1/2 border-x-8 border-x-transparent border-t-8 border-t-[#141419]/90" />
            <div className="absolute left-1/2 -bottom-[9px] -z-10 h-0 w-0 -translate-x-1/2 border-x-8 border-x-transparent border-t-8 border-t-white/[0.12]" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* ── 2. BLOB MASCOT WITH ORGANIC IDLE FLOAT & SQUASH-AND-STRETCH ──── */}
      <motion.div
        animate={{
          y: [0, -9, 0],
          rotate: [0, 1.2, -1.2, 0],
          scale: [1, 1.025, 0.99, 1],
        }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="blob-amber-theme relative my-2 flex h-48 w-48 sm:h-56 sm:w-56 items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
        onClick={handlePoke}
        title="Click to poke the blob!"
      >
        {/* Soft radial glow behind blob with breathing pulse */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.18, 0.32, 0.18],
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          aria-hidden
          className="pointer-events-none absolute h-36 w-48 rounded-full bg-[#e8814a] blur-3xl -z-10"
        />

        {mounted ? (
          <JellyBlobMascot
            mood={mood}
            eyeStyle="v1"
            happyEyes="star"
            gaze={gaze}
            blink={idleBlink}
            nod={isTyping}
            celebrate={celebrateCount}
            onPoke={handlePoke}
            onOverpoke={handleOverpoke}
            className="h-full w-full drop-shadow-[0_15px_30px_rgba(232,129,74,0.35)]"
          />
        ) : (
          <div className="h-36 w-36 rounded-full bg-[#e8814a]/20 animate-pulse" />
        )}
      </motion.div>

      {/* ── 3. SIMPLE INPUT OPTION (NO EXTRA BORDER, NOTHING) ──── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="mt-4 w-full max-w-[340px]"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            // Text input converted into lower case
            value={input}
            onChange={handleInputChange}
            placeholder="ask blob anything... (e.g. who are you)"
            className="w-full rounded-full border border-white/15 bg-white/[0.04] pl-4 pr-11 py-2.5 text-[12px] font-mono text-neutral-100 placeholder:text-neutral-500 focus:border-[#e8814a] focus:bg-[#e8814a]/5 focus:outline-none transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#e8814a] text-neutral-950 font-bold transition-all hover:bg-[#ff965d] active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_10px_rgba(232,129,74,0.4)]"
            aria-label="Send question to blob"
          >
            <Send size={12} />
          </button>
        </div>
      </form>
    </div>
  );
}
