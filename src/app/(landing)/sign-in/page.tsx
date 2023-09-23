import EmailSignIn from "@/app/(landing)/sign-in/email-sign-in";
import GithubSignIn from "@/app/(landing)/sign-in/github-sign-in";

export default function SignInPage() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 px-6 md:px-0 sm:w-[500px]">
        <>
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              Sign In to Kanban
            </h1>
            <p className="text-md text-content-subtle">
              Enter your email below to sign in
            </p>
          </div>
          <div className="grid gap-6">
            <EmailSignIn />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-neutral-300">
                  Or continue with
                </span>
              </div>
            </div>
            <GithubSignIn />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-neutral-300">
              Not been here before? Just{" "}
              <a className="text-blue-500" href="/sign-up">
                Sign Up
              </a>
            </span>
          </div>
        </>
      </div>
    </div>
  );
}
