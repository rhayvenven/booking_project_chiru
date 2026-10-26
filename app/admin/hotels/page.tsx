"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import styles from "./admin-hotels.module.css";

type Hotel = {
  id: string;
  name: string;
  city: string;
  address: string | null;
  description: string | null;
};

export default function AdminHotelsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!user || !isAdmin) {
      router.push("/");
      return;
    }

    async function loadHotels() {
      const { data, error } = await supabase
        .from("hotels")
        .select("id, name, city, address, description")
        .order("name");

      if (error) {
        setError(error.message);
      } else {
        setHotels(data as Hotel[]);
      }
      setLoading(false);
    }

    loadHotels();
  }, [user, isAdmin, authLoading, router]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const { data, error } = await supabase
      .from("hotels")
      .insert({ name, city, address, description })
      .select()
      .single();

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    setHotels((current) => [...current, data as Hotel]);
    setName("");
    setCity("");
    setAddress("");
    setDescription("");
  }

  async function handleDelete(hotel: Hotel) {
    const sure = window.confirm(
      `Delete "${hotel.name}"? This also deletes its rooms and bookings.`,
    );
    if (!sure) return;

    const { error } = await supabase.from("hotels").delete().eq("id", hotel.id);

    if (error) {
      setError(error.message);
      return;
    }

    setHotels((current) => current.filter((h) => h.id !== hotel.id));
  }

  if (authLoading || loading) {
    return <main className={styles.main}>Loading...</main>;
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Link href="/admin" className={styles.backLink}>
          Back to dashboard
        </Link>
        <h1 className={styles.title}>Manage hotels</h1>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleAdd} className={styles.form}>
          <h2 className={styles.subtitle}>Add a hotel</h2>

          <label className={styles.label}>
            Name
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
            />
          </label>

          <label className={styles.label}>
            City
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={styles.input}
              required
            />
          </label>

          <label className={styles.label}>
            Address
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={styles.input}
            />
          </label>

          <label className={styles.label}>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.input}
              rows={3}
            />
          </label>

          <button type="submit" disabled={saving} className={styles.button}>
            {saving ? "Adding..." : "Add hotel"}
          </button>
        </form>

        <h2 className={styles.subtitle}>Current hotels</h2>

        {hotels.length === 0 && <p>No hotels yet.</p>}

        <ul className={styles.list}>
          {hotels.map((hotel) => (
            <li key={hotel.id} className={styles.item}>
              <div>
                <p className={styles.hotelName}>{hotel.name}</p>
                <p className={styles.meta}>{hotel.city}</p>
              </div>
              <button
                onClick={() => handleDelete(hotel)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
