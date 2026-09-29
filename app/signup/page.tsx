"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import styles from "./auth.module.css";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    router.push("/");
  }
  return (
    <main className={styles.main}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Create an account</h1>
        <label className={styles.label}>
          Full name
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={styles.input}
            required
          />
        </label>

        <label className={styles.label}>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </label>
        <label className={styles.label}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
            minLength={6}
          />
        </label>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Creating Account..." : "Sign up"}
        </button>

        <p className={styles.switchLink}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
}
