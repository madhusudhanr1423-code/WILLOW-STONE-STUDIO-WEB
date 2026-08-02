import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Log in — Willow & Stone Studio" }, { name: "robots", content: "noindex" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    if (mode === "forgot") {
      const result = await resetPassword(email);
      setSubmitting(false);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setResetSent(true);
      return;
    }

    const result =
      mode === "login" ? await signIn(email, password) : await signUp(email, password, fullName);
    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (mode === "signup") {
      toast.success("Account created — you're signed in.");
    } else {
      toast.success("Welcome back.");
    }
    navigate({ to: "/" });
  }

  if (mode === "forgot") {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-14 sm:px-6 sm:py-20">
        <Card className="rounded-2xl border-border/70 shadow-[var(--shadow-soft)]">
          <CardContent className="p-6">
            {resetSent ? (
              <>
                <h1 className="text-xl font-semibold">Check your email</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  If an account exists for {email}, a password reset link is on its way.
                </p>
              </>
            ) : (
              <>
                <h1 className="text-xl font-semibold">Reset your password</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  We'll email you a link to set a new password.
                </p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <Button type="submit" className="w-full rounded-xl" disabled={submitting}>
                    {submitting ? "Sending…" : "Send reset link"}
                  </Button>
                </form>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setResetSent(false);
              }}
              className="mt-6 text-sm font-medium text-primary hover:underline"
            >
              ← Back to log in
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-14 sm:px-6 sm:py-20">
      <div className="mb-8 flex gap-2 rounded-xl bg-secondary p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            mode === "login" ? "bg-background shadow-[var(--shadow-soft)]" : "text-muted-foreground"
          }`}
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            mode === "signup" ? "bg-background shadow-[var(--shadow-soft)]" : "text-muted-foreground"
          }`}
        >
          Create account
        </button>
      </div>

      <Card className="rounded-2xl border-border/70 shadow-[var(--shadow-soft)]">
        <CardContent className="p-6">
          <h1 className="text-xl font-semibold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "login"
              ? "Log in to see your booking history."
              : "Save your details so future bookings are one click."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div>
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="mt-1.5"
                />
              </div>
            )}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="mt-1.5"
              />
            </div>
            <Button type="submit" className="w-full rounded-xl" disabled={submitting}>
              {submitting ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Just here to book?{" "}
        <Link to="/book" className="font-medium text-primary hover:underline">
          Book as a guest
        </Link>{" "}
        — no account needed.
      </p>
    </div>
  );
}
