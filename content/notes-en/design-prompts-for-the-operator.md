---
title_ko: "모델뿐 아니라 운영자를 위한 프롬프트를 설계하라"
title_en: "Design Prompts for the Operator, Not Just the Model"
date: "2026-06-23"
category: "Checklist"
summary_ko: "생성 모델용 본문과 운영자용 실행 헤더를 분리해 첨부 오류, 파일 탐색, 재생성 비용을 줄이는 제작 프롬프트 설계법."
summary_en: "A checklist for designing production prompts as interfaces for both generation models and human operators."
status: "published"
---

# Design Prompts for the Operator, Not Just the Model

## The prompt became more precise, but the operator could not run it

The video-generation text had been revised several times. The camera, lighting, movement, expression, and timeline were more specific than before.

Then the operator reached the execution step and stopped.

```txt
Which clip is this prompt for?
Which images should be attached?
Does the attachment order matter?
Where is the file represented by this character name?
Can this be executed without reopening the upstream documents?
```

The model-facing prose had improved while the human-facing interface had disappeared.

A production prompt has two users. One is the generation model. The other is the operator who finds files, attaches references, chooses settings, runs the job, and connects the result back to the production plan.

A prompt that works only for the model is incomplete in a real production environment.

## The two audiences of a production prompt

### The model-facing payload

The payload contains information that can change the generated result:

- the active subject and environment;
- action and physical progression;
- camera and composition;
- lighting and atmosphere;
- dialogue, silence, and narration state;
- the purpose of attached images or panels;
- timeline order;
- and the required final-screen condition.

### The operator-facing execution header

The header contains information required to prepare and track the execution:

- a stable, human-readable clip identity;
- references that are actually prepared for this run;
- duration and aspect ratio when operationally necessary;
- local timeline labels;
- and the mapping between visual guides and prompt instructions.

The two sections serve different purposes.

```txt
OPERATOR HEADER
The human prepares the correct files and settings.
        ↓
MODEL PAYLOAD
The model generates the intended scene and motion.
        ↓
OUTPUT
The human reconnects the result to the correct production item.
```

The header does not replace scene direction. The payload should not force the operator to reconstruct execution details from an earlier document.

## The minimum operator-header contract

A useful execution header does not need to be long. It does need to make the copied prompt independently runnable.

Consider this fictional project:

```txt
EXECUTION: Corridor discovery / take A
DURATION: 12 seconds
ASPECT: 16:9

ATTACHMENTS
1. actor_mina_front.png — speaking character and identity source
2. service_corridor_wide.png — environment and lighting source
3. discovery_beats_01.png — visual guide, panels 1–4

LOCAL TIMELINE
00:00–00:03  approach
00:03–00:07  light failure and discovery
00:07–00:10  spoken line
00:10–00:12  silent reaction
```

From this header alone, an operator knows:

- what execution is being prepared;
- how many files are required;
- what each file is expected to control;
- where speech and silence occur;
- and which guide panels are active.

The stable identity does not need to be an internal database key. It only needs to help a human distinguish this job in a queue and reconnect the generated file to the correct production item.

## What should stay out of the model payload

Production systems contain metadata that is useful for archives, databases, and audit trails but meaningless to a generation model.

```txt
- internal sequence IDs
- database keys
- archive filenames
- revision history
- checksums
- approval-document locations
- storage or folder-transfer instructions
```

When these values are inserted into the model payload, three problems follow.

First, management information becomes more visually prominent than scene information.

Second, the prompt wastes limited space and attention.

Third, the operator may not know whether a string is a required generation instruction or merely a tracking label.

The model needs to know who does what, where, and how the state changes. It does not need to understand the studio's archival vocabulary.

## Before: one mixed block

The following is a fictional example, not a copy of an internal production prompt.

```txt
SEQ-044 REV-C ARCHIVE-7 VERIFIED
use PERSON_MASTER_02 and ENV_SET_19, see previous package
render 12 sec cinematic corridor clip
subject walks, discovers a red light, says the line
checksum approved, export under final_v8
```

This block is ambiguous for both users.

- `PERSON_MASTER_02` does not identify a visible file.
- “See previous package” requires another document.
- The actual attachment count and order are unknown.
- Archive and verification labels do not improve the scene.
- The intermediate physical action and silent reaction are missing.

## After: a production interface

```txt
OPERATOR HEADER
Execution: Corridor discovery / take A
Attachments:
1. actor_mina_front.png — identity and wardrobe
2. service_corridor_wide.png — set geometry and lighting
3. discovery_beats_01.png — panels 1–4
Duration: 12 seconds
Aspect: 16:9

MODEL PAYLOAD
Create one continuous full-screen cinematic shot.
Mina advances through the narrow service corridor while the overhead
lights fail in sequence behind her. She stops when a steady red light
appears at the sealed door. Keep her face, short coat, and proportions
consistent with attachment 1. Preserve the corridor geometry and cold
industrial lighting from attachment 2.

00:00–00:03 slow approach, camera tracking backward
00:03–00:07 lights fail from far to near; Mina turns toward the door
00:07–00:10 Mina quietly asks, "Is someone there?"
00:10–00:12 no dialogue; hold on her listening reaction

Use attachment 3 as a progression guide, not as a split-screen layout.
No captions, labels, grids, or visible storyboard panels.
```

The header prepares the execution. The payload directs the scene. The operator does not need to reopen an upstream document, and the model receives the production instructions without management noise.

## Build a consistent reference namespace

Reference assets need names that a human can search, sort, and recognize.

A public example might use:

```txt
actor_mina_front.png
environment_service_corridor.png
group_night_crew.png
equipment_field_radio.png
object_red_beacon.png
```

The specific prefixes are not the lesson. The lesson is that people, environments, groups, equipment, and objects should follow a consistent naming logic.

A canonical name and a verified source file are also different concepts.

```txt
Canonical name:
The stable name used for the same subject throughout the project.

Verified source file:
The specific visual asset approved for the current execution.
```

Several files may represent the same canonical subject, but they may not be equally reliable identity sources. A source file may be revised while the canonical subject name remains stable.

This distinction helps the operator find the right subject without implying that every file associated with that subject is interchangeable.

## Attachment truth

Every reference listed in the execution header should actually be attached.

Listing an image that has not been prepared and hoping the model will infer it is not a minor omission. It makes the execution contract false.

Separate three states.

### Attached asset

The file is present in this run and can be visually interpreted by the model.

### Prompt-only element

No visual file exists. The element is defined in text and should not be assigned an attachment number.

### Planned reference

The asset may be created later, but it is not available for this execution. Keep it in a preparation queue, not in the active attachment list.

```txt
Inaccurate list:
1. actor reference
2. corridor reference
3. damaged door reference (to be made later)

Truthful list:
1. actor_mina_front.png
2. environment_service_corridor.png

Prompt-only element:
The sealed door has a fresh diagonal dent at handle height.
```

An attachment list is a statement of current execution facts, not a wish list.

## The local timeline is also operator information

Timeline labels help the model, but they are equally important to the operator and reviewer.

The operator uses them to prepare speech, silence, narration, and lip-sync conditions. The reviewer uses them to describe where the result failed.

A useful local timeline answers:

- When does dialogue begin and end?
- Is silence intentional or missing?
- Are narration and an on-screen speaker active at the same time?
- Is there enough time to read the visual payoff?
- Is the ending state held long enough to connect to the next clip?

Time does not need to be divided evenly by the number of CUTs. It should follow speech length, action complexity, reaction space, and the visual importance of the final state.

## Prompt clarity is part of the production budget

Ambiguity is not only a writing problem.

If the operator attaches the wrong identity image, the video may be technically complete and still unusable. If the guide mapping is wrong, the action may move in the opposite direction. If silence is unclear, the model may create unwanted mouth movement or improvised speech.

Each mistake can become another generation.

In a workflow with limited generation capacity or long processing times, the execution header is a cost-control mechanism.

```txt
ambiguous identity
→ wrong file selection
→ wrong generation
→ cause investigation
→ prompt and attachment correction
→ regeneration
```

The few minutes required to make a header exact are often cheaper than one failed run.

## Operator preflight checklist

- Is the clip identity visible at the top of the copied prompt?
- Does the attachment list exactly match the files prepared for this run?
- Is the role of each attachment explained in one line?
- Are unavailable references excluded?
- Are prompt-only elements clearly distinguished from attached files?
- Have internal IDs, database keys, and archive metadata been removed from the payload?
- Does the local timeline add up to the full duration?
- Are speaker, silence, and narration states explicit?
- Does the visual-guide panel range match the actual attachment?
- Do people, environments, groups, equipment, and objects follow a consistent namespace?
- Can the prompt be executed without reopening upstream documents?
- Can the output be connected back to the correct production item?

## Conclusion

A strong production prompt is not complete merely because its scene description is elegant.

The model must understand the shot. The operator must be able to prepare the execution. The reviewer must be able to reconnect the output to its original intention.

Separate the model-facing payload from the operator-facing execution header. List only references that are truly attached. Remove internal management identifiers from scene instructions. Make the local timeline and speaker state explicit.

When a copied prompt can be run without opening its upstream documents, it has become more than text. It has become a production interface.

**A good production prompt is an interface, not just text.**
