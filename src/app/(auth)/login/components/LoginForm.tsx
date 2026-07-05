"use client";

import { Mail } from "lucide-react";
import { useState } from "react";

const inputClasses =
  "w-full rounded-[1.25rem] border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-800 outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <form onSubmit={(event) => event.preventDefault()} className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-slate-700">
          Username
          <input
            type="text"
            placeholder="Email or phone number"
            className={`${inputClasses} mt-2`}
            aria-label="Email or phone number"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className={`${inputClasses} pr-12`}
              aria-label="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-stone-100 px-3 py-2 text-stone-500 transition hover:bg-stone-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </label>
      </div>

      <div className="flex items-center justify-between gap-4 text-sm text-stone-600 sm:text-base">
        <label className="inline-flex items-center gap-3">
          <span
            className={`relative inline-flex h-7 w-12 items-center rounded-full p-1 transition ${
              remember ? "bg-green-500" : "bg-stone-300"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                remember ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </span>
          <span className="font-medium">Remember me</span>
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember((current) => !current)}
            className="sr-only"
          />
        </label>
        <a href="#" className="font-medium text-amber-700 hover:text-amber-800">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        className="cursor-pointer inline-flex h-14 w-full items-center justify-center rounded-3xl bg-stone-900 px-6 text-base font-semibold text-white shadow-[0_16px_32px_rgba(87,83,78,0.18)] transition hover:bg-stone-800"
      >
        Sign in
      </button>

      <div className="space-y-4">
        <button
          type="button"
          className="flex h-14 w-full items-center justify-center gap-3 rounded-3xl border border-stone-200 bg-white px-6 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
        >
          <span className="cursor-pointer flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-700">
            <Mail size={18} strokeWidth={2} />
          </span>
          Continue with Google
        </button>
      </div>
    </form>
  );
}
