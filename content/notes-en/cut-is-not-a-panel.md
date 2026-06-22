---
title_ko: "CUT은 패널이 아니고, 패널은 영상 클립이 아니다"
title_en: "CUT Is Not a Panel, and a Panel Is Not a Video Clip"
date: "2026-06-23"
category: "Reference Guide"
summary_ko: "CUT, 스토리보드 패널, 영상 생성 그룹을 같은 단위로 세지 않고 장면 기능과 물리적 연속성에 따라 설계하는 방법."
summary_en: "A practical guide to separating editorial cuts, storyboard panels, and video-generation groups."
status: "published"
---

# CUT Is Not a Panel, and a Panel Is Not a Video Clip

## If a project has 177 CUTs, does it need 177 generated video clips?

When a long AI video production package is reviewed as a spreadsheet, the first questions are often numerical.

```txt
177 CUTs
→ 177 images?
→ 177 video generations?
→ 177 final clips?
```

Usually, no.

The main problem is not whether 177 is too large. The problem is treating three production units with different purposes as if they were interchangeable. An editorial `CUT`, a storyboard `PANEL`, and a video-generation `CLIP_GROUP` are connected, but they are not the same unit.

Converting them mechanically on a one-to-one basis does more than increase the generation count. It can damage character identity, action continuity, prompt clarity, retry cost, and the reliability of review.

Counts are useful. They reveal unusual ratios and possible workflow failures. But a count is evidence that something deserves inspection, not a rule that determines how production must be executed.

## Separate the three units first

### CUT: an editorial and narrative function

A CUT describes what the audience needs to see and why that moment exists in the edit.

A CUT may:

- establish a new location;
- change the active speaker;
- show the cause or result of an action;
- emphasize a reaction;
- indicate elapsed time;
- or transfer rhythm into the next scene.

It may become an independent shot in the final edit. That does not mean it must begin as an independent generation. A single continuous generated clip may contain several useful edit points that later become separate CUTs.

### PANEL: a fixed visual or camera state

A storyboard PANEL fixes a state that the production team does not want the model to miss.

```txt
- subject position
- camera distance and direction
- the start or change of an action
- spatial relationships
- expression and eye line
- the visual condition required for the next state
```

A panel is not a generation request. One continuous clip may need several panels to explain its progression. A simple reaction or dialogue beat may need only one keyframe.

### CLIP_GROUP: a continuous execution unit

A CLIP_GROUP is the set of material sent to a video model as one generation task.

A strong CLIP_GROUP is not merely a range of consecutive CUT numbers. It contains CUTs that can become one coherent physical progression within compatible conditions of place, time, identity, and action.

```txt
CUT: the editorial or narrative function read by the audience
PANEL: the visual state fixed by the production team
CLIP_GROUP: the continuous action executed by the generation model
```

Once these layers are separated, it becomes obvious that the number of CUTs, images, panels, and video generations can differ without indicating an error.

## The common failure: CUT = PANEL = CLIP

The first failure mode assigns one image and one generated video to every CUT.

Imagine a sequence in which a character looks toward the end of a corridor, asks a short question, and reaches for a door handle.

```txt
CUT 21: The character looks toward the end of the corridor.
CUT 22: The character asks a short question.
CUT 23: The character reaches for the door handle.
```

These may be three editorial CUTs, but physically they form one continuous action. If the location, time, subject, and action axis remain stable, it may be more effective to generate the eye movement, spoken line, and hand movement as one progression, then create the required edit points afterward.

Generating each beat as a long independent clip may introduce unnecessary identity drift, lighting changes, hand-position discontinuity, and additional review work.

The opposite failure is excessive grouping.

If the speaker changes, the main identity source changes, or the scene crosses a meaningful time or location boundary, combining everything merely to reduce the generation count becomes dangerous. A face or costume may spread from one character to another. The model may assign dialogue to the wrong person. The location may reconstruct itself halfway through the shot.

Grouping multiple CUTs is not inherently the problem. Crossing an unsafe boundary is.

## Group by reasons, not by quotas

Use several criteria together when designing a CLIP_GROUP.

### 1. Same place

Can the background geometry and primary lighting remain stable? Passing through a doorway into a structurally different location may justify a new group even when the editorial CUT numbers are consecutive.

### 2. Same time

Is there no meaningful omitted time between the actions? Two moments in the same room may still require separation if one occurs before an incident and the other much later.

### 3. Same action axis

Do the CUTs share a single cause and direction of progression? Approach, discovery, reaction, and contact can form a coherent group when they describe one physical chain.

### 4. Continuous physical progression

Can the movement from the starting state to the ending state be described concretely? “The tension increases” is not enough. The prompt should identify who moves, what changes, and how the space or object state is different at the end.

### 5. Multimodal generation advantage

Do multiple visual guides genuinely clarify space and action? Adding panels to a simple reaction can create more conflicts than information.

### 6. Identity and speaker boundary safety

Do the main character, active speaker, costume source, and face source remain compatible throughout the group? When these conditions change, separation is usually safer than reducing the number of generations.

A useful test is simple: explain in one sentence why the CUTs belong together. If the explanation is only “because they are consecutive” or “because we need fewer clips,” the group probably lacks a production reason.

## A simple grouping diagram

```txt
[CUT A: approach] ─┐
[CUT B: discovery] ├─ same place, time, and action axis ─→ [CLIP_GROUP 1]
[CUT C: reaction] ─┘

[CUT D: a different speaker responds]
          │
          └─ speaker and identity boundary ─────────────→ [CLIP_GROUP 2]
```

CUTs A through C form one physical progression. CUT D is numerically adjacent, but the speaker and identity conditions change, so a separate execution is safer.

## Choose visual guides by the number of required states

Panel count should not become a quality score. The better question is not “How many panels should we fill?” but “How many states must the model understand?”

### One keyframe

One visual guide may be enough for:

- a static establishing shot;
- a brief facial reaction;
- dialogue in an already stable environment;
- or a scene where composition and atmosphere matter more than progression.

### A small multi-panel guide

A few panels can clarify:

- movement from approach to contact;
- a shift in eye line followed by discovery;
- an object opening to reveal its interior;
- or two or three meaningful changes in subject and camera position.

### An action auxiliary sequence

A high-density panel sheet is useful only when the action is genuinely complex:

- a chase or fight;
- simultaneous actions by several subjects;
- a collapse or collision with several stages of cause and effect;
- or a scene in which spatial geometry changes repeatedly.

Even then, the panels should not become individual one-second hard cuts. They are hidden choreography. The final video should compress them into a smaller number of continuous beats.

### Reusing an existing guide

When a location or identity reference has already been validated, there may be no reason to create a new image for every CUT. Reuse is efficient only if the guide is actually called by the current execution.

Unused panels and duplicate guide calls are not harmless documentation clutter. They can produce contradictory instructions or leave a necessary state entirely unsupported.

## Production consequences

Unit design changes more than the number of generated files.

### Generation volume

Generating every CUT independently increases volume. Over-grouping creates the opposite risk: a small failure can invalidate a much larger section of useful action.

### Retry cost

A short, coherent group has a limited repair surface. In an oversized group, a single incorrect hand movement or identity transition may force the entire long clip to be regenerated.

### Identity contamination

Placing several speakers and visual identity sources in one execution increases the chance that faces, costumes, proportions, and narrative roles will mix.

### Prompt complexity

The more exceptions a group contains, the longer and less hierarchical the prompt becomes. A strong group is clear not because its prompt is short, but because its internal conditions are consistent.

### QA workload

Reviewers must trace CUTs, panels, references, and generated results. When the units are conflated, the review cannot begin with quality. It first has to reconstruct basic relationships: Which panel was used by which generation? Which CUT was expected to appear in the result? Which guide was never called?

## Preflight checklist

- Can the function of each CUT be stated in one sentence?
- Can the grouping decision be explained through place, time, and action axis?
- Does the group stay within safe speaker and identity boundaries?
- Is every panel used by an actual execution?
- Is the same guide called more than necessary?
- Does the panel count match the number of visual states that matter?
- Are high-density action guides reserved for complex physical progression?
- Are model-facing scene instructions separated from management identifiers?
- Is the regeneration surface reasonable if the execution fails?
- Could one generated clip provide several editorial CUTs?

## Conclusion

A CUT organizes the story and edit. A PANEL guides a visual state. A CLIP_GROUP executes continuous action.

There is no production benefit in forcing the three to have the same count.

Metrics still matter. An unusually high number of standalone clips, repeated unused panels, or groups that cross several identity boundaries are valuable warnings. They tell the production team where to inspect the system.

They do not automatically dictate how many images or clips must be generated.

**Count is a diagnostic, not a production law.**
