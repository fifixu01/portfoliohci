import { useState } from "react";
import { Catalogue, Columns, Figure, Lightbox, List, LiveFrame, Meta, Prose, PullQuote, Section, Stat, Steps, TextLink } from "./catalogue.jsx";

const asset = (file) => `${import.meta.env.BASE_URL}${file}`;

const faceScreens = [
  { src: asset("face-home.jpg"), alt: "Face Analyzer home screen", caption: "Home: one button, and a promise that the photo stays on your device" },
  { src: asset("face-results.jpg"), alt: "Results overview", caption: "Results: face shape, symmetry score, and the measured outline" },
  { src: asset("face-features.jpg"), alt: "Feature breakdown", caption: "Features: every measurement placed on a scale against a typical face" },
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

const dayDesk = [
  {
    src: asset("scroll-desk-morning.jpg"),
    alt: "The top of a day on a computer",
    caption: "Morning. Each day opens on its header: the place, sunrise and sunset, the sky, and tonight’s moon. (The entries in these screenshots are a sample day.)",
  },
  {
    src: asset("scroll-desk-midday.jpg"),
    alt: "Midday on a computer",
    caption: "Midday. Three lanes: calendar events on the left, writing in the middle, photos on the right.",
  },
  {
    src: asset("scroll-desk-sunset.jpg"),
    alt: "Sunset on a computer",
    caption: "Sunset. Today’s page opens on the now line, with a card waiting for whatever is happening.",
  },
  {
    src: asset("scroll-desk-night.jpg"),
    alt: "Night on a computer",
    caption: "Night. The same page a few hours later: stars, the moon in its real phase, and cooler paper.",
  },
];

const dayPhone = [
  {
    src: asset("scroll-phone-morning.jpg"),
    alt: "The top of a day on a phone",
    caption: "The day’s header, stacked for a narrow screen",
  },
  {
    src: asset("scroll-phone-sunset.jpg"),
    alt: "Sunset on a phone",
    caption: "One column: notes and photos in time order, nothing overlapping",
  },
  {
    src: asset("scroll-phone-month.jpg"),
    alt: "The month on a phone",
    caption: "The month as a wall calendar you flip by swiping up or down",
  },
];

export function DayStudy({ onClose }) {
  const [expanded, setExpanded] = useState(null);
  const url = "https://scroll-through-a-day.vercel.app";
  return (
    <Catalogue
      number="01"
      total="05"
      kind="Personal project · Full-stack web app"
      title="Scroll Through a Day"
      lede="A full-stack journal where scroll position is time. Your notes, your photos, and your Google Calendar all sit where they happened."
      onClose={onClose}
    >
      <Section n="Overview" title="The project">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1fr_27rem]">
          <div>
            <Prose>
              <p>
                Scroll Through a Day turns each day into <strong>one tall page</strong>. Dawn arrives as you scroll down, the sky goes blue, then gold, then dark, and the notes and photos you added sit at the moment they happened. Today’s page opens on a glowing <strong>“now” line</strong> with one question: what’s happening right now?
              </p>
              <p>
                It is built for daily use. Sign in with Google and your <strong>Google Calendar</strong> lines up beside the hours it covers, so the day already has its shape before you write a word, and your entries <strong>sync across your computer and phone</strong>.
              </p>
              <p>
                <strong>The light is real.</strong> The sun, the moon, and the hourly cloud cover all come from your location and the date, and the sky, the shadows under the cards, and the tint of the paper all read the same value: the time at the middle of the screen.
              </p>
            </Prose>
            <Meta
              className="mt-8"
              items={[
                ["Frontend", "React · TypeScript · Vite · GSAP · Lenis · SunCalc"],
                ["Backend", "Supabase (Postgres, Auth, Storage, Edge Functions) · Vercel"],
                ["Connects to", "Google Calendar · Google sign-in · Open-Meteo weather"],
                ["Works on", "Computer and phone, each with its own layout"],
                ["Link", <TextLink href={url}>Open the live site</TextLink>],
              ]}
            />
          </div>
          <div className="grid grid-cols-2 items-start gap-7 px-2 pb-6 md:px-0 xl:-mr-10 min-[1400px]:-mr-24">
            <Figure
              src={asset("scroll-phone-home.jpg")}
              alt="The top of a day on a phone, at sunrise"
              caption="A day opening on a phone, just as the sun comes up."
              natural
              variant="ornate"
              className="-rotate-[2.5deg]"
              seed={31}
              onExpand={setExpanded}
            />
            <Figure
              src={asset("scroll-phone-now.jpg")}
              alt="Today on a phone, after dark"
              caption="Today after dark, waiting at the now line."
              natural
              variant="ornate"
              className="mt-[108%] rotate-[2deg]"
              seed={37}
              onExpand={setExpanded}
            />
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-3">
          {[
            ["Full-stack", "Frontend, database, accounts, photo storage, and a server function, deployed and live."],
            ["Google Calendar", "Your real events, read-only, lined up with the hours of your day."],
            ["Cloud sync", "Write on your computer, read it on your phone. Works offline first."],
          ].map(([word, text]) => (
            <div key={word} className="hairline pt-5">
              <p className="font-display text-4xl font-light leading-none text-ink md:text-[2.6rem]">{word}</p>
              <p className="mt-4 max-w-xs font-serif text-[15px] leading-relaxed text-graphite">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="hairline py-12 md:py-16">
        <p className="font-display text-sm italic text-pencil">01</p>
        <h2 className="font-display mb-8 mt-1 text-2xl font-normal leading-tight">Live</h2>
        <LiveFrame
          src={url}
          title="Scroll Through a Day live preview"
          caption="The deployed app. Scroll inside the frame to move through today; it works without an account, and entries stay in your browser."
          heightClass="h-[560px] md:h-auto md:aspect-[16/10]"
          allow="geolocation"
          seed={132}
        />
      </section>

      <Section n="02" title="Your calendar, inside your day">
        <p className="font-display max-w-3xl text-3xl font-light leading-snug md:text-4xl">
          Connect <span className="italic text-accent">Google Calendar</span> once, and every day arrives with its plans already in place.
        </p>
        <div className="mt-10 grid grid-cols-1 items-start gap-10 md:grid-cols-[3.4fr_1fr]">
          <Figure
            src={asset("scroll-desk-calendar.jpg")}
            alt="Calendar events beside the day on a computer"
            caption="On a computer, events run down the left of the hours, with your own notes under each one. (Sample events shown.)"
            natural
            seed={140}
            onExpand={setExpanded}
          />
          <Figure
            src={asset("scroll-phone-calendar.jpg")}
            alt="Calendar events slid out on a phone"
            caption="On a phone, swipe right to slide the events out."
            natural
            seed={141}
            onExpand={setExpanded}
          />
        </div>
        <div className="mt-10 grid grid-cols-1 gap-x-12 md:grid-cols-2">
          <List
            items={[
              <><strong>Your real schedule.</strong> Events from Google Calendar sit in their own lane, each one as tall as the time it took, so you can see at a glance where the day went.</>,
              <><strong>Read-only, on purpose.</strong> The app only asks Google for permission to read. It never edits, moves, or deletes anything on your calendar.</>,
              <><strong>Notes on any event.</strong> Tap “add note” and jot bullets right on the meeting or the lunch they belong to.</>,
            ]}
          />
          <List
            items={[
              <><strong>Notes that follow you.</strong> What you write on an event is saved to your account, so it is there on your phone and your computer.</>,
              <><strong>All-day events up top.</strong> Birthdays and days off appear in the day’s header instead of crowding the hours.</>,
              <><strong>Quiet by design.</strong> The calendar stays to the side in soft type. It gives the day structure, and the writing stays in the middle.</>,
            ]}
          />
        </div>
      </Section>

      <Section n="03" title="How it works">
        <Steps
          items={[
            {
              n: "i",
              title: "Scroll is time",
              text: "Each day is a tall strip. The top is midnight, the bottom is the next midnight, and the clock in the corner shows the time at the middle of the screen as you move.",
            },
            {
              n: "ii",
              title: "Real light",
              text: "SunCalc gives the sun and moon for your location and date. Sunrise, golden hour, sunset, dusk, the stars, and the moon’s phase all show up where they actually fall in your day.",
            },
            {
              n: "iii",
              title: "Real clouds",
              text: "Hourly cloud cover, wind, rain, and snow come from Open-Meteo. Clouds drift with the wind as you scroll through the hours, and an overcast day greys the sky and softens the shadows.",
            },
            {
              n: "iv",
              title: "Space follows activity",
              text: "Hours with entries expand and empty hours shrink, so a busy afternoon gets room and deep night becomes a short band of stars. The page is as long as the day was full.",
            },
            {
              n: "v",
              title: "Scrapbook photos",
              text: "A photo lands at the moment you add it, taped to the page. You can slide it sideways, tilt it, and resize it, but it only moves a few minutes up or down, so it stays honest about when it happened.",
            },
            {
              n: "vi",
              title: "The month",
              text: "Every day in the month view is a small weather scene for that day, with a mark for what you wrote. Clicking a day dives into it, and the cell grows into the full page.",
            },
          ]}
        />
      </Section>

      <Section n="04" title="On a computer">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {dayDesk.map((shot, i) => (
            <Figure key={shot.src} n={i + 1} {...shot} natural seed={60 + i} onExpand={setExpanded} />
          ))}
        </div>
        <Figure
          className="mt-10"
          n={5}
          src={asset("scroll-desk-month.jpg")}
          alt="The month on a computer"
          caption="The month. Each cell is that day’s weather; small marks show the days with notes and photos."
          natural
          seed={66}
          onExpand={setExpanded}
        />
      </Section>

      <Section n="05" title="On a phone">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {dayPhone.map((shot, i) => (
            <Figure key={shot.src} n={i + 6} {...shot} natural seed={70 + i} onExpand={setExpanded} />
          ))}
        </div>
        <Prose className="mt-10">
          <p>
            The phone is its own layout, not the computer one squeezed. Notes and photos share a single column in time order, calendar events slide out with a swipe to the right, the controls move to the bottom where a thumb can reach them, and the month flips like a wall calendar.
          </p>
        </Prose>
      </Section>

      <Section n="06" title="The full stack">
        <Columns
          items={[
            {
              title: "Works without an account",
              text: "Everything is saved in the browser first, so the app opens instantly and works offline. Nothing asks you to sign up before you can write.",
            },
            {
              title: "Sync when you want it",
              text: "Signing in with email or Google keeps your days in step across devices through Supabase. The newest version of each entry wins, and photos upload in the background.",
            },
            {
              title: "A real backend",
              text: "Entries live in Postgres with row-level security, so each account can only read its own days. Photos go to private storage, and a server function handles the Google Calendar connection. The site deploys to Vercel on every push.",
            },
          ]}
        />
      </Section>

      <Section n="07" title="What I learned">
        <PullQuote>
          A phone layout is a second design, not a smaller one. The hard part was changing the phone freely while keeping the computer exactly as it was.
        </PullQuote>
        <Prose>
          <p>
            Every phone change is scoped to touch devices rather than to narrow windows, so a small browser window on a laptop still gets the computer layout. Photo placement is even saved separately for each, so nudging a photo on the phone never moves it on the computer.
          </p>
        </Prose>
      </Section>

      <Lightbox image={expanded} onClose={() => setExpanded(null)} />
    </Catalogue>
  );
}

export function FaceStudy({ onClose }) {
  const [expanded, setExpanded] = useState(null);
  const url = "https://fifixu01.github.io/face-analyzer/";
  return (
    <Catalogue
      number="02"
      total="05"
      kind="Personal project · Computer vision"
      title="Face Analyzer"
      lede="A private, in-browser face analysis app. See how much you mog."
      onClose={onClose}
    >
      <Section n="Overview" title="The project">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_15rem]">
          <div>
            <Prose>
              <p>
                Face Analyzer takes one photo from your camera and breaks your face down into its shape, symmetry, proportions, and features: eye corner tilt, brow arch, nose width, cupid’s bow, and more. Every result comes with a plain-language description and a scale showing where you sit compared with a typical face.
              </p>
              <p>
                Everything runs in the browser. The photo is analyzed on your device and never uploaded, which shaped the whole product: there is no backend, no account, and no upload button.
              </p>
            </Prose>
            <Meta
              className="mt-8"
              items={[
                ["Built with", "React · TypeScript · MediaPipe Face Landmarker · Tailwind · Motion"],
                ["Link", <TextLink href={url}>Open the live site</TextLink>],
              ]}
            />
          </div>
          <Figure
            src={asset("face-mobile.jpg")}
            alt="Face Analyzer results on a phone"
            caption="Designed phone-first, since most people open it from a link on their phone."
            aspect="aspect-[9/16]"
            fit="object-cover object-top"
            variant="ornate"
            seed={21}
            onExpand={setExpanded}
          />
        </div>
      </Section>

      <Section n="01" title="Live">
        <LiveFrame
          src={url}
          title="Face Analyzer live preview"
          caption="The deployed app. Allow camera access to try it; the photo never leaves your browser."
          heightClass="h-[640px]"
          allow="camera"
          seed={120}
        />
      </Section>

      <Section n="02" title="How it works">
        <Steps
          items={[
            {
              n: "i",
              title: "Guided capture",
              text: "The camera view checks lighting, distance, and head angle in real time, and only takes the photo once you have held still in a good position, so results are not thrown off by a tilted head or a bad frame.",
            },
            {
              n: "ii",
              title: "478 landmarks",
              text: "MediaPipe’s Face Landmarker maps 478 points across the face and irises. The face is levelled by the eye line so every measurement is taken straight on.",
            },
            {
              n: "iii",
              title: "Face shape from the outline",
              text: "Instead of a few ratios, the outline is sampled at 19 heights from forehead to chin and compared with six shape profiles (oval, round, square, oblong, heart, diamond). You get the main shape plus your top three matches with percentages.",
            },
            {
              n: "iv",
              title: "Features, described",
              text: "Eyes, brows, nose, and lips are each measured several ways and translated into words like “upturned soft almond eyes” or “defined cupid’s bow”, with a short explanation of what was measured.",
            },
            {
              n: "v",
              title: "Shareable card",
              text: "Results can be saved as a share card in four color styles, with a few short phrases per feature so it reads at a glance.",
            },
          ]}
        />
      </Section>

      <Section n="03" title="Screens">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {faceScreens.map((shot, i) => (
            <Figure key={shot.src} n={i + 1} {...shot} seed={90 + i} onExpand={setExpanded} />
          ))}
        </div>
      </Section>

      <Section n="04" title="Iterating on accuracy">
        <Columns
          items={[
            {
              title: "The problem",
              text: "Early testers almost all came out as Round or Heart. The thresholds were my own guesses, and they were off-center, so ordinary faces landed at the extremes.",
            },
            {
              title: "The fix",
              text: "I calibrated every measurement against MediaPipe’s canonical face model, so an average face now reads as Oval and sits mid-scale on every feature, and only real differences push a result toward an edge.",
            },
            {
              title: "Honest limits",
              text: "I removed measurements like nose tip projection and bridge profile. Those are side-profile traits, and a front-facing photo cannot judge them, so showing them would have been made-up precision.",
            },
          ]}
        />
      </Section>

      <Section n="05" title="What I learned">
        <PullQuote>
          People trust a result more when it explains itself. A label alone feels like a verdict; a label with what was measured and where you sit on the scale feels like information.
        </PullQuote>
        <Prose>
          <p>
            The design went through a full polish pass: a flat, low-contrast dark palette instead of glassy cards, a bigger symmetry score, and simpler face-shape results. Testing on narrow phones down to 320px caught layout breaks that never showed up on desktop.
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
      number="05"
      total="05"
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
      number="04"
      total="05"
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
              text: "Unlike a Figma prototype, this was a functional deployed website with frontend, backend, authentication, and persistent user data.",
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
      number="03"
      total="05"
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
