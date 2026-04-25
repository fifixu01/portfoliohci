import React, { useMemo, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  DoorOpen,
  ArrowRight,
  Sparkles,
  Mail,
  UserRound,
  MapPin,
  X,
  Music,
  Users,
  MessageCircle,
  CalendarDays,
  ShieldCheck,
  Lightbulb,
  Gamepad2,
} from "lucide-react";

const projects = [
  {
    id: "hci",
    title: "Social Butterflies",
    subtitle: "HCI case study",
    size: "large",
  },
  {
    id: "viz",
    title: "Data Visualization",
    subtitle: "Interactive storytelling",
    size: "medium",
  },
  {
    id: "web",
    title: "GameNite",
    subtitle: "Full-stack SWE project",
    size: "small",
  },
  {
    id: "extra",
    title: "Studio by Fifi",
    subtitle: "Sticker shop + personal design",
    size: "mediumTall",
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

function GalleryLabel({ title, subtitle }) {
  return (
    <div className="mt-4 rounded-sm border border-neutral-300 bg-white/90 px-4 py-2 text-center shadow-sm">
      <p className="font-serif text-sm tracking-wide text-neutral-900">{title}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-neutral-500">{subtitle}</p>
    </div>
  );
}

function Frame({ project, index, onOpen }) {
  const frameImages = [
    `${import.meta.env.BASE_URL}frame1.png`,
    `${import.meta.env.BASE_URL}frame2.png`,
    `${import.meta.env.BASE_URL}frame3.png`,
    `${import.meta.env.BASE_URL}frame4.png`,
  ];

  const sizeClass = useMemo(() => {
    switch (project.size) {
      case "large":
        return "h-80 w-72 md:h-[26rem] md:w-96";
      case "mediumTall":
        return "h-80 w-56 md:h-[24rem] md:w-72";
      case "medium":
        return "h-64 w-64 md:h-80 md:w-80";
      default:
        return "h-52 w-64 md:h-64 md:w-80";
    }
  }, [project.size]);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 40, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}  // slightly faster load
      whileHover={{ y: -12, scale: 1.05, rotate: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onOpen(project)}
      className="group flex flex-col items-center outline-none"
    >
      <div className={`${sizeClass} relative overflow-visible drop-shadow-2xl transition group-hover:drop-shadow-[0_30px_45px_rgba(0,0,0,0.35)]`}>
       <img
          src={frameImages[index]}
          alt={project.title}
          className="h-full w-full object-contain"
          style={{
            transform: index === 2 ? "scale(1.08)" : "scale(1)",
          }}
        />
      </div>

      <GalleryLabel title={project.title} subtitle={project.subtitle} />
    </motion.button>
  );
}

function HciCaseStudy({ onClose }) {
  const [expandedImage, setExpandedImage] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#f6f3ed] text-neutral-950"
    >
      <div className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">Featured Exhibition</p>
            <h1 className="font-serif text-2xl text-neutral-950 md:text-4xl">Social Butterflies</h1>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-neutral-300 bg-white p-3 shadow-sm transition hover:bg-neutral-100"
            aria-label="Close case study"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-[0.9fr_1.1fr] md:py-16">
        <div className="rounded-sm border-[14px] border-neutral-950 bg-white p-4 shadow-2xl">
          <div className="flex min-h-[420px] items-center justify-center rounded-sm bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 p-8 text-center">
            <div>
              <Music className="mx-auto mb-6" size={54} />
              <p className="font-serif text-5xl italic leading-tight text-neutral-950">Bridging the Gap</p>
              <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-neutral-600">
                Designing safe entry points for Northeastern students to move from shared interests to comfortable in-person connection.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-neutral-500">HCI Course Project</p>
          <h2 className="font-serif text-5xl leading-tight text-neutral-950 md:text-7xl">
            A music-based app for low-pressure social connection.
          </h2>
          <p className="mt-7 text-lg leading-8 text-neutral-700">
            Social Butterflies explored how Northeastern students can turn shared music interests, communities, and concerts into safer in-person connection. The main insight was that many students are not lacking opportunities to meet people; they lack clear, socially safe signals that make initiating feel mutual instead of awkward or one-sided.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
            {["Needfinding", "Personas", "Lo-fi Prototype", "Hi-fi Prototype"].map((item) => (
              <div key={item} className="rounded-sm border border-neutral-300 bg-white p-4 text-center shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              icon: Users,
              title: "Problem",
              text: "Students wanted meaningful friendships but hesitated to initiate because they feared awkwardness, rejection, or misreading intentions.",
            },
            {
              icon: Lightbulb,
              title: "Core Insight",
              text: "The barrier was not simply loneliness or lack of events. It was social ambiguity: not knowing whether another person was open to the same level of connection.",
            },
            {
              icon: ShieldCheck,
              title: "Design Goal",
              text: "Create structured signals of openness through music interests, communities, friendship levels, and safer meetup planning.",
            },
          ].map((card) => (
            <div key={card.title} className="rounded-sm border border-neutral-300 bg-white p-6 shadow-sm">
              <card.icon className="mb-5" size={30} />
              <h3 className="font-serif text-2xl text-neutral-950">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-650">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-neutral-500">Process Wall</p>
          <h2 className="font-serif text-5xl text-neutral-950">From research to prototype</h2>
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
            <div key={item.step} className="rounded-sm border border-neutral-300 bg-white p-7 shadow-sm">
              <p className="mb-3 text-xs uppercase tracking-[0.35em] text-neutral-400">Step {item.step}</p>
              <h3 className="font-serif text-3xl text-neutral-950">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-neutral-700">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-neutral-500">Prototype Screens</p>
          <h2 className="font-serif text-5xl text-neutral-950">Visual evidence</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-600">
            Click on the photos to further expand them.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {hciScreenshots.map((shot) => (
            <figure key={shot.src} className="rounded-sm border-[10px] border-neutral-950 bg-white p-3 shadow-2xl">
              <button
                type="button"
                onClick={() => setExpandedImage(shot)}
                className="group aspect-[4/3] w-full overflow-hidden rounded-sm bg-neutral-100 outline-none transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={shot.src}
                  alt={shot.label}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </button>
              <figcaption className="mt-4 rounded-sm border border-neutral-200 bg-white px-3 py-2 text-center">
                <p className="font-serif text-sm text-neutral-950">{shot.label}</p>
                <p className="mt-1 text-xs text-neutral-500">{shot.note}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-sm border border-neutral-300 bg-white p-8 shadow-sm">
            <MessageCircle className="mb-5" size={32} />
            <h3 className="font-serif text-4xl text-neutral-950">Key features</h3>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-neutral-700">
              <li><strong>Music syncing:</strong> helps users express taste without starting from nothing.</li>
              <li><strong>Communities:</strong> lets users engage around shared interests before one-on-one messaging.</li>
              <li><strong>Friendship levels:</strong> makes connection strength more visible and less ambiguous.</li>
              <li><strong>Quick messages:</strong> lowers the effort of starting a conversation.</li>
              <li><strong>Meetup suggestions:</strong> connects people through shared concerts and events.</li>
            </ul>
          </div>

          <div className="rounded-sm border border-neutral-300 bg-white p-8 shadow-sm">
            <CalendarDays className="mb-5" size={32} />
            <h3 className="font-serif text-4xl text-neutral-950">Future improvements</h3>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-neutral-700">
              <li>Make the home page more distinct from the profile page with more personalized content.</li>
              <li>Clarify what friendship levels mean and how users progress through them.</li>
              <li>Add onboarding so first-time users understand profile setup, communities, messaging, and meetups.</li>
              <li>Improve feedback after joining communities or adding events so the user knows the action worked.</li>
              <li>Test with more skeptical users and run longer-term studies to see whether the app actually supports real-world connection.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-sm border border-neutral-300 bg-neutral-950 p-8 text-white shadow-2xl md:p-12">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-white/50">Reflection</p>
          <h2 className="font-serif text-5xl">What I learned</h2>
          <p className="mt-6 max-w-4xl text-base leading-8 text-white/75">
            This project changed how I think about designing for social interaction. Awkwardness is not just a personal weakness or lack of confidence; it often comes from uncertainty, safety concerns, and the hidden work of reading another person’s intentions. A stronger design does not only create more opportunities to meet people. It makes the first step feel clearer, safer, and more mutual.
          </p>
        </div>
      </section>

      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
            onClick={() => setExpandedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="relative max-h-[90vh] w-full max-w-6xl rounded-sm bg-white p-4 shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={() => setExpandedImage(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-3 shadow-lg transition hover:bg-neutral-100"
                aria-label="Close expanded image"
              >
                <X size={20} />
              </button>
              <img
                src={expandedImage.src}
                alt={expandedImage.label}
                className="max-h-[80vh] w-full rounded-sm object-contain"
              />
              <p className="mt-3 text-center font-serif text-lg text-neutral-900">{expandedImage.label}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function VizCaseStudy({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#f6f3ed] text-neutral-950"
    >
      <div className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">Project Exhibition</p>
            <h1 className="font-serif text-2xl text-neutral-950 md:text-4xl">MBTA Data Visualization</h1>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-neutral-300 bg-white p-3 shadow-sm transition hover:bg-neutral-100"
            aria-label="Close data visualization case study"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-[1.2fr_0.8fr] md:py-16">
        <div className="rounded-sm border-[14px] border-neutral-950 bg-white p-4 shadow-2xl">
          <div className="overflow-hidden rounded-sm border border-neutral-200 bg-neutral-100">
            <iframe
              src="https://fifixu01.github.io/ds4200FinalProject/"
              title="MBTA Data Visualization Website Preview"
              className="h-[520px] w-full bg-white"
            />
          </div>
          <div className="mt-4 rounded-sm border border-neutral-200 bg-white px-4 py-3 text-center">
            <p className="font-serif text-sm text-neutral-950">Live Website Preview</p>
            <p className="mt-1 text-xs text-neutral-500">Interactive MBTA ridership project embedded from GitHub Pages</p>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-neutral-500">DS4200 Data Science Project</p>
          <h2 className="font-serif text-5xl leading-tight text-neutral-950 md:text-6xl">
            Exploring MBTA ridership through interactive visuals.
          </h2>
          <p className="mt-7 text-lg leading-8 text-neutral-700">
            This project analyzes MBTA ridership data through a web-based data visualization story. We cleaned and prepared the dataset, then created six interactive visualizations to help viewers explore patterns in public transportation usage.
          </p>
          <p className="mt-5 text-base leading-7 text-neutral-700">
            The goal was to make the data easier to understand by turning raw ridership numbers into visual comparisons, trends, and interactive views. The final result was deployed as a public website so users can directly explore the visualizations.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
            {["Data Cleaning", "6 Visualizations", "Interactive Website", "GitHub Pages"].map((item) => (
              <div key={item} className="rounded-sm border border-neutral-300 bg-white p-4 text-center shadow-sm">
                {item}
              </div>
            ))}
          </div>

          <a
            href="https://fifixu01.github.io/ds4200FinalProject/"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-neutral-950 px-7 py-4 text-sm font-medium text-white shadow-xl transition hover:-translate-y-1 hover:bg-neutral-800"
          >
            Open Full Website <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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
          ].map((card) => (
            <div key={card.title} className="rounded-sm border border-neutral-300 bg-white p-6 shadow-sm">
              <Sparkles className="mb-5" size={30} />
              <h3 className="font-serif text-2xl text-neutral-950">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-700">{card.text}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

function WebCaseStudy({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#f6f3ed] text-neutral-950"
    >
      <div className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">Project Exhibition</p>
            <h1 className="font-serif text-2xl text-neutral-950 md:text-4xl">GameNite</h1>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-neutral-300 bg-white p-3 shadow-sm transition hover:bg-neutral-100"
            aria-label="Close GameNite case study"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="mb-10">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-neutral-500">
            Software Engineering Project
          </p>
          <h2 className="max-w-5xl font-serif text-5xl leading-tight text-neutral-950 md:text-7xl">
            A full-stack community and multiplayer game platform.
          </h2>
          <p className="mt-7 max-w-4xl text-lg leading-8 text-neutral-700">
            GameNite was built for my software engineering class as a real working web application, not just a static prototype. The site supports user accounts, forums that work across multiple users, community interaction, and multiplayer game features. This project helped me practice building a larger full-stack system with frontend UI, backend logic, authentication, persistent data, and real-time interaction.
          </p>
        </div>

        <div className="mb-10 rounded-sm border border-neutral-300 bg-white p-6 shadow-xl">
          <div className="flex items-start gap-4">
            <Gamepad2 className="mt-1 shrink-0" size={32} />
            <div>
              <h3 className="font-serif text-3xl text-neutral-950">Test Login</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-700">
                If you want to test the website, use these credentials:
              </p>
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <div className="rounded-sm border border-neutral-300 bg-neutral-50 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Username</p>
                  <p className="mt-2 font-mono text-lg text-neutral-950">user0</p>
                </div>
                <div className="rounded-sm border border-neutral-300 bg-neutral-50 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Password</p>
                  <p className="mt-2 font-mono text-lg text-neutral-950">pwd0000</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-sm border-[14px] border-neutral-950 bg-white p-4 shadow-2xl">
          <div className="overflow-hidden rounded-sm border border-neutral-200 bg-neutral-100">
            <iframe
              src="https://spring26-project-spring26-project-group-sdc3.onrender.com/login"
              title="GameNite Website Preview"
              className="h-[620px] w-full bg-white"
            />
          </div>
          <div className="mt-4 rounded-sm border border-neutral-200 bg-white px-4 py-3 text-center">
            <p className="font-serif text-sm text-neutral-950">Live Website Preview</p>
            <p className="mt-1 text-xs text-neutral-500">
              Full-stack deployed app with accounts, forums, and multiplayer game features
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
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
          ].map((card) => (
            <div key={card.title} className="rounded-sm border border-neutral-300 bg-white p-6 shadow-sm">
              <Sparkles className="mb-5" size={30} />
              <h3 className="font-serif text-2xl text-neutral-950">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-700">{card.text}</p>
            </div>
          ))}
        </div>

        <a
          href="https://spring26-project-spring26-project-group-sdc3.onrender.com/login"
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-flex w-fit items-center gap-3 rounded-full bg-neutral-950 px-7 py-4 text-sm font-medium text-white shadow-xl transition hover:-translate-y-1 hover:bg-neutral-800"
        >
          Open Full Website <ArrowRight size={18} />
        </a>
      </section>
    </motion.div>
  );
}

function ShopCaseStudy({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#fff7f1] text-neutral-950"
    >
      <div className="sticky top-0 z-50 border-b border-orange-100 bg-white/80 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">Personal Exhibition</p>
            <h1 className="font-serif text-2xl text-neutral-950 md:text-4xl">Studio by Fifi</h1>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-neutral-300 bg-white p-3 shadow-sm transition hover:bg-neutral-100"
            aria-label="Close Studio by Fifi case study"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col justify-center">
            <Sparkles className="mb-6" size={44} />
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-neutral-500">
              Small Business + Creative Website
            </p>
            <h2 className="font-serif text-5xl leading-tight text-neutral-950 md:text-7xl">
              A hand-drawn sticker and stationery shop.
            </h2>
            <p className="mt-7 text-lg leading-8 text-neutral-700">
              Studio by Fifi is my personal sticker and stationery shop, where I design hand-drawn products and turn them into manufactured physical items. This project is more personal and creative than my academic work, but it still reflects my interest in visual design, branding, product presentation, and building a polished online experience.
            </p>
            <p className="mt-5 text-base leading-7 text-neutral-700">
              For this site, I wanted the shop to feel cute, approachable, and cohesive with the handmade style of the products. The design decisions are centered around showing the personality behind the brand while still making the shopping experience clear and easy to navigate.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {["Hand-drawn products", "Brand identity", "Shop design", "Stationery"].map((tag) => (
                <span key={tag} className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm text-neutral-700 shadow-sm">
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://studiobyfifi.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-neutral-950 px-7 py-4 text-sm font-medium text-white shadow-xl transition hover:-translate-y-1 hover:bg-neutral-800"
              >
                Open Shop <ArrowRight size={18} />
              </a>

              <a
                href="https://www.instagram.com/studiobyfifi/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-neutral-300 bg-white px-7 py-4 text-sm font-medium text-neutral-900 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                Instagram @studiobyfifi <ArrowRight size={18} />
              </a>
            </div>
          </div>

          <div className="rotate-1 rounded-sm border-[14px] border-neutral-950 bg-white p-4 shadow-2xl">
            <div className="overflow-hidden rounded-sm border border-neutral-200 bg-neutral-100">
              <img
                src={`${import.meta.env.BASE_URL}sbf.png`}
                alt="Studio by Fifi website preview"
                className="h-[620px] w-full object-cover bg-white"
              />
            </div>
            <div className="mt-4 rounded-sm border border-neutral-200 bg-white px-4 py-3 text-center">
              <p className="font-serif text-sm text-neutral-950">Shop Opening page</p>
              <p className="mt-1 text-xs text-neutral-500">
                Personal storefront for hand-drawn stickers and stationery
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              title: "Creative Direction",
              text: "The shop reflects my personal drawing style, with a focus on cute, handmade, and approachable visuals.",
            },
            {
              title: "Product Thinking",
              text: "I make design decisions not only around how the products look, but also how they are presented, categorized, and experienced by customers.",
            },
            {
              title: "Personal Brand",
              text: "Studio by Fifi lets me explore branding, visual identity, and small-business storytelling outside of class projects.",
            },
          ].map((card) => (
            <div key={card.title} className="rounded-sm border border-orange-100 bg-white p-6 shadow-sm">
              <Sparkles className="mb-5" size={30} />
              <h3 className="font-serif text-2xl text-neutral-950">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-neutral-700">{card.text}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

function PlaceholderCaseStudy({ project, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f6f3ed] p-6"
    >
      <div className="max-w-2xl rounded-sm border border-neutral-300 bg-white p-10 text-center shadow-2xl">
        <p className="mb-3 text-xs uppercase tracking-[0.35em] text-neutral-500">Coming Soon</p>
        <h2 className="font-serif text-5xl text-neutral-950">{project.title}</h2>
        <p className="mt-5 text-neutral-600">We can fill this project page next after the HCI case study is working.</p>
        <button onClick={onClose} className="mt-8 rounded-full bg-neutral-950 px-6 py-3 text-sm text-white">
          Back to gallery
        </button>
      </div>
    </motion.div>
  );
}

function Entrance({ onEnter }) {
  return (
    <section className="relative flex h-screen min-h-[720px] items-center justify-center overflow-hidden bg-[url('/brick.png')] bg-cover bg-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,231,186,0.25),transparent_34%),linear-gradient(to_bottom,rgba(0,0,0,0.05),rgba(0,0,0,0.28))]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="mb-8 rounded-full border border-white/25 bg-black/20 px-5 py-2 text-xs uppercase tracking-[0.35em] text-white/85 backdrop-blur">
          My Gallery
        </div>

        <motion.button
          onClick={onEnter}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="group relative h-[460px] w-[280px] outline-none md:h-[520px] md:w-[320px]"
        >
          <img
            src={`${import.meta.env.BASE_URL}door.png`}
            alt="Gallery Entrance Door"
            className="h-full w-full object-contain"
          />
        </motion.button>

        <p className="mt-18 max-w-md text-center font-serif text-3xl text-white md:text-5xl">Fiora Xu</p>
        <p className="mt-3 max-w-xl text-center text-sm leading-6 text-white/80 md:text-base">
          A portfolio built like a small exhibition: enter, walk along the wall, and open each project as its own frame.
        </p>
      </motion.div>
    </section>
  );
}

function GalleryWalk({ onOpenProject }) {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0.08, 0.95], ["0%", "-66.66%"]);

  return (
    <div className="relative h-[330vh] bg-neutral-100">
      <div className="sticky top-0 h-screen overflow-hidden bg-[#f6f3ed] bg-[url('/stucco.png')] bg-cover bg-center">
        <div className="absolute left-1/2 top-0 z-20 h-40 w-[46vw] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(255,225,160,0.95),rgba(255,214,140,0.38)_38%,rgba(255,230,180,0.14)_62%,transparent_78%)] blur-[2px]" />

        <div className="absolute left-1/2 top-2 z-30 h-10 w-28 -translate-x-1/2 rounded-b-full border border-neutral-800 bg-gradient-to-b from-neutral-700 to-neutral-950 shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
          <div className="absolute left-1/2 top-2 h-2 w-14 -translate-x-1/2 rounded-full bg-white/20" />
          <div className="absolute left-1/2 bottom-0 h-2 w-20 -translate-x-1/2 rounded-t-full bg-amber-200/70 blur-[1px]" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 h-32 bg-gradient-to-t from-neutral-300 to-transparent" />

        <motion.div style={{ x }} className="flex h-full w-[300vw]">
          <section className="relative flex h-screen w-screen items-center justify-center px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-[0.9fr_1.1fr]"
            >
              <div className="relative h-[520px] w-[400px] mx-auto">
                {/* Frame */}
                <img
                  src={`${import.meta.env.BASE_URL}frame-portrait.png`}
                  className="absolute z-20 max-w-none object-fill pointer-events-none"
                  style={{
                    top: "-75px",
                    left: "-110px",
                    width: "calc(100% + 220px)",
                    height: "calc(100% + 170px)",
                  }}
                />
                {/* Image inside frame */}
                <img
                  src={`${import.meta.env.BASE_URL}bday.jpg`}
                  className="absolute z-10 object-cover"
                  style={{
                    top: "28px",
                    left: "28px",
                    width: "calc(100% - 56px)",
                    height: "calc(100% - 56px)",
                  }}
                />
              </div>

              <div className="rounded-sm border border-neutral-300 bg-white/90 p-8 shadow-xl backdrop-blur md:p-12">
                <p className="mb-4 text-xs uppercase tracking-[0.35em] text-neutral-500">Exhibit 00</p>
                <h1 className="font-serif text-5xl text-neutral-950 md:text-7xl">About Me</h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-700">
                  I’m Fiora Xu, a 21-year-old Computer Science major with a concentration in Human-Centered Computing at Northeastern University.

I’m passionate about UI/UX, product design, and quality assurance, with experience in QA and building web-based projects.

I enjoy working at the intersection of design and functionality—thinking about how products not only work, but feel to use.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {["UI/UX", "HCI", "Frontend", "Data Visualization"].map((tag) => (
                    <span key={tag} className="rounded-full border border-neutral-300 px-4 py-2 text-sm text-neutral-700">{tag}</span>
                  ))}
                </div>
                <div className="mt-10 flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-neutral-500">
                  Keep scrolling to walk along the wall <ArrowRight size={18} />
                </div>
              </div>
            </motion.div>
          </section>

          <section className="relative flex h-screen w-screen items-center justify-center px-8">
            <div className="relative w-full max-w-7xl">
              <div className="mb-12 flex items-end justify-between gap-6">
                <div>
                  <p className="mb-3 text-xs uppercase tracking-[0.35em] text-neutral-500">Main Hall</p>
                  <h2 className="font-serif text-5xl text-neutral-950 md:text-7xl">Project Wall</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-4">
                {projects.map((project, index) => (
                  <Frame key={project.id} project={project} index={index} onOpen={onOpenProject} />
                ))}
              </div>
            </div>
          </section>

          <section className="relative flex h-screen w-screen items-center justify-center px-8">
            <div className="relative max-w-4xl rounded-sm border border-neutral-300 bg-white p-10 text-center shadow-2xl md:p-16">
              <Sparkles className="mx-auto mb-6" size={42} />
              <p className="mb-3 text-xs uppercase tracking-[0.35em] text-neutral-500">Exit Plaque</p>
              <h2 className="font-serif text-5xl text-neutral-950 md:text-7xl">Contact</h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-700">
                Thanks for walking through my work! I’m especially interested in opportunities in UI/UX, product design, and quality assurance, where I can continue building thoughtful, user-centered experiences. If anything here resonated with you, I’d love to connect.
              </p>
              <div className="mt-10 grid gap-6 md:grid-cols-2">

                {/* Email Card */}
                <a
                  href="mailto:msfiora@gmail.com"
                  className="group flex items-center gap-5 rounded-xl border border-neutral-300 bg-white px-6 py-5 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="rounded-full bg-neutral-950 p-3 text-white">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">Email</p>
                    <p className="mt-1 font-serif text-lg text-neutral-900">msfiora@gmail.com</p>
                  </div>
                </a>

                {/* LinkedIn Card */}
                <a
                  href="https://www.linkedin.com/in/fiora-xu-17b00223a"
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-5 rounded-xl border border-neutral-300 bg-white px-6 py-5 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="rounded-full bg-neutral-950 p-3 text-white">
                    <UserRound size={20} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">LinkedIn</p>
                    <p className="mt-1 font-serif text-lg text-neutral-900">View Profile</p>
                  </div>
                </a>

              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

export default function App() {
  const [entered, setEntered] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-950">
      <AnimatePresence mode="wait">
        {!entered ? (
          <motion.div
            key="entrance"
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.7 }}
          >
            <Entrance onEnter={() => setEntered(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <GalleryWalk onOpenProject={setSelectedProject} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject?.id === "hci" && <HciCaseStudy onClose={() => setSelectedProject(null)} />}
        {selectedProject?.id === "viz" && <VizCaseStudy onClose={() => setSelectedProject(null)} />}
        {selectedProject?.id === "web" && <WebCaseStudy onClose={() => setSelectedProject(null)} />}
        {selectedProject?.id === "extra" && <ShopCaseStudy onClose={() => setSelectedProject(null)} />}
        {selectedProject && selectedProject.id !== "hci" && selectedProject.id !== "viz" && selectedProject.id !== "web" && selectedProject.id !== "extra" && (
          <PlaceholderCaseStudy project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>

      {entered && !selectedProject && (
        <div className="fixed bottom-5 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-neutral-300 bg-white/80 px-4 py-2 text-xs text-neutral-600 shadow-lg backdrop-blur">
          <MapPin size={14} /> Scroll to walk through the gallery
        </div>
      )}
    </main>
  );
}