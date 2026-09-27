import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import TerminalContact from "@/components/TerminalContact";

export default function Home() {
  return (
    <main className="relative w-full overflow-hidden text-stone-800">
      
      {/* GLOBAL BACKGROUND - Solid Putih Tulang dengan Dotted Grid Halus */}
      <div className="fixed inset-0 -z-50 bg-[#FBF9F6]">
        {/* Pola Titik-Titik (Dotted Grid) untuk mengisi kekosongan visual secara profesional */}
        <div className="absolute inset-0 bg-[radial-gradient(#d6d3d1_1px,transparent_1px)] [background-size:40px_40px] opacity-40 pointer-events-none" />
      </div>

      {/* Scene 1: The Hook */}
      <Hero />

      {/* Scene 2: The Arsenal (Floating Tech Stack) */}
      <Skills />

      {/* Scene 3: The Archives (Horizontal Scroll) */}
      <Projects />

      {/* Scene 4: The Beacon (Interactive Terminal Contact) */}
      <TerminalContact />
    </main>
  );
}
