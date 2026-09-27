"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "@/context/LanguageContext";

type HistoryItem = {
  id: number;
  role: "system" | "user" | "success" | "error" | "jsx";
  content: string | React.ReactNode;
};

export default function TerminalContact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const { t } = useLanguage();

  const [history, setHistory] = useState<HistoryItem[]>([
    { id: 1, role: "system", content: "AhnanOS [Version 1.0.0]" },
    { id: 2, role: "system", content: "(c) 2024 Ahnan. All rights reserved." },
    { id: 3, role: "system", content: " " },
    { id: 4, role: "system", content: "Type 'help' to see available commands." },
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"idle" | "name" | "email" | "message">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.fromTo(
      terminalRef.current,
      { y: 100, opacity: 0, rotateX: 10, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        scale: 1,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      }
    );
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [history]);

  const pushHistory = (role: HistoryItem["role"], content: string | React.ReactNode) => {
    setHistory((prev) => [...prev, { id: Date.now() + Math.random(), role, content }]);
  };

  const handleCommand = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    
    let prefix = "visitor@ahnan.dev:~$ ";
    if (mode === "name") prefix = "Name: ";
    if (mode === "email") prefix = "Email: ";
    if (mode === "message") prefix = "Message: ";
    
    pushHistory("user", <span className="font-bold text-white">{prefix}{cmd}</span>);
    setInput("");

    if (mode === "idle") {
      switch (cmd.toLowerCase()) {
        case "help":
          pushHistory("jsx", (
            <div className="flex flex-col gap-2 my-4 p-4 border border-white/10 bg-white/5 rounded-lg">
              <span className="text-stone-400 font-bold mb-1">{t.terminal.cmdAvailable}</span>
              
              <div className="grid grid-cols-[80px_1fr] md:grid-cols-[100px_1fr] gap-2 text-sm">
                <span className="text-cyan-400 font-bold">contact</span>
                <span className="text-stone-300">{t.terminal.cmdContact}</span>
                
                <span className="text-cyan-400 font-bold">github</span>
                <a href="https://github.com/ANazmuddin" target="_blank" rel="noreferrer" className="text-fuchsia-300 hover:text-white underline underline-offset-4 transition-colors cursor-none">
                  {t.terminal.cmdGithub}
                </a>
                
                <span className="text-cyan-400 font-bold">linkedin</span>
                <a href="https://linkedin.com/in/AhmadNazmuddin" target="_blank" rel="noreferrer" className="text-fuchsia-300 hover:text-white underline underline-offset-4 transition-colors cursor-none">
                  {t.terminal.cmdLinkedin}
                </a>
                
                <span className="text-cyan-400 font-bold">clear</span>
                <span className="text-stone-300">{t.terminal.cmdClear}</span>
              </div>
            </div>
          ));
          break;
        case "contact":
          pushHistory("system", t.terminal.msgInitiating);
          pushHistory("system", t.terminal.msgAskName);
          setMode("name");
          break;
        case "github":
          pushHistory("jsx", (
            <div className="my-2 text-stone-300">
              {t.terminal.msgOpening} <a href="https://github.com/ANazmuddin" target="_blank" rel="noreferrer" className="text-cyan-400 underline underline-offset-2 cursor-none">https://github.com/ANazmuddin ↗</a>
            </div>
          ));
          window.open("https://github.com/ANazmuddin", "_blank");
          break;
        case "linkedin":
          pushHistory("jsx", (
            <div className="my-2 text-stone-300">
              {t.terminal.msgOpening} <a href="https://linkedin.com/in/AhmadNazmuddin" target="_blank" rel="noreferrer" className="text-cyan-400 underline underline-offset-2 cursor-none">https://linkedin.com/in/AhmadNazmuddin ↗</a>
            </div>
          ));
          window.open("https://linkedin.com/in/AhmadNazmuddin", "_blank");
          break;
        case "clear":
          setHistory([]);
          break;
        default:
          pushHistory("error", `Command not found: ${cmd}. Type 'help' for available commands.`);
      }
    } else if (mode === "name") {
      setFormData({ ...formData, name: cmd });
      pushHistory("system", `${t.terminal.msgHello}${cmd}${t.terminal.msgAskEmail}`);
      setMode("email");
    } else if (mode === "email") {
      if (!cmd.includes("@")) {
        pushHistory("error", t.terminal.msgInvalidEmail);
      } else {
        setFormData({ ...formData, email: cmd });
        pushHistory("system", t.terminal.msgAskMessage);
        setMode("message");
      }
    } else if (mode === "message") {
      pushHistory("system", t.terminal.msgEncrypting);
      
      setTimeout(() => {
        pushHistory("success", t.terminal.msgSuccess);
        pushHistory("system", " ");
        setMode("idle");
        setFormData({ name: "", email: "", message: "" });
      }, 1500);
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <section ref={containerRef} className="relative min-h-[90vh] md:min-h-screen w-full flex items-center justify-center bg-transparent py-16 px-4 md:py-20 md:px-6 overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full -z-10 pointer-events-none opacity-[0.03] flex justify-center">
        <h2 className="text-[25vw] font-black text-stone-900 select-none tracking-tighter">
          {t.terminal.bgText}
        </h2>
      </div>

      <div className="w-full max-w-3xl z-10 flex flex-col items-center">
        <h2 className="text-3xl md:text-5xl font-black mb-8 md:mb-12 tracking-tighter text-stone-800 text-center drop-shadow-sm">
          {t.terminal.title}
        </h2>

        <div 
          ref={terminalRef}
          onClick={handleTerminalClick}
          className="w-full h-[400px] md:h-[500px] bg-neutral-950/95 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.2)] flex flex-col font-mono text-xs md:text-sm cursor-text perspective-1000"
        >
          <div className="h-10 md:h-12 bg-neutral-900 border-b border-white/5 flex items-center px-4 gap-2 select-none">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            <div className="mx-auto text-neutral-500 text-[10px] md:text-xs font-bold tracking-widest uppercase">
              bash — ahnan.dev
            </div>
          </div>

          <div ref={scrollAreaRef} className="flex-1 p-4 md:p-6 overflow-y-auto scrollbar-hide text-stone-300">
            {history.map((item) => (
              <div 
                key={item.id} 
                className={`mb-2 ${item.role === 'error' ? 'text-red-400' : item.role === 'success' ? 'text-green-400 font-bold' : ''}`}
              >
                {item.content}
              </div>
            ))}

            <form onSubmit={handleCommand} className="flex flex-wrap md:flex-nowrap items-center mt-2">
              <span className="text-orange-400 mr-2 shrink-0 font-bold">
                {mode === "idle" ? "visitor@ahnan.dev:~$" : mode === "name" ? "Name:" : mode === "email" ? "Email:" : "Message:"}
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 min-w-[100px] bg-transparent border-none outline-none text-white caret-white font-bold"
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
