import { useState } from "react";
import { Catalogue, Columns, Figure, Lightbox, List, LiveFrame, Meta, Prose, PullQuote, Section, Stat, Steps, TextLink } from "./catalogue.jsx";
import { Cover, SketchFrame } from "./sketch.jsx";

const asset = (file) => `${import.meta.env.BASE_URL}${file}`;

const hciScreens = [
  { src: asset("hci1.png"), alt: "Overall Figma layout of screens", caption: "Overall Figma layout of screens" },
  { src: asset("hci2.png"), alt: "Events page", caption: "Events page" },
  { src: asset("hci3.png"), alt: "Home page after syncing music", caption: "Home page after syncing music" },
];

const nbScreens = [
  {
    src: asset("nb-watch-complications.png"),
    alt: "Watch-face complications",
    caption: "Create Note and Start Recording complications, one tap from the watch face",
  },
  {
    src: asset("nb-watch-handoff.png"),
    alt: "Watch to iPhone handoff",
    caption: "Start recording on the watch opens a new note, already recording, on the iPhone",
  },
  {
    src: asset("nb-watch-solo.png"),
    alt: "Recording on the watch",
    caption: "If the iPhone app isn’t open, the watch records on its own and syncs later",
  },
  {
    src: asset("nb-watch-help.png"),
    alt: "Get Help flow",
    caption: "First screen of filing a support request from the wrist",
  },
];

export function HciStudy({ project, onClose }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <Catalogue
      number="01"
      total="04"
      kind="HCI case study · Course project"
      title="Social Butterflies"
      lede="A music-based app for low-pressure social connection."
      onClose={onClose}
    >
      <Section n="Overview" title="Bridging the gap">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_15rem]">
          <div>
            <Prose>
              <p>
                Social Butterflies explored how Northeastern students can turn shared music interests, communities, and concerts into safer in-person connection. The main insight was that many students are not lacking opportunities to meet people; they lack clear, socially safe signals that make initiating feel mutual instead of awkward or one-sided.
              </p>
            </Prose>
            <Meta
              className="mt-8"
              items={[
                ["Methods", "Needfinding · Personas · Lo-fi prototype · Hi-fi prototype"],
                ["Setting", "Northeastern University"],
              ]}
            />
          </div>
          <figure>
            <SketchFrame variant="ornate" seed={21} className="aspect-[4/5] w-full">
              <div className="h-full w-full p-5">
                <Cover project={project} />
              </div>
            </SketchFrame>
            <figcaption className="mt-4 font-serif text-[14px] leading-relaxed text-graphite">
              <span className="italic text-pencil">Plate — </span>
              Designing safe entry points for students to move from shared interests to comfortable in-person connection.
            </figcaption>
          </figure>
        </div>
      </Section>

      <Section n="01" title="The problem">
        <Columns
          items={[
            {
              title: "Problem",
              text: "Students wanted meaningful friendships but hesitated to initiate because they feared awkwardness, rejection, or misreading intentions.",
            },
            {
              title: "Core insight",
              text: "The barrier was not simply loneliness or lack of events. It was social ambiguity: not knowing whether another person was open to the same level of connection.",
            },
            {
              title: "Design goal",
              text: "Create structured signals of openness through music interests, communities, friendship levels, and safer meetup planning.",
            },
          ]}
        />
      </Section>

      <Section n="02" title="From research to prototype">
        <Steps
          items={[
            {
              n: "i",
              title: "Needfinding + observations",
              text: "We used interviews, persona work, and campus observations to understand why students hesitate in shared spaces. Dining hall observations were especially useful because they showed behavior that interviews alone might miss, such as students using phones as barriers or avoiding half-full tables.",
            },
            {
              n: "ii",
              title: "Point of view",
              text: "We framed the problem around students who want friendship but need a socially safe way to move from passive coexistence or online interaction into in-person connection without misreading expectations.",
            },
            {
              n: "iii",
              title: "Task analysis",
              text: "We broke down actions such as syncing music, exploring communities, starting low-pressure conversations, coordinating events, and managing boundaries during first meetups.",
            },
            {
              n: "iv",
              title: "Low-fi prototyping",
              text: "Our early paper prototype helped us test structure before committing to visuals. We discovered issues around unclear sync flows, visual affordance problems, and the need for direct one-on-one coordination from event spaces.",
            },
            {
              n: "v",
              title: "High-fi redesign",
              text: "The high-fidelity version separated the home and profile pages, simplified event cards, added quick message prompts, clarified communities, and added stronger safety features like blocking.",
            },
            {
              n: "vi",
              title: "User testing + reflection",
              text: "Participants completed the major tasks successfully, but testing revealed confusion around edit/save behavior, community posting after joining, and navigation between profile/settings. These became clear future improvement directions.",
            },
          ]}
        />
      </Section>

      <Section n="03" title="Prototype screens">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {hciScreens.map((shot, i) => (
            <Figure key={shot.src} n={i + 1} {...shot} seed={90 + i} onExpand={setExpanded} />
          ))}
        </div>
      </Section>

      <Section n="04" title="Features and what’s next">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <List
            title="Key features"
            items={[
              <><strong>Music syncing</strong> helps users express taste without starting from nothing.</>,
              <><strong>Communities</strong> let users engage around shared interests before one-on-one messaging.</>,
              <><strong>Friendship levels</strong> make connection strength more visible and less ambiguous.</>,
              <><strong>Quick messages</strong> lower the effort of starting a conversation.</>,
              <><strong>Meetup suggestions</strong> connect people through shared concerts and events.</>,
            ]}
          />
          <List
            title="Future improvements"
            items={[
              "Make the home page more distinct from the profile page with more personalized content.",
              "Clarify what friendship levels mean and how users progress through them.",
              "Add onboarding so first-time users understand profile setup, communities, messaging, and meetups.",
              "Improve feedback after joining communities or adding events so the user knows the action worked.",
              "Test with more skeptical users and run longer-term studies to see whether the app actually supports real-world connection.",
            ]}
          />
        </div>
      </Section>

      <Section n="05" title="What I learned">
        <PullQuote>
          Awkwardness is not just a personal weakness or lack of confidence; it often comes from uncertainty, safety concerns, and the hidden work of reading another person’s intentions.
        </PullQuote>
        <Prose>
          <p>
            This project changed how I think about designing for social interaction. A stronger design does not only create more opportunities to meet people. It makes the first step feel clearer, safer, and more mutual.
          </p>
        </Prose>
      </Section>

      <Lightbox image={expanded} onClose={() => setExpanded(null)} />
    </Catalogue>
  );
}

export function VizStudy({ onClose }) {
  const url = "https://fifixu01.github.io/ds4200FinalProject/";
  return (
    <Catalogue
      number="02"
      total="04"
      kind="Data visualization · DS4200"
      title="MBTA Data Visualization"
      lede="Exploring MBTA ridership through interactive visuals."
      onClose={onClose}
    >
      <Section n="Overview" title="The project">
        <Prose columns>
          <p>
            This project analyzes MBTA ridership data through a web-based data visualization story. We cleaned and prepared the dataset, then created six interactive visualizations to help viewers explore patterns in public transportation usage.
          </p>
          <p>
            The goal was to make the data easier to understand by turning raw ridership numbers into visual comparisons, trends, and interactive views. The final result was deployed as a public website so users can directly explore the visualizations.
          </p>
        </Prose>
        <Meta
          className="mt-8"
          items={[
            ["Scope", "Data cleaning · 6 visualizations · Interactive website · GitHub Pages"],
            ["Link", <TextLink href={url}>Open the full website</TextLink>],
          ]}
        />
      </Section>

      <Section n="01" title="Live">
        <LiveFrame src={url} title="MBTA Data Visualization website preview" caption="The interactive ridership site, embedded from GitHub Pages." heightClass="h-[520px]" seed={120} />
      </Section>

      <Section n="02" title="Notes">
        <Columns
          items={[
            {
              title: "Project goal",
              text: "Turn MBTA ridership data into a clearer visual story that helps users understand transit patterns across different routes, times, and categories.",
            },
            {
              title: "My work",
              text: "The project involved cleaning data, building visualizations, organizing the site, and thinking about how users would move through the information.",
            },
            {
              title: "Design focus",
              text: "The website emphasizes readability, interaction, and visual hierarchy so that the data feels approachable instead of overwhelming.",
            },
          ]}
        />
      </Section>
    </Catalogue>
  );
}

export function WebStudy({ onClose }) {
  const url = "https://spring26-project-spring26-project-group-sdc3.onrender.com/login";
  return (
    <Catalogue
      number="03"
      total="04"
      kind="Software engineering · Full-stack"
      title="GameNite"
      lede="A full-stack community and multiplayer game platform."
      onClose={onClose}
    >
      <Section n="Overview" title="The project">
        <Prose columns>
          <p>
            GameNite was built for my software engineering class as a real working web application, not just a static prototype. The site supports user accounts, forums that work across multiple users, community interaction, and multiplayer game features.
          </p>
          <p>
            This project helped me practice building a larger full-stack system with frontend UI, backend logic, authentication, persistent data, and real-time interaction.
          </p>
        </Prose>
        <Meta
          className="mt-8"
          items={[
            ["Link", <TextLink href={url}>Open the full website</TextLink>],
            ["Test login", <span>username <span className="text-ink">user0</span> · password <span className="text-ink">pwd0000</span></span>],
          ]}
        />
      </Section>

      <Section n="01" title="Live">
        <LiveFrame src={url} title="GameNite website preview" caption="The deployed app: accounts, forums, and multiplayer game features." heightClass="h-[620px]" seed={155} />
      </Section>

      <Section n="02" title="Notes">
        <Columns
          items={[
            {
              title: "Full-stack app",
              text: "Unlike the Figma-based HCI project, this was a functional deployed website with frontend, backend, authentication, and persistent user data.",
            },
            {
              title: "Community features",
              text: "The platform includes forums and posts that work across different users, allowing people to interact through shared community spaces.",
            },
            {
              title: "Multiplayer focus",
              text: "The project also supports multiplayer game interaction, connecting the social/community side of the app with actual play experiences.",
            },
          ]}
        />
      </Section>
    </Catalogue>
  );
}

export function NbStudy({ onClose }) {
  const [expanded, setExpanded] = useState(null);
  return (
    <Catalogue
      number="04"
      total="04"
      kind="Internal hackathon · Notability onsite 2026"
      mark="★ 4th place overall"
      title="Notability on Your Wrist"
      lede="Notability that knows your semester and follows you to your wrist."
      onClose={onClose}
    >
      <Section n="Overview" title="The hack">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_18rem]">
          <div>
            <Prose>
              <p>
                For Notability’s company-wide onsite hackathon, our team imagined it was December 2027 and Notability had become the world’s best proactive, AI-driven assistant for students. Then we asked what we would have had to build to get there, built the first piece in a day, and placed 4th overall.
              </p>
              <p>
                We connected Canvas so a student’s assignments and class meetings flow into Notability’s Coming Up card, and made capture one motion away on the device students already wear: an Apple Watch app, watch-face complications, and Siri phrases like “Hey Siri, create a new note in Notability.”
              </p>
            </Prose>
            <Meta
              className="mt-8"
              items={[
                ["Team", "Melon — six people across support, iOS, backend, and design"],
                ["My role", "QA · Apple Watch UI · Smart note naming"],
                ["Built with", "Apple Watch · Siri · Canvas API"],
              ]}
            />
          </div>
          <Figure
            src={nbScreens[1].src}
            alt={nbScreens[1].alt}
            caption="The magic moment: tap Start recording on the watch and a new note opens on the iPhone, already recording."
            aspect="aspect-square"
            fit="object-contain"
            variant="classic"
            seed={180}
            onExpand={setExpanded}
          />
        </div>
      </Section>

      <Section n="01 · Tuesday" title="The prompt">
        <Columns
          items={[
            {
              title: "The prompt",
              text: "It’s December 2027. Notability has become the world’s best proactive, AI-driven assistant for students. What did we do to get here?",
            },
            {
              title: "Our goal",
              text: "Let students capture and build notes with AI from whatever device they’re on, starting with Siri, and remove friction by improving the Notability device ecosystem.",
            },
            {
              title: "Why it matters",
              text: "A proactive assistant needs two things we didn’t have that morning: knowledge of the student’s schedule, and a way to act on it from whatever device is closest.",
            },
          ]}
        />
      </Section>

      <Section n="02 · Wednesday" title="What we built">
        <Columns
          items={[
            {
              title: "Canvas → Coming Up",
              text: "Assignments, announcements, and class meetings from Canvas flow into Notability’s Coming Up card with due dates. Siri answers “What’s my next assignment?” or “When’s my next class?” without opening the app.",
            },
            {
              title: "Apple Watch app",
              text: "Three actions: Start recording, Create note, and Get help, plus Create Note and Start Recording complications right on the watch face. If the phone is in a bag, the watch records on its own and hands the audio over.",
            },
            {
              title: "Help by voice",
              text: "Get help files a support request by voice straight to Fin, with the issue category and diagnostics attached, so students never have to dig through settings.",
            },
          ]}
        />
        <PullQuote small="Every capture lands as a normal note, so transcripts, flashcards, and chat work on it with nothing new to build.">
          A student walks into Biology 101, taps the watch face once or says the words, and a note opens on their iPhone, recording, already bound to that class from Canvas. Later, Coming Up reopens the same note next to the assignment it belongs to.
        </PullQuote>
      </Section>

      <Section n="03 · Thursday" title="Screens from the build">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {nbScreens.map((shot, i) => (
            <Figure key={shot.src} n={i + 1} {...shot} aspect="aspect-[4/5]" fit="object-contain" seed={200 + i} onExpand={setExpanded} />
          ))}
        </div>
      </Section>

      <Section n="04" title="Success metric">
        <p className="font-display max-w-2xl text-3xl font-light leading-snug md:text-4xl">Canvas-connected students record more.</p>
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3">
          <Stat value="40%" label="of students who connect Canvas start a note or recording from Coming Up, Siri, or the watch within two weeks" />
          <Stat value="+25%" label="more recording sessions per week than students without Canvas connected" />
          <Stat value="< 5s" label="from deciding to record to recording via watch or Siri — down from about 20 seconds on the phone" />
        </div>
      </Section>

      <Section n="05" title="My role">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_16rem]">
          <div>
            <Prose>
              <p>I joined a six-person team spanning support, iOS, backend, and design as QA, and also picked up build work on the watch side.</p>
            </Prose>
            <List
              items={[
                <><strong>Smart note naming + filing.</strong> I implemented naming for notes and recordings started from the Apple Watch. A capture takes the name given on the watch, or, if a class or event is happening at that moment, it’s named after that class and filed into its folder automatically.</>,
                <><strong>Apple Watch UI.</strong> I worked on the interface for the Notability watch app.</>,
                <><strong>QA.</strong> I tested the flows end to end as they came together, like what “Start recording” does when the iPhone app isn’t open.</>,
              ]}
            />
          </div>
          <div>
            <h3 className="font-display mb-2 text-xl">Team Melon</h3>
            <ul className="font-serif text-[15px]">
              {[
                ["Luis Guerra", "Support · Lead"],
                ["Drew Bratcher", "iOS"],
                ["Fifi Xu", "QA"],
                ["Jeremy Keys", "Backend"],
                ["Lisa Tran", "Support"],
                ["Natalie Kleinberg", "Design"],
              ].map(([name, role]) => (
                <li key={name} className={`hairline flex justify-between gap-4 py-2 ${name === "Fifi Xu" ? "text-ink" : "text-graphite"}`}>
                  <span>{name}</span>
                  <span className="text-pencil">{role}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Lightbox image={expanded} onClose={() => setExpanded(null)} />
    </Catalogue>
  );
}
