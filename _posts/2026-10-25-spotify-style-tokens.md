---
title: 스포티파이 같은 그라데이션 헤더 만들기
categories: [디자인]
description: 카테고리 색 하나로 커버 · 헤더 · 본문 배경까지 이어지는 그라데이션.
---

플레이리스트 페이지의 핵심은 **커버 색이 헤더 배경으로 번지는** 느낌입니다.
색은 CSS 변수 `--hero` 하나로만 넘기고, 나머지는 CSS 가 계산합니다.

```scss
.hero {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.5)), var(--hero);
}
.view__body {
  background: linear-gradient(rgba(0, 0, 0, 0.6), var(--color-panel) 240px), var(--hero);
}
```

커버 아트도 같은 색에서 `color-mix()` 로 어두운 쪽을 만들어 대각선 그라데이션을 그립니다.

> 색을 바꾸고 싶으면 `_data/categories.yml` 의 `color` 만 고치면 됩니다.
