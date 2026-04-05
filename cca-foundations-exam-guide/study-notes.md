---
title: "CCA Foundations 시험 스터디 노트 — Part 1 기반"
source_article: "Claude Certified Architect: The Complete Guide to Passing the CCA Foundations Exam"
author: Rick Hightower
domains_covered: [1, 2, 3, 4, 5]
---

# CCA Foundations 스터디 노트 (Part 1)

> 이 노트는 Rick Hightower의 CCA 가이드 Part 1에서 추출한 시험 집중 학습 자료다.

---

## 1. 영한 용어표 (시험 출제 빈도 ★ 표시)

| 영어 원문 | 한국어 | 도메인 | 빈도 |
|-----------|--------|--------|------|
| **Subagent context inheritance** | 서브에이전트 컨텍스트 상속 | D1 | ★★★★★ |
| **Coordinator-Subagent pattern** | 코디네이터-서브에이전트 패턴 | D1 | ★★★★★ |
| **Super Agent anti-pattern** | 슈퍼 에이전트 안티패턴 | D1 | ★★★★☆ |
| **Escalation logic (deterministic)** | 에스컬레이션 로직 (결정론적) | D1 | ★★★★☆ |
| **Hub-and-Spoke pattern** | 허브-앤-스포크 패턴 | D1 | ★★★☆☆ |
| **Agentic loop** | 에이전트 루프 | D1 | ★★★☆☆ |
| **Context forking** | 컨텍스트 분기 | D1 | ★★★☆☆ |
| **CLAUDE.md hierarchy** | CLAUDE.md 계층 | D2 | ★★★★☆ |
| **`-p` flag (non-interactive)** | `-p` 플래그 (비대화 모드) | D2 | ★★★★★ |
| **`--bare` flag** | `--bare` 플래그 (재현성 보장) | D2 | ★★★☆☆ |
| **Plan Mode vs Direct Execution** | 계획 모드 vs 직접 실행 | D2 | ★★★★☆ |
| **tool_choice** | 도구 선택 제어 파라미터 | D3 | ★★★★★ |
| **Validation-retry loop** | 검증-재시도 루프 | D3 | ★★★★★ |
| **Structured Outputs API** | 구조화된 출력 API | D3 | ★★★★☆ |
| **Stop reason** | 생성 중단 이유 | D3 | ★★★★☆ |
| **Distractor (plausible)** | 오답 방해물 (그럴듯한) | 전략 | ★★★☆☆ |
| **MCP Tool** | MCP 도구 (실행 가능 함수) | D4 | ★★★★★ |
| **MCP Resource** | MCP 리소스 (읽기 전용 데이터) | D4 | ★★★★★ |
| **MCP Prompt** | MCP 프롬프트 (재사용 템플릿) | D4 | ★★★☆☆ |
| **Tool Description (routing)** | 도구 설명 (라우팅 메커니즘) | D4 | ★★★★☆ |
| **4-5 Tool Rule** | 4-5 도구 규칙 | D4 | ★★★★☆ |
| **Lost in the Middle** | "중간에 묻히는" 효과 | D5 | ★★★★★ |
| **Prompt Caching** | 프롬프트 캐싱 | D5 | ★★★★☆ |
| **Batch API** | 배치 API | D5 | ★★★☆☆ |
| **Internalized knowledge** | 내재화된 지식 | 전략 | ★★☆☆☆ |

---

## 2. 시험 함정 Top 5 (Tricky Exam Questions)

### 함정 1: "Claude가 자신감이 낮으면 에스컬레이션"
- **왜 함정인가**: 직관적으로 맞아 보인다. "AI가 확실하지 않으면 사람에게 넘긴다"는 상식적이다.
- **왜 오답인가**: LLM의 자체 보고 신뢰도(self-reported confidence)는 프로덕션 라우팅에 적합하지 않다. 캘리브레이션이 되어 있지 않다.
- **정답 패턴**: 결정론적 규칙 (금액 > $10,000, 계정 등급 = enterprise, 이슈 유형 = 법적 분쟁)

### 함정 2: "시스템 프롬프트에 JSON 형식 지시 추가"
- **왜 함정인가**: 간단하고 빠르며, 실제로 대부분 동작한다.
- **왜 오답인가**: "대부분"은 프로덕션에 충분하지 않다. 프롬프트는 가이드(guidance)이지 법(law)이 아니다.
- **정답 패턴**: `tool_choice` + 입력 스키마, Structured Outputs API, validation-retry loop

### 함정 3: "컨텍스트 창을 키우면 Lost in the Middle이 해결된다"
- **왜 함정인가**: "더 많은 공간 = 더 나은 성능"이라는 직관.
- **왜 오답인가**: Lost in the Middle은 창 크기와 무관한 주의력 분포(attention distribution) 문제. 200K 토큰에서도 발생.
- **정답 패턴**: 중요 정보를 컨텍스트 처음/끝에 배치

### 함정 4: "하나의 강력한 에이전트가 모든 도구를 관리"
- **왜 함정인가**: 아키텍처가 단순해 보이고, 관리 포인트가 하나다.
- **왜 오답인가**: 15개+ 도구를 가진 단일 에이전트 = 슈퍼 에이전트 안티패턴. 도구 선택 정확도가 측정 가능하게 저하.
- **정답 패턴**: 에이전트당 4-5개 도구, 전문 서브에이전트로 분산

### 함정 5: "서브에이전트는 코디네이터의 컨텍스트를 알고 있다"
- **왜 함정인가**: 같은 시스템 안의 구성 요소가 상태를 공유한다고 가정하는 것은 자연스럽다.
- **왜 오답인가**: 서브에이전트는 빈 컨텍스트에서 시작한다. 자동 상속 없음.
- **정답 패턴**: 필요한 정보를 명시적으로(explicitly) 전달

---

## 3. 연습 문제 5문항

### Q1. 에스컬레이션 로직

한 고객 지원 에이전트가 복잡한 환불 요청을 받았다. 다음 중 에스컬레이션 결정에 가장 적합한 접근법은?

- (A) Claude의 응답에 포함된 신뢰도 점수가 0.7 미만이면 사람에게 넘긴다
- (B) 환불 금액이 $5,000을 초과하거나 계정 등급이 enterprise이면 사람에게 넘긴다
- (C) 고객이 불만을 표시하면 감성 분석을 수행하고, 부정적이면 에스컬레이션한다
- (D) Claude에게 "확실하지 않으면 에스컬레이션하라"고 시스템 프롬프트에 지시한다

**정답: (B)**
> 결정론적 규칙(금액, 계정 등급)이 정답. (A)와 (D)는 모델의 자체 판단에 의존하므로 오답. (C)는 감성 분석도 모델 의존이라 프로덕션 라우팅에 부적합.

---

### Q2. CI/CD에서 Claude Code 실행

CI/CD 파이프라인에서 Claude Code를 실행하려 한다. 다음 중 올바른 명령은?

- (A) `claude code "run tests and deploy"`
- (B) `claude -p "run tests and deploy"`
- (C) `claude -p "run tests and deploy" --bare --output-format json`
- (D) `claude --interactive "run tests and deploy" --output-format json`

**정답: (C)**
> `-p` (비대화 모드) + `--bare` (재현성) + `--output-format json` (파이프라인 파싱)이 CI/CD의 표준 조합. (A)는 `-p`가 없어 시스템이 멈춤. (B)는 동작하지만 `--bare`와 `--output-format`이 없어 불완전. (D)의 `--interactive`는 CI/CD에서 사용하면 안 됨.

---

### Q3. MCP Tool vs Resource

한 MCP 서버에서 고객 주문 내역을 조회하는 기능과 주문 취소 기능을 제공하려 한다. 올바른 MCP 프리미티브 매핑은?

- (A) 주문 내역 조회 = Tool, 주문 취소 = Tool
- (B) 주문 내역 조회 = Resource, 주문 취소 = Resource
- (C) 주문 내역 조회 = Resource, 주문 취소 = Tool
- (D) 주문 내역 조회 = Prompt, 주문 취소 = Tool

**정답: (C)**
> 주문 내역 조회는 읽기 전용(read-only) 데이터 접근이므로 Resource. 주문 취소는 상태를 변경하는 액션(action)이므로 Tool. (A)는 읽기 작업에 Tool을 할당하여 과도. (B)는 상태 변경에 Resource를 사용하므로 오답.

---

### Q4. 멀티 에이전트 설계

리서치 시스템에 웹 검색, 문서 분석, 데이터 시각화, 보고서 작성, DB 쿼리, 이메일 발송 등 18개 기능이 필요하다. 최적의 아키텍처는?

- (A) 18개 도구를 모두 가진 하나의 강력한 에이전트
- (B) 코디네이터 에이전트 + 4-5개 도구씩 가진 전문 서브에이전트 4개
- (C) 18개 독립 에이전트, 각각 하나의 도구
- (D) 사용자가 필요한 도구를 직접 선택하는 인터페이스

**정답: (B)**
> (A)는 슈퍼 에이전트 안티패턴 (15개+ 도구). (B)는 코디네이터-서브에이전트 패턴으로 에이전트당 4-5개 도구 규칙을 따름. (C)는 과도한 세분화로 통신 오버헤드 발생. (D)는 에이전트 아키텍처가 아닌 수동 도구 선택.

---

### Q5. 비용 최적화

실시간 고객 채팅 시스템에서 동일한 회사 정책 문서를 매 대화마다 시스템 프롬프트로 포함해야 한다. 비용을 줄이면서 지연 시간을 유지하는 방법은?

- (A) Batch API로 전환하여 50% 절감
- (B) 정책 문서를 요약하여 토큰 수를 줄인다
- (C) Prompt Caching을 적용하여 반복 시스템 프롬프트를 캐싱한다
- (D) 정책 문서를 제거하고 Claude의 학습 데이터에 의존한다

**정답: (C)**
> 사용자가 응답을 기다리는 실시간 상황이므로 (A) Batch API는 불가 (최대 24시간 지연). (B)는 비용을 줄이지만 정책 누락 위험. (C) Prompt Caching은 최대 90% 비용 절감 + 실시간 지연 유지. (D)는 할루시네이션 위험.

---

## 4. 도메인 매핑 (이 아티클이 커버하는 CCA 도메인)

```
┌───────────────────────────────────────────────────────────┐
│                    CCA Foundations                         │
├───────────┬──────────┬──────────┬─────────┬──────────────┤
│ Domain 1  │ Domain 2 │ Domain 3 │ Domain 4│  Domain 5    │
│ Agentic   │ Claude   │ Prompt   │ Tool &  │  Context     │
│ Arch.     │ Code     │ Eng.     │ MCP     │  Mgmt.       │
│   27%     │   20%    │   20%    │  18%    │   15%        │
│  ████████ │ ██████   │ ██████   │ █████   │  ████        │
│  ✅ 전체  │ ✅ 전체  │ ✅ 전체  │ ✅ 전체 │  ✅ 전체     │
│  커버     │ 커버     │ 커버     │ 커버    │  커버        │
└───────────┴──────────┴──────────┴─────────┴──────────────┘
```

**Part 1 커버리지**: 이 아티클은 5개 도메인 전체를 **개관 수준(overview level)**에서 다룬다. 각 도메인의 핵심 개념, 주요 함정, 멘탈 모델을 소개하지만, 개별 시나리오의 심층 분석은 시리즈의 이후 파트(2~8편)에서 다룰 예정이다.

| 파트 | 예상 내용 | 도메인 |
|------|-----------|--------|
| Part 1 (이 글) | 전체 지형, 5개 도메인 개관, 학습 계획 | D1-D5 전체 |
| Part 2+ | 고객 지원 에이전트 시나리오 딥다이브 | D1, D4 집중 |
| Part 3+ | 코드 생성 시나리오 딥다이브 | D2, D5 집중 |
| Part 4+ | 멀티 에이전트 리서치 딥다이브 | D1, D4 집중 |
| Part 5+ | CI/CD 시나리오 딥다이브 | D2 집중 |
| Part 6+ | 구조화 데이터 추출 딥다이브 | D3 집중 |

---

## 5. Key Concepts Summary (핵심 개념 요약)

### 시험을 관통하는 3대 원칙

1. **"Prompts are guidance. Code is law."**
   - 비즈니스 룰, JSON 준수, 라우팅 결정 → 프롬프트가 아닌 코드로 강제
   - 시험에서 "시스템 프롬프트에 지시 추가" 선택지 = 거의 항상 오답

2. **서브에이전트는 컨텍스트를 상속하지 않는다**
   - 빈 슬레이트에서 시작, 명시적 전달 필수
   - 가장 많이 시험되는 단일 개념

3. **결정론적 규칙 > 모델 판단**
   - 에스컬레이션, 라우팅, 검증 → 결정론적 규칙이 항상 정답
   - Claude의 자체 신뢰도 점수 = 프로덕션 라우팅에 부적합

### 암기 필수 수치

| 항목 | 값 |
|------|-----|
| 시험 문항 수 | 60 |
| 시험 시간 | 120분 |
| 합격 점수 | 720/1,000 |
| 비용 | $99 |
| 에이전트당 적정 도구 수 | 4-5개 |
| 슈퍼 에이전트 기준 | 15개+ 도구 |
| Prompt Caching 절감률 | 최대 90% |
| Batch API 절감률 | 50% |
| Batch API 최대 지연 | 24시간 |
| 프로덕션 시나리오 출제 | 6개 중 4개 랜덤 |
| 권장 총 학습 시간 | 30-37시간 |
| 모의 시험 목표 점수 | 900+ |

### 도메인별 한 줄 요약

- **D1 (27%)**: 코디네이터-서브에이전트 패턴, 서브에이전트 컨텍스트 비상속, 슈퍼 에이전트 안티패턴
- **D2 (20%)**: CLAUDE.md 계층(프로젝트 vs 사용자), CI/CD `-p` 필수, Plan Mode vs Direct
- **D3 (20%)**: tool_choice > 프롬프트 지시, validation-retry loop, stop reason 확인
- **D4 (18%)**: Tool(실행) vs Resource(읽기) 경계, Tool Description이 라우팅 결정, 4-5 도구 규칙
- **D5 (15%)**: Lost in the Middle (처음/끝 배치), Prompt Caching (실시간 + 비용절감), Batch API (배경 작업만)

---

*Generated: 2026-04-04 | Source: CCA Foundations Exam Guide Part 1 by Rick Hightower*
