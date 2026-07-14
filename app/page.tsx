import { absoluteUrl, siteConfig } from "@/app/site-config";
import TypingTest from "@/components/TypingTest";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteConfig.name,
  url: absoluteUrl(),
  description: siteConfig.description,
  applicationCategory: "EducationalApplication",
  applicationSubCategory: "Typing test",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript and a modern web browser",
  inLanguage: "en",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "15, 30, and 60 second typing tests",
    "Words-per-minute and accuracy tracking",
    "Optional punctuation, numbers, and capital letters",
    "Typing performance history",
  ],
};

export default function Home() {
  return (
    <main className="min-h-dvh">
      <section className="sr-only" aria-labelledby="page-title">
        <h1 id="page-title">Free online typing speed test</h1>
        <p>
          OwnType is a free typing test that measures your words per minute and
          accuracy. Choose a 15, 30, or 60 second session and practice with
          optional punctuation, numbers, and capital letters.
        </p>
        <h2>Practice typing and track your progress</h2>
        <p>
          Get immediate WPM and accuracy results, review recent performance,
          and repeat focused tests to improve your typing speed over time.
        </p>
      </section>

      <TypingTest />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
