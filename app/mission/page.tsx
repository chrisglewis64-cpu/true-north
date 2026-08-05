import { BottomNav } from "@/components/navigation/BottomNav";

export default function MissionPage() {
  return (
    <>
      <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-5 pb-28 pt-8 text-center sm:max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          Coming soon
        </p>
        <h1 className="mt-2 text-2xl font-semibold">Mission</h1>
      </main>
      <BottomNav />
    </>
  );
}
