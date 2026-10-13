import { describe, expect, it } from "vitest";
import { mailHref, telHref, whatsappHref } from "./links";

describe("contact links", () => {
  it("builds a WhatsApp link with a prefilled message", () => {
    expect(whatsappHref("919800000000", "Hello On Air")).toBe(
      "https://wa.me/919800000000?text=Hello+On+Air",
    );
  });

  it("returns null when a number or email is missing", () => {
    expect(whatsappHref("")).toBeNull();
    expect(telHref("")).toBeNull();
    expect(mailHref("")).toBeNull();
  });

  it("prefixes telephone links with a plus", () => {
    expect(telHref("912012345678")).toBe("tel:+912012345678");
  });
});
