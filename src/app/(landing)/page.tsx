import { Button } from "@/components/ui/button";
import { getPageSession } from "@/lib/get-page-session";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getPageSession();
  if (session) redirect("/app");

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center mb-3">
          <a
            href="https://github.com/antoninpire/kanban"
            target="_blank"
            rel="noreferrer"
          >
            <button className="inline-flex items-center gap-1.5 text-sm hover:bg-white/5 border rounded-full border-neutral-700 text-neutral-400 px-3 py-1.5">
              See on github
              <ArrowRight size={16} />
            </button>
          </a>
        </div>
        <h1 className="text-4xl font-bold">Kanban App</h1>
        <h3 className="text-xl mt-3">
          A minimalist kanban board app, with just the right amount of features.
        </h3>
        <div className="flex items-center justify-center gap-5 mt-8">
          <Link href="/sign-up">
            <Button variant="outline">Sign Up</Button>
          </Link>
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
