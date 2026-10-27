---
title: "2026.10.13 - 상태값 boolean 세 개를 union 하나로 바꿨다"
description: "isLoading, isError, data 조합 때문에 생기는 불가능한 상태를 TypeScript discriminated union으로 없앤 경험을 정리했다."
date: 2026-10-13 20:05:00 +0900
categories: [개발]
tags: [typescript, react, 타입, 리팩토링]
---

저번 주에 목록 화면에서 버그가 하나 나왔다. 에러가 났는데 로딩 스피너가 계속 돌았다. 코드를 열어보니 상태가 이렇게 생겼다.

## 문제의 상태 모델

```ts
type ListState = {
  isLoading: boolean;
  isError: boolean;
  items: Item[] | null;
  errorMessage: string | null;
};
```

필드가 네 개고, boolean 두 개만 따져도 조합이 네 가지다. 그런데 의미 있는 상태는 로딩 중, 성공, 실패 세 가지뿐이다. 나머지는 전부 "있을 수 없는 상태"인데 타입이 그걸 막아주지 않는다. `isLoading: true` 이면서 `isError: true` 인 객체도 컴파일이 된다.

실제로 요청이 실패했을 때 `isError` 만 켜고 `isLoading` 을 끄는 걸 빠뜨렸다. 그게 이번 버그의 전부였다.

## discriminated union으로 바꾸기

상태 종류를 나타내는 필드 하나를 두고, 그 값에 따라 나머지 필드가 달라지게 만든다.

```ts
type ListState =
  | { status: "loading" }
  | { status: "success"; items: Item[] }
  | { status: "error"; message: string };
```

이제 `loading` 인데 `items` 가 있다거나, `error` 인데 `message` 가 없는 객체는 만들 수 없다. 불가능한 상태가 타입 레벨에서 사라진다.

## 사용하는 쪽

```tsx
function List({ state }: { state: ListState }) {
  switch (state.status) {
    case "loading":
      return <Spinner />;
    case "success":
      return <ItemList items={state.items} />;
    case "error":
      return <ErrorBox message={state.message} />;
  }
}
```

`case "success"` 안에서는 TypeScript가 `state.items` 의 존재를 보장해 준다. `null` 체크가 필요 없다. 반대로 `loading` 에서 `state.items` 를 쓰려고 하면 바로 에러가 난다.

## 새 상태가 생기면 알려주게 하기

나중에 `"empty"` 상태를 추가하는 상황을 생각해 보자. switch에 케이스를 안 넣으면 조용히 `undefined` 가 렌더링된다. 이걸 막는 장치를 하나 넣어뒀다.

```ts
function assertNever(x: never): never {
  throw new Error(`처리되지 않은 상태: ${JSON.stringify(x)}`);
}

// switch 마지막에
default:
  return assertNever(state);
```

새 상태를 추가하고 케이스를 빠뜨리면 컴파일 에러가 난다. 런타임에 사용자가 발견하기 전에 내가 먼저 안다.

> 린트의 `switch-exhaustiveness-check` 규칙으로도 비슷한 효과를 낼 수 있다. 팀 컨벤션에 맞는 쪽을 쓰면 된다.
{: .prompt-info }

## 바꾸고 나서

변경 범위는 파일 네 개였고, 처음엔 귀찮았다. 그런데 바꾸고 나니 화면 컴포넌트가 오히려 짧아졌다. `isLoading && !isError && items` 같은 방어 조건이 전부 사라졌기 때문이다.

한 줄로 줄이면 이렇다. boolean 플래그가 두 개 이상 서로 영향을 주고 있다면, 그건 사실 상태 하나를 여러 개로 쪼개 놓은 것이다. 합쳐서 하나의 union으로 만들면 버그가 들어올 자리가 줄어든다.
