---
title_ko: "화력 회피 프롬프트가 액션 보상을 약하게 만드는 이유"
title_en: "When Safety Wording Turns Firepower into Warning Shots"
date: "2026-06-11"
category: "Prompt Failure"
summary_ko: "AI 전투 장면 제작에서 고어 회피 문구가 선체 파괴와 액션 보상까지 함께 약화시키는 문제를 정리한 공개 제작 노트입니다."
summary_en: "A production note on how safety-oriented prompt wording can accidentally weaken cinematic action rewards by turning direct object damage into harmless warning shots."
---

# 화력 회피 프롬프트가 액션 보상을 약하게 만드는 이유

## 요약

AI 전투 장면을 만들 때 가장 어려운 균형 중 하나는 폭력 수위를 낮추면서도 장면의 물리적 보상은 살리는 것이다.

이번 테스트에서 나온 문제는 단순했다.

현대 화력이 등장하는 장면인데, 결과물이 선박이나 장비를 직접 파괴하지 않고 주변 물, 바위, 빈 지면만 때리는 경고 사격처럼 보였다.

문제는 상위 안전 제한만이 아니었다. 제작자가 직접 만든 프롬프트와 실행 지침 안에 화력을 회피형으로 유도하는 문장이 반복되어 있었다.

```txt
의도:
고어, 신체 훼손, 직접 사망 묘사를 피한다.

실제 결과:
모델이 선박, 장비, 구조물 타격까지 함께 피한다.
```

## 무엇이 잘못됐나

초기 프롬프트에는 안전을 위해 다음과 같은 표현이 많이 들어갔다.

```txt
water impact
near vessel
empty shoreline
rocks
route denial only
controlled fire
no direct human injury
```

각 문장만 보면 나쁜 지침은 아니다.

하지만 이런 문장이 반복되면 모델은 장면의 중심을 잘못 이해한다.

```txt
사람을 직접 묘사하지 말라
→ 위험한 접촉을 모두 피하라
→ 선체도 직접 맞히지 말라
→ 주변 물과 지면만 터뜨려라
```

그 결과 전투 장면은 액션의 원인과 결과가 약해진다.

관객은 “현대 화력이 전장을 바꿨다”가 아니라 “어딘가 주변에서 물기둥이 올라왔다” 정도로만 받아들인다.

## 검열 회피와 장면 회피는 다르다

중요한 구분은 이것이다.

```txt
피해야 하는 것:
피, 고어, 신체 훼손, 직접 사망 클로즈업, 고통을 소비하는 묘사

살려야 하는 것:
선박 파손, 돛대 붕괴, 갑판 구조 파괴, 장비 파손, 대열 붕괴, 연기, 파편, 물보라
```

안전한 장면은 아무 일도 일어나지 않는 장면이 아니다.

사람의 고통을 확대하지 않으면서도, 장비와 환경의 물리적 변화는 분명해야 한다.

## 실패한 프롬프트 구조

실패한 구조는 대체로 다음과 같았다.

```txt
현대 화력 등장
→ 주변 물, 바위, 빈 경로 타격
→ 적이 놀라거나 흩어짐
→ 선박과 장비의 실제 파괴는 약함
```

이 구조에서는 화력의 시각적 보상이 사라진다.

전투 장면에서 중요한 것은 단지 “무기가 발사되었다”가 아니다. 관객은 발사 이후 전장 상태가 어떻게 바뀌었는지를 본다.

```txt
좋은 액션 보상:
선체가 갈라진다.
돛대가 쓰러진다.
노가 부러진다.
갑판 구조가 내려앉는다.
대열이 흐트러진다.
```

이 변화가 없으면 장면은 화력전이 아니라 경고 사격처럼 보인다.

## 새로 잠근 기준

수정 방향은 “더 잔인하게”가 아니다.

수정 방향은 “타격 대상을 정확히 분리하기”다.

```txt
화력은 사람을 직접 클로즈업으로 해치지 않는다.
화력은 선박, 장비, 돛대, 노, 갑판 구조, 도주 수단을 직접 파괴한다.
물, 바위, 빈 땅만 때리는 경고 사격으로 만들지 않는다.
```

영문 실행 지침으로는 다음처럼 정리할 수 있다.

```txt
Modern weapons may directly strike wooden vessels, hulls, masts, oars, deck structures, rigging, and empty escape craft.
Do not restrict fire to water, rocks, empty ground, or warning plumes.
No gore, no body-detail injury, no close-up human death.
The visual reward must be physical object destruction: hull splintering, planks tearing, mast collapse, deck rupture, listing, smoke, spray, debris, broken oars, and formation collapse.
```

## 장면을 살리는 표현

AI 영상 프롬프트에서는 “무엇을 금지할지”보다 “무엇을 보여줄지”가 더 중요하다.

다음 표현은 장면의 물리적 결과를 살리는 데 도움이 된다.

```txt
hull splintering
planks tearing outward
mast collapse
deck support buckling
oars snapping
rigging tearing loose
wooden vessel listing hard
smoke, spray, debris
formation collapse
```

반대로 아래 표현은 과하게 반복되면 장면을 회피형으로 만든다.

```txt
near vessel only
water impact only
empty shoreline
warning shot
route denial only
no direct firing phrasing
```

## 실무 체크리스트

전투 장면 프롬프트를 검수할 때는 아래를 확인한다.

```txt
1. 금지 문구가 장면의 핵심 행동까지 지우고 있지 않은가?
2. 타격 대상이 사람과 구조물로 분리되어 있는가?
3. 선박, 장비, 지형의 물리적 변화가 명확한가?
4. 물기둥이나 연기만 있고 실제 파괴가 빠져 있지 않은가?
5. 고어 회피 문장이 액션 보상 회피로 번역되고 있지 않은가?
6. 장면 이후 전장 상태가 달라졌다는 신호가 있는가?
```

## 최종 교훈

AI 영상 제작에서 안전 문구는 필요하다.

하지만 안전 문구가 장면 전체를 회피형으로 만들면, 영상은 무해해지는 것이 아니라 무력해진다.

좋은 규칙은 다음을 동시에 만족해야 한다.

```txt
사람의 고통은 소비하지 않는다.
물리적 결과는 분명히 보여준다.
전장 상태가 바뀌었다는 보상을 남긴다.
```

전투 장면의 핵심은 “얼마나 세게 묘사하는가”가 아니라, **무엇을 피하고 무엇을 남길지 정확히 분리하는 것**이다.
