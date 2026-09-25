import Link from "next/link";
import { Shippori_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
import styles from "./page.module.css";

const heading = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-heading",
});

const body = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
});

const destinations = [
  {
    name: "Tokyo",
    accent: "#9C3B2E",
    text: "A city of neon crossings and quiet backstreet shrines, side by side.",
  },
  {
    name: "Kyoto",
    accent: "#22343A",
    text: "Wooden machiya, moss gardens, and a thousand years of ceremony,",
  },
  {
    name: "Mount Fuji",
    accent: "#B69457",
    text: "The view that has shaped Japanese art and pilgrimage for centuries",
  },
];

export default function Home() {
  return (
    <main className={`${styles.main} ${heading.variable} ${body.variable}`}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.mark}>Chiru Vacations</p>
          <h1 className={styles.heroTitle}>
            Travel Japan the way it reveals itself slowly.
          </h1>
          <hr className={styles.heroRule} />
          <p>
            Curated stays across Tokyo, Kyoto, and beyond - chosen for what
            surrounds them, not just what&apos;s inside the room.
          </p>
          <Link href="/destinations" className={styles.heroLink}>
            Explore destination
          </Link>
        </div>
        <div className={styles.heroPanel}>
          <div className={styles.seal}>
            <span className={styles.sealChar}>散</span>
          </div>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Where to begin</h2>
          <p className={styles.sectionSubtitle}>
            Three places that shows a different side of Japan - Pick one, or
            plan a route through all three.
          </p>
        </div>
        <div className={styles.grid}>
          {destinations.map((destination) => (
            <article
              key={destination.name}
              className={styles.card}
              style={{ "--accent": destination.accent } as React.CSSProperties}
            >
              <div className={styles.cardImage} />
              <h3 className={styles.cardTitle}>{destination.name}</h3>
              <p className={styles.cardText}>{destination.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
