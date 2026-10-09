"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import styles from "./my-bookings.module.css";

type Booking = {
  id: string;
  check_in: string;
  check_out: string;
  guests: number;
  status: string;
  rooms: {
    room_type: string;
    price_per_night: number;
    hotels: {
      name: string;
      city: string;
    };
  };
};

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    async function loadBookings() {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          "id, check_in, check_out, guests, status, rooms(room_type, price_per_night, hotels(name, city))",
        )
        .order("check_in", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setBookings(data as unknown as Booking[]);
      }
      setLoading(false);
    }

    loadBookings();
  }, [user, authLoading, router]);

  async function handleCancel(bookingId: string) {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);

    if (error) {
      setError(error.message);
      return;
    }

    setBookings((current) =>
      current.map((b) =>
        b.id === bookingId ? { ...b, status: "cancelled" } : b,
      ),
    );
  }

  if (authLoading || loading) {
    return <main className={styles.main}>Loading...</main>;
  }

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>My bookings</h1>

      {error && <p className={styles.error}>{error}</p>}

      {!error && bookings.length === 0 && (
        <p className={styles.empty}>
          You have no bookings yet. <Link href="/hotels">Browse hotels</Link>
        </p>
      )}

      {bookings.length > 0 && (
        <ul className={styles.list}>
          {bookings.map((booking) => (
            <li key={booking.id} className={styles.item}>
              <div>
                <h2 className={styles.hotelName}>
                  {booking.rooms.hotels.name}
                </h2>
                <p className={styles.meta}>
                  {booking.rooms.room_type} · {booking.rooms.hotels.city}
                </p>
                <p className={styles.meta}>
                  {booking.check_in} to {booking.check_out} · {booking.guests}{" "}
                  guest(s)
                </p>
              </div>

              <div className={styles.side}>
                <span
                  className={
                    booking.status === "cancelled"
                      ? styles.cancelled
                      : styles.confirmed
                  }
                >
                  {booking.status}
                </span>
                {booking.status === "confirmed" && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
