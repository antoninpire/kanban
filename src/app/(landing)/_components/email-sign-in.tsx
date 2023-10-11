"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

type EmailSignInProps = {
  action: string;
};

export default function EmailSignIn(props: EmailSignInProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { action } = props;
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setIsLoading(true);
    const response = await fetch(action, {
      method: "POST",
      body: formData,
      redirect: "manual",
    });
    setIsLoading(false);

    if (response.status === 0) return router.refresh();
    if (response.status === 500) return toast.error("Wrong credentials");
    else if (response.status === 400) {
      return toast.error(
        (await response.json()).error ?? "Something went wrong"
      );
    }
  }

  return (
    <form
      className="grid gap-2"
      action={action}
      method="post"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-1">
        <Input
          name="email"
          placeholder="name@example.com"
          type="email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          className="bg-background"
        />
      </div>
      <div className="grid gap-1">
        <Input
          name="password"
          placeholder="password"
          type="password"
          className="bg-background"
        />
      </div>
      <Button isLoading={isLoading}>Sign In with Email</Button>
    </form>
  );
}
