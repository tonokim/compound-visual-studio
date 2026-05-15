import { LoginForm } from "@/components/login/login-form";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen w-full overflow-hidden bg-background">
      <BackgroundDecor />

      <section className="relative z-10 hidden flex-1 items-center justify-center px-12 lg:flex">
        <div className="flex flex-col items-center text-center">
          <BrandMark />
          <h1 className="mt-6 text-5xl font-semibold tracking-tight text-foreground">
            Compound
          </h1>
          <p className="mt-2 text-2xl font-light text-foreground/80">
            Visual Studio
          </p>
          <div className="mt-6 h-px w-12 bg-primary/60" />
        </div>
      </section>

      <section className="relative z-10 flex w-full items-center justify-center px-6 py-12 lg:w-[640px] lg:px-12">
        <LoginForm />
      </section>
    </main>
  );
}

function BrandMark() {
  return (
    <div className="relative size-24">
      <svg
        viewBox="0 0 100 100"
        className="size-full text-foreground"
        aria-hidden
      >
        <circle cx="30" cy="30" r="18" fill="currentColor" />
        <circle cx="70" cy="30" r="18" fill="currentColor" />
        <circle cx="30" cy="70" r="18" fill="currentColor" />
        <circle cx="70" cy="70" r="18" fill="currentColor" />
        <circle cx="50" cy="50" r="14" fill="oklch(0.18 0.025 240)" />
      </svg>
    </div>
  );
}

function BackgroundDecor() {
  return (
    <>
      <div className="absolute inset-0 bg-aurora" aria-hidden />
      <svg
        className="absolute -bottom-32 -left-32 z-0 size-[900px] opacity-70 mix-blend-screen"
        viewBox="0 0 600 600"
        aria-hidden
      >
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.85 0.16 190)" stopOpacity="0.9" />
            <stop offset="60%" stopColor="oklch(0.55 0.18 220)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g fill="url(#glow)">
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i / 60) * Math.PI * 2;
            const r = 180 + Math.sin(i * 0.6) * 60;
            const cx = 300 + Math.cos(angle) * r;
            const cy = 300 + Math.sin(angle) * (r * 0.35);
            return <circle key={i} cx={cx} cy={cy} r={2} />;
          })}
        </g>
        {Array.from({ length: 6 }).map((_, ring) => (
          <ellipse
            key={ring}
            cx="300"
            cy="300"
            rx={120 + ring * 35}
            ry={(120 + ring * 35) * 0.4}
            fill="none"
            stroke="oklch(0.78 0.14 195)"
            strokeOpacity={0.18 - ring * 0.02}
            strokeWidth="1"
            transform={`rotate(${ring * 18} 300 300)`}
          />
        ))}
      </svg>
    </>
  );
}
