/**
 * Custom hook for managing SEO meta tags with React Helmet
 */

import { Helmet } from 'react-helmet-async';
import { useMemo } from 'react';
import { getSEOMetadata, SITE_CONFIG } from '../config/seo';
import type { SEOMetadata } from '../config/seo';

interface UseSEOProps {
  pageName?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  structuredData?: Record<string, any>;
}

/**
 * Hook to set SEO meta tags for current page
 * Can use predefined page metadata or provide custom values
 */
export function useSEO(props: UseSEOProps = {}) {
  const metadata = useMemo(() => {
    if (props.pageName) {
      // Get predefined metadata for the page
      const baseMetadata = getSEOMetadata(props.pageName);

      // Override with custom props if provided
      return {
        ...baseMetadata,
        ...(props.title && { title: props.title }),
        ...(props.description && { description: props.description }),
        ...(props.keywords && { keywords: props.keywords }),
        ...(props.ogTitle && { ogTitle: props.ogTitle }),
        ...(props.ogDescription && { ogDescription: props.ogDescription }),
        ...(props.ogImage && { ogImage: props.ogImage }),
        ...(props.ogType && { ogType: props.ogType }),
        ...(props.canonical && { canonical: props.canonical }),
        ...(props.structuredData && { structuredData: props.structuredData }),
      };
    }

    // Use only custom props provided
    return {
      title: props.title || `${SITE_CONFIG.name} - Connect With Mentors & Mentees`,
      description: props.description || SITE_CONFIG.description,
      keywords: props.keywords || ['mentorship', 'mentors', 'mentees'],
      ogType: props.ogType || 'website',
      structuredData: props.structuredData,
    } as SEOMetadata;
  }, [props]);

  return metadata;
}

/**
 * SEO Helmet Component - Use this in any page component
 * Example:
 * <SEOHelmet pageName="home" />
 * or
 * <SEOHelmet title="Custom Title" description="Custom description" />
 */
export function SEOHelmet(props: UseSEOProps) {
  const metadata = useSEO(props);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      {metadata.keywords && metadata.keywords.length > 0 && (
        <meta name="keywords" content={metadata.keywords.join(', ')} />
      )}

      {/* Open Graph Tags */}
      <meta property="og:type" content={metadata.ogType || 'website'} />
      <meta property="og:title" content={metadata.ogTitle || metadata.title} />
      <meta property="og:description" content={metadata.ogDescription || metadata.description} />
      {metadata.ogImage && <meta property="og:image" content={metadata.ogImage} />}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={metadata.twitterCard || 'summary_large_image'} />
      <meta name="twitter:title" content={metadata.ogTitle || metadata.title} />
      <meta name="twitter:description" content={metadata.ogDescription || metadata.description} />
      {metadata.ogImage && <meta name="twitter:image" content={metadata.ogImage} />}

      {/* Canonical URL */}
      {metadata.canonical && <link rel="canonical" href={metadata.canonical} />}

      {/* Structured Data */}
      {metadata.structuredData && (
        <script type="application/ld+json">{JSON.stringify(metadata.structuredData)}</script>
      )}
    </Helmet>
  );
}
