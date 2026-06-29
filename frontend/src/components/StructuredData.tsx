/**
 * Structured Data Components for SEO
 * JSON-LD markup for rich snippets
 */

import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface StructuredDataProps {
  data: Record<string, any>;
}

/**
 * Generic Structured Data component
 * Use for custom JSON-LD markup
 */
export function StructuredData({ data }: StructuredDataProps) {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}

/**
 * Breadcrumb Schema component
 */
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <StructuredData data={schema} />;
}

/**
 * Person/Mentor Profile Schema
 */
export function PersonSchema({
  name,
  title,
  description,
  image,
  url,
}: {
  name: string;
  title: string;
  description?: string;
  image?: string;
  url?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle: title,
    ...(description && { description }),
    ...(image && { image }),
    ...(url && { url }),
  };

  return <StructuredData data={schema} />;
}

/**
 * FAQ Schema component
 */
export function FAQSchema(
  faqs: Array<{
    question: string;
    answer: string;
  }>
) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return <StructuredData data={schema} />;
}

/**
 * Review/Rating Schema
 */
export function ReviewSchema({
  itemName,
  reviewRating,
  reviewCount,
  ratingValue,
}: {
  itemName: string;
  reviewRating: number;
  reviewCount: number;
  ratingValue: number;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue,
    reviewCount,
    bestRating: '5',
    worstRating: '1',
  };

  return <StructuredData data={schema} />;
}

/**
 * Event Schema
 */
export function EventSchema({
  name,
  description,
  startDate,
  endDate,
  eventLocation,
  image,
}: {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  eventLocation: string;
  image?: string;
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    endDate,
    eventLocation: {
      '@type': 'Place',
      name: eventLocation,
    },
    ...(image && { image }),
  };

  return <StructuredData data={schema} />;
}
