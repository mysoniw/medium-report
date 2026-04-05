# CCA Foundations 시험 준비 학습 허브

> Claude Certified Architect (CCA) Foundations 시험 대비 종합 학습 자료

## 시험 개요

| 항목 | 세부 |
|------|------|
| 문항 수 | 60문항 (객관식) |
| 시간 | 120분 |
| 합격 기준 | 720/1000 ≈ 43/60 (72%) |
| 비용 | $99 |
| 언어 | **영어** |

## 5개 도메인 & 가중치

| # | 도메인 | 가중치 | 예상 문항 | 가이드 |
|---|--------|--------|----------|--------|
| 1 | Agentic Architecture & Orchestration | **27%** | ~16문항 | [domain-1](domain-1-agentic-architecture.md) |
| 2 | Tool Design & MCP Integration | **18%** | ~11문항 | [domain-2](domain-2-tool-design-mcp.md) |
| 3 | Claude Code Configuration & Workflows | **20%** | ~12문항 | [domain-3](domain-3-claude-code.md) |
| 4 | Prompt Engineering & Structured Output | **20%** | ~12문항 | [domain-4](domain-4-prompt-engineering.md) |
| 5 | Context Management & Reliability | **15%** | ~9문항 | [domain-5](domain-5-context-management.md) |

## 학습 로드맵

### Step 1: 원문 학습 (2-3일)
가중치 순서대로 원문 읽기:
1. `cca-foundations-exam-guide/` — 전체 시험 구조 파악
2. `cca-customer-support-agent/` + `cca-multi-agent-research/` — D1 (27%)
3. `cca-code-generation-scenario/` + `cca-cicd-scenario/` — D3 (20%)
4. `cca-structured-data-extraction/` — D4 (20%)
5. `cca-developer-productivity-scenario/` — D2 (18%)

각 디렉터리에서:
- `original-en.md` → 영문 원문 (시험 언어)
- `original-ko.md` → 한글 번역 (이해 보조)
- `study-notes.md` → 시험 특화 노트

### Step 2: 도메인 가이드 정독 (1-2일)
- [Domain 1: Agentic Architecture](domain-1-agentic-architecture.md) ⭐ 최우선
- [Domain 2: Tool Design & MCP](domain-2-tool-design-mcp.md)
- [Domain 3: Claude Code](domain-3-claude-code.md)
- [Domain 4: Prompt Engineering](domain-4-prompt-engineering.md)
- [Domain 5: Context Management](domain-5-context-management.md)

### Step 3: 시험 특화 자료 (1일)
- [안티패턴 카탈로그](anti-patterns.md) — 20-25개 "이렇게 하면 틀린다"
- [플래시카드](flashcards.md) — 80-100장 핵심 Q&A
- [치트시트](cheatsheet.md) — 시험 직전 1페이지 정리

### Step 4: 모의시험 (반일)
- `cca-practice-exam-60-questions/original-en.md` — 60문항 풀기
- `cca-practice-exam-60-questions/study-notes.md` — 오답 분석

### Step 5: 보완 학습
- [Anthropic 공식 문서 요약](supplementary-resources.md)

## 소스 아티클 매핑

| # | 아티클 | 주요 도메인 | 디렉터리 |
|---|--------|-----------|---------|
| 1 | CCA Foundations 시험 완벽 가이드 | All | `cca-foundations-exam-guide/` |
| 2 | 고객 지원 에이전트 시나리오 | D1, D2, D5 | `cca-customer-support-agent/` |
| 3 | 코드 생성 시나리오 | D3, D5 | `cca-code-generation-scenario/` |
| 4 | 구조화된 데이터 추출 시나리오 | D4, D5 | `cca-structured-data-extraction/` |
| 5 | 멀티에이전트 리서치 시나리오 | D1, D2 | `cca-multi-agent-research/` |
| 6 | CI/CD 시나리오 | D3 | `cca-cicd-scenario/` |
| 7 | 개발자 생산성 시나리오 | D2, D3 | `cca-developer-productivity-scenario/` |
| 8 | 모의시험 60문항 | All | `cca-practice-exam-60-questions/` |

## 각 디렉터리 파일 구조

```
cca-{slug}/
├── report.md          ← 한국어 분석 리포트
├── original-en.md     ← 영문 원문 (시험 핵심 용어 볼드)
├── original-ko.md     ← 한글 번역 (💡 시험 포인트)
├── study-notes.md     ← 시험 특화 노트 (용어표, 함정, 연습문제)
└── audio-script.md    ← 음성 학습 스크립트
```
