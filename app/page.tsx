import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-orange-50 text-slate-900">
      <section className="bg-red-700 px-6 py-20 text-center text-white">
        <p className="text-sm font-semibold tracking-[0.3em]">
          CHIRU VACATIONS
        </p>

        <h1 className="mx-auto mt-5 max-w-3xl text-5xl font-bold">
          Discover the beauty of Japan
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg text-red-100">
          Explore unforgettable destinations, scenic views, and curated vacation
          packages with Chiru.
        </p>

        <Link
          href="/destinations"
          className="mt-8 inline-block rounded-full bg-white px-6 py-3 font-semibold text-red-700 transition hover:bg-red-100"
        >
          Explore destinations
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold">Popular Japan destinations</h2>
        <p className="mt-2 text-slate-600">
          Choose a place to begin your next adventure.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {["Tokyo", "Kyoto", "Mount Fuji"].map((destination) => (
            <article
              key={destination}
              className="rounded-2xl bg-white p-6 shadow-sm"
            >
              <div className="h-40 rounded-xl bg-orange-200" />
              <h3 className="mt-5 text-xl font-bold">{destination}</h3>
              <p className="mt-2 text-slate-600">
                Discover iconic views, local culture, and memorable experiences.
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
