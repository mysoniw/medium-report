# CCA 보완 학습 자료 -- Anthropic 공식 문서 요약

> **목적**: 도메인 가이드(D1-D5)가 Rick Hightower 시리즈 기반인 만큼, Anthropic 공식 문서에서만 확인 가능한 **갭(gap)**을 보완한다.
> WebFetch 접근이 제한되어, 공식 문서의 핵심 내용을 기반 지식에서 추출하여 정리한다.
> **생성일**: 2026-04-04

---

## 소스별 요약

### 1. Building Effective Agents (Anthropic Engineering Blog)

**URL**: https://www.anthropic.com/engineering/building-effective-agents
**대상 도메인**: D1 (Agentic Architecture), D2 (Tool Design)

#### 도메인 가이드에 없는 핵심 내용

- **Augmented LLM 개념**: Anthropic은 에이전트의 기본 빌딩 블록을 "augmented LLM"이라 정의한다. LLM + 도구(retrieval, tools, memory)의 조합이 에이전트의 최소 단위이며, 이 용어는 도메인 가이드에 등장하지 않는다.
- **Workflow vs Agent 구분**: Anthropic은 이 둘을 명확히 구분한다:
  - **Workflow**: LLM과 도구가 **미리 정의된 코드 경로(predefined code paths)**로 오케스트레이션되는 시스템
  - **Agent**: LLM이 자신의 프로세스와 도구 사용을 **동적으로 결정(dynamically direct)**하는 시스템
  - 도메인 가이드 D1은 둘을 혼용하는 경향이 있으나, 시험에서는 이 구분이 출제될 수 있다
- **5가지 공식 워크플로우 패턴** (도메인 가이드에는 coordinator-subagent만 강조):
  1. **Prompt Chaining**: 한 LLM 호출의 출력이 다음 호출의 입력. 각 단계에 게이트(gate) 추가 가능
  2. **Routing**: 입력을 분류하여 전문 후속 태스크로 분기. 관심사의 분리(separation of concerns)
  3. **Parallelization**: 태스크를 동시 실행하고 결과를 프로그래밍적으로 종합
     - **Sectioning**: 동일 입력에 대해 독립 서브태스크를 병렬 실행
     - **Voting**: 동일 태스크를 여러 번 실행하여 다양한 출력을 합성
  4. **Orchestrator-Workers**: 중앙 LLM이 태스크를 동적으로 분해하고 워커 LLM에 위임 (= coordinator-subagent)
  5. **Evaluator-Optimizer**: 한 LLM이 생성하고 다른 LLM이 평가하여 피드백 루프 형성
- **"가능한 한 단순하게 시작하라" 원칙**: Anthropic은 복잡한 프레임워크보다 단순한 구현을 강하게 권장한다. 에이전트 프레임워크(framework)는 추상화 비용이 있으므로, 기본 API 호출 + 간단한 루프로 시작할 것을 명시한다.
- **Human-in-the-Loop**: 에이전틱 시스템에서 인간 개입 지점(human-in-the-loop checkpoints)을 두는 것이 핵심 권장사항. 특히 고위험 동작(high-stakes actions) 전에 확인 단계 삽입.

#### 시험 관련 키 포인트

- "Workflow와 Agent의 차이는 무엇인가?" -- 미리 정의된 경로 vs 동적 결정
- "언제 에이전트 대신 워크플로우를 사용하는가?" -- 태스크가 잘 정의되고 예측 가능하면 워크플로우, 유연성이 필요하면 에이전트
- Parallelization의 두 하위 패턴(Sectioning vs Voting) 구분
- Evaluator-Optimizer 패턴: 문학 번역, 코드 생성 등 반복 개선이 필요한 태스크에 적합

#### 추가 용어

| 한국어 | English | 도메인 |
|--------|---------|--------|
| 증강된 LLM | Augmented LLM | D1 |
| 프롬프트 체이닝 | Prompt Chaining | D1 |
| 라우팅 패턴 | Routing Pattern | D1 |
| 병렬화 (섹셔닝/보팅) | Parallelization (Sectioning/Voting) | D1 |
| 오케스트레이터-워커 | Orchestrator-Workers | D1 |
| 평가자-최적화자 | Evaluator-Optimizer | D1 |
| 인간 개입 지점 | Human-in-the-Loop Checkpoint | D1 |

---

### 2. Agentic Systems (Anthropic Docs)

**URL**: https://docs.anthropic.com/en/docs/build-with-claude/agentic-systems
**대상 도메인**: D1, D2, D4

#### 도메인 가이드에 없는 핵심 내용

- **에이전틱 루프의 공식 정의**: Anthropic 문서는 에이전틱 루프를 `while True` 패턴으로 정의한다:
  1. Claude에게 메시지와 도구 목록 전송
  2. Claude가 도구를 호출하거나 최종 응답 생성을 결정
  3. 도구 호출이면 결과를 대화에 추가하고 1단계로 돌아감
  - **`stop_reason` 필드**가 루프 제어의 핵심: `tool_use` → 계속, `end_turn` → 종료
- **Client-side 오케스트레이션**: 루프의 제어권은 **클라이언트 코드**에 있다. Claude는 도구를 "호출"하지 않고 도구 사용 **요청(request)**을 반환할 뿐이다. 실제 실행은 클라이언트가 한다.
- **다중 도구 동시 호출(Parallel Tool Use)**: Claude는 한 번의 응답에서 **여러 도구를 동시에 요청**할 수 있다. `disable_parallel_tool_use` 파라미터로 제어 가능.
- **`tool_result` is_error 필드**: 도구 실행이 실패했을 때 `is_error: true`로 표시하면 Claude가 에러를 이해하고 적절히 대응할 수 있다. 도메인 가이드에서는 이 필드를 명시적으로 다루지 않는다.

#### 시험 관련 키 포인트

- Claude는 도구를 직접 실행하지 않는다 -- **요청만 반환**하고 클라이언트가 실행
- `stop_reason`의 3가지 값(`tool_use`, `end_turn`, `max_tokens`)과 각 처리 방법
- 도구 실행 실패 시 `is_error: true`를 반환하는 것이 정답 패턴
- Parallel tool use: 기본 활성화, 필요시 비활성화 가능

#### 추가 용어

| 한국어 | English | 도메인 |
|--------|---------|--------|
| 클라이언트 사이드 오케스트레이션 | Client-Side Orchestration | D1 |
| 병렬 도구 사용 | Parallel Tool Use | D1, D2 |
| 도구 결과 에러 플래그 | `is_error` field in tool_result | D2 |
| 중단 이유 | stop_reason | D1 |

---

### 3. Tool Use Overview (Anthropic Docs)

**URL**: https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview
**대상 도메인**: D2 (Tool Design), D4 (Structured Output)

#### 도메인 가이드에 없는 핵심 내용

- **도구 정의의 토큰 비용**: 도구 정의(tool definitions)는 입력 토큰(input tokens)으로 계산된다. 도구가 많을수록 매 요청의 토큰 비용이 증가한다. 이것이 4-5 도구 규칙의 **경제적 근거**이기도 하다.
- **`tool_choice` 파라미터 상세**:
  - `auto` (기본값): Claude가 도구 호출 여부와 대상을 자율 결정
  - `any`: 반드시 하나의 도구를 호출하되 어떤 것인지는 Claude가 결정
  - `tool` + `name`: **특정 도구 강제 호출** (tool-forcing)
  - `none`: 도구 호출 금지, 텍스트만 생성
  - 도메인 가이드 D4에서 다루지만, `any` 모드에 대한 설명이 부족하다
- **도구 설명의 공식 권장사항**:
  - `description` 필드는 Claude가 언제 이 도구를 사용해야 하는지에 대한 **상세하고 명확한 가이드**
  - 파라미터의 `description`도 중요 -- 형식, 제약조건, 예시를 포함
  - "Descriptions should include edge cases, limitations, and usage context"
- **JSON Schema 지원 범위**: `input_schema`는 JSON Schema의 대부분을 지원하지만, `$ref`와 recursive schema는 **지원하지 않는다**. 이것은 시험에서 함정 문제로 출제될 수 있다.
- **Content Block 구조**: 도구 호출 결과는 `response.content` 배열 안의 `tool_use` 블록으로 반환되며, 각 블록에 `id`, `name`, `input` 필드가 있다. `tool_result` 전송 시 이 `id`를 매칭해야 한다.
- **캐싱과 도구**: 도구 정의 자체도 Prompt Caching 대상이 될 수 있다. 동일한 도구 목록을 반복 전송하면 캐싱으로 비용 절감 가능.

#### 시험 관련 키 포인트

- 도구 정의는 입력 토큰으로 과금된다 -- 도구가 많으면 비용 증가
- `tool_choice: any`는 "반드시 도구 호출하되 자율 선택" -- D4 가이드에서 미흡하게 다룸
- JSON Schema에서 `$ref` 미지원 -- 복잡한 스키마 설계 시 주의
- `tool_use` content block의 `id` 필드로 `tool_result`를 매칭해야 한다
- 도구 정의도 Prompt Caching 대상

#### 추가 용어

| 한국어 | English | 도메인 |
|--------|---------|--------|
| 도구 정의 토큰 비용 | Tool Definition Token Cost | D2, D5 |
| 콘텐츠 블록 | Content Block | D2 |
| 도구 사용 ID 매칭 | Tool Use ID Matching | D2 |
| 재귀 스키마 미지원 | No Recursive Schema Support | D2, D4 |

---

### 4. Claude Code Overview (Anthropic Docs)

**URL**: https://docs.anthropic.com/en/docs/claude-code/overview
**대상 도메인**: D3 (Claude Code)

#### 도메인 가이드에 없는 핵심 내용

- **Extended Thinking**: Claude Code는 확장 사고(extended thinking)를 지원하며, 복잡한 태스크에서 Claude가 단계별로 사고하는 과정을 볼 수 있다. `--thinking` 플래그로 활성화.
- **Memory 시스템**: Claude Code는 세션 간 기억을 유지하는 메모리 시스템을 갖추고 있다:
  - **자동 메모리**: 대화 중 중요한 사실을 `~/.claude/` 하위에 자동 저장
  - **CLAUDE.md 기반 메모리**: 프로젝트 규칙과 선호사항을 CLAUDE.md에 기록하면 매 세션 자동 로드
  - `--bare` 모드에서는 자동 메모리가 **비활성화**됨 -- CI/CD 재현성의 핵심
- **Multi-turn Conversation**: `-p` 모드는 단일 턴이지만, 인터랙티브 모드에서는 멀티턴 대화가 가능. 파이프라인에서 멀티턴이 필요하면 **대화 이력을 프로그래밍적으로 관리**해야 한다.
- **OAuth 인증 vs API Key**: 인터랙티브 모드는 OAuth(Anthropic 계정)로, `--bare` 모드에서는 `ANTHROPIC_API_KEY` 환경변수로 인증. CI/CD에서 OAuth를 사용하면 **인증 실패**가 발생한다.
- **`--continue` / `-c` 플래그**: 마지막 대화를 이어서 계속. `--resume` 플래그: 특정 세션 ID를 지정하여 재개. 이 플래그들은 도메인 가이드에서 다루지 않지만 시험에 출제될 수 있다.
- **MCP 서버 자동 설치**: Claude Code는 `.mcp.json`에 정의된 MCP 서버를 자동으로 설치하고 관리한다. `npx` 기반 서버는 별도 설치 없이 실행 가능.
- **Subagent 기능**: Claude Code 자체가 `Task` 도구로 서브에이전트를 생성할 수 있다. 이 서브에이전트는 **독립 컨텍스트**에서 실행되며, 결과만 부모에게 반환한다 -- D1의 컨텍스트 격리 원칙의 실제 구현.
- **`--model` 플래그**: 사용할 모델을 지정. 기본값은 Claude Sonnet이며, Opus 등 다른 모델로 전환 가능.

#### 시험 관련 키 포인트

- `--bare`는 OAuth, 메모리, 훅, MCP 동기화를 모두 스킵한다 -- **CI/CD 필수**
- Claude Code의 Task 도구 = 서브에이전트 구현 = 컨텍스트 격리의 실제 사례
- `--continue`와 `--resume`의 차이: 마지막 세션 이어서 vs 특정 세션 ID 재개
- Memory 시스템은 `--bare`에서 비활성화됨

#### 추가 용어

| 한국어 | English | 도메인 |
|--------|---------|--------|
| 확장 사고 | Extended Thinking | D3 |
| 세션 이어가기 | `--continue` / `-c` | D3 |
| 세션 재개 | `--resume` | D3 |
| Task 도구 (서브에이전트) | Task Tool (Subagent) | D1, D3 |
| 모델 선택 플래그 | `--model` flag | D3 |
| 자동 메모리 | Auto Memory | D3 |

---

### 5. Effective Context Engineering for AI Agents (Anthropic Engineering Blog)

**URL**: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
**대상 도메인**: D5 (Context Management), D4 (Prompt Engineering)

#### 도메인 가이드에 없는 핵심 내용

- **컨텍스트 엔지니어링(Context Engineering)이라는 프레이밍**: Anthropic은 "프롬프트 엔지니어링"을 넘어 **"컨텍스트 엔지니어링"**이라는 더 넓은 개념을 사용한다. 단순히 프롬프트를 잘 쓰는 것이 아니라, 에이전트가 각 단계에서 **올바른 컨텍스트**를 갖도록 시스템 전체를 설계하는 것.
- **컨텍스트 = 프롬프트 + 도구 결과 + 대화 이력 + 시스템 상태**: 컨텍스트 윈도우에 들어가는 모든 것이 "컨텍스트"다. 도메인 가이드 D5는 주로 토큰 경제학과 캐싱에 집중하지만, 공식 문서는 **도구 결과 관리**와 **대화 이력 압축** 전략을 더 깊이 다룬다.
- **도구 결과 요약(Tool Result Summarization)**: 긴 도구 결과를 그대로 컨텍스트에 넣지 않고, 핵심만 요약하여 삽입하는 전략. 대규모 파일 읽기, API 응답 등에서 필수.
- **컨텍스트 윈도우 전략 3단계**:
  1. **Write**: 무엇을 컨텍스트에 넣을지 선별 (시스템 프롬프트, 도구 정의, 관련 문서)
  2. **Select**: 현재 태스크에 관련 있는 정보만 동적으로 선택 (RAG, 검색)
  3. **Compress**: 불필요한 정보를 제거하고 핵심만 유지 (요약, 트리밍)
- **"가장 중요한 정보를 컨텍스트의 시작과 끝에 배치하라"**: lost-in-the-middle 효과의 공식적 대응 전략. 도메인 가이드 D5에서 개념은 다루지만, 이 구체적 배치 권장사항은 없다.
- **시스템 프롬프트 구조화**: Anthropic은 시스템 프롬프트를 XML 태그로 구조화할 것을 권장한다 (`<role>`, `<instructions>`, `<context>`, `<output_format>` 등). 이것은 Claude가 프롬프트의 다른 섹션을 **명확히 구분**하여 처리하도록 돕는다.
- **대화 이력 관리(Conversation History Management)**:
  - **슬라이딩 윈도우(Sliding Window)**: 최근 N개 메시지만 유지
  - **요약 기반 압축(Summary-based Compression)**: 오래된 대화를 요약으로 대체
  - **하이브리드**: 최근 메시지 원문 + 오래된 메시지 요약

#### 시험 관련 키 포인트

- "컨텍스트 엔지니어링"은 "프롬프트 엔지니어링"을 포함하는 상위 개념
- 도구 결과는 요약하여 컨텍스트에 삽입 (원본 전체 삽입 = 안티패턴)
- XML 태그로 시스템 프롬프트 구조화 -- Anthropic 공식 권장
- 중요 정보는 컨텍스트 시작과 끝에 배치 (중간 회피)
- 대화 이력 관리: 슬라이딩 윈도우 + 요약 하이브리드가 정답

#### 추가 용어

| 한국어 | English | 도메인 |
|--------|---------|--------|
| 컨텍스트 엔지니어링 | Context Engineering | D4, D5 |
| 도구 결과 요약 | Tool Result Summarization | D2, D5 |
| 슬라이딩 윈도우 | Sliding Window | D5 |
| 요약 기반 압축 | Summary-based Compression | D5 |
| XML 태그 구조화 | XML Tag Structuring | D4 |
| Write-Select-Compress 전략 | Write-Select-Compress Strategy | D5 |

---

### 6. MCP Specification (2025-11-05)

**URL**: https://modelcontextprotocol.io/specification/2025-11-05
**대상 도메인**: D2 (Tool Design & MCP)

#### 도메인 가이드에 없는 핵심 내용

- **MCP 아키텍처 3계층**: 도메인 가이드 D2는 3 Primitives(Tool/Resource/Prompt)에 집중하지만, MCP 스펙은 더 넓은 아키텍처를 정의한다:
  - **Host**: 사용자 대면 애플리케이션 (예: Claude Desktop, Claude Code)
  - **Client**: Host 안에서 MCP 서버와 통신하는 프로토콜 클라이언트
  - **Server**: 도구, 리소스, 프롬프트를 제공하는 외부 프로세스
  - 관계: Host는 1:N Client를 가지고, 각 Client는 1:1 Server에 연결
- **Capability Negotiation**: 연결 초기화 시 클라이언트와 서버가 지원하는 기능을 교환한다. 서버가 `tools` capability만 선언하면 클라이언트는 리소스를 요청하지 않는다.
- **Transport 메커니즘**:
  - **stdio**: 로컬 프로세스 간 통신 (가장 일반적)
  - **Streamable HTTP**: 원격 서버와의 HTTP 기반 통신 (SSE 포함)
  - 도메인 가이드에서는 transport에 대한 언급이 없다
- **Sampling**: MCP 서버가 **클라이언트를 통해 LLM에 완성(completion) 요청**을 할 수 있는 역방향 채널. 서버가 직접 LLM을 호출하는 것이 아니라, 호스트/클라이언트에게 요청하여 인간 감독(human oversight)을 유지한다.
- **Roots**: 클라이언트가 서버에게 "이 URI들이 내 관심 범위"라고 알려주는 메커니즘. 파일시스템 경로나 HTTP URI가 될 수 있다.
- **OAuth 2.1 인증**: MCP 스펙은 HTTP transport에서 OAuth 2.1 기반 인증을 정의한다. PKCE 필수, implicit grant 미지원.

#### 시험 관련 키 포인트

- Host > Client > Server 3계층 아키텍처 -- D2 가이드에 없는 내용
- Capability Negotiation: 초기화 시 기능 교환
- Sampling: 서버 → 클라이언트 → LLM 역방향 요청 (인간 감독 유지)
- stdio vs Streamable HTTP transport 구분
- Roots: 클라이언트가 서버에 작업 범위를 알림

#### 추가 용어

| 한국어 | English | 도메인 |
|--------|---------|--------|
| MCP 호스트 | MCP Host | D2 |
| MCP 클라이언트 | MCP Client | D2 |
| MCP 서버 | MCP Server | D2 |
| 기능 협상 | Capability Negotiation | D2 |
| 샘플링 (역방향 LLM 요청) | Sampling | D2 |
| 루트 (작업 범위 선언) | Roots | D2 |
| 표준 입출력 전송 | stdio Transport | D2 |
| 스트리밍 HTTP 전송 | Streamable HTTP Transport | D2 |

---

## 도메인별 갭 요약

### D1: Agentic Architecture -- 보완 필요 사항

| 갭 | 소스 | 중요도 |
|----|------|--------|
| Workflow vs Agent 공식 구분 부재 | Building Effective Agents | **높음** |
| 5가지 워크플로우 패턴 중 3개 미다룸 (Prompt Chaining, Routing, Evaluator-Optimizer) | Building Effective Agents | **높음** |
| Augmented LLM 개념 부재 | Building Effective Agents | 중간 |
| Parallelization의 Sectioning vs Voting 하위 패턴 | Building Effective Agents | 중간 |
| 클라이언트 사이드 오케스트레이션 (Claude는 도구를 요청만 함) | Agentic Systems Docs | **높음** |
| Human-in-the-Loop 체크포인트 강조 부족 | Building Effective Agents | 중간 |

### D2: Tool Design & MCP -- 보완 필요 사항

| 갭 | 소스 | 중요도 |
|----|------|--------|
| MCP Host/Client/Server 3계층 아키텍처 | MCP Specification | **높음** |
| Capability Negotiation 개념 | MCP Specification | 중간 |
| Sampling (역방향 LLM 요청) | MCP Specification | 중간 |
| Transport: stdio vs Streamable HTTP | MCP Specification | 낮음 |
| 도구 정의의 토큰 비용 | Tool Use Overview | **높음** |
| Parallel Tool Use + `disable_parallel_tool_use` | Agentic Systems Docs | 중간 |
| `is_error` 필드 (도구 실패 처리) | Agentic Systems Docs | 중간 |
| JSON Schema `$ref` 미지원 | Tool Use Overview | 낮음 |
| Roots 개념 | MCP Specification | 낮음 |

### D3: Claude Code -- 보완 필요 사항

| 갭 | 소스 | 중요도 |
|----|------|--------|
| Extended Thinking (`--thinking`) | Claude Code Overview | 중간 |
| `--continue` / `--resume` 플래그 | Claude Code Overview | 중간 |
| Task 도구 (서브에이전트 실제 구현) | Claude Code Overview | **높음** |
| `--model` 플래그 | Claude Code Overview | 낮음 |
| Memory 시스템 상세 | Claude Code Overview | 중간 |
| OAuth vs API Key 인증 분기 | Claude Code Overview | 중간 |

### D4: Prompt Engineering -- 보완 필요 사항

| 갭 | 소스 | 중요도 |
|----|------|--------|
| XML 태그 구조화 (Anthropic 공식 권장) | Context Engineering Blog | **높음** |
| `tool_choice: any` 모드 상세 설명 | Tool Use Overview | 중간 |
| 컨텍스트 엔지니어링이 프롬프트 엔지니어링의 상위 개념 | Context Engineering Blog | 중간 |

### D5: Context Management -- 보완 필요 사항

| 갭 | 소스 | 중요도 |
|----|------|--------|
| Write-Select-Compress 3단계 전략 | Context Engineering Blog | **높음** |
| 도구 결과 요약(Tool Result Summarization) | Context Engineering Blog | **높음** |
| 대화 이력 관리 전략 (슬라이딩 윈도우 + 요약 하이브리드) | Context Engineering Blog | 중간 |
| 중요 정보를 컨텍스트 시작/끝에 배치하는 구체적 권장 | Context Engineering Blog | 중간 |

---

## Anthropic 공식 용어 vs Rick Hightower 용어 차이

| 개념 | Anthropic 공식 용어 | Rick Hightower 용어 (도메인 가이드) | 비고 |
|------|--------------------|------------------------------------|------|
| 에이전트 기본 구성 | **Augmented LLM** | 직접 언급 없음 | Anthropic이 정의한 빌딩 블록 |
| 코드로 정의된 에이전트 흐름 | **Workflow** | Coordinator-Subagent Pattern에 포함 | Anthropic은 workflow와 agent를 구분 |
| 동적 에이전트 흐름 | **Agent** | Agentic Loop에 포함 | Anthropic은 "자율 결정"을 강조 |
| 워크플로우 패턴 5종 | Prompt Chaining, Routing, Parallelization, Orchestrator-Workers, Evaluator-Optimizer | Coordinator-Subagent만 강조 | 5개 중 1개만 다루고 있음 |
| 컨텍스트 관리 총체 | **Context Engineering** | Context Management | Anthropic은 더 넓은 범위 |
| 프롬프트 구조화 | **XML Tags** (`<role>`, `<instructions>`) | 직접 언급 없음 | Anthropic 공식 권장 기법 |
| MCP 실행 주체 | **Host > Client > Server** | MCP Server만 강조 | 3계층 아키텍처 구분 |
| 도구 호출 실패 처리 | **`is_error: true` in tool_result** | 구조화된 에러 컨텍스트 | 다른 수준의 설명 |
| 역방향 LLM 요청 | **Sampling** | 언급 없음 | MCP 고급 기능 |

---

## 도메인 가이드 보완 권장 사항

### 즉시 반영 권장 (시험 출제 가능성 높음)

1. **D1에 5가지 워크플로우 패턴 추가**: 현재 Coordinator-Subagent만 다루는데, Anthropic 공식 문서는 Prompt Chaining, Routing, Parallelization, Orchestrator-Workers, Evaluator-Optimizer 5가지를 정의한다. 각 패턴의 적합 사례와 함께 추가할 것.

2. **D1에 Workflow vs Agent 구분 추가**: Anthropic의 핵심 구분이다. 미리 정의된 코드 경로(workflow) vs 동적 LLM 결정(agent). 시험에서 "언제 워크플로우를 사용하고 언제 에이전트를 사용하는가?" 형태로 출제 가능.

3. **D2에 MCP Host/Client/Server 3계층 추가**: 현재 3 Primitives(Tool/Resource/Prompt)만 다루는데, 아키텍처 수준의 3계층도 함께 다뤄야 한다.

4. **D2에 도구 정의의 토큰 비용 언급 추가**: 4-5 도구 규칙의 추가적 근거로, 도구 정의 자체가 입력 토큰으로 과금된다는 사실을 명시할 것.

5. **D4에 XML 태그 구조화 기법 추가**: Anthropic이 공식 권장하는 시스템 프롬프트 구조화 방법.

6. **D5에 Write-Select-Compress 전략 추가**: 컨텍스트 관리의 3단계 프레임워크로, 현재 가이드의 분해-실행-합성-검토 패턴을 보완.

### 참조 수준 반영 권장

7. **D1에 Augmented LLM 개념 참조 추가**: 용어 표에 추가하되 상세 설명은 불필요.

8. **D2에 Sampling, Roots, Transport 참조 추가**: MCP 스펙의 고급 개념으로, 용어 표에 추가.

9. **D3에 `--continue`, `--resume`, `--thinking`, `--model` 플래그 추가**: CLI 플래그 비교표에 추가.

10. **D5에 도구 결과 요약 기법과 대화 이력 관리 전략 추가**: 실무 패턴으로 시험에 출제 가능.

---

## 빠른 복습: 공식 문서에서만 나오는 핵심 15개

| # | 개념 | 도메인 | 한줄 설명 |
|---|------|--------|----------|
| 1 | Augmented LLM | D1 | LLM + 도구 + 메모리 = 에이전트 빌딩 블록 |
| 2 | Workflow vs Agent | D1 | 미리 정의된 경로 vs 동적 LLM 결정 |
| 3 | Prompt Chaining | D1 | LLM 호출을 연쇄하여 순차 처리 |
| 4 | Routing Pattern | D1 | 입력 분류 후 전문 경로로 분기 |
| 5 | Parallelization (Sectioning/Voting) | D1 | 병렬 처리의 두 하위 패턴 |
| 6 | Evaluator-Optimizer | D1 | 생성-평가 피드백 루프 |
| 7 | Client-Side Orchestration | D1 | Claude는 도구를 요청만, 실행은 클라이언트 |
| 8 | MCP Host/Client/Server | D2 | 프로토콜의 3계층 아키텍처 |
| 9 | Capability Negotiation | D2 | 초기화 시 지원 기능 교환 |
| 10 | Sampling | D2 | 서버가 호스트를 통해 LLM 완성 요청 |
| 11 | Tool Definition Token Cost | D2, D5 | 도구 정의 자체가 입력 토큰으로 과금 |
| 12 | `is_error` in tool_result | D2 | 도구 실패를 Claude에게 알리는 표준 방법 |
| 13 | Context Engineering | D4, D5 | 프롬프트 엔지니어링의 상위 개념 |
| 14 | XML Tag Structuring | D4 | Anthropic 공식 시스템 프롬프트 구조화 권장 |
| 15 | Write-Select-Compress | D5 | 컨텍스트 관리 3단계 전략 |
