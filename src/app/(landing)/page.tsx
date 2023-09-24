import { Button } from "@/components/ui/button";
import { getPageSession } from "@/lib/get-page-session";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getPageSession();
  if (session) redirect("/app");

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold">Kanban App</h1>
        <div className="flex items-center justify-center gap-5">
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
