import { Button } from "@/components/ui/button";
import { getPageSession } from "@/lib/get-page-session";
import { redirect } from "next/navigation";

export default async function AppPage() {
  const session = await getPageSession();
  if (!session) redirect("/sign-in");

  return (
    <div>
      App Page
      <form method="post" action="/api/auth/sign-out">
        <Button variant="destructive" type="submit">
          Logout
        </Button>
      </form>
    </div>
  );
}
