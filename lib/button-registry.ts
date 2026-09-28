export interface ConfigurableButtonMeta {
  id: string;
  defaultLabel: string;
  sectionName: string;
  sectionType: string;
  defaultActionType: "section" | "url" | "phone" | "email";
  defaultTarget: string;
  defaultVariant: "btn-primary" | "btn-accent" | "btn-outline";
}

export const PAGE_BUTTONS_REGISTRY: ConfigurableButtonMeta[] = [
  {
    id: "navbar.cta",
    defaultLabel: "Book Visit",
    sectionName: "Navigation Bar",
    sectionType: "navbar",
    defaultActionType: "section",
    defaultTarget: "#booking",
    defaultVariant: "btn-primary",
  },
  {
    id: "hero.primaryCta",
    defaultLabel: "Book Appointment",
    sectionName: "Hero Header",
    sectionType: "hero",
    defaultActionType: "section",
    defaultTarget: "#booking",
    defaultVariant: "btn-primary",
  },
  {
    id: "hero.secondaryCta",
    defaultLabel: "Emergency Care",
    sectionName: "Hero Header",
    sectionType: "hero",
    defaultActionType: "phone",
    defaultTarget: "+1 (800) 427-2673",
    defaultVariant: "btn-outline",
  },
  {
    id: "hero.cardCta",
    defaultLabel: "Confirm Time",
    sectionName: "Hero Appointment Card",
    sectionType: "hero",
    defaultActionType: "section",
    defaultTarget: "#booking",
    defaultVariant: "btn-primary",
  },
  {
    id: "services.cta",
    defaultLabel: "Consult a Specialist",
    sectionName: "Clinical Services",
    sectionType: "services",
    defaultActionType: "section",
    defaultTarget: "#booking",
    defaultVariant: "btn-primary",
  },
  {
    id: "doctors.cta",
    defaultLabel: "View All 18 Specialists",
    sectionName: "Medical Staff",
    sectionType: "doctors",
    defaultActionType: "url",
    defaultTarget: "#booking",
    defaultVariant: "btn-primary",
  },
  {
    id: "booking.submit",
    defaultLabel: "Submit Request",
    sectionName: "Direct Booking Form",
    sectionType: "booking",
    defaultActionType: "section",
    defaultTarget: "#booking",
    defaultVariant: "btn-primary",
  },
  {
    id: "footer.portal",
    defaultLabel: "Patient Portal Login",
    sectionName: "Footer",
    sectionType: "footer",
    defaultActionType: "url",
    defaultTarget: "https://myhealth-portal.org",
    defaultVariant: "btn-primary",
  },
];

export function getButtonMeta(buttonId: string): ConfigurableButtonMeta {
  return (
    PAGE_BUTTONS_REGISTRY.find((b) => b.id === buttonId) || {
      id: buttonId,
      defaultLabel: "Action Button",
      sectionName: "Page Section",
      sectionType: "hero",
      defaultActionType: "section",
      defaultTarget: "#booking",
      defaultVariant: "btn-primary",
    }
  );
}
