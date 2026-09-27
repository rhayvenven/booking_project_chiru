import Link from "next/link";
import { Shippori_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
import { supabase } from "@/lib/supabase";
import styles from "../page.module.css";

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
export default async function HotelsPage() {
  const { data: hotels, error } = await supabase
    .from("hotels")
    .select("*")
    .order("name");

  return (
    <main className={`${styles.main} ${heading.variable} ${body.variable}`}>
      <section className={styles.section} style={{ paddingTop: "4rem" }}>
        <p className={styles.mark}>Chiru Vacations</p>
        <h1 className={styles.heroTitle} style={{ fontSize: "2.25rem " }}>
          All hotels
        </h1>
        <hr className={styles.heroRule} />

        {error && (
          <p style={{ color: "#9C3B2E", marginTop: "1rem" }}>
            Couldn&apos;t load hotels: {error.message}
          </p>
        )}
        {hotels && hotels.length === 0 && (
          <p className={styles.sectionSubtitle} style={{ marginTop: "1rem" }}>
            No hotels added yet.
          </p>
        )}

        {hotels && hotels.length > 0 && (
          <div className={styles.grid} style={{ marginTop: "2.5rem" }}>
            {hotels.map((hotel, index) => (
              <Link
                key={hotel.id}
                href={"/hotels/${hotel.id}"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <article
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
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
