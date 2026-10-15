"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import styles from "./admin.module.css";

type AdminBooking = {
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
    };
  };
};

function countNights(checkIn: string, checkOut: string) {
  const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user || !isAdmin) {
      router.push("/");
      return;
    }

    async function loadBookings() {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          "id, check_in, check_out, guests, status, rooms(room_type, price_per_night, hotels(name))",
        )
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setBookings(data as unknown as AdminBooking[]);
      }
      setLoading(false);
    }

    loadBookings();
  }, [user, isAdmin, authLoading, router]);

  if (authLoading || loading) {
    return <main className={styles.main}>Loading...</main>;
  }

  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const cancelledCount = bookings.length - confirmed.length;
  const revenue = confirmed.reduce(
    (total, b) =>
      total + countNights(b.check_in, b.check_out) * b.rooms.price_per_night,
    0,
  );

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Admin dashboard</h1>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.stats}>
          <div className={styles.stat}>
            <p className={styles.statValue}>{confirmed.length}</p>
            <p className={styles.statLabel}>Confirmed bookings</p>
          </div>
          <div className={styles.stat}>
            <p className={styles.statValue}>{cancelledCount}</p>
            <p className={styles.statLabel}>Cancelled</p>
          </div>
          <div className={styles.stat}>
            <p className={styles.statValue}>
              ¥{revenue.toLocaleString("ja-JP")}
            </p>
            <p className={styles.statLabel}>Booked revenue</p>
          </div>
        </div>

        <h2 className={styles.subtitle}>All bookings</h2>

        {bookings.length === 0 && (
          <p className={styles.empty}>No bookings yet.</p>
        )}

        {bookings.length > 0 && (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Hotel</th>
                  <th>Room</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Guests</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td>{b.rooms.hotels.name}</td>
                    <td>{b.rooms.room_type}</td>
                    <td>{b.check_in}</td>
                    <td>{b.check_out}</td>
                    <td>{b.guests}</td>
                    <td
                      className={
                        b.status === "cancelled"
                          ? styles.cancelled
                          : styles.confirmed
                      }
                    >
                      {b.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
