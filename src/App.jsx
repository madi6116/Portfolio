import { useState, useEffect, useRef } from "react";

// ── Scroll-reveal hook ──────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── SVG Icons ───────────────────────────────────────────────────────
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4zM8 8h3.8v2.2h.05c.53-1 1.83-2.2 3.77-2.2 4.03 0 4.78 2.66 4.78 6.1V24h-4v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.7-2.54 3.5V24h-4z"/>
  </svg>
);
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.1.79-.25.79-.55v-2.02c-3.2.7-3.88-1.54-3.88-1.54-.52-1.3-1.27-1.65-1.27-1.65-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.67 1.24 3.32.95.1-.74.4-1.25.72-1.54-2.56-.29-5.26-1.28-5.26-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.52-1.45.11-3.03 0 0 .97-.31 3.18 1.18a10.94 10.94 0 012.9-.39c.98 0 1.97.13 2.9.39 2.2-1.5 3.17-1.18 3.17-1.18.64 1.58.24 2.74.12 3.03.74.81 1.18 1.83 1.18 3.09 0 4.41-2.71 5.38-5.29 5.67.41.36.77 1.1.77 2.23v3.3c0 .3.21.66.8.55A10.52 10.52 0 0023.5 12c0-6.28-5.23-11.5-11.5-11.5z"/>
  </svg>
);
const EmailIcon = () => (
  <svg viewBox="-2 -2 28 28" fill="currentColor" width="22" height="22">
    <path d="M0 4a2 2 0 012-2h20a2 2 0 012 2v16a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2 0l10 7 10-7H2zm0 2.236V20h20V6.236l-10 7-10-7z"/>
  </svg>
);

// ── Typing animation ────────────────────────────────────────────────
function TypeWriter({ words }) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !deleting) {
      setTimeout(() => setDeleting(true), 1500);
      return;
    }
    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex(i => (i + 1) % words.length);
      return;
    }
    const t = setTimeout(() => setSubIndex(s => s + (deleting ? -1 : 1)), deleting ? 60 : 100);
    return () => clearTimeout(t);
  }, [subIndex, index, deleting, words]);

  return (
    <span style={{ color: "#00e5a0" }}>
      {words[index].substring(0, subIndex)}
      <span style={{ opacity: blink ? 1 : 0, transition: "opacity 0.1s" }}>|</span>
    </span>
  );
}

// ── Reveal wrapper ──────────────────────────────────────────────────
function Reveal({ children, delay = 0, style = {}, href }) {
  const [ref, visible] = useReveal();
  const s = {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(40px)",
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    ...style,
  };
  if (href) return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      ref={ref} style={{ textDecoration: "none", color: "inherit", display: "block", ...s }}>
      {children}
    </a>
  );
  return <div ref={ref} style={s}>{children}</div>;
}

// ── Section heading ─────────────────────────────────────────────────
function SectionHeading({ children }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.5s ease",
      textAlign: "center",
      marginBottom: "56px",
    }}>
      <h2 style={{
        fontSize: "2.2rem",
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700,
        margin: 0,
        display: "inline-block",
        position: "relative",
        color: "#fff",
        letterSpacing: "0.04em",
        paddingBottom: "12px",
      }}>
        {children}
        <span style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #00e5a0, #0077ff)",
          borderRadius: "2px",
        }} />
      </h2>
    </div>
  );
}

// ── Data ────────────────────────────────────────────────────────────
const experience = [
  {
    company: "Best Buy", role: "Geek Squad Consultation Agent", icon: "🔧",
    desc: "Diagnosed and resolved hardware, software, and network issues across Windows, macOS, and mobile systems. Provided technical support for OS reinstalls, driver updates, malware removal, and data recovery while maintaining clear communication with customers.",
    link: "https://www.bestbuy.com/site/electronics/services/pcmcat1528819595254.c",
  },
  {
    company: "Firefox Student Ambassador", role: "Student Ambassador", icon: "🦊",
    desc: "Helped launch the first Firefox Student Ambassador program on campus, building brand presence through creative events. Designed a compliant website in coordination with Mozilla's legal team and organized case competitions, themed promotions, and giveaways.",
    link: "https://soloist.ai/responsiblecomputingclub",
  },
  {
    company: "Responsible Computing Club", role: "Lead Industry Mozilla Ambassador", icon: "💡",
    desc: "Led initiatives to promote responsible computing and ethical technology use by planning and executing 7+ events each semester. Managed a team of 4 to coordinate speaker events and workshops with industry professionals.",
    link: "https://www.instagram.com/rcc.sjsu",
  },
  {
    company: "IDEAs Entrepreneurship Club", role: "Vice President", icon: "🚀",
    desc: "Judged for SJ Hacks with 30+ applications, organized events that boosted membership by 5%, and supported executive board growth through recruitment, interviews, and team coordination.",
    link: "https://www.instagram.com/ideas.sjsu/",
  },
];

const projects = [
  {
    title: "EPA ESA Web App", role: "User Research Lead",
    desc: "Led user research for a 3-person team to design a centralized web platform helping farmers identify pesticide options by region. Created an interactive Figma prototype and supported development with React Native.",
    link: "", tags: ["React Native", "Figma", "JavaScript"],
  },
  {
    title: "Reef Guardian Game", role: "System Architect",
    desc: "5-person team Java side-scroller game. Served as system architect creating UML diagrams and flowcharts, and contributed to gameplay logic, debugging, and optimization.",
    link: "https://github.com/d2blepeace/CMPE-131-Term-Project", tags: ["Java", "LibGDX", "UML"],
  },
  {
    title: "Overwatchful", role: "Developer",
    desc: "Solo stats tracker for Overwatch 2 — search any player and view their rank, time played, and more.",
    link: "https://github.com/madi6116/OW2-Stats-Tracker", tags: ["JavaScript", "API", "Node.js"],
  },
  {
    title: "Engineering Labs", role: "Developer",
    desc: "12+ advanced Java applications covering OOP, data structures, debugging, inheritance, polymorphism, and encapsulation.",
    link: "https://github.com/madi6116/EngineeringLabs", tags: ["Java", "OOP", "Data Structures"],
  },
  {
    title: "Solar Panel Suitcase", role: "Project Lead",
    desc: "Led a team of 5 to build a solar panel suitcase providing sustainable lighting to underdeveloped regions in Africa, supporting a hospital's operations.",
    link: "#", tags: ["Hardware", "Leadership", "Sustainability"],
  },
  {
    title: "Autonomous Robot", role: "Software Engineer",
    desc: "Autonomous robot integrating electrical, mechanical, and software systems. Nominated for the Youth Service Awards 2023 for excellence in STEM innovation and sustainability.",
    link: "https://www.linkedin.com/feed/update/urn:li:activity:7251777779870904320", tags: ["C++", "Sensors", "Robotics"],
  },
  {
    title: "Campus Essentials Hub", role: "Designer",
    desc: "Ideathon project — a mobile app centralizing campus aid, filtering resources by eligibility, and gamifying engagement to help SJSU students access support they need.",
    link: "https://www.figma.com/proto/ay65PCiQElNKbUrZYl3UXi/Hacktivism-II-Mockups---Fall-2025", tags: ["Figma", "UX Research", "Prototyping"],
  },
   {
    title: "Eco Choices", role: "Designer",
    desc: "STEMpower Hacks Hackathon — a mobile game that shows you and ecourages you to make sustainable choices in your daily life. Designed the UI/UX and created a Figma prototype for user testing.",
    link: "https://www.linkedin.com/in/madison-ammirati/overlay/Project/1415640629/treasury/?profileId=ACoAAEcpmVEBlc5uJnZTn34-Xdh2TulTDI5SNUI", tags: ["Figma", "Wireframing", "Prototyping"],
  },
];

const skills = {
  "Languages":        ["Java", "Python", "HTML", "CSS", "JavaScript", "x86 Assembly", "C++", "SQL"],
  "Frameworks & Tools": ["React", "Node.js", "Express.js", "React Native", "Git", "LibGDX", "JavaFX", "VSCode", "IntelliJ"],
  "Operating Systems":    ["Windows", "Linux", "Chrome OS", "macOS"],
  "Design / UI":      ["Figma", "Adobe Audition", "GIMP", "Canva", "soloist.ai", "IMovie"],
  "Software Engineering Concepts": ["Data Structures & Algorithms", "Object-Oriented Design (OOP)", "RESTful APIs", "MVC & Design Patterns", "Debugging & Unit Testing", "SDLC", "Agile/Scrum", "Client–Server Architecture", "Authentication & Authorization", "Database Design", "State Management", "API Integration", "Version Control", "Cloud Fundamentals"],
  "Certifications":   ["Microsoft Python Programming Fundamentals (Coursera)", "Google's Cybersecurity Certificate (IN PROGRESS)"],
}
// ── App ─────────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen]           = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [heroVisible, setHeroVisible]     = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const ids = ["home","about","skills","experience","projects","contact"];
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) { setActiveSection(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navLinks = ["home","about","skills","experience","projects","contact"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #04040f; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #04040f; }
        ::-webkit-scrollbar-thumb { background: #00e5a0; border-radius: 3px; }

        .nav-link {
          color: rgba(232,234,240,0.65);
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 2px;
          position: relative;
          transition: color 0.2s;
          background: none; border: none; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: #00e5a0;
          transform: scaleX(0);
          transition: transform 0.25s ease;
          border-radius: 2px;
        }
        .nav-link:hover, .nav-link.active { color: #00e5a0; }
        .nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }

        .card {
          background: linear-gradient(135deg, rgba(8,8,28,0.97) 0%, rgba(4,4,18,0.99) 100%);
          border: 1px solid rgba(0,229,160,0.18);
          border-radius: 16px;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,229,160,0.03) 0%, transparent 50%);
          border-radius: inherit;
          pointer-events: none;
        }
        .card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(0,229,160,0.1), 0 0 0 1px rgba(0,229,160,0.35);
          border-color: rgba(0,229,160,0.45);
        }

        .skill-tag {
          display: inline-block;
          background: rgba(0,229,160,0.07);
          border: 1px solid rgba(0,229,160,0.22);
          color: #00e5a0;
          border-radius: 6px;
          padding: 5px 12px;
          font-size: 0.82rem;
          font-family: 'Space Mono', monospace;
          letter-spacing: 0.02em;
          transition: background 0.2s, border-color 0.2s;
        }
        .skill-tag:hover { background: rgba(0,229,160,0.14); border-color: rgba(0,229,160,0.45); }

        .tag-badge {
          display: inline-block;
          background: rgba(0,119,255,0.1);
          border: 1px solid rgba(0,119,255,0.28);
          color: #5ba4ff;
          border-radius: 5px;
          padding: 3px 10px;
          font-size: 0.76rem;
          font-family: 'Space Mono', monospace;
          margin: 3px 3px 3px 0;
        }

        .social-btn {
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px;
          border: 1px solid rgba(0,229,160,0.22);
          border-radius: 10px;
          color: rgba(232,234,240,0.6);
          text-decoration: none;
          transition: all 0.25s ease;
          background: rgba(0,229,160,0.04);
        }
        .social-btn:hover {
          border-color: #00e5a0;
          color: #00e5a0;
          background: rgba(0,229,160,0.1);
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,229,160,0.15);
        }

        .primary-btn {
          background: linear-gradient(135deg, #00e5a0, #0077ff);
          color: #04040f;
          border: none; border-radius: 10px;
          padding: 14px 30px;
          font-size: 1rem; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; letter-spacing: 0.03em;
          transition: all 0.3s ease;
        }
        .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,229,160,0.3); }

        .ghost-btn {
          background: transparent;
          color: #00e5a0;
          border: 1px solid rgba(0,229,160,0.35);
          border-radius: 10px;
          padding: 14px 30px;
          font-size: 1rem; font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; letter-spacing: 0.03em;
          transition: all 0.3s ease;
        }
        .ghost-btn:hover { border-color: #00e5a0; background: rgba(0,229,160,0.08); transform: translateY(-2px); }

        .form-input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(0,229,160,0.18);
          border-radius: 8px;
          padding: 12px 16px;
          color: #e8eaf0;
          font-size: 1rem;
          width: 100%;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-input:focus {
          border-color: rgba(0,229,160,0.5);
          box-shadow: 0 0 0 3px rgba(0,229,160,0.08);
        }
        .form-input::placeholder { color: rgba(232,234,240,0.3); }

        .submit-btn {
          background: linear-gradient(135deg, #00e5a0, #0077ff);
          color: #04040f;
          border: none; border-radius: 10px;
          padding: 14px; width: 100%;
          font-size: 1rem; font-weight: 700;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; letter-spacing: 0.04em;
          transition: all 0.3s ease;
        }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,229,160,0.3); }

        .mobile-menu {
          position: fixed; inset: 0; top: 60px;
          background: rgba(4,4,15,0.98);
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 36px; z-index: 998;
        }

        @keyframes scrollPulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
          .hero-name { font-size: 2.8rem !important; }
          .section { padding: 70px 18px !important; }
          .exp-card-inner { flex-direction: column !important; }
        }
      `}</style>

      <div style={{ background: "#04040f", color: "#e8eaf0", minHeight: "100vh", overflowX: "hidden" }}>

        {/* ── NAV ── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
          padding: scrolled ? "12px 48px" : "22px 48px",
          background: scrolled ? "rgba(4,4,15,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,229,160,0.12)" : "none",
          transition: "all 0.4s ease",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div
            onClick={() => scrollTo("home")}
            style={{ fontFamily: "'Space Mono', monospace", fontSize: "1.15rem", fontWeight: 700, color: "#00e5a0", cursor: "pointer", letterSpacing: "0.05em" }}
          >
            MA_
          </div>

          {/* Desktop links */}
          <ul className="desktop-nav" style={{ display: "flex", gap: "36px", listStyle: "none" }}>
            {navLinks.map(s => (
              <li key={s}>
                <button className={`nav-link${activeSection === s ? " active" : ""}`} onClick={() => scrollTo(s)}>
                  {s}
                </button>
              </li>
            ))}
          </ul>

          {/* Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(o => !o)}
            style={{ display: "none", flexDirection: "column", gap: "5px", background: "none", border: "none", cursor: "pointer", padding: "4px", zIndex: 999 }}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: "block", width: "24px", height: "2px",
                background: "#00e5a0", borderRadius: "2px", transition: "all 0.3s",
                transform: menuOpen
                  ? (i===0 ? "rotate(45deg) translate(5px,5px)" : i===2 ? "rotate(-45deg) translate(5px,-5px)" : "scaleX(0)")
                  : "none",
              }} />
            ))}
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-menu">
            {navLinks.map(s => (
              <button key={s} className="nav-link" onClick={() => scrollTo(s)} style={{ fontSize: "1.4rem" }}>{s}</button>
            ))}
          </div>
        )}

        {/* ── HERO ── */}
        <section id="home" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", textAlign: "center", padding: "0 24px", overflow: "hidden" }}>
          {/* Grid background */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "linear-gradient(rgba(0,229,160,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,160,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          }} />
          {/* Glow blobs */}
          <div style={{ position: "absolute", top: "25%", left: "30%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(0,119,255,0.1) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "55%", right: "25%", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(0,229,160,0.07) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(30px)", transition: "all 0.7s ease 0.1s", marginBottom: "12px" }}>
              <span style={{ fontFamily: "'Space Mono', monospace", color: "#00e5a0", fontSize: "0.9rem", letterSpacing: "0.18em" }}>👋 Hello World! I'm</span>
            </div>

            <h1
              className="hero-name"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.02em", color: "#fff",
                marginBottom: "18px",
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.7s ease 0.25s",
              }}
            >
              Madison<br />Ammirati
            </h1>

            <div style={{
              fontSize: "clamp(1.1rem, 2.5vw, 1.45rem)",
              color: "rgba(232,234,240,0.7)", fontWeight: 300, marginBottom: "44px",
              opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.7s ease 0.4s",
            }}>
              <TypeWriter words={["Software Engineer", "UI/UX Designer", "Innovator", "Problem Solver"]} />
            </div>

            <div style={{
              display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap",
              opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.7s ease 0.55s",
            }}>
              <button className="primary-btn" onClick={() => scrollTo("projects")}>View Projects</button>
              <button className="ghost-btn" onClick={() => scrollTo("contact")}>Contact Me</button>
            </div>
          </div>

          {/* Scroll cue */}
          <div style={{
            position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
            opacity: heroVisible ? 0.45 : 0, transition: "opacity 1s ease 1.4s",
          }}>
            <span style={{ fontSize: "0.72rem", letterSpacing: "0.15em", color: "#00e5a0", fontFamily: "'Space Mono', monospace" }}>SCROLL</span>
            <div style={{ width: "1px", height: "44px", background: "linear-gradient(to bottom, #00e5a0, transparent)", animation: "scrollPulse 2s infinite" }} />
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" className="section" style={{ maxWidth: "900px", margin: "0 auto", padding: "100px 24px" }}>
          <SectionHeading>About Me</SectionHeading>
          <Reveal>
            <div className="card" style={{ padding: "52px 44px", display: "flex", flexDirection: "column", alignItems: "center", gap: "28px", textAlign: "center" }}>
              <div style={{
                width: "100px", height: "100px", borderRadius: "50%",
                background: "linear-gradient(135deg, #00e5a0, #0077ff)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2.6rem", boxShadow: "0 0 50px rgba(0,229,160,0.22)", flexShrink: 0,
                animation: "float 4s ease-in-out infinite",
              }}>
                <img src="headshot.png" alt="Headshot" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
              </div>
              <p style={{ fontSize: "1.08rem", lineHeight: 1.85, color: "rgba(232,234,240,0.78)", maxWidth: "680px", fontWeight: 300 }}>
                Motivated and detail-oriented aspiring Software Engineer seeking internship opportunities to leverage academic knowledge and gain hands-on experience. Highly adept at problem-solving, software development, and team collaboration, with a strong commitment to innovation and excellence.
              </p>
              <div style={{ display: "flex", gap: "14px" }}>
                <a href="https://www.linkedin.com/in/madison-ammirati/" target="_blank" rel="noopener noreferrer" className="social-btn"><LinkedInIcon /></a>
                <a href="https://github.com/madi6116" target="_blank" rel="noopener noreferrer" className="social-btn"><GitHubIcon /></a>
                <a href="mailto:madison.ammirati@gmail.com" className="social-btn"><EmailIcon /></a>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── SKILLS ── */}
        <section id="skills" className="section" style={{ maxWidth: "1100px", margin: "0 auto", padding: "100px 24px" }}>
          <SectionHeading>Skills</SectionHeading>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            {Object.entries(skills).map(([cat, items], i) => (
              <Reveal key={cat} delay={i * 0.1}>
                <div className="card" style={{ padding: "28px", height: "100%" }}>
                  <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.78rem", color: "#00e5a0", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "18px" }}>{cat}</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {items.map(s => <span key={s} className="skill-tag">{s}</span>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── EXPERIENCE ── */}
        <section id="experience" className="section" style={{ maxWidth: "1100px", margin: "0 auto", padding: "100px 24px" }}>
          <SectionHeading>Experience</SectionHeading>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {experience.map((exp, i) => (
              <Reveal key={exp.company} delay={i * 0.1} href={exp.link}>
                <div className="card" style={{ padding: "28px 32px" }}>
                  <div className="exp-card-inner" style={{ display: "flex", alignItems: "flex-start", gap: "22px" }}>
                    <div style={{
                      width: "52px", height: "52px", borderRadius: "12px", flexShrink: 0,
                      background: "linear-gradient(135deg, rgba(0,229,160,0.12), rgba(0,119,255,0.12))",
                      border: "1px solid rgba(0,229,160,0.18)",
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem",
                    }}>
                      {exp.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                        <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: "1.05rem", color: "#fff" }}>{exp.company}</h3>
                        <span style={{ fontSize: "0.82rem", color: "#00e5a0", fontWeight: 600, letterSpacing: "0.02em" }}>{exp.role}</span>
                      </div>
                      <p style={{ fontSize: "0.93rem", lineHeight: 1.8, color: "rgba(232,234,240,0.65)", fontWeight: 300 }}>{exp.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" className="section" style={{ maxWidth: "1100px", margin: "0 auto", padding: "100px 24px" }}>
          <SectionHeading>Projects</SectionHeading>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))", gap: "20px" }}>
            {projects.map((proj, i) => (
              <Reveal key={proj.title} delay={i * 0.08} href={proj.link || undefined}>
                <div className="card" style={{ padding: "28px", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px" }}>
                    <div style={{ fontSize: "1.6rem" }}>📁</div>
                    {proj.link && proj.link !== "#" && proj.link !== "" && (
                      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="rgba(0,229,160,0.45)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                    )}
                  </div>
                  <h3 style={{ fontFamily: "'Space Mono', monospace", fontSize: "1rem", color: "#fff", marginBottom: "5px" }}>{proj.title}</h3>
                  <span style={{ fontSize: "0.82rem", color: "#00e5a0", fontWeight: 600, marginBottom: "12px", display: "block" }}>{proj.role}</span>
                  <p style={{ fontSize: "0.91rem", lineHeight: 1.78, color: "rgba(232,234,240,0.6)", fontWeight: 300, flex: 1, marginBottom: "20px" }}>{proj.desc}</p>
                  <div>{proj.tags.map(t => <span key={t} className="tag-badge">{t}</span>)}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="section" style={{ maxWidth: "600px", margin: "0 auto", padding: "100px 24px" }}>
          <SectionHeading>Contact</SectionHeading>
          <Reveal>
            <div className="card" style={{ padding: "48px 40px" }}>
              <p style={{ textAlign: "center", color: "rgba(232,234,240,0.6)", marginBottom: "36px", fontSize: "1rem", lineHeight: 1.75, fontWeight: 300 }}>
                Have a question or want to work together? Drop me a message!
              </p>
              <form action="https://formspree.io/f/xblzagyy" method="POST" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "#00e5a0", fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Name</label>
                  <input type="text" name="name" required className="form-input" placeholder="Your name" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "#00e5a0", fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Email</label>
                  <input type="email" name="_replyto" required className="form-input" placeholder="your@email.com" />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "#00e5a0", fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>Message</label>
                  <textarea name="message" required rows={5} className="form-input" placeholder="What's on your mind?" style={{ resize: "none" }} />
                </div>
                <button type="submit" className="submit-btn">Send Message ✦</button>
              </form>
            </div>
          </Reveal>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: "1px solid rgba(0,229,160,0.1)", background: "rgba(0,0,0,0.35)", padding: "40px 24px", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "14px", marginBottom: "20px" }}>
            <a href="https://www.linkedin.com/in/madison-ammirati/" target="_blank" rel="noopener noreferrer" className="social-btn"><LinkedInIcon /></a>
            <a href="https://github.com/madi6116" target="_blank" rel="noopener noreferrer" className="social-btn"><GitHubIcon /></a>
            <a href="mailto:madison.ammirati@gmail.com" className="social-btn"><EmailIcon /></a>
          </div>
          <p style={{ color: "rgba(232,234,240,0.3)", fontSize: "0.82rem", fontFamily: "'Space Mono', monospace" }}>
            © 2025 Madison Ammirati — Built with React
          </p>
        </footer>

      </div>
    </>
  );
}
