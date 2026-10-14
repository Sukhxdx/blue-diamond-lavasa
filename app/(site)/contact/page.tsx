import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { PayAdvanceLink } from "@/components/pay-advance-link";
import { brand } from "@/lib/brand";
import { enterprise } from "@/lib/enterprise";
import { hostContact } from "@/lib/host-contact";
import { mailHref, telHref, whatsappHref } from "@/lib/links";
import { publicEnv } from "@/lib/public-env";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${brand.hotelName} and the ${brand.villaName} villa in Lavasa.`,
};

export default function ContactPage() {
  const phone = telHref(publicEnv.phoneE164);
  const emailAddress = publicEnv.email || hostContact.email;
  const email = mailHref(emailAddress);
  const mapsEmbedUrl = publicEnv.mapsEmbedUrl || hostContact.mapsEmbedUrl;
  const whatsapp = whatsappHref(
    publicEnv.whatsappE164 || hostContact.whatsappDigits,
    `Hello, I would like to ask about ${brand.villaName} / ${brand.hotelName}.`,
  );

  return (
    <>
      <PageIntro eyebrow={enterprise.name} title="Contact">
        {enterprise.name} operates {brand.hotelName} and the {brand.villaName} villa in{" "}
        {brand.location}. After a booking, guests call the host on {hostContact.phoneDisplay}.
      </PageIntro>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-2">
        <div className="rounded-3xl border border-sand bg-paper p-6">
          <h2 className="font-serif text-3xl">Business</h2>
          <address className="mt-4 space-y-2 text-base not-italic leading-7 text-ink">
            <p className="font-medium">{enterprise.name}</p>
            <p>Proprietor: {enterprise.proprietor}</p>
            <p>Udyam: {enterprise.udyam}</p>
            <p>
              {brand.hotelName}. Villa: {brand.villaName}.
            </p>
            {enterprise.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p>
              Registered phone:{" "}
              <a href={enterprise.telHref} className="underline">
                {enterprise.phoneDisplay}
              </a>
            </p>
            <p>
              Registered email:{" "}
              <a href={`mailto:${enterprise.email}`} className="underline">
                {enterprise.email}
              </a>
            </p>
            <p>
              Host phone:{" "}
              <a href={hostContact.telHref} className="underline">
                {hostContact.phoneDisplay}
              </a>
            </p>
            {email ? (
              <p>
                Email:{" "}
                <a href={email} className="underline">
                  {emailAddress}
                </a>
              </p>
            ) : null}
            <p>
              <a href={hostContact.mapsUrl} className="underline" target="_blank" rel="noopener noreferrer">
                Open the property in Google Maps
              </a>
            </p>
          </address>
          <div className="mt-8">
            <PayAdvanceLink />
          </div>
          <h2 className="mt-8 font-serif text-3xl">After you book</h2>
          <p className="mt-4 leading-7 text-muted">
            Call the host on{" "}
            <a href={hostContact.telHref} className="font-medium text-ink underline">
              {hostContact.phoneDisplay}
            </a>
            . The payment receipt and booking details are sent to you and to the host.
          </p>
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
          </ul>
        </div>
        <div className="overflow-hidden rounded-3xl border border-sand bg-sand min-h-64">
          <iframe
            title={`Map of ${brand.hotelName} in Lavasa`}
            src={mapsEmbedUrl}
            className="h-full min-h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </>
  );
}
