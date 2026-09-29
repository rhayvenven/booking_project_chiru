import Link from "next/link";
import { notFound } from "next/navigation";
import { Shippori_Mincho, Zen_Kaku_Gothic_New } from "next/font/google";
import { supabase } from "@/lib/supabase";
import pageStyles from "../../page.module.css";
import styles from "./hotel.module.css";

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

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: hotel } = await supabase
    .from("hotels")
    .select("*")
    .eq("id", id)
    .single();
  if (!hotel) {
    notFound();
  }
  const { data: rooms, error: roomsError } = await supabase
    .from("rooms")
    .select("*")
    .eq("hotel_id", id)
    .order("price_per_night");
  return (
    <main className={`${pageStyles.main} ${heading.variable} ${body.variable}`}>
      <section className={pageStyles.section}>
        <Link href="/hotels" className={styles.backLink}>
          Back to all hotels
        </Link>
        <h1 className={styles.hotelName}>{hotel.name}</h1>
        <p className={styles.hotelCity}>{hotel.city}</p>
        <hr className={pageStyles.heroRule} />
        {hotel.description && (
          <p className={styles.hotelDescription}>{hotel.description}</p>
        )}

        <h2 className={pageStyles.sectionTitle} style={{ marginTop: "3rem" }}>
          Rooms
        </h2>
        {roomsError && (
          <p style={{ color: "#9C3B2E", marginTop: "1rem" }}>
            Couldn&apos;t load rooms: {roomsError.message}
          </p>
        )}

        {rooms && rooms.length === 0 && (
          <p
            className={pageStyles.sectionSubtitle}
            style={{ marginTop: "1rem" }}
          >
            No rooms listed for this hotel yet.
          </p>
        )}

        {rooms && rooms.length > 0 && (
          <ul className={styles.roomList}>
            {rooms.map((room) => (
              <li key={room.id} className={styles.room}>
                <div>
                  <h3 className={styles.roomType}>{room.room_type}</h3>
                  <p className={styles.roomMeta}>
                    Sleeps up to {room.capacity}
                  </p>
                </div>
                <p className={styles.roomPrice}>
                  ¥{room.price_per_night.toLocaleString("ja-JP")}
                  <span className={styles.perNight}> / night</span>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
