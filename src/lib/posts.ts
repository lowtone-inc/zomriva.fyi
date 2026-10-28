import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from './url';
import { yearOf } from './format';

export type Post = CollectionEntry<'posts'>;

const byNewest = (a: Post, b: Post) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

/** 공개된 글을 최신순으로 반환 (draft는 dev 모드에서만 노출) */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort(byNewest);
}

export interface Group {
  name: string;
  slug: string;
  posts: Post[];
}

/** 글을 이름(카테고리/태그) 기준으로 묶어 글 수 내림차순으로 반환 */
function groupBy(posts: Post[], names: (post: Post) => string[]): Group[] {
  const groups = new Map<string, Group>();
  for (const post of posts) {
    for (const name of names(post)) {
      const slug = slugify(name);
      const group = groups.get(slug) ?? { name, slug, posts: [] };
      group.posts.push(post);
      groups.set(slug, group);
    }
  }
  return [...groups.values()].sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name));
}

export async function getTagGroups(): Promise<Group[]> {
  return groupBy(await getPosts(), (p) => p.data.tags);
}

export async function getCategoryGroups(): Promise<Group[]> {
  return groupBy(await getPosts(), (p) => [p.data.category]);
}

/** 연도별 아카이브 (최신 연도 먼저) */
export async function getYearGroups(): Promise<{ year: string; posts: Post[] }[]> {
  const years = new Map<string, Post[]>();
  for (const post of await getPosts()) {
    const year = yearOf(post.data.pubDate);
    years.set(year, [...(years.get(year) ?? []), post]);
  }
  return [...years].map(([year, posts]) => ({ year, posts }));
}

/** 이전/다음 글 계산 (posts는 최신순) */
export function getAdjacent(posts: Post[], id: string) {
  const index = posts.findIndex((p) => p.id === id);
  return {
    newer: index > 0 ? posts[index - 1] : undefined,
    older: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}
