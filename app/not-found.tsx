import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>Page not found</h1>
      <p>This language page is not available yet.</p>
      <Link className="button button-primary" href="/">
        Back home
      </Link>
    </main>
  );
}
