import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { brand } from "@/lib/brand";
import { hostContact } from "@/lib/host-contact";
import { mailHref, telHref, whatsappHref } from "@/lib/links";
import { publicEnv } from "@/lib/public-env";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${brand.hotelName} and the ${brand.villaName} villa in Lavasa.`,
};

export default function ContactPage() {
  const phone = telHref(publicEnv.phoneE164);
  const email = mailHref(publicEnv.email);
  const whatsapp = whatsappHref(
    publicEnv.whatsappE164 || hostContact.whatsappDigits,
    `Hello, I would like to ask about ${brand.villaName} / ${brand.hotelName}.`,
  );
  const hasDirectContact = Boolean(phone || email || whatsapp);

  return (
    <>
      <PageIntro eyebrow={brand.hotelName} title="Contact">
        {brand.hotelName}, {brand.location}, {brand.country}. After a booking, guests call
        the host on {hostContact.phoneDisplay}.
      </PageIntro>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-2">
        <div className="rounded-3xl border border-sand bg-paper p-6">
          <h2 className="font-serif text-3xl">Business</h2>
          <address className="mt-4 space-y-2 text-base not-italic leading-7 text-ink">
            <p className="font-medium">{brand.hotelName}</p>
            <p>Villa: {brand.villaName}</p>
            <p>
              {brand.location}, {brand.country}
            </p>
            <p>
              Phone:{" "}
              <a href={hostContact.telHref} className="underline">
                {hostContact.phoneDisplay}
              </a>
            </p>
          </address>
          <h2 className="mt-8 font-serif text-3xl">After you book</h2>
          <p className="mt-4 leading-7 text-muted">
            Call the host on{" "}
            <a href={hostContact.telHref} className="font-medium text-ink underline">
              {hostContact.phoneDisplay}
            </a>
            . The payment receipt and booking details are sent to you and to the host.
          </p>
          {hasDirectContact ? (
            <ul className="mt-4 space-y-3 text-base">
              {phone ? (
                <li>
                  <a href={phone} className="underline">
                    {publicEnv.phoneDisplay || `+${publicEnv.phoneE164}`}
                  </a>
                </li>
              ) : null}
              {whatsapp ? (
                <li>
                  <a href={whatsapp} className="underline" target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {email ? (
                <li>
                  <a href={email} className="underline">
                    {publicEnv.email}
                  </a>
                </li>
              ) : null}
            </ul>
          ) : null}
        </div>
        <div className="overflow-hidden rounded-3xl border border-sand bg-sand min-h-64">
          {publicEnv.mapsEmbedUrl ? (
            <iframe
              title={`Map of ${brand.hotelName} in Lavasa`}
              src={publicEnv.mapsEmbedUrl}
              className="h-full min-h-64 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <p className="p-6 leading-7 text-muted">
              {brand.hotelName} is in {brand.location}, {brand.country}.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
