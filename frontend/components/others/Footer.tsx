import Image from "next/image";
import Link from "next/link";

const productLinks = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how" },
  { label: "Roles", href: "/#roles" },
  { label: "FAQ", href: "/#faq" },
];

const onboardingLinks = [
  { label: "Get started", href: "/getstarted" },
  { label: "Create a company", href: "/getstarted/createcompany" },
  { label: "Join with code", href: "/getstarted?join=code" },
  { label: "Sign in", href: "/login" },
];

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-[var(--ledger-line)] bg-[var(--paper-card)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="Reqora home" className="inline-block">
              <Image
                src="/reqoraLogo.png"
                width={160}
                height={48}
                alt="Reqora logo"
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The resource request platform for modern teams. Request, approve,
              and track every company resource — in one place.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>Operational</span>
              <span aria-hidden>·</span>
              <span>v1.0.0</span>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-card-foreground">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-card-foreground">Get started</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {onboardingLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-bold text-card-foreground">System</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p>Version</p>
                <p className="font-medium text-card-foreground">v1.0.0</p>
              </div>
              <div>
                <p>Status</p>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span>Operational</span>
                </div>
              </div>
              <div>
                <p>Last Updated</p>
                <p className="font-medium text-card-foreground">June 2026</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between border-t pt-5 text-sm text-muted-foreground md:flex-row">
          <p>© 2026 Reqora. Resource management for modern teams.</p>
          <div className="mt-3 flex gap-4 md:mt-0">
            <Link href="/getstarted" className="hover:text-foreground">
              Get started
            </Link>
            <Link href="/login" className="hover:text-foreground">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
