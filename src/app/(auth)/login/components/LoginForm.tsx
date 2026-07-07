export function LoginForm() {
  return (
    <section className="flex w-full items-center justify-center border-t border-[#d9b07f]/15 p-6 sm:p-8 lg:w-1/2 lg:p-10 lg:border-t-0 lg:border-l lg:border-[#d9b07f]/15">
      <div className="w-full max-w-xl sm:max-w-lg lg:max-w-lg">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#8d5a2b]">
            Coffee House
          </p>
          <h2 className="mt-2 cursor-pointer text-3xl font-semibold text-[#3d2413] sm:text-4xl lg:text-5xl">
            Login to your account
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#7b5f46] sm:text-base lg:text-lg">
            Access your rewards and order your next favorite drink.
          </p>
        </div>

        <form className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#5d4033]">
              Email
            </span>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-[#ddc0a0] bg-[#fffdf9] px-4 py-3 text-[#3d2413] outline-none transition focus:border-[#8c5a2b] focus:ring-2 focus:ring-[#e0b887]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#5d4033]">
              Password
            </span>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-[#ddc0a0] bg-[#fffdf9] px-4 py-3 text-[#3d2413] outline-none transition focus:border-[#8c5a2b] focus:ring-2 focus:ring-[#e0b887]"
            />
          </label>

          <div className="flex items-center justify-between text-sm text-[#7b5f46]">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[#cda77d] text-[#6f3e1d] focus:ring-[#e0b887]"
              />
              Remember me
            </label>
            <a
              href="#"
              className="cursor-pointer font-medium text-[#8d5a2b] transition hover:text-[#6f3e1d]"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer rounded-full bg-[#6f3e1d] px-4 py-3 font-semibold text-white transition hover:bg-[#5c3418]"
          >
            Sign in
          </button>
        </form>
      </div>
    </section>
  );
}
