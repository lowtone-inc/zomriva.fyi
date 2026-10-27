# zomriva (Jekyll)

카테고리를 **플레이리스트**, 글을 **트랙**처럼 보여 주는 Spotify 스타일 GitHub Pages 블로그입니다.

## 로컬 실행

```bash
bundle install
bundle exec jekyll serve --livereload
# http://localhost:4000/
```

## 글 쓰기

`_posts/YYYY-MM-DD-slug.md` 파일을 만들고 front matter 를 작성합니다.

```yaml
---
title: 글 제목
categories: [dev]          # _data/categories.yml 의 key
description: 목록 요약 (선택)
---
```

- 카테고리 페이지(`/category/<slug>/`)는 `jekyll-archives` 가 자동 생성합니다.
- 새 카테고리의 표시 이름 · 커버 색 · 설명은 `_data/categories.yml` 에 추가합니다. (없어도 slug · 기본 색으로 동작)
- 사이드바 · 모바일 하단 메뉴는 `_data/navigation.yml` 에서 관리합니다.

## 화면 구성

| 화면 | 모양 |
| --- | --- |
| 홈 | 시간대 인사 + 카테고리 바로가기 타일 → "새로 올라온 글" 카드 → 전체 글 트랙 목록 |
| 카테고리 | 플레이리스트 헤더(커버 · 글 수 · 총 읽는 시간) → 재생 버튼(최신 글) → 트랙 목록 |
| 글 | 커버 + 큰 제목 헤더 → 본문 → 이전/다음 글 |
| 레이아웃 | 데스크톱: 좌측 사이드바(메뉴 · 내 라이브러리) / 모바일: 하단 탭 바 |

## 구조

| 경로 | 역할 |
| --- | --- |
| `_layouts/` | `default`(앱 셸) → `home` / `category` / `post` / `page` |
| `_includes/` | 재사용 컴포넌트 (아래 표) |
| `_sass/` | `tokens`(색·크기) · `mixins`(반복 스타일) · `base` · `layout` · `hero` · `media` · `tracklist` · `prose` |
| `_data/` | 카테고리 메타데이터, 내비게이션 |

### 컴포넌트

| include | 역할 |
| --- | --- |
| `category-resolve` | **값 계산 전용**. slug → `cat_name` · `cat_color` · `cat_url` 등을 변수로 채움 |
| `reading-time` | **값 계산 전용**. 글 → `read_minutes` |
| `cover` | 색 그라데이션 커버 아트 (`scale`: sm · md · lg) |
| `play-button` | 초록 원형 재생 버튼 (`url` 없으면 장식용) |
| `media-card` | 커버 + 제목 + 부제 카드 (글 · 카테고리 그리드 공용) |
| `media-row` | 작은 커버 + 텍스트 행 (`variant`: library · shortcut) |
| `hero` | 페이지 상단 헤더 (모든 레이아웃 공용) |
| `post-list` → `post-row` | 트랙 목록 |
| `category-list` → `category-link` | 카테고리 링크 (`variant`: pill · text) |
| `nav-links` | 메뉴 (사이드바 · 하단 바 공용) |
| `icon` · `meta-line` · `section-header` · `pagination` | 작은 공용 조각 |

카테고리 slug → 이름/색/URL 변환은 `_includes/category-resolve.html` 한 곳에서만 처리합니다.

> Jekyll include 주의: 파라미터 없이 부른 include 는 부모의 `include` 값을 그대로 물려받고,
> `include.size` 는 Hash 크기를 돌려줍니다. 그래서 크기 파라미터 이름은 `scale` 을 씁니다.

## 배포

`main` 브랜치에 push 하면 `.github/workflows/pages.yml` 이 빌드 · 배포합니다.
최초 1회 **Settings → Pages → Source** 를 **GitHub Actions** 로 설정하고, Custom domain 에 `zomriva.fyi` 를 입력하세요.
