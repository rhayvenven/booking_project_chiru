"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import styles from "./BookRoomForm.module.css";

type Props = {
  roomId: string;
  totalQuantity: number;
  capacity: number;
};

export default function BookRoomForm({
  roomId,
  totalQuantity,
  capacity,
}: Props) {
  const { user, loading: authLoading } = useAuth();

  const [open, setOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!user) return;

    if (!checkIn || !checkOut) {
      setError("Please select both dates.");
      return;
    }

    if (checkOut <= checkIn) {
      setError("Check-out must be after check-in.");
      return;
    }

    setSubmitting(true);

    // Count existing confirmed bookings for this room that overlap these dates
    const { count, error: countError } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("room_id", roomId)
      .eq("status", "confirmed")
      .lt("check_in", checkOut)
      .gt("check_out", checkIn);

    if (countError) {
      setSubmitting(false);
      setError(countError.message);
      return;
    }

    if (count !== null && count >= totalQuantity) {
      setSubmitting(false);
      setError("No rooms of this type are available for those dates.");
      return;
    }

    const { error: insertError } = await supabase.from("bookings").insert({
      user_id: user.id,
      room_id: roomId,
      check_in: checkIn,
      check_out: checkOut,
      guests,
      status: "confirmed",
    });

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setSuccess(true);
  }

  if (authLoading) return null;

  if (!user) {
    return (
      <Link href="/login" className={styles.loginPrompt}>
        Log in to book
      </Link>
    );
  }

  if (success) {
    return <p className={styles.success}>Booking confirmed!</p>;
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className={styles.bookButton}>
        Book this room
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label className={styles.field}>
        Check-in
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className={styles.input}
          required
        />
      </label>

      <label className={styles.field}>
        Check-out
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className={styles.input}
          required
        />
      </label>

      <label className={styles.field}>
        Guests
        <input
          type="number"
          min={1}
          max={capacity}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className={styles.input}
          required
        />
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button
          type="submit"
          disabled={submitting}
          className={styles.bookButton}
        >
          {submitting ? "Booking..." : "Confirm booking"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className={styles.cancelButton}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
