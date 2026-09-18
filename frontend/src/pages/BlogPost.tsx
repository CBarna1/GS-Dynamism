import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import ScrollProgress from '../components/ScrollProgress';
import { SEOHelmet } from '../hooks/useSEO';
import api from '../services/api';

interface BlogPostFull {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  author: string | null;
  published_at: string;
}

/**
 * Renders post content as paragraphs, splitting out any embedded
 * ![alt](url) markers (inserted via the admin's "Insert Image" button)
 * into actual <img> elements rather than showing them as raw text.
 */
function renderPostContent(content: string) {
  const parts = content.split(/(!\[[^\]]*\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (match) {
      const [, alt, src] = match;
      return (
        <img
          key={i}
          src={src}
          alt={alt || 'Blog post image'}
          className="w-full rounded-lg my-8 shadow-md"
          loading="lazy"
        />
      );
    }
    if (!part.trim()) return null;
    return (
      <p key={i} className="whitespace-pre-wrap mb-4 last:mb-0">
        {part.trim()}
      </p>
    );
  });
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.get(`/blog/${slug}`)
      .then(res => {
        if (cancelled) return;
        setPost(res.data?.data || null);
        setNotFound(false);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#FF9148] rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Post not found</h1>
          <p className="text-gray-500 mb-6">This post may have been unpublished or moved.</p>
          <Link
            to="/blog"
            className="btn-tactile inline-block text-white px-6 py-3 rounded-lg font-semibold transition hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #FF9148, #E8722E)' }}
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <SEOHelmet title={`${post.title} | Guiding Stars`} description={post.excerpt || undefined} />
      <ScrollProgress />

      {post.cover_image && (
        <section className="relative">
          <img src={post.cover_image} alt={post.title} className="w-full h-[40vh] md:h-[50vh] object-cover brightness-90" />
        </section>
      )}

      <article className="py-12 md:py-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link to="/blog" className="text-sm font-semibold" style={{ color: '#FF9148' }}>
            ← Back to Blog
          </Link>

          <p className="text-xs text-gray-400 mt-6 mb-2 uppercase tracking-wide">
            {new Date(post.published_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
            {post.author && ` · ${post.author}`}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{post.title}</h1>

          <div className="text-gray-700 text-lg leading-relaxed">
            {renderPostContent(post.content)}
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPost;
