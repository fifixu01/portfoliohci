import { Catalogue, List, Meta, Prose, Section, TextLink } from "../catalogue.jsx";

// The page behind the last billboard. The words are Fiora's, carried over from the old desk.
export function AboutStudy({ onClose }) {
  return (
    <Catalogue kind="End of the line · About" title="Hello, I’m Fiora." lede="Thanks for riding all the way out here." onClose={onClose}>
      <Section n="About" title="Who’s driving">
        <Prose>
          <p>
            I’m Fiora Xu, a Computer Science major with a concentration in Human-Centered Computing at Northeastern University. I’m passionate about product management, UI/UX, product design, and quality assurance, with experience in QA and building web-based projects.
          </p>
          <p>I enjoy working at the intersection of design and functionality—thinking about how products not only work, but feel to use.</p>
        </Prose>
        <Meta
          className="mt-8"
          items={[
            ["Studying", "Computer Science · Human-Centered Computing · Northeastern University"],
            ["Focus", "Product / PM · UI/UX · HCI · Frontend · Data Visualization"],
          ]}
        />
      </Section>
      <Section n="Now" title="Looking for">
        <p className="font-hand text-3xl leading-snug text-ink">currently looking for PM, UI/UX, product design &amp; QA / automation roles :)</p>
      </Section>
      <Section n="Contact" title="Say hello">
        <List
          items={[
            <TextLink href="mailto:msfiora@gmail.com">msfiora@gmail.com</TextLink>,
            <TextLink href="https://www.linkedin.com/in/fiora-xu-17b00223a">LinkedIn</TextLink>,
          ]}
        />
      </Section>
    </Catalogue>
  );
}
