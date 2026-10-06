"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import styles from "./Header.module.css";

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        Chiru Vacations
      </Link>

      <nav className={styles.nav}>
        <Link href="/hotels" className={styles.navLink}>
          Hotels
        </Link>

        {!loading && !user && (
          <>
            <Link href="/login" className={styles.navLink}>
              Log in
            </Link>
            <Link href="/signup" className={styles.signupButton}>
              Sign up
            </Link>
          </>
        )}

        {!loading && user && (
          <>
            <span className={styles.userName}>
              {user.user_metadata?.full_name || user.email}
            </span>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Log out
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
