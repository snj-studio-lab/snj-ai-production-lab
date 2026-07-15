---
title_ko: "캐릭터 시트는 이미지가 아니라 계약이다"
title_en: "A Character Sheet Is a Contract, Not Just an Image"
date: "2026-07-15"
category: "Template"
summary_ko: "AI 영상 제작에서 캐릭터 시트를 단순 참고 이미지가 아니라 모델 입력 계약으로 작성하기 위한 공개 템플릿 노트."
summary_en: "A public template note for writing character sheets as input contracts that protect identity, costume, background, and prompt boundaries."
status: "published"
---

# 캐릭터 시트는 이미지가 아니라 계약이다

AI 영상 제작에서 캐릭터 시트는 종종 참고 이미지처럼 다뤄진다. 앞모습, 옆모습, 의상, 색상, 표정 몇 가지를 한 장에 모아두고 모델에게 “이 캐릭터를 유지해 달라”고 요청하는 방식이다.

하지만 영상 생성 모델은 캐릭터 시트를 사람이 보는 방식으로만 읽지 않는다. 시트 안의 패널, 라벨, 구획선, 색상표, 설명 문구까지 장면의 일부로 받아들일 수 있다. 그 결과 캐릭터 정보는 유지되지 않고, 오히려 시트 구조가 영상에 새어 나오는 일이 생긴다.

그래서 캐릭터 시트는 단순한 이미지 참고자료가 아니라 입력 계약으로 작성해야 한다. 이 노트는 특정 도구를 전제로 하지 않는다. AI 영상 제작자가 캐릭터와 배경 정보를 더 안전하게 전달하기 위한 공개 템플릿이다.

## 왜 계약이라는 표현을 쓰는가

계약은 “무엇을 지킬 것인지”와 “무엇을 하지 말아야 하는지”를 함께 적는다.

캐릭터 시트도 마찬가지다. 좋은 시트는 단지 예쁜 이미지가 아니라 다음을 분명히 해야 한다.

- 반드시 유지해야 할 특징
- 장면마다 바뀌어도 되는 요소
- 다른 캐릭터와 섞이면 안 되는 요소
- 영상에 나타나면 안 되는 시트 구조
- 프롬프트가 우선해야 할 판단 기준

이 기준이 없으면 모델은 시트를 장면의 재료로 오해할 수 있다. 캐릭터의 눈 색을 유지하는 대신 색상표를 배경에 띄우거나, 의상 구분선을 실제 무대 구조처럼 넣거나, 라벨 텍스트를 영상 안에 생성할 수 있다.

## Character Contract

아래 형식은 단일 캐릭터를 위한 기본 계약이다.

```text
Character Contract

Character role:
- [캐릭터의 역할 또는 장면 안 기능]

Identity anchors:
- Face shape: [고정할 얼굴형]
- Eyes: [눈매, 색, 인상]
- Hair: [헤어스타일, 길이, 색]
- Outfit silhouette: [의상 형태]
- Main colors: [반드시 유지할 색상]

Flexible elements:
- [장면에 따라 바뀌어도 되는 요소]

Do not change:
- [변하면 안 되는 핵심 특징]

Do not generate:
- Reference sheet borders
- Labels or text from the sheet
- Color swatches
- Panel layout
- Extra duplicate versions of the character

Scene instruction:
- Use the reference only to preserve the character identity.
- Do not reproduce the reference sheet layout in the final video frame.
```

핵심은 “무엇을 참고하라”보다 “무엇을 영상에 만들지 말라”를 함께 적는 것이다.

## Multi-Character Contract

두 명 이상의 캐릭터가 등장하면 문제는 더 복잡해진다. 얼굴, 의상, 색상, 위치가 서로 섞이기 쉽다. 이 경우 캐릭터별 고정값을 분리해 적어야 한다.

```text
Multi-Character Contract

Character A:
- Role: [역할]
- Identity anchors: [얼굴, 헤어, 의상, 색상]
- Position rule: [장면 안 위치 또는 동선]
- Must not borrow from Character B: [섞이면 안 되는 특징]

Character B:
- Role: [역할]
- Identity anchors: [얼굴, 헤어, 의상, 색상]
- Position rule: [장면 안 위치 또는 동선]
- Must not borrow from Character A: [섞이면 안 되는 특징]

Separation rules:
- Keep each character's face, outfit, and color palette distinct.
- Do not merge hairstyles, accessories, or costume details.
- Do not create extra duplicate bodies unless explicitly requested.
```

멀티 캐릭터 장면에서는 “각 캐릭터를 잘 만들어 달라”보다 “서로의 정보를 빌리지 말라”가 더 중요할 때가 많다.

## Background Contract

배경도 계약이 필요하다. 배경 참고 이미지가 강하면 모델이 캐릭터보다 배경 질서를 우선할 수 있고, 반대로 배경 설명이 약하면 캐릭터는 살아도 장면의 장소성이 무너진다.

```text
Background Contract

Location:
- [장소의 종류]

Mood:
- [조명, 시간대, 분위기]

Stable background anchors:
- [유지할 구조물, 색감, 공간 방향]

Flexible background elements:
- [바뀌어도 되는 소품 또는 디테일]

Do not generate:
- Reference image frames
- Layout grids
- Annotation marks
- Text labels
- Unwanted logos or symbols

Relationship to character:
- The background should support the character action.
- Do not let background patterns overwrite the character silhouette.
```

배경 계약은 장면을 예쁘게 만드는 장치가 아니라 캐릭터와 행동을 보호하는 장치다.

## Video Prompt Guardrail

마지막으로 영상 프롬프트에 붙일 수 있는 짧은 가드레일을 둔다.

```text
Video Prompt Guardrail

Use the reference material as identity guidance only.
Preserve the character's face, outfit silhouette, and main color palette.
Do not reproduce the reference sheet as a panel, grid, label, UI, poster, or diagram.
Do not generate multiple versions of the character unless the scene explicitly requires it.
Keep the final frame cinematic, not like a design sheet.
```

이 가드레일은 만능 해결책이 아니다. 다만 모델이 참고자료의 구조를 장면으로 착각하는 실패를 줄이는 데 도움이 된다.

## 검수 기준

생성 결과를 볼 때는 “비슷한가?”만 묻지 않는다. 다음을 함께 본다.

- 캐릭터가 같은 인물로 보이는가?
- 의상과 색상이 다른 캐릭터나 배경으로 새지 않았는가?
- 시트의 패널, 라벨, 표, 색상칩이 영상 안에 나타나지 않았는가?
- 배경이 캐릭터의 실루엣을 침범하지 않는가?
- 장면이 디자인 시트가 아니라 실제 영상 프레임처럼 보이는가?

캐릭터 시트는 더 많은 정보를 넣는다고 항상 좋아지지 않는다. 때로는 정보가 많을수록 모델이 무엇을 지켜야 하는지 혼란스러워진다.

좋은 캐릭터 계약은 짧고 분명하다. 유지할 것, 바뀌어도 되는 것, 절대 생성하지 말아야 할 것을 나눈다. AI 영상에서 캐릭터 일관성은 이미지 한 장이 아니라 이런 계약 구조에서 시작된다.
