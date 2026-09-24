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

const destination = [
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
        <div className={styles.heroTxt}>
          <p className={styles.mark}>Chiru</p>
        </div>
      </section>
    </main>
  );
}
