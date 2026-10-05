import Link from "next/link";
import Feedback from "@/app/components/Feedback";

export const metadata = { title: "More about Kay - Portfolio" };

const projects = [
  {
    title: "Sampah Go",
    emoji: "♻️",
    bg: "linear-gradient(135deg,#cfeccf,#f6f0b8)",
    r: -1.5,
    description:
      "A gamified app that teaches waste management. Students scan waste, earn points, and learn to care about their environment.",
    tech: [["Flutter", "s2"], ["Firebase", "s3"], ["UI/UX", "s1"]],
  },
  {
    title: "Nusantara Rasa",
    emoji: "🍜",
    bg: "linear-gradient(135deg,#ffd9e6,#ffe9c7)",
    r: 1.2,
    description:
      "A recipe website that introduces traditional Indonesian dishes, with ingredients and cooking steps.",
    tech: [["Laravel", "s5"], ["PHP", "s6"], ["MySQL", "s8"]],
  },
  {
    title: "A.U.R.A Box",
    emoji: "🌦️",
    bg: "linear-gradient(135deg,#d8e6ff,#e9ddff)",
    r: -0.8,
    description:
      "An IoT project that simulates weather conditions using sensors and a monitoring system.",
    tech: [["ESP32", "s4"], ["IoT", "s7"], ["AI", "s1"]],
  },
];

export default function More() {
  return (
    <main>
      <div className="col" aria-hidden="true" />
      <div className="wrap">
        <Link className="back" href="/">
          ← Back to home
        </Link>

        <section className="sec">
          <h2 className="script">About me</h2>
          <div className="about">
            <div>
              <p>
                I&apos;m interested in UI/UX design, web development, and creating digital
                products that solve real problems. I like to start from a sketch in Figma,
                then carry it all the way to working code.
              </p>
              <p>
                My projects range from a gamified waste-sorting app for students to a recipe
                website and an IoT weather box.
              </p>
            </div>
            <div className="facts">
              <div><b>Focus</b>UI/UX, web, mobile</div>
              <div><b>Tools</b>Figma, Next.js, React, Laravel, Flutter</div>
              <div><b>Based in</b>Makassar, Indonesia</div>
            </div>
          </div>
        </section>

        <section className="sec">
          <h2 className="script">Experiences</h2>
          <div className="book">
            <div className="pg l">
              <h3 className="script">Notes</h3>
              <div className="note" style={{ ["--r" as string]: "-1.5deg" }}>
                <b>Education</b>SMK Telkom Makassar, sejak 2024
              </div>
              <div className="note" style={{ ["--r" as string]: "1deg" }}>
                <b>Research</b>OPSI research project: Sampah Go for vocational students
              </div>
            </div>
            <div className="pg r">
              <h3 className="script">Journal</h3>
              <div className="note" style={{ ["--r" as string]: "1deg" }}>
                <b>Design</b>Wireframes and UI in Figma
              </div>
              <div className="note" style={{ ["--r" as string]: "-1deg" }}>
                <b>Build</b>Laravel web apps, Flutter mobile apps, ESP32 prototypes
              </div>
            </div>
          </div>
        </section>

        <section className="sec">
          <h2 className="script b">Projects</h2>
          <div className="grid">
            {projects.map((p) => (
              <article key={p.title} className="card" style={{ ["--r" as string]: `${p.r}deg` }}>
                <div className="cover" style={{ ["--g" as string]: p.bg }}>
                  {p.emoji}
                </div>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
                {p.tech.map(([label, c]) => (
                  <span key={label} className={`stk ${c}`}>
                    {label}
                  </span>
                ))}
              </article>
            ))}
          </div>
        </section>

        <section className="sec" id="feedback">
          <h2 className="script">Leave a note</h2>
          <Feedback />
        </section>

        <section className="sec">
          <div className="mail">
            <div className="script">Let&apos;s create something together.</div>
            <div>
              Have a project or idea?
              <br />
              <a href="mailto:your@email.com">your@email.com</a>
            </div>
          </div>
        </section>

        <div className="foot">
          <Link className="btn" href="/">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
