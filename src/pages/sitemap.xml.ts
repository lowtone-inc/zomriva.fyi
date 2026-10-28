import type { APIContext } from 'astro';
import { getCategoryGroups, getPosts, getTagGroups } from '@/lib/posts';
import { SITE } from '@/config';
import { categoryUrl, postUrl, tagUrl, withBase } from '@/lib/url';

// Chirpy와 같은 /sitemap.xml 경로 유지 (@astrojs/sitemap의 sitemap-index.xml도 별도로 생성됨)
export async function GET(context: APIContext) {
  const posts = await getPosts();
  const lastmod = (d: Date) => d.toISOString();
  const pages = Math.max(1, Math.ceil(posts.length / SITE.postsPerPage));
  const staticPaths = ['/', ...Array.from({ length: pages - 1 }, (_, i) => `/page${i + 2}/`)]
    .concat(['/about/', '/archives/', '/categories/', '/tags/'])
    .map((p) => ({ loc: withBase(p) }));
  const entries = [
    ...staticPaths,
    ...posts.map((p) => ({ loc: postUrl(p.id), lastmod: lastmod(p.data.updatedDate ?? p.data.pubDate) })),
    ...(await getCategoryGroups()).map((g) => ({ loc: categoryUrl(g.name) })),
    ...(await getTagGroups()).map((g) => ({ loc: tagUrl(g.name) })),
  ];
  const urls = entries
    .map(({ loc, lastmod }: { loc: string; lastmod?: string }) => {
      const href = new URL(loc, context.site).href;
      return `  <url><loc>${href}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
