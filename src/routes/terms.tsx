import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { CONTACT } from "@/data/site";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, formatINR } from "@/lib/pricing";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: pageMeta("Terms & Conditions", "Terms for using LearningBIX courses, the online store, school and franchise programs.") }),
  component: () => (
    <LegalPage
      title="Terms & Conditions"
      updated="November 2026"
      sections={[
        { heading: "Using LearningBIX", body: <p>By creating an account or purchasing from LearningBIX you agree to these terms. Accounts are personal; keep your password safe and tell us about any unauthorised use.</p> },
        { heading: "Courses & classes", body: <p>Class schedules, batch allocation and mentors may change with notice. Missed live classes can be caught up through recorded lessons where available.</p> },
        { heading: "Orders & shipping", body: <p>Prices are in Indian Rupees and include applicable taxes. Orders of {formatINR(FREE_SHIPPING_THRESHOLD)} or more ship free; smaller orders carry a {formatINR(SHIPPING_FEE)} delivery fee.</p> },
        { heading: "Returns & refunds", body: <p>Unopened kits can be returned within 7 days of delivery. Damaged or missing parts are replaced free of charge when reported within 7 days with photos.</p> },
        { heading: "Certificates", body: <p>Certificates are issued on course completion and can be verified online with their certificate code.</p> },
        { heading: "Acceptable use", body: <p>Do not misuse the platform, share others' personal data or upload harmful content. We may suspend accounts that break these rules.</p> },
        { heading: "Contact", body: <p>Questions? Email <a className="text-primary" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p> },
      ]}
    />
  ),
});
