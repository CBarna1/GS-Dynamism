/**
 * SEO Configuration for Guiding Stars
 * Centralized metadata for all pages
 */

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  canonical?: string;
  structuredData?: Record<string, any>;
}

// Site-wide configuration
export const SITE_CONFIG = {
  name: 'Guiding Stars',
  baseURL: import.meta.env.VITE_APP_BASE_URL || 'https://guidingstars.com',
  description: 'Connect with mentors and mentees in a thriving community for professional growth.',
  socialImage: 'https://guidingstars.com/og-image.png',
  twitterHandle: '@guidingstars',
};

// Page metadata dictionary
export const PAGE_METADATA: Record<string, SEOMetadata> = {
  home: {
    title: 'Guiding Stars - Connect With Mentors & Mentees | Mentorship Platform',
    description:
      'Guiding Stars connects mentors and mentees in a thriving community. Build meaningful relationships, gain industry insights, and grow together through personalized mentorship.',
    keywords: [
      'mentorship',
      'mentors',
      'mentees',
      'career guidance',
      'professional development',
      'networking',
      'mentorship platform',
    ],
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Guiding Stars',
      description:
        'A mentorship platform connecting professionals and aspiring individuals for career growth.',
      url: SITE_CONFIG.baseURL,
      image: SITE_CONFIG.socialImage,
      sameAs: [
        'https://www.facebook.com/guidingstars',
        'https://www.twitter.com/guidingstars',
        'https://www.linkedin.com/company/guiding-stars',
      ],
    },
  },

  about: {
    title: 'About Guiding Stars - Our Mission & Vision',
    description:
      'Learn about Guiding Stars mission to connect mentors and mentees worldwide. Discover how we empower professionals to make an impact through meaningful mentorship.',
    keywords: [
      'about us',
      'mentorship mission',
      'career development',
      'our story',
      'mentoring community',
    ],
    ogType: 'website',
  },

  mentors: {
    title: 'Meet Our Mentors | Guiding Stars',
    description:
      'Browse experienced mentors ready to guide you. Connect with professionals from various industries and gain valuable insights for your career.',
    keywords: [
      'mentors',
      'experienced professionals',
      'career mentors',
      'industry experts',
      'mentor directory',
    ],
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Mentor Directory',
      description: 'A collection of experienced mentors ready to help',
    },
  },

  mentees: {
    title: 'Join as a Mentee | Guiding Stars',
    description:
      'Find your perfect mentor. Get personalized guidance, build your professional network, and accelerate your career growth with Guiding Stars.',
    keywords: [
      'find mentors',
      'mentees',
      'career mentorship',
      'professional growth',
      'apply as mentee',
    ],
    ogType: 'website',
  },

  apply: {
    title: 'Become a Mentor | Guiding Stars',
    description:
      'Share your expertise and make a difference. Apply to become a mentor on Guiding Stars and help the next generation of professionals.',
    keywords: [
      'become mentor',
      'mentor application',
      'share expertise',
      'mentor program',
    ],
    ogType: 'website',
  },

  contact: {
    title: 'Contact Us | Guiding Stars',
    description:
      'Have questions? Get in touch with the Guiding Stars team. We are here to help you connect with the perfect mentor or answer any inquiries.',
    keywords: ['contact us', 'support', 'customer service', 'get in touch'],
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact Guiding Stars',
    },
  },

  testimonials: {
    title: 'Success Stories | Guiding Stars',
    description:
      'Hear from mentees and mentors who transformed their careers through Guiding Stars mentorship. Real stories of growth and success.',
    keywords: ['testimonials', 'success stories', 'mentorship results', 'reviews'],
    ogType: 'website',
  },

  team: {
    title: 'Our Team | Guiding Stars',
    description:
      'Meet the passionate team behind Guiding Stars, dedicated to connecting mentors and mentees and fostering professional growth.',
    keywords: ['our team', 'staff', 'team members', 'leadership'],
    ogType: 'website',
  },

  login: {
    title: 'Login | Guiding Stars',
    description: 'Sign in to your Guiding Stars account to access your mentorship dashboard.',
    keywords: ['login', 'sign in', 'account'],
    ogType: 'website',
  },

  dashboard: {
    title: 'Dashboard | Guiding Stars',
    description: 'Manage your mentorship connections, view progress, and track your growth.',
    keywords: ['dashboard', 'mentorship management', 'progress tracking'],
    ogType: 'website',
  },
};

/**
 * Get SEO metadata for a specific page
 * Provides defaults if page metadata is not found
 */
export function getSEOMetadata(pageName: string): SEOMetadata {
  const metadata = PAGE_METADATA[pageName.toLowerCase()];

  if (!metadata) {
    return {
      title: `${SITE_CONFIG.name} - Connect With Mentors & Mentees`,
      description: SITE_CONFIG.description,
      keywords: ['mentorship', 'mentors', 'mentees'],
    };
  }

  return {
    ...metadata,
    ogTitle: metadata.ogTitle || metadata.title,
    ogDescription: metadata.ogDescription || metadata.description,
    ogImage: metadata.ogImage || SITE_CONFIG.socialImage,
    canonical: `${SITE_CONFIG.baseURL}/${pageName}`,
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbs(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate LocalBusiness structured data
 */
export function generateLocalBusiness() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.baseURL,
    image: SITE_CONFIG.socialImage,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
  };
}
