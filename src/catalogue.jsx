import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowUpRight, X } from "lucide-react";
import { SketchFrame } from "./sketch.jsx";

// Exhibition-catalogue layout for case studies: numbered sections, running text, figures with captions.

export function Catalogue({ number, total, kind, title, lede, mark, onClose, children }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="sticky top-0 z-50 bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <button
            type="button"
            onClick={onClose}
            className="ink-link-draw inline-flex items-center gap-2 font-serif text-[15px] text-graphite hover:text-ink"
          >
            <ArrowLeft size={15} strokeWidth={1.5} /> Back to the wall
          </button>
          <p className="font-display text-[15px] italic text-pencil">
            No. {number} <span className="mx-1 not-italic">/</span> {total}
          </p>
        </div>
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="hairline" />
        </div>
      </div>

      <header className="mx-auto max-w-6xl px-6 pb-10 pt-14 md:px-10 md:pb-16 md:pt-24">
        <p className="font-serif text-[13px] uppercase tracking-[0.2em] text-pencil">{kind}</p>
        {mark && <p className="mt-2 font-serif text-[13px] uppercase tracking-[0.2em] text-accent">{mark}</p>}
        <h1 className="font-display mt-5 max-w-4xl text-5xl font-light leading-[0.98] md:text-7xl">{title}</h1>
        {lede && (
          <p className="mt-7 max-w-3xl font-serif text-2xl font-light italic leading-snug text-graphite md:text-[2rem]">
            {lede}
          </p>
        )}
      </header>

      <div className="mx-auto max-w-6xl px-6 pb-24 md:px-10">{children}</div>
    </div>
  );
}

export function Section({ n, title, children, className = "" }) {
  return (
    <section className={`hairline grid grid-cols-1 gap-6 py-12 md:grid-cols-[10rem_1fr] md:gap-12 md:py-16 ${className}`}>
      <div>
        {n && <p className="font-display text-sm italic text-pencil">{n}</p>}
        <h2 className="font-display mt-1 text-2xl font-normal leading-tight">{title}</h2>
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export function Prose({ children, columns = false, className = "" }) {
  return (
    <div
      className={`font-serif text-[1.125rem] leading-[1.7] text-graphite [&>p+p]:mt-5 [&_strong]:font-medium [&_strong]:text-ink ${
        columns ? "catalogue-columns" : "max-w-[62ch]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// Three short titled paragraphs side by side, no boxes.
export function Columns({ items }) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {items.map(({ title, text }) => (
        <div key={title}>
          <h3 className="font-display text-xl">{title}</h3>
          <p className="mt-3 font-serif text-[1.0625rem] leading-[1.65] text-graphite">{text}</p>
        </div>
      ))}
    </div>
  );
}

export function PullQuote({ children, small }) {
  return (
    <blockquote className="my-10 border-l border-ink py-1 pl-6 md:my-12 md:pl-8">
      <p className="font-display max-w-3xl text-2xl font-light italic leading-snug md:text-[1.9rem]">{children}</p>
      {small && <p className="mt-4 max-w-2xl font-serif text-base leading-relaxed text-graphite">{small}</p>}
    </blockquote>
  );
}

export function Steps({ items }) {
  return (
    <ol className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
      {items.map(({ n, title, text }) => (
        <li key={n} className="hairline grid grid-cols-[2.5rem_1fr] gap-4 py-6">
          <span className="font-display pt-0.5 text-sm italic text-pencil">{n}</span>
          <div>
            <h3 className="font-display text-xl">{title}</h3>
            <p className="mt-2 font-serif text-[1.0625rem] leading-[1.65] text-graphite">{text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function List({ title, items }) {
  return (
    <div>
      {title && <h3 className="font-display mb-2 text-xl">{title}</h3>}
      <ul>
        {items.map((item, i) => (
          <li key={i} className="hairline py-3 font-serif text-[1.0625rem] leading-[1.6] text-graphite [&_strong]:font-medium [&_strong]:text-ink">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Key / value rows like a catalogue entry.
export function Meta({ items, className = "" }) {
  return (
    <dl className={`grid grid-cols-[7rem_1fr] gap-y-2 font-serif text-[15px] ${className}`}>
      {items.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="uppercase tracking-[0.16em] text-[11px] leading-6 text-pencil">{k}</dt>
          <dd className="text-graphite">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function TextLink({ href, children, className = "" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`ink-link inline-flex items-center gap-1 text-ink ${className}`}
    >
      {children}
      <ArrowUpRight size={14} strokeWidth={1.5} />
    </a>
  );
}

export function Stat({ value, label }) {
  return (
    <div className="hairline pt-5">
      <p className="font-display text-6xl font-light leading-none md:text-7xl">{value}</p>
      <p className="mt-4 max-w-xs font-serif text-[15px] leading-relaxed text-graphite">{label}</p>
    </div>
  );
}

export function Figure({ n, src, alt, caption, onExpand, aspect = "aspect-[4/3]", fit = "object-cover", variant = "thin", seed = 7, className = "" }) {
  const inner = <img src={src} alt={alt} className={`h-full w-full bg-white ${fit}`} />;
  return (
    <figure className={className}>
      {onExpand ? (
        <button type="button" onClick={() => onExpand({ src, label: alt })} className="group block w-full outline-none">
          <SketchFrame variant={variant} seed={seed} className={`${aspect} w-full transition-shadow duration-500 group-hover:shadow-frame-lift`}>
            {inner}
          </SketchFrame>
        </button>
      ) : (
        <SketchFrame variant={variant} seed={seed} className={`${aspect} w-full`}>
          {inner}
        </SketchFrame>
      )}
      <figcaption className="mt-4 font-serif text-[14px] leading-relaxed text-graphite">
        {n && <span className="italic text-pencil">Fig. {n} — </span>}
        {caption}
      </figcaption>
    </figure>
  );
}

export function LiveFrame({ src, title, caption, heightClass = "h-[560px]", seed = 9 }) {
  return (
    <figure>
      <SketchFrame variant="thin" seed={seed}>
        <iframe src={src} title={title} className={`${heightClass} w-full bg-white`} />
      </SketchFrame>
      <figcaption className="mt-4 font-serif text-[14px] leading-relaxed text-graphite">
        <span className="italic text-pencil">Live — </span>
        {caption}
      </figcaption>
    </figure>
  );
}

export function Lightbox({ image, onClose }) {
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
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[90vh] w-full max-w-5xl bg-canvas p-3 shadow-frame-lift"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 bg-canvas p-2 text-ink transition hover:text-accent"
              aria-label="Close expanded image"
            >
              <X size={18} strokeWidth={1.5} />
            </button>
            <img src={image.src} alt={image.label} className="max-h-[80vh] w-full object-contain" />
            <p className="mt-3 text-center font-serif text-[15px] text-graphite">{image.label}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
