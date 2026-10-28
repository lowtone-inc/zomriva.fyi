---
title: '2026.09.06 - 월말 정산이 하루씩 밀리던 날짜 버그'
description: '날짜 문자열을 new Date로 파싱하다 타임존에 따라 하루가 밀린 버그 회고. 원인과 날짜 문자열을 다루는 방법을 정리했다.'
pubDate: 2026-09-06T21:10:00+09:00
category: 개발
tags: [javascript, typescript, 날짜, timezone, 버그회고]
featured: false
draft: false
---

지난주 목요일에 QA에서 이슈가 하나 올라왔다. "월말 정산 화면에서 건수가 월 경계에서 어긋납니다." 내 로컬에서는 재현이 안 돼서 처음엔 데이터 문제라고 생각했다. 결론부터 말하면 내 코드 문제였고, 원인은 날짜 파싱 한 줄이었다.

## 증상

정산 화면은 서버에서 `"2026-08-31"` 같은 날짜 문자열을 받아서 월별로 묶어 보여준다. 한국 시간대로 설정된 내 장비에서는 멀쩡했다. 그런데 시간대가 미국 서부로 설정된 테스트 장비에서는 9월 1일 건이 8월로 묶여 있었다.

## 원인 찾기

월로 묶는 부분은 이렇게 생겼다.

```ts
function toMonthKey(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
```

별 문제 없어 보인다. 그런데 `new Date("2026-09-01")` 은 **UTC 자정**으로 해석된다. 한국(UTC+9)에서는 9월 1일 오전 9시니까 `getMonth()` 가 9월을 돌려준다. 하지만 미국 서부(UTC-7)에서는 같은 순간이 8월 31일 오후 5시다. 그래서 `getMonth()` 가 8월을 돌려줬다.

같은 문자열인데 장비의 시간대에 따라 다른 월이 나오는 코드였다. 한국에서만 개발하고 한국에서만 테스트하면 영원히 못 찾는다.

> **WARNING**
>
> `"YYYY-MM-DD"` 형식 문자열은 UTC로, `"YYYY-MM-DDTHH:mm:ss"` (오프셋 없음) 형식은 로컬 시간으로 파싱된다. 비슷하게 생겼는데 규칙이 다르다.


## 고친 방법

날짜만 필요한 값은 `Date` 객체를 거치지 않는 게 제일 안전하다. 어차피 문자열 앞 7글자가 월 키다.

```ts
function toMonthKey(dateStr: string): string {
  return dateStr.slice(0, 7); // "2026-09"
}
```

달력 계산이 꼭 필요하면 `Date` 를 만들되 로컬 기준으로 직접 조립한다.

```ts
function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d); // 로컬 자정
}
```

## 테스트로 박아두기

이런 버그는 내 장비에서 안 보이는 게 가장 짜증난다. 그래서 타임존을 바꿔서 돌리는 테스트를 추가했다.

```bash
TZ=America/Los_Angeles npm test
TZ=Asia/Seoul npm test
```

CI에서 두 타임존으로 두 번 돌린다. 시간은 조금 더 걸리지만 이 버그를 다시 만나는 것보다는 싸다.

## 정리

- 날짜만 있는 값은 `Date` 로 바꾸지 말고 문자열로 다룬다
- 꼭 바꿔야 하면 `new Date(y, m - 1, d)` 로 로컬 기준으로 만든다
- 타임존을 바꿔 돌리는 테스트를 하나 둔다

돌이켜보면 "내 컴퓨터에서는 되는데요"가 가장 위험한 문장이다. 이번엔 그걸 내가 말하고 있었다.
