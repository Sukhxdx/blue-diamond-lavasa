import Link from "next/link";
import { brand } from "@/lib/brand";
import { enterprise } from "@/lib/enterprise";
import { hostContact } from "@/lib/host-contact";
import { mailHref, telHref, whatsappHref } from "@/lib/links";
import { publicEnv } from "@/lib/public-env";

const links = [
  { href: "/stay", label: "Stay" },
  { href: "/pricing", label: "Pricing" },
  { href: "/restaurant", label: "Restaurant" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const policies = [
  { href: "/terms", label: "Terms and conditions" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/refunds", label: "Cancellation and refunds" },
  { href: "/shipping", label: "Service delivery" },
];

export function SiteFooter() {
  const phone = telHref(publicEnv.phoneE164);
  const emailAddress = publicEnv.email || hostContact.email;
  const email = mailHref(emailAddress);
  const whatsapp = whatsappHref(
    publicEnv.whatsappE164 || hostContact.whatsappDigits,
    `Hello, I would like to ask about ${brand.villaName} / ${brand.hotelName}.`,
  );

  return (
    <footer className="mt-auto border-t border-sand bg-pine text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-4xl leading-none">{brand.villaName}</p>
          <p className="mt-3 text-sm uppercase tracking-[0.16em] text-brass-bright">
            {brand.hotelName}
          </p>
          <p className="mt-4 max-w-xs text-sm leading-6 text-cream/80">
            {enterprise.name} operates {brand.hotelName} and the {brand.villaName} villa in{" "}
            {brand.location}.
          </p>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-[0.18em] text-brass-bright">Visit</h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brass-bright">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-[0.18em] text-brass-bright">Policies</h2>
          <ul className="mt-4 flex flex-col gap-2 text-sm">
            {policies.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brass-bright">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-[0.18em] text-brass-bright">Contact</h2>
          <address className="mt-4 space-y-2 text-sm not-italic leading-6 text-cream/90">
            <p className="font-medium text-cream">{enterprise.name}</p>
            <p>Udyam {enterprise.udyam}</p>
            {enterprise.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p>
              <a href={enterprise.telHref} className="hover:text-brass-bright">
                {enterprise.phoneDisplay}
              </a>
            </p>
            <p>
              <a href={`mailto:${enterprise.email}`} className="hover:text-brass-bright">
                {enterprise.email}
              </a>
            </p>
            <p>
              <a href={hostContact.paymentUrl} className="hover:text-brass-bright" target="_blank" rel="noopener noreferrer">
                Pay the advance
              </a>
            </p>
            <p>
              <a href={hostContact.mapsUrl} className="hover:text-brass-bright" target="_blank" rel="noopener noreferrer">
                Google Maps
              </a>
            </p>
            <p>
              <a href={hostContact.telHref} className="hover:text-brass-bright">
                Host {hostContact.phoneDisplay}
              </a>
            </p>
            {phone ? (
              <p>
                <a href={phone} className="hover:text-brass-bright">
                  {publicEnv.phoneDisplay || `+${publicEnv.phoneE164}`}
                </a>
              </p>
            ) : null}
            {whatsapp ? (
              <p>
                <a href={whatsapp} className="hover:text-brass-bright" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </p>
            ) : null}
            {email ? (
              <p>
                <a href={email} className="hover:text-brass-bright">
                  {emailAddress}
                </a>
              </p>
            ) : null}
          </address>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-cream/70">
          © {enterprise.name}. {brand.location}.
        </p>
      </div>
    </footer>
  );
}
