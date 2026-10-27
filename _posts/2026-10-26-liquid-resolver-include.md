---
title: Liquid include 로 값 돌려받기
categories: [dev]
description: 출력 대신 변수를 채워 주는 "resolver" include 패턴.
---

Liquid 의 `assign` 은 include 안에서 써도 호출한 쪽에 남습니다. 이걸 이용하면
**계산은 한 곳에서, 표시는 여러 컴포넌트에서** 나눠 맡을 수 있습니다.

```liquid
{% raw %}{% include category-resolve.html slug=post.categories.first %}
{% include cover.html color=cat_color label=cat_name size="sm" %}{% endraw %}
```

`category-resolve.html` 은 아무것도 출력하지 않고 `cat_name` · `cat_color` · `cat_url` 만 채웁니다.
사이드바, 카드, 트랙 목록, 글 헤더가 모두 이 한 파일을 거치므로 slug 변환 규칙이 흩어지지 않습니다.

| include | 역할 |
| --- | --- |
| `category-resolve` | slug → 이름 · 색 · URL |
| `reading-time` | 본문 → 읽는 시간(분) |
