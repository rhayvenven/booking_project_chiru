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
      <section className={pageStyles.section}></section>
    </main>
  );
}
