import { useMemo, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { Cover, HangingWire, SketchBox, SketchDefs, SketchFrame } from "./sketch.jsx";
import { rng, roughLine } from "./rough.js";

const projects = [
  {
    id: "hci",
    title: "Social Butterflies",
    subtitle: "HCI case study",
    size: "large",
    frame: "ornate",
  },
  {
    id: "viz",
    title: "Data Visualization",
    subtitle: "Interactive storytelling",
    size: "medium",
    frame: "matted",
  },
  {
    id: "web",
    title: "GameNite",
    subtitle: "Full-stack SWE project",
    size: "small",
    frame: "classic",
  },
  {
    id: "nb",
    title: "Notability on Your Wrist",
    subtitle: "Internal hackathon · 4th place",
    size: "mediumTall",
    frame: "thin",
  },
];

const hciScreenshots = [
  {
    src: `${import.meta.env.BASE_URL}hci1.png`,
    label: "Prototype screen 01",
    note: "Overall Figma layout of screens",
  },
  {
    src: `${import.meta.env.BASE_URL}hci2.png`,
    label: "Prototype screen 02",
    note: "Events Page",
  },
  {
    src: `${import.meta.env.BASE_URL}hci3.png`,
    label: "Prototype screen 03",
    note: "Home Page after syncing music",
  },
];

const nbScreenshots = [
  {
    src: `${import.meta.env.BASE_URL}nb-watch-complications.png`,
    label: "Watch-face complications",
    note: "Create Note and Start Recording, one tap from the watch face",
  },
  {
    src: `${import.meta.env.BASE_URL}nb-watch-handoff.png`,
    label: "Watch → iPhone handoff",
    note: "Start recording on the watch opens a new note recording on the iPhone",
  },
  {
    src: `${import.meta.env.BASE_URL}nb-watch-solo.png`,
    label: "Recording on the watch",
    note: "If the iPhone app isn’t open, the watch records on its own and syncs later",
  },
  {
    src: `${import.meta.env.BASE_URL}nb-watch-help.png`,
    label: "Get Help flow",
    note: "First screen of filing a support request from the wrist",
  },
];

// ---------- small shared pieces ----------

function Eyebrow({ children, className = "" }) {
  return <p className={`font-mono text-[11px] uppercase tracking-[0.28em] text-pencil ${className}`}>{children}</p>;
}

function HandNote({ children, className = "" }) {
  return <p className={`font-hand text-2xl leading-none text-graphite ${className}`}>{children}</p>;
}

function Note({ title, label, seed, children }) {
  return (
    <SketchBox seed={seed} className="bg-canvas/60 p-6">
      {label && <Eyebrow className="mb-4">{label}</Eyebrow>}
      <h3 className="font-serif text-3xl text-ink">{title}</h3>
      <div className="mt-3 text-sm leading-7 text-graphite">{children}</div>
    </SketchBox>
  );
}

function Tag({ children, seed }) {
  return (
    <SketchBox as="span" seed={seed} faint className="inline-block px-3 py-1.5 font-mono text-xs text-graphite">
      {children}
    </SketchBox>
  );
}

function InkLink({ href, children, variant = "solid", seed = 5 }) {
  const solid = variant === "solid";
  return (
    <SketchBox
      as="a"
      seed={seed}
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex w-fit items-center gap-3 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] transition hover:-translate-y-0.5 ${
        solid ? "bg-ink text-canvas hover:bg-graphite" : "text-ink hover:bg-canvas"
      }`}
    >
      {children} <ArrowUpRight size={16} strokeWidth={1.5} />
    </SketchBox>
  );
}

function PencilRule({ className = "" }) {
  const d = useMemo(() => {
    const r = rng(7);
    return roughLine(0, 4, 1000, 4, r, { over: 0, wobble: 1.5 });
  }, []);
  return (
    <svg className={`h-2 w-full overflow-visible ${className}`} viewBox="0 0 1000 8" preserveAspectRatio="none" aria-hidden="true">
      <path d={d} fill="none" stroke="var(--ink)" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.6" />
    </svg>
  );
}

function GalleryLabel({ title, subtitle, index }) {
  return (
    <SketchBox seed={index + 40} faint className="mt-6 bg-canvas px-4 py-2.5 text-center">
      <p className="font-serif text-lg leading-tight text-ink">{title}</p>
      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-pencil">
        No. 0{index + 1} — {subtitle}
      </p>
    </SketchBox>
  );
}

function Frame({ project, index, onOpen }) {
  const sizeClass = useMemo(() => {
    switch (project.size) {
      case "large":
        return "h-80 w-64 md:h-[24rem] md:w-80";
      case "mediumTall":
        return "h-80 w-56 md:h-[22rem] md:w-64";
      case "medium":
        return "h-64 w-64 md:h-72 md:w-72";
      default:
        return "h-52 w-64 md:h-60 md:w-80";
    }
  }, [project.size]);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 30, rotate: index % 2 === 0 ? -1.2 : 1.2 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -8, rotate: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpen(project)}
      className="group flex flex-col items-center outline-none"
    >
      <div className={`${sizeClass} relative`}>
        <HangingWire />
        <SketchFrame variant={project.frame} seed={index * 13 + 3} className="h-full w-full">
          <div className="h-full w-full p-3 transition duration-500 group-hover:scale-[1.03]">
            <Cover id={project.id} />
          </div>
        </SketchFrame>
      </div>

      <GalleryLabel title={project.title} subtitle={project.subtitle} index={index} />
    </motion.button>
  );
}

// ---------- case study shell ----------

function CaseStudyShell({ eyebrow, title, onClose, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] overflow-y-auto bg-paper text-ink"
    >
      <div className="sticky top-0 z-50 bg-paper/90 px-5 pt-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 pb-3">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1 className="mt-1 font-serif text-2xl text-ink md:text-4xl">{title}</h1>
          </div>
          <SketchBox
            as="button"
            seed={9}
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-ink transition hover:bg-canvas"
            aria-label={`Close ${title}`}
          >
            <X size={16} strokeWidth={1.5} /> Back
          </SketchBox>
        </div>
        <PencilRule className="mx-auto max-w-7xl" />
      </div>
      {children}
    </motion.div>
  );
}

function LivePreview({ src, title, caption, note, heightClass, seed }) {
  return (
    <div>
      <SketchFrame variant="thin" seed={seed}>
        <iframe src={src} title={title} className={`${heightClass} w-full bg-white`} />
      </SketchFrame>
      <div className="mt-4 text-center">
        <p className="font-serif text-lg text-ink">{caption}</p>
        <Eyebrow className="mt-1 normal-case tracking-[0.1em]">{note}</Eyebrow>
      </div>
    </div>
  );
}

function ScreenshotGrid({ shots, seedBase, onExpand, cols = "md:grid-cols-3", aspect = "aspect-[4/3]", fit = "object-cover" }) {
  return (
    <div className={`grid grid-cols-1 gap-10 ${cols}`}>
      {shots.map((shot, i) => (
        <figure key={shot.src}>
          <button type="button" onClick={() => onExpand(shot)} className="group block w-full outline-none">
            <SketchFrame variant="thin" seed={i + seedBase} className={`${aspect} w-full transition duration-300 group-hover:-translate-y-1`}>
              <img
                src={shot.src}
                alt={shot.label}
                className={`h-full w-full bg-white ${fit}`}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </SketchFrame>
          </button>
          <figcaption className="mt-4 text-center">
            <p className="font-serif text-lg text-ink">{shot.label}</p>
            <p className="mt-1 text-xs text-pencil">{shot.note}</p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

function ImageLightbox({ image, onClose }) {
  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/85 p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 16 }}
            className="relative max-h-[90vh] w-full max-w-6xl bg-canvas p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 bg-canvas p-2.5 text-ink transition hover:bg-paper"
              aria-label="Close expanded image"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
            <img src={image.src} alt={image.label} className="max-h-[80vh] w-full object-contain" />
            <p className="mt-3 text-center font-serif text-lg text-ink">{image.label}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ---------- case studies ----------

function HciCaseStudy({ onClose }) {
  const [expandedImage, setExpandedImage] = useState(null);

  return (
    <CaseStudyShell eyebrow="Featured Exhibition" title="Social Butterflies" onClose={onClose}>
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-12 md:grid-cols-[0.9fr_1.1fr] md:py-16">
        <SketchFrame variant="ornate" seed={21} className="h-[460px]">
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <div className="h-40 w-40">
              <Cover id="hci" />
            </div>
            <p className="mt-4 font-serif text-5xl italic leading-tight text-ink">Bridging the Gap</p>
            <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-graphite">
              Designing safe entry points for Northeastern students to move from shared interests to comfortable in-person connection.
            </p>
          </div>
        </SketchFrame>

        <div className="flex flex-col justify-center">
          <Eyebrow className="mb-4">HCI Course Project</Eyebrow>
          <h2 className="font-serif text-5xl leading-[1.05] text-ink md:text-7xl">
            A music-based app for low-pressure social connection.
          </h2>
          <p className="mt-7 text-lg leading-8 text-graphite">
            Social Butterflies explored how Northeastern students can turn shared music interests, communities, and concerts into safer in-person connection. The main insight was that many students are not lacking opportunities to meet people; they lack clear, socially safe signals that make initiating feel mutual instead of awkward or one-sided.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["Needfinding", "Personas", "Lo-fi Prototype", "Hi-fi Prototype"].map((item, i) => (
              <Tag key={item} seed={i + 60}>{item}</Tag>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              title: "Problem",
              text: "Students wanted meaningful friendships but hesitated to initiate because they feared awkwardness, rejection, or misreading intentions.",
            },
            {
              title: "Core Insight",
              text: "The barrier was not simply loneliness or lack of events. It was social ambiguity: not knowing whether another person was open to the same level of connection.",
            },
            {
              title: "Design Goal",
              text: "Create structured signals of openness through music interests, communities, friendship levels, and safer meetup planning.",
            },
          ].map((card, i) => (
            <Note key={card.title} title={card.title} label={`Note ${String.fromCharCode(65 + i)}`} seed={i + 70}>
              {card.text}
            </Note>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <Eyebrow className="mb-3">Process Wall</Eyebrow>
          <h2 className="font-serif text-5xl text-ink">From research to prototype</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            {
              step: "01",
              title: "Needfinding + observations",
              text: "We used interviews, persona work, and campus observations to understand why students hesitate in shared spaces. Dining hall observations were especially useful because they showed behavior that interviews alone might miss, such as students using phones as barriers or avoiding half-full tables.",
            },
            {
              step: "02",
              title: "Point of View",
              text: "We framed the problem around students who want friendship but need a socially safe way to move from passive coexistence or online interaction into in-person connection without misreading expectations.",
            },
            {
              step: "03",
              title: "Task analysis",
              text: "We broke down actions such as syncing music, exploring communities, starting low-pressure conversations, coordinating events, and managing boundaries during first meetups.",
            },
            {
              step: "04",
              title: "Low-fi prototyping",
              text: "Our early paper prototype helped us test structure before committing to visuals. We discovered issues around unclear sync flows, visual affordance problems, and the need for direct one-on-one coordination from event spaces.",
            },
            {
              step: "05",
              title: "High-fi redesign",
              text: "The high-fidelity version separated the home and profile pages, simplified event cards, added quick message prompts, clarified communities, and added stronger safety features like blocking.",
            },
            {
              step: "06",
              title: "User testing + reflection",
              text: "Participants completed the major tasks successfully, but testing revealed confusion around edit/save behavior, community posting after joining, and navigation between profile/settings. These became clear future improvement directions.",
            },
          ].map((item) => (
            <Note key={item.step} title={item.title} label={`Step ${item.step}`} seed={Number(item.step) + 80}>
              {item.text}
            </Note>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <Eyebrow className="mb-3">Prototype Screens</Eyebrow>
          <h2 className="font-serif text-5xl text-ink">Visual evidence</h2>
          <HandNote className="mt-3">click a screen to look closer ↓</HandNote>
        </div>
        <ScreenshotGrid shots={hciScreenshots} seedBase={90} onExpand={setExpandedImage} />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Note title="Key features" label="Features" seed={101}>
            <ul className="mt-3 space-y-3">
              <li><strong className="font-medium text-ink">Music syncing:</strong> helps users express taste without starting from nothing.</li>
              <li><strong className="font-medium text-ink">Communities:</strong> lets users engage around shared interests before one-on-one messaging.</li>
              <li><strong className="font-medium text-ink">Friendship levels:</strong> makes connection strength more visible and less ambiguous.</li>
              <li><strong className="font-medium text-ink">Quick messages:</strong> lowers the effort of starting a conversation.</li>
              <li><strong className="font-medium text-ink">Meetup suggestions:</strong> connects people through shared concerts and events.</li>
            </ul>
          </Note>

          <Note title="Future improvements" label="Next" seed={102}>
            <ul className="mt-3 list-['–_'] space-y-3 pl-4">
              <li>Make the home page more distinct from the profile page with more personalized content.</li>
              <li>Clarify what friendship levels mean and how users progress through them.</li>
              <li>Add onboarding so first-time users understand profile setup, communities, messaging, and meetups.</li>
              <li>Improve feedback after joining communities or adding events so the user knows the action worked.</li>
              <li>Test with more skeptical users and run longer-term studies to see whether the app actually supports real-world connection.</li>
            </ul>
          </Note>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <SketchBox seed={110} className="bg-ink p-8 text-canvas md:p-12">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-canvas/50">Reflection</p>
          <h2 className="font-serif text-5xl">What I learned</h2>
          <p className="mt-6 max-w-4xl text-base leading-8 text-canvas/75">
            This project changed how I think about designing for social interaction. Awkwardness is not just a personal weakness or lack of confidence; it often comes from uncertainty, safety concerns, and the hidden work of reading another person’s intentions. A stronger design does not only create more opportunities to meet people. It makes the first step feel clearer, safer, and more mutual.
          </p>
        </SketchBox>
      </section>

      <ImageLightbox image={expandedImage} onClose={() => setExpandedImage(null)} />
    </CaseStudyShell>
  );
}

function VizCaseStudy({ onClose }) {
  return (
    <CaseStudyShell eyebrow="Project Exhibition" title="MBTA Data Visualization" onClose={onClose}>
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-12 md:grid-cols-[1.2fr_0.8fr] md:py-16">
        <LivePreview
          src="https://fifixu01.github.io/ds4200FinalProject/"
          title="MBTA Data Visualization Website Preview"
          caption="Live Website Preview"
          note="Interactive MBTA ridership project embedded from GitHub Pages"
          heightClass="h-[520px]"
          seed={120}
        />

        <div className="flex flex-col justify-center">
          <Eyebrow className="mb-4">DS4200 Data Science Project</Eyebrow>
          <h2 className="font-serif text-5xl leading-[1.05] text-ink md:text-6xl">
            Exploring MBTA ridership through interactive visuals.
          </h2>
          <p className="mt-7 text-lg leading-8 text-graphite">
            This project analyzes MBTA ridership data through a web-based data visualization story. We cleaned and prepared the dataset, then created six interactive visualizations to help viewers explore patterns in public transportation usage.
          </p>
          <p className="mt-5 text-base leading-7 text-graphite">
            The goal was to make the data easier to understand by turning raw ridership numbers into visual comparisons, trends, and interactive views. The final result was deployed as a public website so users can directly explore the visualizations.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {["Data Cleaning", "6 Visualizations", "Interactive Website", "GitHub Pages"].map((item, i) => (
              <Tag key={item} seed={i + 130}>{item}</Tag>
            ))}
          </div>

          <div className="mt-8">
            <InkLink href="https://fifixu01.github.io/ds4200FinalProject/">Open Full Website</InkLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              title: "Project Goal",
              text: "Turn MBTA ridership data into a clearer visual story that helps users understand transit patterns across different routes, times, and categories.",
            },
            {
              title: "My Work",
              text: "The project involved cleaning data, building visualizations, organizing the site, and thinking about how users would move through the information.",
            },
            {
              title: "Design Focus",
              text: "The website emphasizes readability, interaction, and visual hierarchy so that the data feels approachable instead of overwhelming.",
            },
          ].map((card, i) => (
            <Note key={card.title} title={card.title} label={`Note ${String.fromCharCode(65 + i)}`} seed={i + 140}>
              {card.text}
            </Note>
          ))}
        </div>
      </section>
    </CaseStudyShell>
  );
}

function WebCaseStudy({ onClose }) {
  return (
    <CaseStudyShell eyebrow="Project Exhibition" title="GameNite" onClose={onClose}>
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="mb-10">
          <Eyebrow className="mb-4">Software Engineering Project</Eyebrow>
          <h2 className="max-w-5xl font-serif text-5xl leading-[1.05] text-ink md:text-7xl">
            A full-stack community and multiplayer game platform.
          </h2>
          <p className="mt-7 max-w-4xl text-lg leading-8 text-graphite">
            GameNite was built for my software engineering class as a real working web application, not just a static prototype. The site supports user accounts, forums that work across multiple users, community interaction, and multiplayer game features. This project helped me practice building a larger full-stack system with frontend UI, backend logic, authentication, persistent data, and real-time interaction.
          </p>
        </div>

        <SketchBox seed={150} className="mb-12 bg-canvas/60 p-6">
          <Eyebrow>Test Login</Eyebrow>
          <p className="mt-3 text-sm leading-7 text-graphite">If you want to test the website, use these credentials:</p>
          <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
            {[
              ["Username", "user0"],
              ["Password", "pwd0000"],
            ].map(([k, v], i) => (
              <SketchBox key={k} seed={151 + i} faint className="p-4">
                <Eyebrow>{k}</Eyebrow>
                <p className="mt-2 font-mono text-lg text-ink">{v}</p>
              </SketchBox>
            ))}
          </div>
        </SketchBox>

        <LivePreview
          src="https://spring26-project-spring26-project-group-sdc3.onrender.com/login"
          title="GameNite Website Preview"
          caption="Live Website Preview"
          note="Full-stack deployed app with accounts, forums, and multiplayer game features"
          heightClass="h-[620px]"
          seed={155}
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              title: "Full-Stack App",
              text: "Unlike the Figma-based HCI project, this was a functional deployed website with frontend, backend, authentication, and persistent user data.",
            },
            {
              title: "Community Features",
              text: "The platform includes forums and posts that work across different users, allowing people to interact through shared community spaces.",
            },
            {
              title: "Multiplayer Focus",
              text: "The project also supports multiplayer game interaction, connecting the social/community side of the app with actual play experiences.",
            },
          ].map((card, i) => (
            <Note key={card.title} title={card.title} label={`Note ${String.fromCharCode(65 + i)}`} seed={i + 160}>
              {card.text}
            </Note>
          ))}
        </div>

        <div className="mt-10">
          <InkLink href="https://spring26-project-spring26-project-group-sdc3.onrender.com/login">Open Full Website</InkLink>
        </div>
      </section>
    </CaseStudyShell>
  );
}

function NotabilityCaseStudy({ onClose }) {
  const [expandedImage, setExpandedImage] = useState(null);

  return (
    <CaseStudyShell eyebrow="Internal Hackathon · Onsite 2026" title="Notability on Your Wrist" onClose={onClose}>
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-12 md:grid-cols-[0.95fr_1.05fr] md:py-16">
        <div className="flex flex-col justify-center">
          <SketchBox seed={175} className="mb-6 w-fit bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-canvas">
            ★ 4th place overall
          </SketchBox>
          <Eyebrow className="mb-4">Notability · Team Melon · My role: QA + Apple Watch</Eyebrow>
          <h2 className="font-serif text-5xl leading-[1.05] text-ink md:text-6xl">
            Notability that knows your semester and follows you to your wrist.
          </h2>
          <p className="mt-7 text-lg leading-8 text-graphite">
            For Notability’s company-wide onsite hackathon, our team imagined it was December 2027 and Notability had become the world’s best proactive, AI-driven assistant for students. Then we asked what we would have had to build to get there, built the first piece in a day, and placed 4th overall.
          </p>
          <p className="mt-5 text-base leading-7 text-graphite">
            We connected Canvas so a student’s assignments and class meetings flow into Notability’s Coming Up card, and made capture one motion away on the device students already wear: an Apple Watch app, watch-face complications, and Siri phrases like “Hey Siri, create a new note in Notability.”
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {["Apple Watch UI", "Smart naming", "Siri", "Canvas API", "QA", "4th place overall"].map((tag, i) => (
              <Tag key={tag} seed={i + 170}>{tag}</Tag>
            ))}
          </div>
        </div>

        <div>
          <button type="button" onClick={() => setExpandedImage(nbScreenshots[1])} className="group block w-full rotate-1 outline-none">
            <SketchFrame variant="classic" seed={180} className="aspect-square w-full">
              <img src={nbScreenshots[1].src} alt={nbScreenshots[1].label} className="h-full w-full bg-white object-contain" />
            </SketchFrame>
          </button>
          <div className="mt-4 text-center">
            <p className="font-serif text-lg text-ink">The magic moment</p>
            <p className="mt-1 text-xs text-pencil">Tap “Start recording” on the watch — a new note opens on the iPhone, already recording</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Note title="The prompt" label="Tuesday · Brainstorm" seed={185}>
            It’s December 2027. Notability has become the world’s best proactive, AI-driven assistant for students. What did we do to get here?
          </Note>
          <Note title="Our goal" label="Dec 2027" seed={186}>
            Let students capture and build notes with AI from whatever device they’re on, starting with Siri, and remove friction by improving the Notability device ecosystem.
          </Note>
          <Note title="Why it matters" label="The bet" seed={187}>
            A proactive assistant needs two things we didn’t have that morning: knowledge of the student’s schedule, and a way to act on it from whatever device is closest.
          </Note>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <Eyebrow className="mb-3">Wednesday · The Build</Eyebrow>
          <h2 className="font-serif text-5xl text-ink">What we built</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Note title="Canvas → Coming Up" label="Part 01" seed={190}>
            Assignments, announcements, and class meetings from Canvas flow into Notability’s Coming Up card with due dates. Siri answers “What’s my next assignment?” or “When’s my next class?” without opening the app.
          </Note>
          <Note title="Apple Watch app" label="Part 02" seed={191}>
            Three actions: Start recording, Create note, and Get help, plus Create Note and Start Recording complications right on the watch face. If the phone is in a bag, the watch records on its own and hands the audio over.
          </Note>
          <Note title="Help by voice" label="Part 03" seed={192}>
            Get help files a support request by voice straight to Fin, with the issue category and diagnostics attached, so students never have to dig through settings.
          </Note>
        </div>
        <SketchBox seed={193} faint className="mt-6 bg-canvas/60 p-6 md:p-8">
          <Eyebrow className="mb-3">Where the two halves meet</Eyebrow>
          <p className="max-w-4xl font-serif text-2xl leading-snug text-ink md:text-3xl">
            A student walks into Biology 101, taps the watch face once or says the words, and a note opens on their iPhone, recording, already bound to that class from Canvas. Later, Coming Up reopens the same note next to the assignment it belongs to.
          </p>
          <p className="mt-4 text-sm leading-7 text-graphite">
            Every capture lands as a normal note, so transcripts, flashcards, and chat work on it with nothing new to build.
          </p>
        </SketchBox>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <Eyebrow className="mb-3">Thursday · Science Fair</Eyebrow>
          <h2 className="font-serif text-5xl text-ink">Screens from the build</h2>
          <HandNote className="mt-3">click a screen to look closer ↓</HandNote>
        </div>
        <ScreenshotGrid
          shots={nbScreenshots}
          seedBase={200}
          onExpand={setExpandedImage}
          cols="md:grid-cols-2 lg:grid-cols-4"
          aspect="aspect-[4/5]"
          fit="object-contain"
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <SketchBox seed={210} className="bg-ink p-8 text-canvas md:p-12">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-canvas/50">Success Metric</p>
          <h2 className="font-serif text-4xl md:text-5xl">Canvas-connected students record more.</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              ["40%", "of students who connect Canvas start a note or recording from Coming Up, Siri, or the watch within two weeks"],
              ["+25%", "more recording sessions per week than students without Canvas connected"],
              ["< 5s", "from deciding to record to recording via watch or Siri — down from about 20 seconds on the phone"],
            ].map(([stat, text]) => (
              <div key={stat}>
                <p className="font-serif text-6xl md:text-7xl">{stat}</p>
                <p className="mt-3 text-sm leading-6 text-canvas/70">{text}</p>
              </div>
            ))}
          </div>
        </SketchBox>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <Note title="My role" label="QA · Watch UI · Smart naming" seed={220}>
            <p>
              I joined a six-person team spanning support, iOS, backend, and design as QA, and also picked up build work on the watch side.
            </p>
            <ul className="mt-4 space-y-3">
              <li>
                <strong className="font-medium text-ink">Smart note naming + filing:</strong> I implemented naming for notes and recordings started from the Apple Watch. A capture takes the name given on the watch, or, if a class or event is happening at that moment, it’s named after that class and filed into its folder automatically.
              </li>
              <li>
                <strong className="font-medium text-ink">Apple Watch UI:</strong> I worked on the interface for the Notability watch app.
              </li>
              <li>
                <strong className="font-medium text-ink">QA:</strong> I tested the flows end to end as they came together, like what “Start recording” does when the iPhone app isn’t open.
              </li>
            </ul>
          </Note>
          <Note title="Team Melon" label="The team" seed={221}>
            <ul className="mt-1 space-y-1.5 font-mono text-xs">
              {[
                ["Luis Guerra", "Support · Lead"],
                ["Drew Bratcher", "iOS"],
                ["Fifi Xu", "QA"],
                ["Jeremy Keys", "Backend"],
                ["Lisa Tran", "Support"],
                ["Natalie Kleinberg", "Design"],
              ].map(([name, role]) => (
                <li key={name} className={`flex justify-between gap-4 ${name === "Fifi Xu" ? "text-ink" : ""}`}>
                  <span>{name}</span>
                  <span className="text-pencil">{role}</span>
                </li>
              ))}
            </ul>
          </Note>
        </div>
      </section>

      <ImageLightbox image={expandedImage} onClose={() => setExpandedImage(null)} />
    </CaseStudyShell>
  );
}

function PlaceholderCaseStudy({ project, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-paper p-6"
    >
      <SketchBox seed={200} className="max-w-2xl bg-canvas p-10 text-center">
        <Eyebrow className="mb-3">Coming Soon</Eyebrow>
        <h2 className="font-serif text-5xl text-ink">{project.title}</h2>
        <button onClick={onClose} className="mt-8 bg-ink px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-canvas">
          Back to gallery
        </button>
      </SketchBox>
    </motion.div>
  );
}

// ---------- the gallery wall ----------

function Baseboard() {
  const lines = useMemo(() => {
    const r = rng(17);
    return [
      roughLine(0, 10, 3000, 10, r, { over: 0, wobble: 2 }),
      roughLine(0, 20, 3000, 20, r, { over: 0, wobble: 2 }),
    ];
  }, []);
  return (
    <svg
      className="pointer-events-none absolute bottom-[9vh] left-0 h-10 w-full"
      viewBox="0 0 3000 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <g fill="none" stroke="var(--ink)" vectorEffect="non-scaling-stroke">
        <path d={lines[0]} strokeWidth="1.1" opacity="0.6" vectorEffect="non-scaling-stroke" />
        <path d={lines[1]} strokeWidth="0.8" opacity="0.35" vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

function RoomMarker({ children }) {
  return <Eyebrow className="absolute left-8 top-8 md:left-12 md:top-10">{children}</Eyebrow>;
}

function GalleryWalk({ onOpenProject }) {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0.04, 0.96], ["0%", "-66.66%"]);

  return (
    <div className="relative h-[330vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-paper">
        <motion.div style={{ x, willChange: "transform" }} className="relative flex h-full w-[300vw]">
          <Baseboard />

          <section className="relative flex h-screen w-screen items-center justify-center px-8">
            <RoomMarker>Room 00 — Introduction</RoomMarker>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative grid max-w-6xl grid-cols-1 items-center gap-14 md:grid-cols-[0.8fr_1.2fr]"
            >
              <div className="group relative mx-auto h-[380px] w-[290px] -rotate-1 md:h-[440px] md:w-[340px]">
                <HangingWire />
                <SketchFrame variant="matted" seed={4} className="h-full w-full">
                  <img
                    src={`${import.meta.env.BASE_URL}bday.jpg`}
                    alt="Fiora Xu"
                    className="h-full w-full object-cover"
                  />
                </SketchFrame>
                <HandNote className="absolute -bottom-10 right-0 rotate-[-3deg]">that’s me ↑</HandNote>
              </div>

              <div>
                <Eyebrow className="mb-4">Exhibit 00</Eyebrow>
                <h1 className="font-serif text-6xl leading-none text-ink md:text-8xl">
                  About <span className="italic">Me</span>
                </h1>
                <PencilRule className="mt-6 max-w-md" />
                <p className="mt-6 max-w-2xl text-lg leading-8 text-graphite">
                  I’m Fiora Xu, a 21-year-old Computer Science major with a concentration in Human-Centered Computing at Northeastern University.
                  I’m passionate about product management, UI/UX, product design, and quality assurance, with experience in QA and building web-based projects.
                  I enjoy working at the intersection of design and functionality—thinking about how products not only work, but feel to use.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {["Product / PM", "UI/UX", "HCI", "Frontend", "Data Visualization"].map((tag, i) => (
                    <Tag key={tag} seed={i + 10}>{tag}</Tag>
                  ))}
                </div>
                <HandNote className="mt-10 flex items-center gap-2">
                  keep scrolling to walk along the wall <ArrowRight size={20} strokeWidth={1.5} />
                </HandNote>
              </div>
            </motion.div>
          </section>

          <section className="relative flex h-screen w-screen items-center justify-center px-8">
            <RoomMarker>Room 01 — Main Hall</RoomMarker>
            <div className="relative w-full max-w-7xl">
              <div className="mb-20 flex items-end justify-between gap-6">
                <div>
                  <Eyebrow className="mb-3">Selected Works</Eyebrow>
                  <h2 className="font-serif text-5xl text-ink md:text-7xl">Project Wall</h2>
                </div>
                <HandNote className="hidden md:block">click a frame to step inside</HandNote>
              </div>

              <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-4">
                {projects.map((project, index) => (
                  <Frame key={project.id} project={project} index={index} onOpen={onOpenProject} />
                ))}
              </div>
            </div>
          </section>

          <section className="relative flex h-screen w-screen items-center justify-center px-8">
            <RoomMarker>Room 02 — Exit</RoomMarker>
            <SketchBox seed={30} className="relative max-w-4xl bg-canvas/70 p-10 text-center md:p-16">
              <Eyebrow className="mb-3">Exit Plaque</Eyebrow>
              <h2 className="font-serif text-6xl text-ink md:text-8xl">Contact</h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-graphite">
                Thanks for walking through my work! I’m especially interested in opportunities in product management, UI/UX, product design, and quality assurance, where I can continue building thoughtful, user-centered experiences. If anything here resonated with you, I’d love to connect.
              </p>
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <SketchBox
                  as="a"
                  seed={31}
                  href="mailto:msfiora@gmail.com"
                  className="group block px-6 py-5 text-left transition hover:-translate-y-0.5 hover:bg-paper"
                >
                  <Eyebrow>Email</Eyebrow>
                  <p className="mt-1 flex items-center justify-between font-serif text-xl text-ink">
                    msfiora@gmail.com <ArrowUpRight size={18} strokeWidth={1.5} />
                  </p>
                </SketchBox>

                <SketchBox
                  as="a"
                  seed={32}
                  href="https://www.linkedin.com/in/fiora-xu-17b00223a"
                  target="_blank"
                  rel="noreferrer"
                  className="group block px-6 py-5 text-left transition hover:-translate-y-0.5 hover:bg-paper"
                >
                  <Eyebrow>LinkedIn</Eyebrow>
                  <p className="mt-1 flex items-center justify-between font-serif text-xl text-ink">
                    View Profile <ArrowUpRight size={18} strokeWidth={1.5} />
                  </p>
                </SketchBox>
              </div>
            </SketchBox>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <SketchDefs />
      <div className="paper-grain" aria-hidden="true" />

      <GalleryWalk onOpenProject={setSelectedProject} />

      <AnimatePresence>
        {selectedProject?.id === "hci" && <HciCaseStudy onClose={() => setSelectedProject(null)} />}
        {selectedProject?.id === "viz" && <VizCaseStudy onClose={() => setSelectedProject(null)} />}
        {selectedProject?.id === "web" && <WebCaseStudy onClose={() => setSelectedProject(null)} />}
        {selectedProject?.id === "nb" && <NotabilityCaseStudy onClose={() => setSelectedProject(null)} />}
        {selectedProject && !["hci", "viz", "web", "nb"].includes(selectedProject.id) && (
          <PlaceholderCaseStudy project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>

      {!selectedProject && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <HandNote className="text-xl text-pencil">scroll to walk through the gallery ⟶</HandNote>
        </div>
      )}
    </main>
  );
}
