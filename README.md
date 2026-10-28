# zomriva.fyi

LOWTONE 팀 블로그. Astro 5 정적 사이트 (Chirpy 스타일 + Spotify 다크 팔레트). → https://zomriva.fyi

## 실행

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # astro check + 빌드 → dist/
```

## 글 작성

`src/content/posts/<slug>.md` 추가. URL 은 `/posts/<slug>/`.

```md
---
title: '제목'
description: '요약'
pubDate: 2026-10-27T21:00:00+09:00
category: 개발
tags: [태그1, 태그2]
featured: false
draft: false
---
```

카테고리 · 태그 · 아카이브 페이지와 `/feed.xml`, `/sitemap.xml` 은 자동 생성됩니다.

## 배포

`main` 에 merge 하면 `.github/workflows/deploy.yml` 이 빌드 후 GitHub Pages 에 배포합니다 (Pages Source = GitHub Actions).
커스텀 도메인은 `public/CNAME` (`zomriva.fyi`).
DNS(Spaceship): `@` A 레코드 `185.199.108.153` · `185.199.109.153` · `185.199.110.153` · `185.199.111.153`, `www` CNAME `lowtone-inc.github.io`.
