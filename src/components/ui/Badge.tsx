import { cn } from "@/lib/utils";

type BadgeTone = "primary" | "success" | "neutral" | "outline";

export function Badge({
  children,
  tone = "primary",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  const toneClasses: Record<BadgeTone, string> = {
    primary: "bg-primary-500 text-white",
    success: "bg-success text-white",
    neutral: "bg-ink-900 text-white",
    outline: "border border-ink-900/15 text-ink-600 bg-white",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-tight",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
