---
title_ko: "캐릭터 시트는 이미지가 아니라 계약이다"
title_en: "A Character Sheet Is a Contract, Not Just an Image"
date: "2026-07-15"
category: "Template"
summary_ko: "AI 영상 제작에서 캐릭터 시트를 단순 참고 이미지가 아니라 모델 입력 계약으로 작성하기 위한 공개 템플릿 노트."
summary_en: "A public template note for writing character sheets as input contracts that protect identity, costume, background, and prompt boundaries."
status: "published"
---

# A Character Sheet Is a Contract, Not Just an Image

In AI video production, a character sheet is often treated as a visual reference: front view, side view, outfit, colors, and a few expressions collected on one page, then handed to the model with the request to keep the character consistent.

But a video generation model does not always read a character sheet the way a human does. It may treat panels, labels, borders, color swatches, and explanatory text as part of the scene itself. Instead of preserving the character, the model may leak the structure of the sheet into the video.

That is why a character sheet should be written as an input contract, not merely as an image reference. This note is not tied to any single tool. It is a public template for giving a model clearer boundaries around character identity, background, and visual layout.

## Why call it a contract?

A contract says what must be preserved and what must not happen.

A useful character sheet does the same. It should clarify:

- the features that must remain stable;
- the elements that may change from scene to scene;
- the traits that must not be borrowed by another character;
- the sheet structures that must not appear in the video;
- and the priority rules the prompt should follow.

Without these rules, the model may misunderstand the sheet as scene material. It may preserve an eye color while also placing a color swatch in the background, turning costume separators into set design, or generating label text inside the shot.

## Character Contract

Use this format for a single character.

```text
Character Contract

Character role:
- [The character's function in the scene]

Identity anchors:
- Face shape: [stable face structure]
- Eyes: [shape, color, expression]
- Hair: [style, length, color]
- Outfit silhouette: [main costume shape]
- Main colors: [colors that must remain stable]

Flexible elements:
- [Elements that may change by scene]

Do not change:
- [Core traits that must not drift]

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

The key is to describe not only what the model should use, but also what it must not generate.

## Multi-Character Contract

When two or more characters appear in the same scene, the problem becomes more fragile. Faces, outfits, colors, and positions can blend together. In that case, each character needs a separate set of stable anchors.

```text
Multi-Character Contract

Character A:
- Role: [role]
- Identity anchors: [face, hair, outfit, colors]
- Position rule: [placement or movement in the scene]
- Must not borrow from Character B: [traits that must not mix]

Character B:
- Role: [role]
- Identity anchors: [face, hair, outfit, colors]
- Position rule: [placement or movement in the scene]
- Must not borrow from Character A: [traits that must not mix]

Separation rules:
- Keep each character's face, outfit, and color palette distinct.
- Do not merge hairstyles, accessories, or costume details.
- Do not create extra duplicate bodies unless explicitly requested.
```

In multi-character scenes, “make each character look good” is often less important than “do not let them borrow from each other.”

## Background Contract

The background also needs a contract. A strong background reference can overpower the character, while a weak background description can leave the character intact but destroy the sense of place.

```text
Background Contract

Location:
- [type of place]

Mood:
- [lighting, time of day, atmosphere]

Stable background anchors:
- [structures, colors, or spatial directions to preserve]

Flexible background elements:
- [props or details that may change]

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

The background contract is not just for making the frame prettier. It protects the character and the action from being swallowed by the reference image.

## Video Prompt Guardrail

This short guardrail can be added to a video prompt.

```text
Video Prompt Guardrail

Use the reference material as identity guidance only.
Preserve the character's face, outfit silhouette, and main color palette.
Do not reproduce the reference sheet as a panel, grid, label, UI, poster, or diagram.
Do not generate multiple versions of the character unless the scene explicitly requires it.
Keep the final frame cinematic, not like a design sheet.
```

This is not a universal fix. It is a way to reduce the chance that the model treats reference-sheet structure as final-frame content.

## Review criteria

When reviewing the result, do not only ask whether it looks similar. Ask:

- Does the character still read as the same person?
- Did costume or color information leak into another character or the background?
- Did panels, labels, tables, or color chips from the sheet appear in the video?
- Did the background overwrite the character silhouette?
- Does the frame look like cinematic video rather than a design sheet?

More information does not always make a better character sheet. Sometimes too much information makes it harder for the model to understand what must be protected.

A good character contract is short and explicit. It separates what must remain stable, what may change, and what must never be generated. In AI video production, character consistency begins not with one image, but with this contract structure.
