import Link from "next/link";

export default function Home() {
  return (
    <main className="flex w-full h-full justify-center items-between space-x-8">
      <Link href="/stem" className="border h-24 lg:h-32 p-4">
        STEM
      </Link>
      <Link href="/writing" className="border h-24 lg:h-32 p-4">
        Writing
      </Link>
    </main>
  );
}
