# CCA Foundations -- 1-Page Cheatsheet (Last-Minute Review)

## 1. 시험 구조 (Exam Structure)

| 항목 | 값 | | 항목 | 값 |
|------|-----|---|------|-----|
| 문항 수 | 60 | | 합격 | 720/1000 (~72%) |
| 시간 | 120분 | | 비용 | $99 |
| 시나리오 | 6개 중 4개 랜덤 | | 목표 점수 | 900+ |

| Domain | 비중 | 핵심 한 줄 |
|--------|------|-----------|
| **D1** Agentic Architecture | **27%** | Coordinator-Subagent, 결정론적 에스컬레이션, 슈퍼에이전트 안티패턴 |
| **D2** Tool Design & MCP | **18%** | MCP 3 Primitives, 4-5 Tool Rule, Description = Routing |
| **D3** Claude Code Workflows | **20%** | CLAUDE.md 4단계 계층, `-p --bare`, Hooks = deterministic |
| **D4** Prompt Engineering | **20%** | 3-Tier Model, tool_choice, Pydantic parse, Prefill |
| **D5** Context Management | **15%** | Lost-in-the-Middle, Prompt Caching, Batch API = 비실시간만 |

## 2. D1 핵심 (27%) -- Agentic Architecture
- **서브에이전트 = blank slate** -- 컨텍스트 자동 상속 없음, 명시적 전달(explicit context passing) 필수
- **에스컬레이션 = 결정론적 비즈니스 규칙** (금액/등급/이슈유형) -- confidence score 보이면 즉시 제거
- **Hub-and-Spoke**: 스포크 간 직접 통신 절대 불가, 모든 데이터 허브 경유
- **Agentic Loop**: 분해 -> 실행 -> 합성 -> 검토
- **"Prompts = guidance, Code = law"** -- 컴플라이언스/라우팅/검증은 코드로 강제

## 3. D2 핵심 (18%) -- Tool Design & MCP
- **MCP 3 Primitives**: Tools(동사/실행) / Resources(명사/읽기전용) / Prompts(패턴/템플릿)
- **4-5 Tool Rule**: 에이전트당 4-5개 최적 / 15+ = 슈퍼에이전트 안티패턴 (attention tax)
- **Tool Description = 라우팅 메커니즘** (이름 아님!) -- 부정 경계(negative bounds) 포함 필수
- **MCP 스코핑**: 서버 정의 = `.mcp.json`(팀/VCS) / 크레덴셜 = `~/.claude.json`(개인/non-VCS)

## 4. D3 핵심 (20%) -- Claude Code Workflows
- **CLAUDE.md 4단계**: **M-P-U-L** (Managed > Project > User > Local, 상위 우선, 재정의 불가)
  - Managed/Org: IT 배포, 재정의 불가 | Project: `.claude/CLAUDE.md`, Git 공유 | User: `~/.claude/CLAUDE.md` | Local: `CLAUDE.local.md`, .gitignore
- **CI/CD 필수**: `-p`(비인터랙티브) + `--bare`(재현성) + `--output-format json`(파싱)
- **`--tools`** = 도구 제한(샌드박싱) vs **`--allowedTools`** = 사전 승인(제한 아님!)
- **Hooks**: PreToolUse/PostToolUse = 확정적(deterministic) 실행 -- 프롬프트는 확률적
- **`--json-schema`** 결과 -> `structured_output` 필드 (result 아님!)

## 5. D4 핵심 (20%) -- Prompt Engineering
- **3-Tier Reliability Model**: L1 프롬프트 안내(확률적 넛지) -> L2 스키마 강제(tool_choice) -> L3 프로그래밍적 시맨틱 검증
- **Tool-forcing**: `tool_choice={"type":"tool","name":"..."}` + `input_schema`
- **Pydantic parse**: `client.messages.parse(output_format=PydanticModel)` -- 네이티브 SDK
- **`with_structured_output()`는 LangChain!** -- Anthropic SDK 아님 (시험 대표 함정)
- **Retry**: Informed(구체적 에러) + Bounded(2-3회) + Human Escalation -- blind/unbounded = 항상 오답

## 6. D5 핵심 (15%) -- Context Management
- **Lost-in-the-Middle**: 주의력 분포 문제 (용량 아님!) -- 중요 정보를 컨텍스트 처음/끝에 배치
- **"윈도우 늘리기"는 항상 오답** -- 주의력이 더 얇아짐
- **긴 문서**: 청크 분할 -> 독립 추출 -> 병합/중복 제거
- **Context Forking**: Unix fork() 유사, 필요한 컨텍스트만 선택적 복제
- **핸드오프**: 구조화된 JSON 요약 > raw transcript

## 7. 암기 필수 숫자 (Critical Numbers)

| 항목 | 값 | 항목 | 값 |
|------|-----|------|-----|
| 에이전트당 적정 도구 | **4-5개** | 슈퍼에이전트 기준 | **15+** |
| Prompt Cache 최소 토큰 | **1,024+** | Cache TTL | **5분** |
| Cache 읽기 절감 | **90%** (0.1x) | Cache 쓰기 추가(5min) | **25%** (1.25x) |
| Cache 쓰기 추가(1hr) | **100%** (2.0x) | Batch API 절감 | **50%** |
| Batch API 최대 지연 | **24시간** | Retry 제한 | **2-3회** |
| MCP Primitives | **3개** | CCA 시나리오 출제 | **6중 4개** |

## 8. Top 10 안티패턴 (Wrong -> Right)

| # | 안티패턴 (Wrong) | 정답 패턴 (Right) |
|---|-----------------|------------------|
| 1 | confidence score로 에스컬레이션 | 결정론적 비즈니스 규칙 |
| 2 | 단일 에이전트 15+ 도구 (Super Agent) | 4-5개 도구 + 서브에이전트 분할 |
| 3 | 서브에이전트 컨텍스트 자동 상속 기대 | 명시적 컨텍스트 전달 |
| 4 | 프롬프트만으로 JSON 강제 | tool_choice + schema enforcement |
| 5 | Batch API + 실시간 워크플로우 | Prompt Caching (실시간 호환) |
| 6 | blind/unbounded retry | informed + bounded(2-3회) + escalation |
| 7 | full transcript 핸드오프 | 구조화된 JSON 요약 |
| 8 | 컨텍스트 윈도우 확장으로 해결 | 청크 분할 또는 정보 배치 최적화 |
| 9 | 팀 표준을 user-level CLAUDE.md에 | project-level `.claude/CLAUDE.md` (Git) |
| 10 | few-shot으로 도구 호출 순서 제어 | 프로그래밍적 전제조건 또는 단일 도구 래핑 |

## 9. CLI 플래그 비교표

| 플래그 | 역할 | CI/CD 필수? |
|--------|------|------------|
| `-p` (`--print`) | 비인터랙티브 모드, 실행 후 종료 | **필수** -- 없으면 파이프라인 hang |
| `--bare` | 훅/LSP/스킬/메모리 스킵, 재현성 보장 | **필수** -- 환경 간 일관성 |
| `--output-format json` | 기계 파싱 가능 JSON 출력 보장 | 파싱 필요 시 |
| `--tools` | 사용 가능 도구 **제한** (샌드박싱) | 보안 필요 시 |
| `--allowedTools` | 도구 **사전 승인** (제한 아님!) | 편의 기능 |
| `--json-schema` | 스키마 기반 구조화 출력 -> `structured_output` 필드 | 구조화 필요 시 |

## 10. 비용 비교 (Cost Comparison)

| 방법 | 비용 | 실시간 | ZDR 호환 | 사용 시나리오 |
|------|------|--------|---------|-------------|
| **Standard API** | 기본 | O | O | 일반 워크플로우 |
| **Batch API** | **-50%** | **X (24h)** | **X** | nightly/weekly 배경 작업만 |
| **Prompt Caching (읽기)** | **-90%** | O | O | 반복 시스템 프롬프트 (정답!) |
| Cache 쓰기 (5min TTL) | +25% | O | O | 초기 캐시 비용 |
| Cache 쓰기 (1hr TTL) | +100% | O | O | 장기 캐시 프리미엄 |

> **황금률**: 규제 산업(금융/의료) + Batch API = 즉시 제거 (ZDR 미지원)
> **황금률**: 실시간 + 비용절감 = Prompt Caching이 유일한 정답
