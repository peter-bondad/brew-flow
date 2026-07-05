export default function AuthFooter() {
  return (
    <p className="text-center text-sm text-slate-500">
      Don&apos;t have an account?{' '}
      <a
        href="/signup"
        className="font-semibold text-sky-600 transition hover:text-sky-700"
      >
        Sign up now
      </a>
    </p>
  );
}
