# CCA 시험 안티패턴 카탈로그

> 이 문서는 CCA Foundations 시험에서 **오답을 빠르게 제거**하기 위한 핵심 도구다.
> 시험에서 특정 키워드가 보이면 해당 안티패턴을 떠올려 즉시 선택지를 배제하라.

---

## 도메인 가중치 및 안티패턴 배분

| 도메인 | 가중치 | 안티패턴 수 |
|--------|--------|------------|
| D1 — Agentic Architecture | 27% | 7개 |
| D2 — Claude Code Workflows | 20% | 5개 |
| D3 — Prompt Engineering & Structured Output | 20% | 4개 |
| D4 — Tool Design & MCP Integration | 18% | 5개 |
| D5 — Context Management & Reliability | 15% | 4개 |
| **합계** | **100%** | **25개** |

---

## D1 — Agentic Architecture (27%)

---

### AP-01: 자기보고 신뢰도 기반 에스컬레이션 ❌

**도메인**: D1 — Agentic Architecture
**빈출도**: ★★★★★

**안티패턴 (틀린 답)**:
> "에이전트가 85% 확신을 보고하므로 80% 임계값 이상이니 처리를 허용한다"
> Self-reported confidence score as escalation threshold

**정답 패턴 (올바른 답)**:
> 결정론적 비즈니스 규칙으로 에스컬레이션 결정 — 금액 > $500, 계정 등급 = enterprise, 이슈 유형 = 법적 분쟁
> Deterministic business rules (amount, tier, issue type)

**시험 키워드**: `confidence score`, `self-reported confidence`, `model certainty`, `"if the agent is uncertain"`, `신뢰도 점수`, `85%/92% 확신` → **즉시 제거**

---

### AP-02: 서브에이전트 컨텍스트 자동 상속 착각 ❌

**도메인**: D1 — Agentic Architecture
**빈출도**: ★★★★★

**안티패턴 (틀린 답)**:
> "서브에이전트가 코디네이터의 대화 이력과 지시사항을 자동으로 상속한다"
> Sub-agents automatically inherit coordinator's context

**정답 패턴 (올바른 답)**:
> 서브에이전트는 blank slate에서 시작. 코디네이터가 명시적으로 전달(explicit context passing)한 것만 안다
> Sub-agents start from blank slate — only explicitly passed context is available

**시험 키워드**: `context inheritance`, `자동 상속`, `shares context`, `"상속에 실패"` (상속이 기본이라는 전제 자체가 오답) → **즉시 제거**

**코드 예시**:
```
[오답] "코디네이터가 APA 인용을 요구했는데 서브에이전트가 MLA 반환"
       → 원인: "상속 실패"가 아니라 "인용 형식을 전달하지 않았다"
```

---

### AP-03: 슈퍼 에이전트 (만능 에이전트) ❌

**도메인**: D1 — Agentic Architecture
**빈출도**: ★★★★★

**안티패턴 (틀린 답)**:
> "하나의 강력한 에이전트에 15-18개 도구를 모두 부여하여 컨텍스트 전환 비용을 제거한다"
> Single super-agent with 15+ tools to eliminate context switching

**정답 패턴 (올바른 답)**:
> 코디네이터 + 전문 서브에이전트 (에이전트당 4-5개 도구). Attention tax로 인해 도구가 많을수록 선택 정확도 하락
> Coordinator-subagent pattern with 4-5 tools per agent

**시험 키워드**: `single powerful agent`, `모든 도구를 하나에`, `18개 도구`, `one agent handles all` → **즉시 제거**

---

### AP-04: 서브에이전트 간 직접 통신 ❌

**도메인**: D1 — Agentic Architecture
**빈출도**: ★★★★☆

**안티패턴 (틀린 답)**:
> "서브에이전트 A가 서브에이전트 B에 직접 결과를 전달하여 효율성을 높인다"
> Sub-agents communicate directly for efficiency

**정답 패턴 (올바른 답)**:
> 허브앤스포크에서 스포크끼리는 절대 직접 통신 불가. 모든 조율은 코디네이터(허브)를 경유
> All communication flows through the coordinator (hub) — spokes never talk directly

**시험 키워드**: `직접 전달`, `direct communication between sub-agents`, `A가 B에 전달` → **즉시 제거**

---

### AP-05: 프롬프트만으로 컴플라이언스 보장 ❌

**도메인**: D1 — Agentic Architecture
**빈출도**: ★★★★☆

**안티패턴 (틀린 답)**:
> "시스템 프롬프트에 PCI-DSS 규칙을 상세히 기술하여 컴플라이언스를 보장한다"
> "That is not a compliance strategy. That is a hope."

**정답 패턴 (올바른 답)**:
> 프로그래밍적 강제(programmatic enforcement): redaction, validation, audit logging을 코드로 구현
> Prompts = guidance, Code = enforcement

**시험 키워드**: `시스템 프롬프트에 규칙 추가`, `프롬프트로 보안 강제`, `"절대 하지 마라"고 지시` → **즉시 제거** (보안/컴플라이언스 맥락에서)

---

### AP-06: 사일런트 실패 (success + null) ❌

**도메인**: D1 — Agentic Architecture
**빈출도**: ★★★★☆

**안티패턴 (틀린 답)**:
> `{"status": "success", "data": null}` — 에러를 성공으로 위장. "데이터가 없다"와 "소스 접근 불가"를 구분하지 않음
> Silent failure: error masquerading as success

**정답 패턴 (올바른 답)**:
> 구조화된 에러 컨텍스트: `{"status": "error", "error_type": "timeout", "source": "api.example.com", "retry_eligible": true}`
> Structured error context with type, source, and retry eligibility

**시험 키워드**: `success + null`, `빈 응답`, `에러를 무시`, `부분 데이터만 반환` → **즉시 제거**

---

### AP-07: 실시간 워크플로우에 Batch API 사용 ❌

**도메인**: D1 — Agentic Architecture
**빈출도**: ★★★★★

**안티패턴 (틀린 답)**:
> "Batch API로 마이그레이션하여 50% 비용 절감. 동일 모델 품질 유지" (사용자 대면 시나리오에서)
> Batch API for real-time/user-facing workflows

**정답 패턴 (올바른 답)**:
> 실시간 = Prompt Caching (최대 90% 절감, 지연 없음) / 비실시간(nightly/weekly) = Batch API (50% 절감)
> Real-time = Prompt Caching / Background = Batch API

**시험 키워드**: `Batch API` + `실시간`, `사용자 대면`, `고객 채팅`, `즉시 응답 필요` 조합 → **즉시 제거**

---

## D2 — Claude Code Workflows (20%)

---

### AP-08: CI/CD에서 -p 플래그 누락 ❌

**도메인**: D2 — Claude Code Workflows
**빈출도**: ★★★★★

**안티패턴 (틀린 답)**:
> "파이프라인 타임아웃을 120분으로 늘려라" — 증상 치료일 뿐
> Increasing pipeline timeout instead of adding -p flag

**정답 패턴 (올바른 답)**:
> `claude -p "..." --bare --output-format json` — 비인터랙티브 모드 + 재현성 + 기계 파싱
> `-p` (non-interactive) + `--bare` (reproducible) is the CI/CD standard

**시험 키워드**: `파이프라인 무한 대기`, `hang`, `타임아웃 연장` → **-p 누락이 근본 원인**

---

### AP-09: --tools와 --allowedTools 혼동 ❌

**도메인**: D2 — Claude Code Workflows
**빈출도**: ★★★★☆

**안티패턴 (틀린 답)**:
> "`--allowedTools`로 도구를 제한한다" — 이것은 사전 승인(pre-approve)이지 제한(restrict)이 아님
> Confusing --allowedTools (pre-approve) with --tools (restrict)

**정답 패턴 (올바른 답)**:
> `--tools "Read,Bash"` = 이 도구만 사용 가능 (샌드박싱). `--allowedTools` = 권한 프롬프트 없이 사전 승인만
> `--tools` = restrict (sandbox), `--allowedTools` = pre-approve (no restriction)

**시험 키워드**: `의도치 않은 동작 방지`, `도구 제한`, `sandbox` → **`--tools`가 정답**

---

### AP-10: 팀 표준을 사용자 레벨 CLAUDE.md에 배치 ❌

**도메인**: D2 — Claude Code Workflows
**빈출도**: ★★★★☆

**안티패턴 (틀린 답)**:
> "각 개발자의 `~/.claude/CLAUDE.md`에 팀 표준을 복사한다" — Git 비공유, 수동 전파 불가
> Team standards in user-level CLAUDE.md (~/.claude/CLAUDE.md)

**정답 패턴 (올바른 답)**:
> 팀 표준은 프로젝트 레벨 `.claude/CLAUDE.md`에 정의 → Git 커밋으로 자동 공유
> Team standards in project-level `.claude/CLAUDE.md` (version controlled)

**시험 키워드**: `manually copy`, `각 개발자의 CLAUDE.md`, `user-level` + 팀 표준 → **즉시 제거**

---

### AP-11: 조직 보안 정책을 프로젝트 레벨에 배치 ❌

**도메인**: D2 — Claude Code Workflows
**빈출도**: ★★★★☆

**안티패턴 (틀린 답)**:
> "조직 전체 보안 정책을 프로젝트 CLAUDE.md에 추가한다" — 개발자가 재정의 가능
> Organization security policy in project-level (can be overridden)

**정답 패턴 (올바른 답)**:
> Managed/Org 레벨 (`/Library/Application Support/ClaudeCode/CLAUDE.md`)에 IT 팀이 배포 — 하위 재정의 불가
> Managed/Org level: highest authority, cannot be overridden

**시험 키워드**: `재정의 불가`, `모든 개발자에 강제`, `조직 전체 보안` → **Managed/Org 레벨**
> 4단계 우선순위 암기: **M-P-U-L** (Managed → Project → User → Local)

---

### AP-12: 프롬프트로 규칙 강제 (훅 대신) ❌

**도메인**: D2 — Claude Code Workflows
**빈출도**: ★★★★☆

**안티패턴 (틀린 답)**:
> "CLAUDE.md에 규칙을 추가하면 충분하다" — 장문 세션에서 컨텍스트 압박 시 무시될 수 있음
> System prompt instructions for enforcement (probabilistic)

**정답 패턴 (올바른 답)**:
> PostToolUse/PreToolUse 훅으로 확정적(deterministic) 실행. 프롬프트 = 확률적, 훅 = 확정적
> Hooks (PreToolUse/PostToolUse) for deterministic execution

**시험 키워드**: `프롬프트에 규칙 추가`, `CLAUDE.md에 지시`, `간헐적으로 무시` → **훅이 정답**

---

## D3 — Prompt Engineering & Structured Output (20%)

---

### AP-13: "Always return JSON" 프롬프트로 구조 보장 ❌

**도메인**: D3 — Prompt Engineering
**빈출도**: ★★★★★

**안티패턴 (틀린 답)**:
> "시스템 프롬프트에 JSON 형식 지시를 추가하여 출력 형식을 제어한다" — 확률적 넛지(probabilistic nudge)일 뿐
> Prompt-based JSON formatting (probabilistic, not guaranteed)

**정답 패턴 (올바른 답)**:
> `tool_choice` + `input_schema` (tool-forcing), `client.messages.parse()` (Pydantic), validation-retry loop
> Schema enforcement (Level 2) + programmatic validation (Level 3)

**시험 키워드**: `프롬프트에 JSON 형식 지정`, `시스템 프롬프트로 출력 제어`, `"Always return JSON"` → **즉시 제거**

**3계층 신뢰성 모델**:
```
Level 1: 프롬프트 안내 (확률적 넛지) — 불충분
Level 2: 스키마 강제 (tool-forcing) — 구조 보장
Level 3: 프로그래밍적 시맨틱 검증 — 의미 보장
```

---

### AP-14: with_structured_output()를 네이티브 SDK로 착각 ❌

**도메인**: D3 — Prompt Engineering
**빈출도**: ★★★★☆

**안티패턴 (틀린 답)**:
> "`with_structured_output(PydanticModel)`로 구조화된 출력을 구현한다" — 이것은 **LangChain** 메서드
> `with_structured_output()` is LangChain, NOT native Anthropic SDK

**정답 패턴 (올바른 답)**:
> `tool_choice={"type": "tool", "name": "..."}` 또는 `client.messages.parse(output_format=PydanticModel)`
> Native SDK methods for structured output

**시험 키워드**: `네이티브 Anthropic SDK`, `SDK 기본 기능만`, `with_structured_output` → **LangChain 함정**

---

### AP-15: 맹목적/무한 재시도 ❌

**도메인**: D3 — Prompt Engineering
**빈출도**: ★★★★★

**안티패턴 (틀린 답)**:
> "실패 시 자동 재시도" (blind retry) 또는 "성공할 때까지 반복" (unbounded retry)
> Blind retry (no error feedback) or unbounded retry (no limit)

**정답 패턴 (올바른 답)**:
> Informed(구체적 에러 메시지 포함) + Bounded(2-3회 제한) + Human escalation(최대 재시도 후 인간 개입)
> Informed + bounded (2-3 times) + human escalation

**시험 키워드**: `자동 재시도`, `성공할 때까지`, `재시도 로직 추가`, `temperature 조정하며 반복` → **즉시 제거**

---

### AP-16: Few-shot으로 도구 호출 순서 제어 ❌

**도메인**: D3 — Prompt Engineering
**빈출도**: ★★★☆☆

**안티패턴 (틀린 답)**:
> "시스템 프롬프트에 도구 호출 순서 예시를 추가하라" — few-shot은 도구 순서를 제어하지 못함
> Few-shot examples to control tool invocation sequence

**정답 패턴 (올바른 답)**:
> 프로그래밍적 전제조건(preconditions), `tool_choice`, 또는 hooks로 순서 강제
> Programmatic preconditions or hooks for sequence enforcement

**시험 키워드**: `few-shot` + `도구 순서`, `호출 순서 예시 추가` → **즉시 제거**
> few-shot은 **출력 포맷/추론 스타일**에만 유효

---

## D4 — Tool Design & MCP Integration (18%)

---

### AP-17: 도구 설명 개선만으로 과다 도구 문제 해결 ❌

**도메인**: D4 — Tool Design & MCP
**빈출도**: ★★★★☆

**안티패턴 (틀린 답)**:
> "12개 도구의 설명을 더 명확하게 개선하여 도구 선택 정확도를 높인다" — 증상 치료
> Improving descriptions of 12+ tools (treating symptoms, not root cause)

**정답 패턴 (올바른 답)**:
> 4-5개 도구로 축소 + 전문 서브에이전트 분리. 도구 수를 줄인 후에야 설명 개선이 유효
> Reduce to 4-5 tools per agent + split into specialized sub-agents

**시험 키워드**: `도구 설명 개선` + 도구 수가 5개 초과인 상황 → **분할이 우선**

---

### AP-18: MCP Resource로 상태 변경 수행 ❌

**도메인**: D4 — Tool Design & MCP
**빈출도**: ★★★★☆

**안티패턴 (틀린 답)**:
> "주문 취소를 Resource로 구현한다" — Resource는 읽기 전용 데이터(명사)
> Using MCP Resource for state-changing actions

**정답 패턴 (올바른 답)**:
> MCP 3대 프리미티브: **Tools = 동사**(실행), **Resources = 명사**(읽기), **Prompts = 패턴**(템플릿)
> Tools(verbs) for actions, Resources(nouns) for read-only data, Prompts(patterns) for templates

**시험 키워드**: 상태 변경(취소, 환불, 삭제) + `Resource` → **Tool이 정답**

---

### AP-19: MCP 크레덴셜을 .mcp.json에 저장 ❌

**도메인**: D4 — Tool Design & MCP
**빈출도**: ★★★★☆

**안티패턴 (틀린 답)**:
> "API 토큰을 `.mcp.json`에 포함하여 팀이 공유한다" — VCS에 크레덴셜 노출
> Credentials in .mcp.json (version-controlled, exposed to VCS)

**정답 패턴 (올바른 답)**:
> 서버 정의(비밀 제외) = `.mcp.json` (팀 공유, VCS) / 크레덴셜 = `~/.claude.json` 또는 환경변수 (개인, non-VCS)
> "정의는 팀에, 비밀은 나에게" (Definitions to team, secrets to me)

**시험 키워드**: `크레덴셜` + `.mcp.json`, `API 토큰 포함하여 팀 공유` → **즉시 제거**

---

### AP-20: 도구 이름만으로 라우팅 문제 해결 ❌

**도메인**: D4 — Tool Design & MCP
**빈출도**: ★★★☆☆

**안티패턴 (틀린 답)**:
> "도구 이름을 더 명확하게 변경하면 해결된다" — Claude는 이름이 아닌 설명으로 도구를 선택
> Renaming tools to fix routing (Claude selects by description, not name)

**정답 패턴 (올바른 답)**:
> 도구 설명(tool description)을 구체적으로 작성 — 입출력 명시, 부정 경계(negative bounds) 포함
> Specific tool descriptions with input/output specs and negative bounds

**시험 키워드**: `도구 이름 변경`, `rename tools` → **설명 개선 + 도구 수 축소가 정답**

---

### AP-21: 4-5개 도구 규칙을 SDK 하드 리밋으로 착각 ❌

**도메인**: D4 — Tool Design & MCP
**빈출도**: ★★★☆☆

**안티패턴 (틀린 답)**:
> "SDK가 도구 수를 제한하므로 에이전트를 분리해야 한다" — 기술적 제약이 아님
> Treating 4-5 tool rule as an SDK hard limit

**정답 패턴 (올바른 답)**:
> 4-5개는 Anthropic의 아키텍처 모범 사례(architecture best practice). 주의력 세금(attention tax) 때문
> It's a design principle based on attention tax, not a technical limitation

**시험 키워드**: `SDK 제한`, `SDK hard limit`, `기술적 제약` + 도구 수 → **아키텍처 원칙임**

---

## D5 — Context Management & Reliability (15%)

---

### AP-22: 컨텍스트 윈도우 확대로 Lost in the Middle 해결 ❌

**도메인**: D5 — Context Management
**빈출도**: ★★★★★

**안티패턴 (틀린 답)**:
> "더 큰 컨텍스트 윈도우를 사용하면 중간 정보 손실이 해결된다" — 주의력 문제이지 용량 문제가 아님
> Increasing context window to fix lost-in-the-middle (attention, not capacity)

**정답 패턴 (올바른 답)**:
> 중요 정보를 컨텍스트 처음/끝에 배치 + 청크 분할 → 독립 처리 → 병합 + 매 턴 시작에 구조화된 요약 삽입
> Place critical info at start/end, chunk long documents, insert structured summaries per turn

**시험 키워드**: `increase window`, `load everything`, `larger context`, `컨텍스트 윈도우 확장` → **항상 오답**

---

### AP-23: 전체 대화 기록으로 에스컬레이션 핸드오프 ❌

**도메인**: D5 — Context Management
**빈출도**: ★★★★☆

**안티패턴 (틀린 답)**:
> "휴먼 에이전트에게 전체 대화 기록(raw transcript)을 전달하여 맥락 손실을 방지한다"
> Full raw transcript handoff to human agent

**정답 패턴 (올바른 답)**:
> 구조화된 JSON 요약: customer_id, tier, issue_type, disputed_amount, escalation_reason 등
> Structured JSON summary with key fields

**시험 키워드**: `full transcript`, `전체 대화 기록`, `완전한 맥락 전달` → **구조화된 요약이 정답**

---

### AP-24: 규제 산업에서 Batch API 사용 (ZDR 미지원) ❌

**도메인**: D5 — Context Management
**빈출도**: ★★★★☆

**안티패턴 (틀린 답)**:
> "의료/금융/정부 환경에서 Batch API로 야간 분석 비용을 50% 절감" — ZDR(Zero Data Retention) 미지원
> Batch API in regulated industries (does NOT support ZDR)

**정답 패턴 (올바른 답)**:
> Real-Time API + Prompt Caching — ZDR 호환 + 비용 최적화
> Real-Time API (ZDR compatible) + Prompt Caching

**시험 키워드**: `규제 산업` + `Batch API`, `ZDR` + `Batch`, `금융/의료/정부` + `배치` → **즉시 제거**

---

### AP-25: 단일 세션에서 대규모 리팩토링 ❌

**도메인**: D5 — Context Management
**빈출도**: ★★★★☆

**안티패턴 (틀린 답)**:
> "47개 파일을 하나의 세션에 로드하고 한 번에 리팩토링한다" — 380K 토큰 → lost in the middle
> Loading all files in a single session for large-scale refactoring

**정답 패턴 (올바른 답)**:
> 코디네이터 패턴: 분해(decompose) → 파일별 집중 세션(focused per-file passes) → 합성 → 교차 파일 일관성 검토
> Coordinator pattern: decompose → focused sessions → synthesize → cross-file review

**시험 키워드**: `load all files`, `single session`, `모든 파일을 한 번에`, `전체 디렉토리 로드` → **즉시 제거**

---

## 빠른 참조 요약 테이블

| # | 안티패턴 | 도메인 | 빈출 | 즉시 제거 키워드 |
|---|---------|--------|------|-----------------|
| AP-01 | 자기보고 신뢰도 에스컬레이션 | D1 | ★★★★★ | confidence score, self-reported, 85%/92% |
| AP-02 | 서브에이전트 컨텍스트 상속 | D1 | ★★★★★ | context inheritance, 자동 상속 |
| AP-03 | 슈퍼 에이전트 (15+ 도구) | D1 | ★★★★★ | single agent + all tools, 18개 도구 |
| AP-04 | 서브에이전트 간 직접 통신 | D1 | ★★★★☆ | direct communication between sub-agents |
| AP-05 | 프롬프트 기반 컴플라이언스 | D1 | ★★★★☆ | 프롬프트에 보안 규칙 추가 |
| AP-06 | 사일런트 실패 (success+null) | D1 | ★★★★☆ | success + null, 에러 무시 |
| AP-07 | 실시간에 Batch API | D1 | ★★★★★ | Batch API + 실시간/고객 대면 |
| AP-08 | CI/CD -p 플래그 누락 | D2 | ★★★★★ | 파이프라인 hang, 타임아웃 연장 |
| AP-09 | --tools vs --allowedTools 혼동 | D2 | ★★★★☆ | allowedTools로 제한 |
| AP-10 | 팀 표준 → 사용자 레벨 CLAUDE.md | D2 | ★★★★☆ | 각 개발자의 ~/.claude/CLAUDE.md |
| AP-11 | 조직 정책 → 프로젝트 레벨 | D2 | ★★★★☆ | 재정의 불가 + project level |
| AP-12 | 훅 대신 프롬프트로 강제 | D2 | ★★★★☆ | CLAUDE.md에 규칙 추가 + 간헐 무시 |
| AP-13 | 프롬프트로 JSON 보장 | D3 | ★★★★★ | "Always return JSON", 프롬프트로 형식 제어 |
| AP-14 | with_structured_output = SDK | D3 | ★★★★☆ | with_structured_output + 네이티브 SDK |
| AP-15 | 맹목적/무한 재시도 | D3 | ★★★★★ | 자동 재시도, 성공할 때까지 |
| AP-16 | Few-shot → 도구 순서 제어 | D3 | ★★★☆☆ | few-shot + 도구 호출 순서 |
| AP-17 | 도구 설명만 개선 (12+ 도구) | D4 | ★★★★☆ | 설명 개선 + 도구 수 5개 초과 |
| AP-18 | Resource로 상태 변경 | D4 | ★★★★☆ | 취소/환불/삭제 + Resource |
| AP-19 | .mcp.json에 크레덴셜 | D4 | ★★★★☆ | API 토큰 + .mcp.json |
| AP-20 | 도구 이름만 변경 | D4 | ★★★☆☆ | rename tools, 이름 변경 |
| AP-21 | 4-5 도구 = SDK 리밋 | D4 | ★★★☆☆ | SDK 제한, SDK hard limit |
| AP-22 | 컨텍스트 확대 → Lost in Middle | D5 | ★★★★★ | increase window, larger context |
| AP-23 | 전체 대화 기록 핸드오프 | D5 | ★★★★☆ | full transcript, 전체 대화 기록 |
| AP-24 | 규제 산업 + Batch API | D5 | ★★★★☆ | ZDR + Batch API, 규제 + 배치 |
| AP-25 | 단일 세션 대규모 리팩토링 | D5 | ★★★★☆ | load all files, single session |

---

## 시험 직전 3분 암기법

### 관통 원칙 3개
1. **"Prompts are guidance. Code is law."** — 프롬프트 기반 답변 = 거의 항상 오답 (보안/컴플라이언스/형식 보장에서)
2. **결정론적 규칙 > 모델 판단** — confidence score, self-reported = 항상 오답
3. **서브에이전트 = blank slate** — 자동 상속 없음, 명시적 전달만

### 숫자 암기
| 항목 | 값 | 안티패턴 연결 |
|------|---|--------------|
| 에이전트당 도구 | **4-5개** | AP-03, AP-17, AP-21 |
| 재시도 상한 | **2-3회** | AP-15 |
| Prompt Caching 절감 | **90%** (읽기만) | AP-07 |
| Batch API 절감 | **50%** | AP-07, AP-24 |
| Batch API 지연 | **최대 24시간** | AP-07 |
| CLAUDE.md 계층 | **4단계** (M-P-U-L) | AP-10, AP-11 |

### 즉시 제거 패턴 Top 5
1. `confidence score` / `self-reported` → 오답 (AP-01)
2. `Batch API` + 실시간 → 오답 (AP-07)
3. `increase context window` → 오답 (AP-22)
4. `시스템 프롬프트에 규칙 추가` (보안 맥락) → 오답 (AP-05, AP-12, AP-13)
5. `서브에이전트가 상속/공유` → 오답 (AP-02)

---

*Generated: 2026-04-04 | Sources: CCA Study Notes Series (8 articles) by Rick Hightower*
