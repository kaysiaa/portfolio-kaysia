import Link from "next/link";

const skills = [
  { label: "UI/UX Design", c: "s1", r: -3 },
  { label: "Figma", c: "s2", r: 2 },
  { label: "Next.js", c: "s3", r: -2 },
  { label: "React", c: "s4", r: 3 },
  { label: "Laravel", c: "s5", r: -3 },
  { label: "Flutter", c: "s6", r: 2 },
  { label: "HTML", c: "s7", r: -2 },
  { label: "CSS", c: "s8", r: 3 },
];

export default function Home() {
  return (
    <main>
      <div className="col" aria-hidden="true" />

      <div className="wrap">
        <section className="hero">
          <div className="frame" aria-hidden="true">
            <div className="ring">
              <span className="script">K</span>
            </div>

            <span className="fl" style={{ left: -18, top: 30 }}>
              ✨
            </span>

            <span className="fl" style={{ right: -14, top: 0 }}>
              🌷
            </span>

            <span className="fl" style={{ left: -22, bottom: -4 }}>
              🌸
            </span>

            <span className="fl" style={{ right: -20, bottom: 6 }}>
              🌺
            </span>
          </div>

          <div>
            <h1 className="script">Hallo!</h1>

            <p>
              Saya Kaysia, seorang desainer dan pengembang UI/UX yang senang
              mengubah ide menjadi antarmuka yang sederhana, bermanfaat, dan
              menyenangkan untuk digunakan. Saya membangun aplikasi, situs web,
              dan eksperimen IoT kecil.
            </p>

            <p>
              For me, design is a way to say something clearly, and code is how
              I make it real.
            </p>

            <div className="edu">
              <b>Education</b>
              <small>Sejak 2023 · Siswi</small>
              <small>SMK Telkom Makassar · Rekayasa Perangkat Lunak</small>
            </div>
          </div>
        </section>

        <div className="contact">
          <a href="mailto:kaysiaputri103@email.com">
            ✉ kaysiaputri103@email.com
          </a>

          <a href="#">📱 +62 824-720-8489</a>

          <a href="#">@kaysiaputri</a>
        </div>
      </div>

      <div className="tiles" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, i) => (
          <i key={i} />
        ))}
      </div>

      <section className="skills" aria-label="Software and skills">
        <div className="wrap">
          <div className="env">
            <div className="body" />

            <div className="letter">
              {skills.map((s) => (
                <span
                  key={s.label}
                  className={`stk ${s.c}`}
                  style={{ ["--r" as string]: `${s.r}deg` }}
                >
                  {s.label}
                </span>
              ))}
            </div>

            <div className="flap" />
          </div>

          <h2 className="script">
            Software<em>&amp; Skill</em>
          </h2>
        </div>
      </section>

      <div className="cta">
        <Link className="btn" href="/more">
          See more 🌸
        </Link>
      </div>
    </main>
  );
}