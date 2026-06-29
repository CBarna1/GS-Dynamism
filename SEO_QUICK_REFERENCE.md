# SEO Quick Reference

## 🚀 Quick Start (5 minutes)

### 1. Update Your Pages
Add this to the top of each page component:

```typescript
import { SEOHelmet } from '../hooks/useSEO';

// In the component:
<SEOHelmet pageName="about" />
```

### 2. Test It
- View page source (Ctrl+U)
- Search for `<meta name="description"`
- Should see your SEO metadata

### 3. Submit to Google
1. [Google Search Console](https://search.google.com/search-console)
2. Add your domain
3. Submit sitemap: `/sitemap.xml`

---

## 📝 Pages That Need SEO Updates

Use these `pageName` values in `<SEOHelmet pageName="..." />`:

- `home` ✅ (already updated)
- `about`
- `mentors`
- `mentees`
- `apply`
- `contact`
- `testimonials`
- `team`
- `login` (optional)
- `dashboard` (optional)

---

## 🔧 Environment Variables

Add to `.env` file:

```env
# Backend
SITE_URL=https://guidingstars.com

# Frontend (if needed)
REACT_APP_BASE_URL=https://guidingstars.com
```

---

## 📊 Verify SEO Is Working

### Check 1: Meta Tags
```
Visit: https://yoursite.com
Right-click → View Page Source
Search for: <meta name="description"
```

### Check 2: Sitemap
```
Visit: https://yoursite.com/sitemap.xml
Should show: <urlset> with <url> entries
```

### Check 3: robots.txt
```
Visit: https://yoursite.com/robots.txt
Should show: User-agent directives
```

### Check 4: Google
```
Visit: https://search.google.com/search-console
Check indexing status
```

---

## 💡 Quick Tips

✅ **Do:**
- Add SEOHelmet to all public pages
- Use descriptive keywords (3-5 per page)
- Keep titles under 60 characters
- Keep descriptions 150-160 characters
- Use H1 once per page
- Add alt text to images

❌ **Don't:**
- Duplicate titles across pages
- Keyword stuff (overusing keywords)
- Hide text with CSS
- Use poor quality backlinks
- Ignore mobile optimization

---

## 🎯 Expected Results Timeline

- **Week 1-2**: Search engines discover your site
- **Week 3-4**: Pages start appearing in search results
- **Month 2-3**: Organic traffic increases
- **Month 3+**: Build backlinks for better ranking

---

## 📞 Common Issues

**Q: Meta tags not showing?**  
A: Clear cache, check browser DevTools, rebuild frontend

**Q: Sitemap not updating?**  
A: Restart backend, check SITE_URL env variable

**Q: Not ranking in Google?**  
A: Takes 3-4 weeks min, verify in Search Console, build backlinks

---

## 🔗 Helpful Links

- [Search Console](https://search.google.com/search-console) - Monitor indexing
- [Rich Results Test](https://search.google.com/test/rich-results) - Test structured data
- [Mobile Test](https://search.google.com/test/mobile-friendly) - Check mobile compatibility
- [Schema Validator](https://validator.schema.org/) - Validate JSON-LD

---

**Status:** ✅ SEO Implementation Complete
