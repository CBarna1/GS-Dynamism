/**
 * SEO Routes for robots.txt and sitemap.xml
 * Add these routes to your Express server
 */

module.exports = function setupSEORoutes(app) {
  /**
   * GET /robots.txt
   * Tells search engines which pages to crawl
   */
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`# Guiding Stars Robots.txt
# Allow search engines to crawl all public pages

User-agent: *
Allow: /
Allow: /mentors
Allow: /mentees
Allow: /about
Allow: /contact
Allow: /testimonials
Allow: /team

# Disallow crawling of admin/protected routes
Disallow: /admin
Disallow: /dashboard
Disallow: /login
Disallow: /api/
Disallow: /uploads/
Disallow: /private/

# Crawl delay (optional, in seconds)
Crawl-delay: 1

# Sitemap location
Sitemap: ${process.env.SITE_URL || 'https://guidingstars.com'}/sitemap.xml
`);
  });

  /**
   * GET /sitemap.xml
   * XML sitemap for search engines
   * In production, you might want to generate this dynamically from your database
   */
  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = process.env.SITE_URL || 'https://guidingstars.com';
    const lastmod = new Date().toISOString().split('T')[0];

    // Define your site URLs
    const urls = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: '/mentors', priority: '0.9', changefreq: 'weekly' },
      { path: '/mentees', priority: '0.9', changefreq: 'weekly' },
      { path: '/about', priority: '0.7', changefreq: 'monthly' },
      { path: '/team', priority: '0.7', changefreq: 'monthly' },
      { path: '/testimonials', priority: '0.8', changefreq: 'weekly' },
      { path: '/contact', priority: '0.8', changefreq: 'monthly' },
      { path: '/apply', priority: '0.9', changefreq: 'daily' },
    ];

    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
${urls
  .map(
    (url) => `  <url>
    <loc>${baseUrl}${url.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`);
  });

  /**
   * GET /sitemap-mentors.xml (Optional)
   * Dynamic sitemap for mentors (can be expanded to fetch from DB)
   */
  app.get('/sitemap-mentors.xml', async (req, res) => {
    try {
      const baseUrl = process.env.SITE_URL || 'https://guidingstars.com';

      // TODO: In production, fetch mentors from database
      // const mentors = await Mentor.findAll();
      // Then map them to URLs

      res.type('application/xml');
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Mentor profile URLs would go here -->
  <!-- Example: <url><loc>${baseUrl}/mentors/123</loc></url> -->
</urlset>`);
    } catch (error) {
      console.error('Error generating mentor sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  /**
   * GET /.well-known/security.txt (Optional)
   * Security disclosure policy for bug reporters
   */
  app.get('/.well-known/security.txt', (req, res) => {
    res.type('text/plain');
    res.send(`Contact: security@guidingstars.com
Expires: ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()}
Preferred-Languages: en
`);
  });
};
