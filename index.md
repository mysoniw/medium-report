# Medium 블로그 분석 아카이브

> 기술 블로그를 읽고, 분석하여 이해하기 쉬운 보고서로 재구성합니다.
> 최종 목표: 문서 간 개념-기술-저자 관계를 추출하여 **지식 그래프**를 구축한다.

- **프로젝트 경로**: `/Users/minholee/projects/medium/`
- **리포트 생성 스킬**: `/report <URL>` (`.claude/commands/report.md`)
- **인덱스 파일**: `/Users/minholee/projects/medium/index.md`
- **시각화**: `/Users/minholee/projects/medium/index.html` (태그 클라우드, 검색)
- **지식 그래프**: `/Users/minholee/projects/medium/graph.html` (D3.js force-directed)

---

## 문서 목록

| # | 제목 | 카테고리 | 태그 | 원문 저자 | 날짜 | 경로 |
|---|------|---------|------|----------|------|------|
| 1 | [아젠틱 코딩 프레임워크 대격돌](agentic-framework-showdown/report.md) | AI/에이전트 엔지니어링 | `#agentic-coding` `#framework-comparison` `#AI-agent` `#context-engineering` `#TDD` | Rick Hightower | 2026-03-18 | `agentic-framework-showdown/` |
| 2 | [Claude Code 슬래시 커맨드 5가지](claude-code-slash-commands/report.md) | 개발 도구/생산성 | `#claude-code` `#slash-commands` `#developer-tools` `#workflow` `#productivity` | Joe Njenga | 2026-03-18 | `claude-code-slash-commands/` |
| 3 | [NotebookLM 11단계 학습 워크플로우](notebooklm-learning-workflow/report.md) | 학습/생산성 | `#NotebookLM` `#learning-workflow` `#active-learning` `#AI-tools` `#knowledge-management` | Soultntoure | 2024-12-23 | `notebooklm-learning-workflow/` |
| 4 | [Boris Cherny의 Claude Code 팁 스킬 분석](boris-cherny-claude-code-tips-skill/report.md) | 개발 도구/생산성 | `#claude-code` `#claude-code-skills` `#workflow-optimization` `#parallel-agents` `#worktree` `#boris-cherny` | Reza Rezvani | 2026-03-23 | `boris-cherny-claude-code-tips-skill/` |
| 5 | [CCA Scenario Deep Dive Series (7편)](cca-scenario-deep-dive/report.md) | AI/자격증 | `#CCA` `#claude-certified-architect` `#anthropic` `#agentic-architecture` `#MCP` `#claude-code` `#prompt-engineering` `#anti-patterns` | Rick Hightower | 2026-03-25 ~ 04-02 | `cca-scenario-deep-dive/` |

---

## 시리즈

### [CCA Scenario Deep Dive Series](cca-scenario-deep-dive/report.md) (Rick Hightower, 7/8편 보유)

> 시리즈 인덱스 문서에서 각 아티클 요약과 시리즈 관통 안티패턴/올바른 패턴 대조표 확인 가능

| # | 제목 | 핵심 주제 | 보유 |
|---|------|----------|------|
| 1 | [CCA Foundations 시험 완벽 가이드](cca-foundations-exam-guide/report.md) | 시험 형식, 5개 도메인, 4주 학습 계획 | ✅ |
| 2 | [고객 지원 에이전트 시나리오](cca-customer-support-agent/report.md) | 에스컬레이션 로직, Prompt Caching, 컴플라이언스 | ✅ |
| 3 | [코드 생성 시나리오](cca-code-generation-scenario/report.md) | 컨텍스트 열화, CLAUDE.md, -p 플래그 | ✅ |
| 4 | [멀티에이전트 리서치 시나리오](cca-multi-agent-research/report.md) | 허브앤스포크, 컨텍스트 격리, 4-5 도구 | ✅ |
| 5 | [CI/CD 시나리오](cca-cicd-scenario/report.md) | --bare, JSON 스키마, ZDR, 토큰 경제학 | ✅ |
| 6 | [구조화된 데이터 추출 시나리오](cca-structured-data-extraction/report.md) | 3계층 신뢰성, tool-forcing, 재시도 루프 | ✅ |
| 7 | [개발자 생산성 시나리오](cca-developer-productivity-scenario/report.md) | CLAUDE.md 4단계, MCP 스코핑, 안티패턴 | ✅ |
| 8 | 60 Review Questions (미발행) | 종합 연습 문제 | ⬜ |

---

## 카테고리

### AI/에이전트 엔지니어링
- [아젠틱 코딩 프레임워크 대격돌](agentic-framework-showdown/report.md) — 5개 프레임워크(BMAD, SpecKit, OpenSpec, GSD, Superpowers) 비교 분석

### AI/자격증
- [CCA Scenario Deep Dive Series (7편)](cca-scenario-deep-dive/report.md) — 시리즈 인덱스. Foundations 가이드 + 6개 시나리오(고객지원, 코드생성, 멀티에이전트, CI/CD, 데이터추출, 생산성) 분석

### 개발 도구/생산성
- [Claude Code 슬래시 커맨드 5가지](claude-code-slash-commands/report.md) — /effort, /loop, /copy, /color, /simplify, /batch 활용 가이드
- [Boris Cherny의 Claude Code 팁 스킬 분석](boris-cherny-claude-code-tips-skill/report.md) — 57개 팁의 스택 의존 구조, Part 3-5 심층 분석, 12주 도입 전략

### 학습/생산성
- [NotebookLM 11단계 학습 워크플로우](notebooklm-learning-workflow/report.md) — Google NotebookLM으로 기술 서적 체계적 학습법

---

## 태그 인덱스

| 태그 | 관련 문서 |
|------|----------|
| `#agentic-coding` | [프레임워크 대격돌](agentic-framework-showdown/report.md) |
| `#framework-comparison` | [프레임워크 대격돌](agentic-framework-showdown/report.md) |
| `#AI-agent` | [프레임워크 대격돌](agentic-framework-showdown/report.md) |
| `#context-engineering` | [프레임워크 대격돌](agentic-framework-showdown/report.md) |
| `#TDD` | [프레임워크 대격돌](agentic-framework-showdown/report.md) |
| `#claude-code` | [슬래시 커맨드](claude-code-slash-commands/report.md), [Boris 팁 스킬](boris-cherny-claude-code-tips-skill/report.md), [CCA 생산성](cca-developer-productivity-scenario/report.md), [CCA 코드생성](cca-code-generation-scenario/report.md), [CCA CI/CD](cca-cicd-scenario/report.md) |
| `#claude-code-skills` | [Boris 팁 스킬](boris-cherny-claude-code-tips-skill/report.md) |
| `#slash-commands` | [슬래시 커맨드](claude-code-slash-commands/report.md) |
| `#developer-tools` | [슬래시 커맨드](claude-code-slash-commands/report.md) |
| `#workflow` | [슬래시 커맨드](claude-code-slash-commands/report.md), [NotebookLM 학습](notebooklm-learning-workflow/report.md) |
| `#workflow-optimization` | [Boris 팁 스킬](boris-cherny-claude-code-tips-skill/report.md) |
| `#parallel-agents` | [Boris 팁 스킬](boris-cherny-claude-code-tips-skill/report.md) |
| `#worktree` | [Boris 팁 스킬](boris-cherny-claude-code-tips-skill/report.md) |
| `#boris-cherny` | [Boris 팁 스킬](boris-cherny-claude-code-tips-skill/report.md) |
| `#claude-certified-architect` | [CCA 시험 가이드](cca-foundations-exam-guide/report.md), [CCA 생산성](cca-developer-productivity-scenario/report.md), [CCA 고객지원](cca-customer-support-agent/report.md), [CCA 코드생성](cca-code-generation-scenario/report.md), [CCA 멀티에이전트](cca-multi-agent-research/report.md), [CCA CI/CD](cca-cicd-scenario/report.md), [CCA 데이터추출](cca-structured-data-extraction/report.md) |
| `#CCA` | [CCA 시험 가이드](cca-foundations-exam-guide/report.md), [CCA 생산성](cca-developer-productivity-scenario/report.md), [CCA 고객지원](cca-customer-support-agent/report.md), [CCA 코드생성](cca-code-generation-scenario/report.md), [CCA 멀티에이전트](cca-multi-agent-research/report.md), [CCA CI/CD](cca-cicd-scenario/report.md), [CCA 데이터추출](cca-structured-data-extraction/report.md) |
| `#certification` | [CCA 시험 가이드](cca-foundations-exam-guide/report.md) |
| `#agentic-architecture` | [CCA 시험 가이드](cca-foundations-exam-guide/report.md), [CCA 고객 지원 시나리오](cca-customer-support-agent/report.md) |
| `#MCP` | [CCA 시험 가이드](cca-foundations-exam-guide/report.md), [CCA 생산성 시나리오](cca-developer-productivity-scenario/report.md) |
| `#tool-design` | [CCA 시험 가이드](cca-foundations-exam-guide/report.md), [CCA 멀티에이전트](cca-multi-agent-research/report.md) |
| `#context-management` | [CCA 시험 가이드](cca-foundations-exam-guide/report.md), [CCA 코드생성](cca-code-generation-scenario/report.md) |
| `#prompt-engineering` | [CCA 시험 가이드](cca-foundations-exam-guide/report.md), [CCA 생산성](cca-developer-productivity-scenario/report.md), [CCA 데이터추출](cca-structured-data-extraction/report.md) |
| `#anthropic` | [CCA 시험 가이드](cca-foundations-exam-guide/report.md), [CCA 생산성 시나리오](cca-developer-productivity-scenario/report.md) |
| `#productivity` | [슬래시 커맨드](claude-code-slash-commands/report.md) |
| `#NotebookLM` | [NotebookLM 학습](notebooklm-learning-workflow/report.md) |
| `#learning-workflow` | [NotebookLM 학습](notebooklm-learning-workflow/report.md) |
| `#active-learning` | [NotebookLM 학습](notebooklm-learning-workflow/report.md) |
| `#AI-tools` | [NotebookLM 학습](notebooklm-learning-workflow/report.md) |
| `#knowledge-management` | [NotebookLM 학습](notebooklm-learning-workflow/report.md) |
| `#developer-productivity` | [CCA 생산성 시나리오](cca-developer-productivity-scenario/report.md) |
| `#CLAUDE-md` | [CCA 생산성](cca-developer-productivity-scenario/report.md), [CCA 코드생성](cca-code-generation-scenario/report.md) |
| `#anti-patterns` | [CCA 생산성](cca-developer-productivity-scenario/report.md), [CCA 고객지원](cca-customer-support-agent/report.md), [CCA 코드생성](cca-code-generation-scenario/report.md), [CCA 멀티에이전트](cca-multi-agent-research/report.md), [CCA CI/CD](cca-cicd-scenario/report.md), [CCA 데이터추출](cca-structured-data-extraction/report.md) |
| `#customer-support` | [CCA 고객 지원 시나리오](cca-customer-support-agent/report.md) |
| `#escalation-logic` | [CCA 고객 지원 시나리오](cca-customer-support-agent/report.md) |
| `#prompt-caching` | [CCA 고객 지원 시나리오](cca-customer-support-agent/report.md), [CCA CI/CD](cca-cicd-scenario/report.md) |
| `#code-generation` | [CCA 코드 생성](cca-code-generation-scenario/report.md) |
| `#multi-agent` | [CCA 멀티에이전트](cca-multi-agent-research/report.md) |
| `#context-isolation` | [CCA 멀티에이전트](cca-multi-agent-research/report.md) |
| `#hub-and-spoke` | [CCA 멀티에이전트](cca-multi-agent-research/report.md) |
| `#ci-cd` | [CCA 코드 생성](cca-code-generation-scenario/report.md), [CCA CI/CD](cca-cicd-scenario/report.md) |
| `#headless-mode` | [CCA CI/CD](cca-cicd-scenario/report.md) |
| `#batch-api` | [CCA CI/CD](cca-cicd-scenario/report.md) |
| `#structured-data` | [CCA 데이터 추출](cca-structured-data-extraction/report.md) |
| `#data-extraction` | [CCA 데이터 추출](cca-structured-data-extraction/report.md) |
| `#validation` | [CCA 데이터 추출](cca-structured-data-extraction/report.md) |
| `#json-schema` | [CCA 데이터 추출](cca-structured-data-extraction/report.md) |
