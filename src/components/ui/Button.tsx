import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-primary-500 text-white hover:bg-primary-600 shadow-card hover:shadow-cardHover",
  secondary: "bg-ink-900 text-white hover:bg-black",
  outline: "border border-ink-900/15 text-ink-900 hover:border-primary-500 hover:text-primary-600 bg-white",
  ghost: "text-ink-900 hover:bg-surface-muted",
  whatsapp: "bg-success text-white hover:bg-[#176b45]",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-sm px-3.5 py-2 rounded-lg gap-1.5",
  md: "text-[15px] px-5 py-3 rounded-lg gap-2",
  lg: "text-base px-7 py-4 rounded-xl gap-2.5",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = BaseProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  >;

type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseClasses =
  "inline-flex items-center justify-center font-semibold transition-all duration-200 ease-out disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant = "primary", size = "md", fullWidth, className, children, ...props }, ref) => {
    const classes = cn(
      baseClasses,
      VARIANT_CLASSES[variant],
      SIZE_CLASSES[size],
      fullWidth && "w-full",
      className,
    );

    if ("href" in props && props.href) {
      const { href, ...rest } = props as ButtonAsLink;
      const isExternal = href.startsWith("http");
      if (isExternal) {
        return (
          <a
            ref={ref as React.Ref<HTMLAnchorElement>}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={classes}
            {...rest}
          >
            {children}
          </a>
        );
      }
      return (
        <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={classes} {...rest}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} {...(props as ButtonAsButton)}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
