export const SITE = {
  title: 'zomriva',
  tagline: 'LOWTONE 팀 블로그',
  description: '개발 · 디자인 · 일상 이야기를 기록하는 LOWTONE 팀 블로그.',
  author: 'LOWTONE',
  locale: 'ko-KR',
  postsPerPage: 10,
  // 글별 이미지가 없을 때 쓰는 공유 이미지 (public/ 기준 경로)
  ogImage: '/og-default.png',
} as const;

// 서치콘솔 소유 확인 코드. 값이 있을 때만 meta 태그를 출력한다.
export const SITE_VERIFICATION = {
  google: '',
  naver: 'e3b67000cff372fafb031a8544fdf0be5c232c46',
} as const;

// 사이드바 탭 (Chirpy 순서 유지)
export const NAV_LINKS = [
  { href: '/', label: '홈' },
  { href: '/categories/', label: '카테고리' },
  { href: '/tags/', label: '태그' },
  { href: '/archives/', label: '아카이브' },
  { href: '/about/', label: '정보' },
] as const;

export const SOCIAL_LINKS = [
  { href: 'https://github.com/lowtone-inc', label: 'GitHub' },
  { href: '/feed.xml', label: 'RSS' },
] as const;
