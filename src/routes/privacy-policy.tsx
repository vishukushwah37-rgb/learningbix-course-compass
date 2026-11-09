import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { CONTACT } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({ meta: pageMeta("Privacy Policy", "How LearningBIX collects, uses and protects personal information of students, parents and partners.") }),
  component: () => (
    <LegalPage
      title="Privacy Policy"
      updated="November 2026"
      sections={[
        { heading: "Information we collect", body: <p>We collect details you give us — such as names, email addresses, phone numbers, delivery addresses and a child's age — when you register, book a trial, place an order or contact us. We also record learning progress, quiz results and attendance for enrolled students.</p> },
        { heading: "How we use it", body: <p>To deliver classes and kits, track learning progress, issue certificates, process payments, answer enquiries and send service updates. We do not sell personal information.</p> },
        { heading: "Children's privacy", body: <p>Accounts for children under 18 should be created or supervised by a parent or guardian. Parents may request access to, correction of, or deletion of their child's data at any time.</p> },
        { heading: "Payments", body: <p>Online payments are processed by our payment partner. We never store full card or bank details on our servers.</p> },
        { heading: "Sharing", body: <p>We share information only with partner schools or franchise centres your child is enrolled with, and with service providers who help us run the platform (hosting, payments, delivery), under confidentiality obligations.</p> },
        { heading: "Security & retention", body: <p>Data is stored securely with access limited by role. We keep information only as long as needed for the purposes above or as required by law.</p> },
        { heading: "Contact", body: <p>For privacy questions write to <a className="text-primary" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</p> },
      ]}
    />
  ),
});
