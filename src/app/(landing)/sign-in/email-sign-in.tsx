"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function EmailSignIn() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form className="grid gap-2">
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
