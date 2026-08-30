import Image from "next/image";
import Link from "next/link";

export function BrandMark({ href = "/" }: { href?: string }) {
  return (
    <Link className="app-brand" href={href} aria-label="AI Language Tutor home">
      <Image src="/arno.svg" width={42} height={42} alt="" priority />
      <span>
        <strong>AI Language Tutor</strong>
      </span>
    </Link>
  );
}
