/**
 * Renders free-text content as paragraphs, splitting out any embedded
 * ![alt](url) markers (inserted via an admin "Insert Image" button) into
 * actual <img> elements instead of showing them as raw text. Shared by
 * Blog posts and Graduation cohort press statements.
 */
export function renderRichText(content: string, imgClassName = 'w-full rounded-lg my-8 shadow-md') {
  const parts = content.split(/(!\[[^\]]*\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (match) {
      const [, alt, src] = match;
      return (
        <img key={i} src={src} alt={alt || 'Content image'} className={imgClassName} loading="lazy" />
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
