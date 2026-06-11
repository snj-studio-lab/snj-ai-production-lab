---
title_ko: "군복이 정장으로 바뀌는 AI 이미지 프롬프트 문제"
title_en: "When Military Uniform Prompts Collapse into Business Suits"
date: "2026-06-11"
category: "Visual Identity"
summary_ko: "현대군 캐릭터 레퍼런스 제작에서 국적, 군종, 계급, 복장 구조를 충분히 잠그지 않으면 군복이 정장이나 generic officer 이미지로 무너지는 문제를 정리한 제작 노트입니다."
summary_en: "A production note on why modern military character prompts need nationality, branch, rank hierarchy, and uniform-structure locks to avoid drifting into suits or generic officers."
---

# 군복이 정장으로 바뀌는 AI 이미지 프롬프트 문제

## 요약

현대군 캐릭터 레퍼런스를 만들 때, “naval captain”이나 “operations officer” 같은 짧은 표현만으로는 충분하지 않았다.

프롬프트가 헐거우면 모델은 다음 방향으로 쉽게 미끄러진다.

```txt
한국군이 아니라 외국군처럼 보인다.
군복이 아니라 정장처럼 보인다.
함장과 작전장교의 위계가 섞인다.
계급장과 군복 구조가 사라진다.
공식 초상처럼 보이거나 generic officer가 된다.
```

이번 테스트의 핵심 교훈은 간단하다.

현대군 캐릭터는 “사람”만 만드는 것이 아니라, 국적, 군종, 직책, 계급 위계, 복장 구조를 함께 고정해야 한다.

## 왜 짧은 프롬프트가 무너지는가

초기 프롬프트는 대체로 이런 식이었다.

```txt
modern Korean naval captain in dark command uniform
modern naval operations officer in dark command uniform
```

이 정도 문장에는 중요한 정보가 빠져 있다.

```txt
- 어느 나라 군인인가
- 어느 군종인가
- 정복인가, 근무복인가, 작전복인가
- 함장과 작전장교의 위계는 어떻게 다른가
- 계급장은 보여야 하는가, 숨겨야 하는가
- 읽을 수 있는 텍스트와 시각적 계급 표식은 어떻게 분리할 것인가
```

모델은 빈칸을 스스로 채운다.

그 결과 한국 해군 장교가 아니라 서양권 해군, 정장 입은 관리, 항공사 파일럿, 경찰 제복, 일반 비즈니스 인물처럼 보이는 이미지가 나올 수 있다.

## “읽을 수 없는 표식”과 “표식 없음”은 다르다

처음에는 안전을 위해 다음 표현을 사용했다.

```txt
no readable insignia
no readable name tag
no readable text
no logos
```

문제는 일부 모델이 이 문장을 “계급장과 군복 표식을 모두 제거하라”로 해석한다는 점이다.

하지만 실제로 필요한 것은 이것이었다.

```txt
작은 글자는 읽히지 않아도 된다.
하지만 계급장, 견장, 소매 계급선, 리본바, 명찰 영역, 군복 실루엣은 보여야 한다.
```

즉, 금지해야 할 것은 읽을 수 있는 텍스트이지, 군복의 시각적 정체성 자체가 아니다.

더 안전한 표현은 다음과 같다.

```txt
Exact tiny lettering does not need to be readable, but officer rank markings, shoulder boards, sleeve rank bands, ribbons, badge, and nameplate area must be visibly present.
```

## 캐릭터 위계 분리

현대 해군 브리지 장면에서는 함장과 작전장교가 시각적으로 구분되어야 한다.

공개용으로 단순화하면 다음 기준이 유용했다.

```txt
A_CAPT:
senior commanding officer
mature Korean male
calm restrained authority
visually highest authority on the bridge
dark Republic of Korea Navy command uniform
visible senior officer structure

A_OPS:
subordinate operations officer
younger Korean male
alert, procedural, report-oriented
visually lower authority than the captain
dark Republic of Korea Navy duty or operations uniform
visible but less senior officer structure
```

이 차이를 명시하지 않으면 두 캐릭터는 나이, 얼굴, 복장, 권위가 섞인다.

스토리보드나 영상 실행 단계에서는 아래와 같은 분리 문구가 도움이 된다.

```txt
Role separation lock:
The captain and operations officer must remain clearly distinct.
The captain is older, higher authority, calmer, and visually dominant as the commanding officer.
The operations officer is younger, subordinate, report-oriented, and operationally reactive.
Do not merge their facial identity, age impression, or command hierarchy.
```

## 작전 장면과 공식 초상은 다르다

또 하나의 문제는 장면 맥락이었다.

모델은 군복을 요구받으면 종종 공식 초상, 행사 사진, 정복 차림으로 해석한다.

하지만 브리지 작전 장면에서는 이런 방향이 어색할 수 있다.

```txt
공식 초상:
정면 포즈
정복 또는 예장 느낌
깨끗한 배경
장식성이 강함

작전 장면:
브리지 내부
근무복 또는 지휘복
콘솔, 창, 조명, 보고 자세
긴장감은 있지만 과장되지 않음
```

그래서 장면용 프롬프트에는 반드시 환경을 함께 넣어야 한다.

```txt
modern Korean aircraft carrier bridge interior
restrained dark command space
large forward bridge windows
cold dawn light
subtle consoles and monitors
no readable monitor text
```

## 더 안정적인 프롬프트 구조

현대군 캐릭터를 만들 때는 다음 블록을 분리해 쓰는 편이 안정적이다.

```txt
1. Subject
국적, 성별, 연령대, 얼굴 인상

2. Role
함장인지, 작전장교인지, 지휘권 위계가 무엇인지

3. Uniform
군종, 복장 종류, 견장, 계급선, 리본바, 명찰 영역, 군복 실루엣

4. Setting
브리지, 작전실, 콘솔, 조명, 장면 목적

5. Negative constraints
정장, 외국군, generic officer, 경찰, 파일럿, 비즈니스맨 방지
```

이 구조는 단순히 프롬프트를 길게 쓰기 위한 것이 아니다.

모델이 임의로 빈칸을 채우지 못하게 하기 위한 제작 통제 장치다.

## 사용할 수 있는 공통 락

아래 문구는 현대군 캐릭터 레퍼런스의 공통 기준으로 쓸 수 있다.

```txt
Uniform identity lock:
The character must clearly read as a modern Republic of Korea Navy officer, not a civilian, not a businessperson, not a foreign officer, and not a generic uniformed official.
The uniform must include visible military naval structure: shoulder boards, sleeve rank bands, ribbons, naval badge or breast insignia, structured collar, formal buttons, and a nameplate area.
Exact tiny lettering does not need to be readable, but the rank markings and officer identity details must be present and visually recognizable.
```

함장과 작전장교를 함께 쓸 때는 다음 문구를 추가한다.

```txt
Hierarchy lock:
The captain must read as the senior commanding officer.
The operations officer must read as subordinate to the captain.
Their age, posture, rank impression, and command presence must not merge.
```

## 실무 체크리스트

캐릭터 레퍼런스를 생성하기 전에 아래를 확인한다.

```txt
1. 국적이 명시되어 있는가?
2. 군종이 명시되어 있는가?
3. 군복이 정장으로 오해되지 않게 되어 있는가?
4. 계급 표식은 사라지지 않고, 작은 글자만 읽히지 않게 되어 있는가?
5. 함장과 작전장교의 위계가 분리되어 있는가?
6. 공식 초상인지, 작전 장면인지 맥락이 분명한가?
7. 배경과 조명이 역할에 맞는가?
8. 금지 문구가 필요한 시각 정체성까지 지우고 있지 않은가?
```

## 최종 교훈

AI 이미지 제작에서 “정확한 옷”은 옷 이름만으로 만들어지지 않는다.

특히 군복처럼 계급, 직책, 소속, 상황이 함께 읽혀야 하는 의상은 더 그렇다.

중요한 것은 다음을 분리하는 것이다.

```txt
읽히면 안 되는 것:
작은 텍스트, 실제 명찰, 로고, 과도하게 특정되는 표식

보여야 하는 것:
군복 실루엣, 견장, 계급선, 리본바, 명찰 영역, 지휘관다운 위계
```

시각 정체성은 숨기는 것이 아니라, 안전하게 읽히도록 설계해야 한다.
