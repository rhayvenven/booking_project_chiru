import Link from "next/link";
import { Shippori_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
import { supabase } from "@/lib/supabase";
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
const accentColors = ["#9C3B2E", "#22343A", "#B69457"];

export default async function chiruHomePage() {
  const { data: hotels, error } = await supabase
    .from("hotels")
    .select("*")
    .limit(3);
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
            A few of our stays - pick one, or browse all of them.
          </p>
        </div>
        {error && (
          <p style={{ color: "#9C3B2E", marginTop: "1rem" }}>
            Couldn&apos;t load hotels: {error.message}
          </p>
        )}

        {hotels && hotels.length === 0 && (
          <p className={styles.sectionSubtitle} style={{ marginTop: "1rem" }}>
            No hotels added yet - add some in Supabase to see them here.
          </p>
        )}
        {hotels && hotels.length > 0 && (
          <div className={styles.grid}>
            {hotels.map((hotel, index) => (
              <article
                key={hotel.id}
                className={styles.card}
                style={
                  {
                    "--accent": accentColors[index % accentColors.length],
                  } as React.CSSProperties
                }
              >
                <div className={styles.cardImage} />
                <h3 className={styles.cardTitle}>{hotel.name}</h3>
                <p className={styles.cardText}>{hotel.city}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
