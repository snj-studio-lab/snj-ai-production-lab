---
title_ko: "Seedance 16패널을 16컷처럼 실행하면 무너지는 이유"
title_en: "Why 16-Panel Action Guides Should Not Become 16 Hard Cuts"
date: "2026-06-10"
category: "Workflow Failure"
summary_ko: "노량 해전 테스트 중 16패널 ACTION_AUX 가이드가 실제 16개의 물리 위상으로 생성되지 못하고, 이후 Seedance 실행 단계에서는 초단위 하드컷처럼 해석되며 리듬이 깨진 문제와, 이를 STEP8 v7.51 / APPENDIX B v7.4 Continuous Beat Lock으로 정리한 기록."
summary_en: "A production note on a Seedance failure mode where a 16-panel action guide first failed to become 16 concrete physical states, then was interpreted as 16 rapid hard cuts, and how the workflow was corrected with a continuous beat execution lock."
---

# Seedance 16패널을 16컷처럼 실행하면 무너지는 이유

## 요약

노량 해전 테스트에서 중요한 실패 패턴이 나왔다.

16패널 스토리보드 자체가 문제였던 것은 아니다. 문제는 두 단계로 나뉘어 있었다.

첫째, 스토리보드 프롬프트가 “16패널”을 요구했지만 실제로는 각 패널이 서로 다른 물리 위상을 충분히 갖지 못했다. 패널 수는 맞아도 내용이 `start state`, `progression`, `reaction`, `payoff` 같은 템플릿 문장으로 반복되면 16패널은 16개의 장면 설계가 아니라 16칸짜리 빈 양식이 된다.

둘째, 그 16패널을 Seedance 실행 프롬프트에서 거의 16개의 짧은 컷처럼 강제했다.

그 결과 영상은 장면을 이해하기 전에 다음 화면으로 넘어가는 식으로 급하게 흔들렸다. 개별 이미지는 나쁘지 않았지만, 전체 영상은 전투의 흐름이 아니라 빠르게 넘어가는 샘플러처럼 보였다.

이 발견 때문에 STEP8 지침은 `v7.51 ACTION_AUX Continuous Beat Lock`으로, APPENDIX B는 `v7.4 Continuous Beat Execution Lock`으로 교체되었다.

## 실패한 구조

처음 문제는 단순했다.

```txt
스토리보드 단계:
16패널이라고 쓰였지만, 실제로는 패널별 물리 변화가 약함

영상 실행 단계:
16패널 가이드를 16개의 초단위 컷처럼 실행
```

이렇게 연결되면 대규모 전투 장면에서 리듬이 깨진다.

함대전, 백병전, 군중 이동, 함선 압박 같은 장면은 관객이 공간과 주체를 먼저 이해해야 한다. 그런데 15초 안에서 16개 패널이 거의 모두 컷 전환처럼 소비되면, 관객은 “무슨 일이 일어났는지”보다 “화면이 계속 바뀐다”는 인상만 받는다.

## 앞단 문제: 16패널이 실제 16패널이 아니었다

노량 클립 리뷰에서 먼저 확인한 문제는 영상 실행 이전에 있었다.

어떤 클립은 스토리보드 프롬프트가 5패널 또는 16패널을 요구했지만, 각 패널 문장이 실제 그림을 만들 만큼 구체적이지 않았다.

예를 들어 이런 식이다.

```txt
P1: start state for formation pressure
P2: progression for formation pressure
P3: visible action for formation pressure
P4: reaction for formation pressure
P5: payoff for formation pressure
```

겉보기에는 패널 구성이 있지만, 실제로는 같은 말을 다른 이름으로 반복한 것에 가깝다.

AI 영상 도구는 이런 문장을 보고 구체적인 전장 구조를 안정적으로 만들기 어렵다. 어느 배가 주체인지, 어느 세력이 어느 방향에서 압박하는지, 배경 병사가 노를 젓는지 줄을 당기는지, 지휘관과 일반 병사가 어떻게 달라야 하는지 알 수 없기 때문이다.

그래서 노량 클립 리뷰 워크플로우는 먼저 다음 항목을 검사하도록 잠겼다.

```txt
- 패널별 실제 물리 변화가 있는가
- 모든 패널이 Seedance에서 Guide:@Image1 P#로 커버되는가
- prompt-only group을 가짜 @REF처럼 호출하지 않았는가
- hard-surface reference가 필요한 장면에 실제 기준 이미지가 있는가
- 배경 인물이 frozen extra처럼 서 있지 않고 task를 갖는가
- 지휘관 얼굴/복식이 배경 인물에게 복제되지 않는가
- 조선군/일본군 복식과 위치가 섞이지 않는가
```

즉, 이번 문제는 단순히 Seedance 프롬프트 한 줄의 문제가 아니었다.

스토리보드, reference discipline, background task, faction split, Seedance execution이 모두 이어지는 구조 문제였다.

## 16패널은 버릴 것이 아니라 다르게 써야 한다

이번 결론은 16패널을 폐기하는 것이 아니었다.

16패널은 여전히 필요하다. 특히 대규모 전투에서는 다음 정보를 고정해주는 데 유용하다.

```txt
- 어느 세력이 어디에 있는가
- 어떤 함선이 기준 피사체인가
- 배경 병사들이 실제로 어떤 일을 하는가
- 어느 방향으로 압박이 들어오는가
- 어떤 행동이 원인이고 어떤 반응이 결과인가
- 다음 클립으로 넘어갈 때 전장 상태가 어떻게 바뀌었는가
```

문제는 이 16패널을 최종 영상 컷리스트로 착각하는 순간 생긴다.

그래서 수정 방향은 다음과 같다.

```txt
16P storyboard = P1~P16을 구체적인 물리 위상으로 설계한다.
Seedance execution = P1~P16을 4~5개의 continuous beat로 묶어 실행한다.
```

즉, 패널은 hidden choreography guide이고, 최종 영상은 연속적인 풀스크린 시네마틱 액션이어야 한다.

## Continuous Beat Lock

새 잠금 규칙의 핵심은 이렇다.

```txt
금지:
- P1~P16을 16개 초단위 하드컷처럼 실행
- P1-P4를 "battle intensifies" 같은 추상 요약으로 처리
- prompt-only subject 같은 빈 주체 사용
- 함대, 병사, 배경 인물, 지휘관을 같은 얼굴과 복장으로 뭉개기

허용:
- P1~P16은 반드시 구체적으로 설계
- Seedance 실행에서는 P1-P4 / P5-P8처럼 연속 BEAT로 묶기
- 각 BEAT 안에 포함된 실제 동작 순서를 명시
- 최종 영상은 grid, panel, label, caption 없이 풀스크린으로 출력
```

중요한 것은 “유연하게 대충 묶는다”가 아니다.

각 BEAT는 포함된 패널의 실제 동작 순서를 모두 반영해야 한다. 예를 들어 `P1-P4`를 하나의 BEAT로 묶더라도, 그 안에는 방패가 버티고, 줄이 당겨지고, 함선 간격이 좁아지고, 압박 방향이 보이는 식의 구체적 흐름이 있어야 한다.

## 클립별 리뷰 워크플로우

이 문제 때문에 노량 편에는 별도의 클립 리뷰 워크플로우가 필요했다.

핵심은 전체 산출물을 한 번에 다시 만들지 않는 것이다.

```txt
하지 않는 것:
- 전체 에피소드 재작성
- 전체 STEP8 엑셀 재생성
- 대사 변경
- 컷 순서 변경
- 화력 보상 축소
- 다른 세계관 설정 추가

하는 것:
- 한 번에 한 클립만 검토
- 구조 실패 확인
- reference / visual identity 위험 확인
- frozen background extra 위험 확인
- panel-guide mismatch 확인
- storyboard prompt 수리
- Seedance prompt 수리
- 짧은 patch note 작성
```

이 방식은 느려 보이지만, 실제로는 더 안전하다.

생성 실패는 보통 한 줄 때문에 생기지 않는다. 한 클립 안에서 `@REF`, 패널, 배경 인물, 세력 구분, 카메라, 실행 시간, 다음 클립 연결이 함께 꼬인다. 그래서 전체 문서를 다시 생성하면 새 문제가 생기기 쉽다.

노량 테스트에서는 클립 단위로 실패를 잡고, 반복되는 실패 패턴만 공통 지침으로 승격하는 쪽이 더 안정적이었다.

## 대규모 전투에서 추가로 잠근 것

노량 테스트는 또 다른 문제도 드러냈다.

배경 인물이 멀뚱히 서 있거나, 지휘관 얼굴이 배경 병사에게 복제되거나, 조선군과 일본군의 복식이 뒤섞이는 현상이 있었다.

그래서 STEP8과 APPENDIX B에는 다음 기준도 함께 강화되었다.

```txt
- hard-surface reference를 1~3개 명확히 선택
- prompt-only group은 @REF처럼 호출하지 않고 prose로 설명
- 세력별 복식과 위치를 분리
- 배경 인물은 rowing, reloading, bracing, signaling, hauling rope 같은 실제 task를 가져야 함
- 지휘관과 배경 인물 얼굴/복식 복제 금지
- 16P는 반복 문장이 아니라 cause → motion → impact → reaction → changed geometry를 가져야 함
```

이 규칙은 노량 전용 수리가 아니라, 이후 황산벌, 대야성, 함대전, 군중전, 기병전 같은 대형 장면에도 재사용할 공통 실행 규칙이다.

## 이번 교체의 의미

이번 교체는 “더 복잡한 프롬프트를 쓰자”가 아니다.

오히려 목적은 반대다.

```txt
스토리보드 단계에서는 물리 위상을 충분히 설계하고,
영상 실행 단계에서는 그것을 사람이 볼 수 있는 연속 동작으로 압축한다.
```

이 구분이 없으면 AI 영상 제작은 자주 두 가지 실패로 간다.

첫째, 패널을 무시해서 장면이 뭉개진다.

둘째, 패널을 너무 문자 그대로 따라가서 영상이 조각난다.

이번 `Continuous Beat Lock`은 그 사이를 잡기 위한 규칙이다.

## 현재 작업 방식

노량 편은 아직 개별 클립 단위로 수동 수정 중이다. 전체 STEP8 엑셀을 한 번에 갈아엎는 방식은 위험하다.

현재 더 안전한 방식은 다음과 같다.

```txt
1. 원본 산출물은 보존한다.
2. 문제가 드러난 클립만 하나씩 본다.
3. 스토리보드 프롬프트와 Seedance 실행 프롬프트를 함께 수리한다.
4. 실제 생성 결과를 보고 다음 클립으로 넘어간다.
5. 반복되는 실패 패턴만 공통 지침으로 승격한다.
```

이 기록은 그 과정에서 발견한 하나의 실패 패턴과 교정 규칙이다.

## 공개 시 남길 점

이 사례는 공개해도 의미가 있다.

AI 영상 제작 실패는 단순히 “프롬프트가 약했다”로 끝나지 않는다. 패널, 레퍼런스, 실행 프롬프트, 시간 배분, 배경 인물 동작, 세력 구분이 서로 맞물려야 한다.

다만 공개본에서는 내부 지침 전문, 실제 작업용 프롬프트 전문, 비공개 에피소드 세부 내용, 계정 정보, API 키, 로컬 경로는 제외한다.

핵심은 실패 자체가 아니라, 실패를 재사용 가능한 제작 규칙으로 바꾸는 과정이다.
