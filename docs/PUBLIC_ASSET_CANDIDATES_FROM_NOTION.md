# Public Asset Candidates from Notion — Scan 01

## Purpose

This document summarizes the first Notion search pass for S&J Studio Lab public asset development.

The goal is not to publish raw Notion pages.

The goal is to identify production failures, workflow lessons, and template candidates that can be transformed into public-facing GitHub documents without exposing private scripts, character assets, internal engines, or unreleased IP.

## Scan status

```txt
SCAN_ID: NOTION_PUBLIC_ASSET_SCAN_01
SCAN_SCOPE: Initial semantic search over S&J Studio / AI video production notes
SCAN_DATE: 2026-06-04
SCAN_MODE: Candidate discovery, not full archive audit
OUTPUT: 10 public asset candidates + next scan plan
```

## Search areas covered in this pass

This first pass searched for signals around:

- S&J Studio Lab
- AI video production failures
- Seedance / 시댄스 2.0
- STEP8 / longform workflow
- GMI / CCTV-only collapse
- storyboard reference issues
- character duplication / reference overload
- Voice DNA / dialogue prompt contamination
- SRT / subtitle cleanup
- upload package / thumbnail package
- longform production structure

## Candidate table

| Priority | Public asset candidate | Suggested file path | Type | Public readiness | Internal risk |
|---:|---|---|---|---|---|
| 1 | When a Storyboard Becomes the Video | `postmortems/seedance-storyboard-layout-leak.md` | Postmortem | High | Low if generalized |
| 2 | Reference Overload and Character Duplication | `postmortems/reference-overload-character-duplication.md` | Postmortem + checklist | High | Medium |
| 3 | Evidence Is Not the Film | `postmortems/evidence-is-not-the-film.md` | Postmortem | Already published | Low |
| 4 | CCTV Can Hook a Mystery, But It Cannot Be the Genre | `notes/cctv-is-a-device-not-a-genre.md` | Short lab note | High | Low |
| 5 | Motion and Space Checklist for AI Video | `templates/ai-video-motion-and-space-checklist.md` | Template | High | Low |
| 6 | Longform AI Video Should Not Be Built as One Giant Prompt | `notes/longform-video-segmentation.md` | Production note | Medium-high | Low |
| 7 | SRT Cleanup Checklist | `templates/srt-cleanup-checklist.md` | Template | Medium-high | Low |
| 8 | Upload Packaging Is a Separate Production Layer | `templates/upload-package-checklist.md` | Workflow template | Medium | Low |
| 9 | Thumbnail / CTR Packaging Can Become Formulaic | `case-studies/thumbnail-package-risk.md` | Case study | Medium | Medium |
| 10 | When Instructions Kill the Scene | `postmortems/instructions-can-kill-the-scene.md` | Postmortem + checklist | High | Medium |

## Candidate details

### 1. When a Storyboard Becomes the Video

**Suggested path**

```txt
postmortems/seedance-storyboard-layout-leak.md
```

**Public title**

```txt
When a Storyboard Becomes the Video: A Seedance Reference Failure
```

**Core lesson**

```txt
Storyboard references should guide continuity, not become the generated layout.
```

**Why it matters**

AI video models can misinterpret multi-panel storyboard sheets as final layout instructions. A hidden continuity guide may leak into the generated clip as split-screen, panel residue, collage structure, or repeated frame logic.

**Public angle**

This can be explained as a general AI video production failure without exposing private characters, scripts, or episode details.

**Keep private**

- Actual storyboard images
- Original prompt bodies
- Internal STEP engine language
- Named character assets
- Unreleased episode structure

---

### 2. Reference Overload and Character Duplication

**Suggested path**

```txt
postmortems/reference-overload-character-duplication.md
```

**Public title**

```txt
Why AI Video Characters Duplicate When You Overload References
```

**Core lesson**

```txt
Reference control is not only about what to include. It is also about what to withhold.
```

**Why it matters**

Dialogue scenes often need one active speaker and one listener. If both are referenced too strongly, the listener can become a second clear subject, the active character can duplicate, or the model can treat background figures as co-protagonists.

**Public angle**

Useful to any creator making AI dialogue scenes, cinematic storyboards, or recurring-character content.

**Keep private**

- Real character faces / asset IDs
- Internal character sheets
- Episode-specific reference plans

---

### 3. Evidence Is Not the Film

**Suggested path**

```txt
postmortems/evidence-is-not-the-film.md
```

**Status**

Already created and uploaded.

**Core lesson**

```txt
Evidence can support the film. Evidence is not the film.
```

**Why it matters**

CCTV, dashcam, briefing, report screens, and evidence boards are useful scene devices, but they should not replace the cinematic incident itself.

---

### 4. CCTV Can Hook a Mystery, But It Cannot Be the Genre

**Suggested path**

```txt
notes/cctv-is-a-device-not-a-genre.md
```

**Core lesson**

```txt
CCTV can introduce an anomaly, but it cannot carry an entire cinematic promise.
```

**Why it matters**

Many AI mystery shorts drift toward static camera logic because it is safer and easier. The result can feel like a prompt concept rather than a watchable scene.

---

### 5. Motion and Space Checklist for AI Video

**Suggested path**

```txt
templates/ai-video-motion-and-space-checklist.md
```

**Core lesson**

```txt
If motion, camera, and spatial change are missing, an AI video prompt becomes an image prompt.
```

**Why it matters**

AI video often fails by producing beautiful stillness. A reusable checklist can help verify motion, spatial relationship, subject action, camera behavior, and scene progression before generation.

---

### 6. Longform AI Video Should Not Be Built as One Giant Prompt

**Suggested path**

```txt
notes/longform-video-segmentation.md
```

**Core lesson**

```txt
Longform AI video production is a sequence system, not one long generation request.
```

**Why it matters**

Trying to create long AI videos as a single continuous object creates structural and execution pressure. Segmentation can improve quality, review, and recovery.

---

### 7. SRT Cleanup Checklist

**Suggested path**

```txt
templates/srt-cleanup-checklist.md
```

**Core lesson**

```txt
Subtitle cleanup is not only language correction. It is format integrity.
```

**Why it matters**

SRT files fail when timestamps, blank lines, numbering, punctuation style, and platform readability are not controlled.

---

### 8. Upload Packaging Is a Separate Production Layer

**Suggested path**

```txt
templates/upload-package-checklist.md
```

**Core lesson**

```txt
Upload packaging is not a final afterthought. It is its own production deliverable.
```

**Why it matters**

Title, description, tags, subtitles, pinned comments, and thumbnail framing can be systematized without exposing private channel strategy.

---

### 9. Thumbnail / CTR Packaging Can Become Formulaic

**Suggested path**

```txt
case-studies/thumbnail-package-risk.md
```

**Core lesson**

```txt
CTR optimization language can become a formula that hides the real viewer promise.
```

**Why it matters**

A repeated “CTR package” may appear professional but still fail if the thumbnail promise does not match the emotional or cinematic hook of the video.

---

### 10. When Instructions Kill the Scene

**Suggested path**

```txt
postmortems/instructions-can-kill-the-scene.md
```

**Core lesson**

```txt
A scene can satisfy every production rule and still fail as entertainment.
```

**Why it matters**

AI production systems often accumulate rules to prevent errors. If those rules are not ranked, the output can become safe, compliant, and dead.

## What should not be uploaded directly

The following Notion source categories should remain internal unless transformed:

```txt
- studio master bibles
- full channel bibles
- full STEP engines
- internal prompt engines
- character sheet prompts
- actual production prompts
- unreleased episode scripts
- private strategy pages
- revenue or performance details
- raw emotional conversation logs
```

## Recommended next GitHub upload sequence

```txt
1. postmortems/seedance-storyboard-layout-leak.md
2. docs/PUBLIC_ASSET_CANDIDATES_FROM_NOTION.md
3. templates/ai-video-motion-and-space-checklist.md
4. postmortems/reference-overload-character-duplication.md
5. templates/srt-cleanup-checklist.md
```

## Next Notion scan plan

This first scan was broad. The next scans should be narrower.

### Scan 02 — Seedance / storyboard / reference failures

Search targets:

```txt
Seedance
시댄스
storyboard
스토리보드
Action Aux
16P
@Image
reference
Active refs
listener
캐릭터 복제
split screen
화면 분할
```

Expected outputs:

```txt
- Seedance reference failure postmortems
- reference safety checklist
- storyboard prompt safety checklist
```

### Scan 03 — Longform workflow collapse

Search targets:

```txt
롱폼
STEP8
재작업
컷시트
프롬프트 길이
3500자
실행 패키지
영상 제작 플로우
```

Expected outputs:

```txt
- longform segmentation note
- prompt compression checklist
- production gate template
```

### Scan 04 — Subtitles / upload packaging / channel operation

Search targets:

```txt
SRT
자막
캡컷
자동 캡션
업로드 패키지
썸네일
CTR
쇼츠
태그
설명문
```

Expected outputs:

```txt
- SRT cleanup checklist
- upload package template
- thumbnail promise checklist
```

### Scan 05 — Creator brand / Super Sample / public trust

Search targets:

```txt
슈퍼샘플
포크
GitHub
공개 자산
S&J Studio Lab
개인 사이트
브랜드
신뢰
```

Expected outputs:

```txt
- creator brand manifesto
- public lab operating principles
- website about page revisions
```

## Continuity note for future ChatGPT sessions

If continuing this work later, use this instruction:

```txt
Continue S&J Studio Lab public asset mining from NOTION_PUBLIC_ASSET_SCAN_01.

Current GitHub repo:
snj-studio-lab/snj-ai-production-lab

Already uploaded:
- README.md
- docs/about-snj-studio-lab.md
- postmortems/ai-video-pipeline-45-days-failure.md
- postmortems/evidence-is-not-the-film.md

Next recommended public document:
postmortems/seedance-storyboard-layout-leak.md

Next recommended scans:
Scan 02 Seedance/storyboard/reference failures
Scan 03 Longform workflow collapse
Scan 04 Subtitles/upload/channel operation
Scan 05 Creator brand/Super Sample/public trust

Do not upload raw Notion strategy pages. Transform them into public-facing postmortems, templates, or notes.
```
