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
      setError("No rooms available for the selected dates.");
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
}
