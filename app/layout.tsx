import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import Header from "@/components/Header";
import styles from "./layout.module.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chiru Vacations",
  description: "Curated hotel stays across Japan.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={styles.html}>
      <body className={styles.body}>
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
