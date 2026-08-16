import {
  useEffect,
  useState,
} from "react";

import {
  ShieldCheck,
  Lock,
  Mail,
  Loader2,
  AlertTriangle,
} from "lucide-react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Login() {

  const {
    user,
    loading,
    signIn,
  } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {

    setError("");

  }, [email, password]);

  if (loading) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070D1A]">

        <Loader2
          className="animate-spin text-cyan-400"
          size={40}
        />

      </div>
    );

  }

  if (user) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }

  async function handleSubmit(event) {

    event.preventDefault();

    setError("");

    if (!email.trim()) {

      setError(
        "Enter your email address."
      );

      return;

    }

    if (!password) {

      setError(
        "Enter your password."
      );

      return;

    }

    try {

      setSubmitting(true);

      await signIn(
        email.trim(),
        password
      );

    } catch (err) {

      console.error(
        "LOGIN ERROR:",
        err
      );

      setError(
        err?.message ??
        "Unable to sign in."
      );

    } finally {

      setSubmitting(false);

    }

  }

  return (

    <div className="flex min-h-screen items-center justify-center bg-[#070D1A] px-4">

      <div className="w-full max-w-md">

        <div className="mb-8 text-center">

          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500 shadow-2xl shadow-cyan-500/20">

            <ShieldCheck
              size={42}
              className="text-slate-950"
            />

          </div>

          <h1 className="text-4xl font-black text-white">
            Alloy Cape
          </h1>

          <p className="mt-2 text-cyan-400">
            Enterprise Edition
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Secure Document Attribution Platform
          </p>

        </div>

        <div className="rounded-3xl border border-slate-700 bg-[#111B33] p-8 shadow-2xl">

          <div className="mb-7">

            <h2 className="text-2xl font-bold text-white">
              Sign in
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Authenticate to access Alloy Cape.
            </p>

          </div>

          {error && (

            <div className="mb-6 flex gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">

              <AlertTriangle
                size={20}
                className="mt-0.5 shrink-0"
              />

              <span>
                {error}
              </span>

            </div>

          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Email
              </label>

              <div className="relative">

                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  placeholder="you@company.com"
                  autoComplete="email"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-[#0B1220]
                    py-3
                    pl-11
                    pr-4
                    text-white
                    outline-none
                    transition
                    placeholder:text-slate-600
                    focus:border-cyan-500
                    focus:ring-2
                    focus:ring-cyan-500/20
                  "
                />

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Password
              </label>

              <div className="relative">

                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-700
                    bg-[#0B1220]
                    py-3
                    pl-11
                    pr-4
                    text-white
                    outline-none
                    transition
                    placeholder:text-slate-600
                    focus:border-cyan-500
                    focus:ring-2
                    focus:ring-cyan-500/20
                  "
                />

              </div>

            </div>

            <button
              type="submit"
              disabled={submitting}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-cyan-500
                px-5
                py-3.5
                font-bold
                text-slate-950
                transition
                hover:bg-cyan-400
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {submitting ? (

                <>
                  <Loader2
                    size={19}
                    className="animate-spin"
                  />

                  Authenticating...
                </>

              ) : (

                <>
                  <ShieldCheck size={19} />

                  Sign In
                </>

              )}

            </button>

          </form>

          <div className="mt-7 border-t border-slate-700 pt-5 text-center">

            <p className="text-xs text-slate-500">
              Authorized personnel only
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}