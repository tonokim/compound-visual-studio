"use client";

import { useEffect, useState } from "react";
import { Lock, Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const emailValid = EMAIL_RE.test(email);
  const canSubmit = emailValid && code.length === 6 && !submitting;

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/5 bg-card/60 p-10 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <header className="flex items-center gap-4">
        <span className="flex size-12 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
          <Lock className="size-5" />
        </span>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          登录
        </h2>
      </header>

      <form
        className="mt-10 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSubmit) return;
          setSubmitting(true);
          setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
          }, 700);
        }}
      >
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground/90"
          >
            邮箱地址
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="请输入邮箱地址"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl pr-32 pl-10"
            />
            <Button
              type="button"
              disabled={!emailValid || countdown > 0}
              onClick={() => setCountdown(60)}
              className="absolute top-1/2 right-1.5 h-9 -translate-y-1/2 rounded-lg bg-primary/15 px-4 text-primary hover:bg-primary/25 disabled:opacity-60"
            >
              {countdown > 0 ? `${countdown}s 后重试` : "发送验证码"}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="code"
            className="text-sm font-medium text-foreground/90"
          >
            验证码
          </label>
          <div className="relative">
            <ShieldCheck className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="code"
              inputMode="numeric"
              maxLength={6}
              placeholder="请输入 6 位验证码"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="h-12 rounded-xl pl-10 tracking-widest"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={!canSubmit}
          className="bg-brand-gradient mt-2 h-12 w-full rounded-xl text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-95 disabled:opacity-60"
        >
          {submitting ? "登录中..." : submitted ? "登录成功 ✓" : "登录"}
        </Button>
      </form>
    </div>
  );
}
