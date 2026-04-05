# Domain 2: Tool Design & MCP Integration

> **가중치 18%** | 예상 ~11문항 | **다크호스 도메인** — 가중치 대비 예상 외 실점이 가장 큰 영역

---

## 1. 도메인 개요

### 무엇을 테스트하는가

Tool Design & MCP Integration 도메인은 Claude가 도구를 **선택**하고 **실행**하는 메커니즘, MCP(Model Context Protocol)의 구조적 이해, 그리고 도구 설계의 모범 사례를 평가한다.

> **English (Exam Vocabulary)**: This domain tests your ability to design tool interfaces that Claude can reliably select and execute, configure MCP servers with proper scoping, and architect toolsets that maintain selection accuracy at scale.

### 왜 "다크호스"인가

초기 응시자 피드백에 따르면 **MCP Tool 경계(Tool vs Resource boundary)**에서 가장 많은 예상 외 실점이 발생한다. 18%라는 가중치에 비해 **6-8시간**의 학습 시간을 투자해야 한다.

| 핵심 테스트 영역 | 출제 빈도 | 시나리오 연결 |
|----------------|----------|-------------|
| MCP 3 Primitives (Tool / Resource / Prompt) | ★★★ | 멀티에이전트 리서치, 고객 지원 |
| Tool Description = Routing Mechanism | ★★★ | 개발자 생산성, 고객 지원 |
| 4-5 Tool Principle | ★★★ | 모든 시나리오 |
| MCP Configuration Scoping | ★★★ | 개발자 생산성 |
| Tool Sandboxing & Least Privilege | ★★ | 고객 지원 |
| Input Schema Design | ★★ | 구조화된 데이터 추출 |

---

## 2. 핵심 개념

### 2.1 MCP 3 Primitives (Tool / Resource / Prompt)

MCP의 세 가지 프리미티브는 에이전트가 외부 세계와 상호작용하는 방식을 정의한다. 시험에서 이 셋의 **경계를 정확히 구분**하는 것이 핵심 스킬이다.

> **English (Exam Vocabulary)**: MCP defines three primitives — Tools (executable functions), Resources (read-only data), and Prompts (reusable templates). The Tool vs Resource boundary is the core skill tested in this domain.

| 프리미티브 | 비유 | 목적 | 판별 질문 |
|-----------|------|------|----------|
| **Tool** (도구) | **동사** (verb) | 실행 가능한 함수 — DB 쿼리, API 호출, 파일 쓰기 | "Claude가 무언가를 **실행**해서 **변화**를 일으켜야 하는가?" → Tool |
| **Resource** (리소스) | **명사** (noun) | 읽기 전용 데이터 — 문서, 스키마, 지식 베이스 | "Claude가 맥락을 위해 이것을 **읽기만** 하면 되는가?" → Resource |
| **Prompt** (프롬프트) | **패턴** (pattern) | 재사용 가능한 템플릿/워크플로우 | "이것이 반복적으로 사용되는 **작업 패턴**인가?" → Prompt |

**시험 함정**: "고객 프로필 조회"가 Tool인지 Resource인지 혼동. **데이터베이스에서 조회(실행)**하면 Tool, **이미 로드된 데이터를 참조(읽기)**하면 Resource.

**암기법**: "동사, 명사, 패턴" — Tools = verbs, Resources = nouns, Prompts = patterns

```mermaid
graph TD
    MCP[MCP Protocol]
    MCP --> T["🔧 Tool<br/>(동사/Verb)<br/>실행 가능한 함수"]
    MCP --> R["📄 Resource<br/>(명사/Noun)<br/>읽기 전용 데이터"]
    MCP --> P["📋 Prompt<br/>(패턴/Pattern)<br/>재사용 템플릿"]

    T --> T1["DB 쿼리 실행"]
    T --> T2["API 호출"]
    T --> T3["파일 쓰기"]

    R --> R1["문서/스키마"]
    R --> R2["지식 베이스"]
    R --> R3["설정 카탈로그"]

    P --> P1["코드 리뷰 템플릿"]
    P --> P2["분석 워크플로우"]
    P --> P3["보고서 생성 패턴"]

    style T fill:#e74c3c,color:#fff
    style R fill:#3498db,color:#fff
    style P fill:#2ecc71,color:#fff
```

---

### 2.2 Tool Description as Routing (Description-Discernment Loop)

Claude는 도구를 **이름**이 아닌 **설명(description)**으로 선택한다. 설명이 곧 라우팅 테이블이다.

> **English (Exam Vocabulary)**: Claude selects tools based on their **descriptions**, not their names. The description is the routing table. Vague descriptions cause misrouting; specific descriptions enable accurate selection.

#### 나쁜 설명 vs 좋은 설명

```json
// BAD — 모호한 설명 (misrouting 유발)
{
  "name": "analyze",
  "description": "Analyzes stuff"
}

// GOOD — 구체적 설명 (정확한 라우팅)
{
  "name": "python_static_analyzer",
  "description": "Performs static analysis on Python source files, identifying type errors, unused imports, and style violations. Returns results with line numbers and severity ratings. Does NOT execute code or modify files."
}
```

#### 좋은 도구 설명의 4요소

| 요소 | 설명 | 예시 |
|------|------|------|
| **긍정 경계** (Positive bounds) | 도구가 **하는 것** | "Python 소스 파일에 정적 분석 수행" |
| **부정 경계** (Negative bounds) | 도구가 **하지 않는 것** | "코드를 실행하거나 파일을 수정하지 않음" |
| **입력 명세** | 무엇을 받는지 | "customer_id를 입력으로 받아" |
| **출력 명세** | 무엇을 반환하는지 | "줄 번호와 심각도 등급이 포함된 결과 반환" |

#### Description-Discernment Loop

일회성 개선이 아닌 **반복적 피드백 루프**가 정답 패턴이다.

> **English (Exam Vocabulary)**: The Description-Discernment loop is an iterative improvement cycle: Description (CLAUDE.md, skills, tool descriptions) → Claude generates output → Discernment (code review, tests) → Update Description → Repeat. The loop answer is almost always more correct than the one-shot answer.

```
Description (도구 설명, CLAUDE.md, 스킬)
     │
     ▼
Claude가 도구 선택 및 출력 생성
     │
     ▼
Discernment (코드 리뷰, 테스트, 아키텍처 리뷰)
     │
     ▼
판별 결과로 Description 업데이트
     │
     ▼
(반복)
```

**시험 팁**: "프롬프트만 한 번 수정"하는 답변 vs "피드백 루프로 지속 개선"하는 답변 → **항상 루프가 정답**.

---

### 2.3 Tool Count Threshold (4-5 → Split Signal)

에이전트당 **4-5개 도구**가 최적이다. 이를 초과하면 **주의력 세금(attention tax)**이 발생하여 도구 선택 정확도가 저하된다.

> **English (Exam Vocabulary)**: The architectural best practice is 4-5 tools per agent. When tool count exceeds this threshold, selection accuracy degrades due to **attention tax**. The solution is not "write a better prompt" — it is to split into specialized subagents. This is an architectural principle, NOT an SDK hard limit.

| 도구 수 | 상태 | 대응 |
|---------|------|------|
| 4-5개 | 최적 | 도구 설명 구체화로 미세 조정 |
| 6-10개 | 주의 | 설명 개선으로 해결 가능하지만 분할 검토 |
| 12+개 | 분할 필수 | 코디네이터-서브에이전트 패턴으로 분리 |
| 15+개 | 안티패턴 | "Swiss Army Agent" / "Super Agent" 안티패턴 |

```mermaid
flowchart TD
    START["에이전트의 도구 수 확인"] --> CHECK{도구 수가<br/>4-5개 이하?}
    CHECK -->|Yes| OK["✅ 최적 상태<br/>도구 설명 구체화로 미세 조정"]
    CHECK -->|No| MISROUTE{"도구 오라우팅<br/>발생 여부?"}
    MISROUTE -->|No| MONITOR["⚠️ 모니터링<br/>설명 개선으로 대응"]
    MISROUTE -->|Yes| SPLIT["🔀 서브에이전트로 분할<br/>코디네이터-서브에이전트 패턴"]
    SPLIT --> SUB1["서브에이전트 A<br/>4-5개 전문 도구"]
    SPLIT --> SUB2["서브에이전트 B<br/>4-5개 전문 도구"]
    SPLIT --> SUB3["서브에이전트 C<br/>4-5개 전문 도구"]

    style OK fill:#2ecc71,color:#fff
    style MONITOR fill:#f39c12,color:#fff
    style SPLIT fill:#e74c3c,color:#fff
```

**핵심 구분**: 이 제한은 **SDK 기술적 제약이 아닌 아키텍처 설계 원칙**이다. "SDK가 도구 수를 제한한다"는 항상 오답.

**두 가지 이유로 분할이 정답**:
1. **도구 선택 정확도 저하**: 15+ 도구에서 Claude가 매 턴마다 더 많은 옵션을 평가해야 해서 오선택 확률 증가
2. **최소 권한 원칙(Least Privilege)**: 고객 지원 에이전트가 HR 정책이나 마케팅 데이터에 접근 가능하면 보안/컴플라이언스 리스크

---

### 2.4 MCP Scoping (Project-level vs Global)

MCP 설정은 CLAUDE.md와 동일한 계층 원칙을 따른다: **팀 공유는 프로젝트 레벨**, **개인 비밀은 사용자 레벨**.

> **English (Exam Vocabulary)**: MCP server configuration follows a layered scoping principle. Server definitions (without secrets) go in `.mcp.json` (project-level, version-controlled). Credentials go in `~/.claude.json` (user-level, not version-controlled) or environment variables.

| 파일 | 위치 | 목적 | VCS 대상 |
|------|------|------|----------|
| **`.mcp.json`** | 프로젝트 루트 | 팀 공유 MCP 서버 정의 | **Yes** |
| **`~/.claude.json`** | 홈 디렉토리 | 개인 MCP 서버 + **크레덴셜** | **No** |

#### 스코핑 의사결정 트리

```
1. 팀 전체가 이 서버를 사용하는가?
   └─ No → ~/.claude.json에 전부 정의
   └─ Yes ↓
2. 개인 크레덴셜이 필요한가?
   └─ No → .mcp.json에 전부 정의
   └─ Yes → 서버 정의(비밀 제외)는 .mcp.json, 크레덴셜은 ~/.claude.json 또는 환경변수
```

**암기법**: "정의는 팀에, 비밀은 나에게" (Definitions to team, secrets to me)

#### MCP 설정 예시

```json
// .mcp.json (프로젝트 루트, Git 추적)
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"  // 환경변수 참조, 값 직접 입력 금지
      }
    },
    "jira": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-jira"],
      "env": {
        "JIRA_API_TOKEN": "${JIRA_API_TOKEN}"  // 개인 토큰은 환경변수로
      }
    }
  }
}
```

```json
// ~/.claude.json (개인, Git 추적 안 함)
{
  "mcpServers": {
    "personal-notes": {
      "command": "npx",
      "args": ["-y", "my-personal-mcp-server"]
    }
  }
}
```

**시험 함정**:
- `.mcp.json`에 API 토큰을 직접 넣으면 → VCS에 크레덴셜 노출 (보안 위반)
- 모든 것을 `~/.claude.json`에 넣으면 → 팀원이 공유 서버에 접근 불가

---

### 2.5 Tool Sandboxing (Network, Filesystem Restrictions)

도구에 **최소 권한 원칙(Principle of Least Privilege)**을 적용한다. 에이전트가 필요 이상의 도구에 접근하면 보안 리스크가 발생한다.

> **English (Exam Vocabulary)**: Apply the principle of least privilege to agent toolsets. A customer support agent with access to HR policies or marketing data possesses capabilities it should never exercise. Scope creep creates security and compliance risk, especially against prompt injection attacks.

| 샌드박싱 영역 | 목적 | 예시 |
|-------------|------|------|
| **네트워크 제한** | 승인된 API만 호출 | 고객 지원 에이전트는 내부 API만, 외부 웹 크롤링 불가 |
| **파일시스템 제한** | 필요한 디렉토리만 접근 | 코드 생성 에이전트는 프로젝트 디렉토리만 |
| **도구 범위 제한** | 역할에 맞는 도구만 | 빌링 서브에이전트는 빌링 도구 4-5개만 |
| **실행 권한 제한** | 프로그래밍 훅으로 검증 | PostToolUse로 금액 한도 초과 검증 |

**시험 출제 패턴**: "고객 지원 에이전트에 15개 도구가 있고 HR 정책 조회도 포함" → 보안 리스크 + 도구 선택 정확도 저하, 두 가지 문제를 동시에 지적하는 답이 정답.

---

### 2.6 Input Schema Design (Strict Types, Validation)

도구의 입력 스키마는 Claude가 올바른 파라미터를 전달하도록 안내하는 **계약(contract)**이다.

> **English (Exam Vocabulary)**: Tool input schemas serve as contracts that guide Claude to provide correct parameters. Use strict types, required fields, and descriptive field descriptions to minimize misuse.

```json
{
  "name": "process_refund",
  "description": "Processes a refund for a verified customer purchase. Requires prior policy check. Amount must not exceed $500 without human approval.",
  "input_schema": {
    "type": "object",
    "properties": {
      "customer_id": {
        "type": "string",
        "description": "Unique customer identifier (format: CUS-XXXXX)"
      },
      "amount": {
        "type": "number",
        "description": "Refund amount in USD. Must be positive. Amounts > $500 trigger automatic escalation."
      },
      "reason": {
        "type": "string",
        "enum": ["defective_product", "wrong_item", "late_delivery", "other"],
        "description": "Categorized refund reason from approved list"
      },
      "order_id": {
        "type": "string",
        "description": "Associated order identifier (format: ORD-XXXXX)"
      }
    },
    "required": ["customer_id", "amount", "reason", "order_id"]
  }
}
```

**스키마 설계 원칙**:
- `required` 필드를 명시하여 필수 파라미터 누락 방지
- `enum`으로 허용값을 제한하여 자유 텍스트 입력 최소화
- `description`에 포맷, 제약조건, 단위를 포함
- 도구 설명에 **사전조건**(예: "Requires prior policy check")을 명시

---

## 3. 안티패턴 vs 정답 패턴

| # | 안티패턴 | 왜 실패하는가 | 정답 패턴 |
|---|---------|-------------|----------|
| 1 | **Swiss Army Agent**: 단일 에이전트에 15+개 도구 | 주의력 세금(attention tax)으로 도구 선택 정확도 저하 + 최소 권한 위반 | **4-5 tools + 전문 서브에이전트** 분할, 코디네이터 패턴 |
| 2 | **"더 나은 프롬프트"로 12개 도구의 오라우팅 해결** | 도구 수 자체가 문제인데 설명만 고치면 근본 원인 미해결 | 도구 수 **감소** + 서브에이전트 분할 (4-5개 이하에서만 설명 개선 유효) |
| 3 | **`.mcp.json`에 크레덴셜 포함** | VCS에 비밀값 노출 → 보안 위반 | 서버 정의는 `.mcp.json`, 크레덴셜은 `~/.claude.json` 또는 환경변수 |
| 4 | **Few-shot 예시로 도구 호출 순서 제어** | Few-shot은 출력 포맷에 유효하지만 도구 호출 시퀀스에는 무효 | **프로그래밍적 전제조건(preconditions)** 또는 단일 도구로 래핑 |
| 5 | **모호한 도구 설명 ("handles customer stuff")** | Claude가 설명 기반으로 라우팅하므로 모호하면 오선택 | **긍정 경계 + 부정 경계** 포함한 구체적 설명, 입출력 명세 포함 |

> **English (Exam Vocabulary)**: Anti-patterns — Swiss Army Agent (15+ tools), improving prompts instead of reducing tool count, credentials in version control, few-shot for tool ordering, vague tool descriptions. Correct patterns — 4-5 tools per agent, coordinator-subagent split, scoped credentials, programmatic preconditions, specific descriptions with positive and negative bounds.

---

## 4. 시험 빈출 용어 15개

| # | 한국어 | English Term | 시험 빈출도 | 설명 |
|---|--------|-------------|-----------|------|
| 1 | MCP 프리미티브 | **MCP Primitives** | ★★★ | Tools(동사), Resources(명사), Prompts(패턴) |
| 2 | 도구 설명 | **Tool Description** | ★★★ | Claude의 도구 선택 **라우팅 메커니즘** |
| 3 | 4-5개 도구 원칙 | **4-5 Tool Principle** | ★★★ | 에이전트당 최적 도구 수 |
| 4 | 주의력 세금 | **Attention Tax** | ★★★ | 도구 수 증가 시 매 선택의 인지적 비용 |
| 5 | MCP 스코핑 | **MCP Configuration Scoping** | ★★★ | .mcp.json(팀) vs ~/.claude.json(개인) |
| 6 | 도구 라우팅 | **Tool Routing** | ★★★ | 설명 기반 도구 선택 메커니즘 |
| 7 | 오라우팅 | **Misrouting** | ★★ | 부정확한 설명으로 잘못된 도구 호출 |
| 8 | 부정 경계 | **Negative Bounds** | ★★ | 도구 설명에서 "하지 않는 것" 명시 |
| 9 | 기술-판별 루프 | **Description-Discernment Loop** | ★★★ | 설명 → 출력 → 판별 → 업데이트 반복 |
| 10 | 슈퍼에이전트 안티패턴 | **Super Agent Anti-pattern** | ★★★ | 단일 에이전트에 과도한 도구 부여 |
| 11 | 최소 권한 원칙 | **Principle of Least Privilege** | ★★ | 역할에 필요한 도구만 부여 |
| 12 | 입력 스키마 | **Input Schema** | ★★ | 도구 파라미터의 타입, 필수값, 제약조건 |
| 13 | 코디네이터-서브에이전트 | **Coordinator-Subagent Pattern** | ★★★ | 허브앤스포크 도구 분산 아키텍처 |
| 14 | 프로그래밍적 강제 | **Programmatic Enforcement** | ★★★ | 훅으로 확정적 실행 (프롬프트의 확률적 실행과 대비) |
| 15 | Tool vs Resource 경계 | **Tool vs Resource Boundary** | ★★★ | 실행(Tool) vs 읽기(Resource) 판별 |
| 16 | MCP 호스트 | **MCP Host** | ★★★ | 사용자 대면 앱 (Claude Desktop, Claude Code) |
| 17 | MCP 클라이언트 | **MCP Client** | ★★★ | Host 안에서 MCP 서버와 통신하는 프로토콜 커넥터 |
| 18 | 기능 협상 | **Capability Negotiation** | ★★ | 연결 초기화 시 클라이언트-서버 지원 기능 교환 |
| 19 | 샘플링 | **Sampling** | ★★ | MCP 서버가 클라이언트를 통해 LLM에 역방향 요청 |
| 20 | 도구 정의 토큰 비용 | **Tool Definition Token Cost** | ★★★★ | 도구 정의가 입력 토큰으로 계산되어 비용 증가 |
| 21 | 병렬 도구 사용 | **Parallel Tool Use** | ★★★ | Claude가 한 번의 응답에서 여러 도구 동시 요청 |
| 22 | `is_error` 필드 | **is_error field** | ★★★ | 도구 실행 실패 시 에러를 Claude에 전달하는 필드 |

---

## 5. 예상 문제 7문항

### Q1. MCP Primitives 구분

**문제**: MCP 서버에서 "회사 환불 정책 문서를 참조"하는 기능과 "환불을 실행"하는 기능을 구현해야 합니다. 올바른 MCP 프리미티브 매핑은?

- A) 두 기능 모두 Tool로 구현
- B) 환불 정책 참조 = Tool, 환불 실행 = Resource
- C) 환불 정책 참조 = Resource, 환불 실행 = Tool
- D) 두 기능 모두 Resource로 구현

**정답**: **C**

> 환불 정책 문서는 읽기 전용 데이터이므로 **Resource(명사)**. 환불 실행은 시스템 상태를 변경하는 함수이므로 **Tool(동사)**. "실행해서 변화를 일으키는가?" → Tool, "읽기만 하면 되는가?" → Resource. A는 읽기 전용 데이터를 Tool로 만들어 불필요한 복잡성을 추가한다. B는 Tool과 Resource를 반대로 매핑했다.

---

### Q2. Tool Count & Misrouting

**문제**: QA 에이전트에 14개의 테스트 도구가 있습니다. "API 응답 검증" 도구 대신 "UI 렌더링 검증" 도구를 자주 잘못 선택합니다. 가장 효과적인 해결책은?

- A) 시스템 프롬프트에 "API 테스트 시 반드시 API 응답 검증 도구를 사용하라"는 지시 추가
- B) 각 도구의 설명을 더 구체적으로 개선
- C) QA 에이전트를 API 테스트 서브에이전트(4개 도구)와 UI 테스트 서브에이전트(4개 도구)로 분할하고, 각 도구 설명을 구체화
- D) 도구 이름을 더 명확하게 변경

**정답**: **C**

> 14개 도구는 4-5개 원칙을 크게 초과하여, 설명이 겹치는 도구 간 오라우팅이 구조적으로 발생한다. **서브에이전트 분할 + 구체적 도구 설명**이 근본 원인과 증상을 모두 해결한다. A는 프롬프트 기반으로 확률적이라 신뢰 불가. B는 4-5개 이하일 때만 유효한 접근. D는 Claude가 이름이 아닌 **설명**으로 도구를 선택하므로 효과 제한.

---

### Q3. MCP Scoping

**문제**: 팀이 GitHub MCP 서버와 Jira MCP 서버를 사용합니다. GitHub 서버는 팀 전체가 동일한 설정으로 접근하고, Jira 서버는 각 개발자의 개인 API 토큰이 필요합니다. 올바른 설정 방법은?

- A) 두 서버 모두 `.mcp.json`에 API 토큰 포함하여 정의
- B) 두 서버 모두 `~/.claude.json`에 정의
- C) GitHub는 `.mcp.json`에, Jira는 `~/.claude.json`에 전부 정의
- D) 두 서버 정의는 `.mcp.json`에, Jira API 토큰만 `~/.claude.json` 또는 환경변수에 분리

**정답**: **D**

> 서버 정의(비밀값 제외)는 팀 공유를 위해 `.mcp.json`에, 개인 크레덴셜은 `~/.claude.json` 또는 환경변수에 분리한다. A는 크레덴셜이 VCS에 노출. B는 팀원이 서버 정의를 공유할 수 없음. C는 Jira 서버 정의 자체를 팀이 공유할 수 없어 각 팀원이 개별 설정 필요.

---

### Q4. Tool Description & Negative Bounds

**문제**: 멀티에이전트 리서치 시스템에서 "웹 검색" 도구와 "문서 분석" 도구 간 오라우팅이 빈번합니다. 두 도구 모두 "정보를 찾는다"라는 설명만 있습니다. 가장 효과적인 개선 방법은?

- A) 도구 이름을 `web_search_tool`과 `document_analysis_tool`로 변경
- B) 시스템 프롬프트에 각 도구의 사용 시점을 few-shot 예시로 제공
- C) 각 도구 설명에 긍정 경계(하는 것)와 부정 경계(하지 않는 것)를 포함하여 구체화
- D) 두 도구를 하나로 합쳐 "정보 검색" 통합 도구로 만들기

**정답**: **C**

> 도구 설명이 라우팅 메커니즘이므로, **긍정 경계**(웹 검색: "실시간 인터넷 소스에서 최신 정보 검색") + **부정 경계**(웹 검색: "로컬 문서나 데이터베이스는 검색하지 않음")를 포함하면 Claude가 두 도구를 명확히 구분할 수 있다. A는 Claude가 이름이 아닌 설명으로 선택하므로 제한적. B는 few-shot이 도구 선택을 안정적으로 제어하지 못함. D는 기능 통합으로 정밀도 저하.

---

### Q5. Programmatic Enforcement vs Prompt

**문제**: 고객 지원 에이전트가 $500 초과 환불을 승인하지 않도록 해야 합니다. 에이전트의 시스템 프롬프트에 "환불 금액이 $500을 초과하면 반드시 에스컬레이션하라"고 작성했으나, 간헐적으로 무시됩니다. 가장 효과적인 해결책은?

- A) 시스템 프롬프트의 지시를 더 강조하여 재작성 (예: "절대로, 어떤 경우에도")
- B) 에이전트의 자체 보고 신뢰도(confidence)가 높으면 예외 허용
- C) PostToolUse 훅을 설정하여 `process_refund` 실행 후 금액이 $500 초과이면 자동 에스컬레이션
- D) 환불 도구의 입력 스키마에 최대값을 500으로 설정

**정답**: **C**

> 프롬프트는 **확률적(probabilistically)** 실행되어 컨텍스트 압박 시 생략 가능하지만, PostToolUse 훅은 **확정적(deterministically)** 실행된다. A는 강조해도 여전히 프롬프트 기반이라 간헐적 실패 반복. B는 자체 보고 신뢰도(self-reported confidence)는 보정되지 않은 값으로 금융 결정에 부적합. D는 스키마 제한만으로 실행을 막을 수 없으며 프로그래밍 레벨 검증이 필요.

---

### Q6. MCP 3계층 아키텍처

**문제**: MCP 아키텍처에서 Claude Desktop 앱이 GitHub MCP 서버와 Jira MCP 서버에 동시에 연결되어 있습니다. 이 아키텍처의 구성 요소 관계를 올바르게 설명한 것은?

- A) Claude Desktop(Host)이 하나의 Client를 통해 두 Server에 연결
- B) Claude Desktop(Host)이 두 개의 Client를 각각 하나의 Server에 연결 (Host 1:N Client, Client 1:1 Server)
- C) Claude Desktop(Client)이 두 개의 Host를 통해 Server에 연결
- D) GitHub Server와 Jira Server가 하나의 Client를 공유하여 Host에 연결

**정답**: **B**

> MCP 아키텍처는 Host, Client, Server 3계층으로 구성된다. Host(사용자 대면 앱)는 **여러 Client를 관리**하고, 각 Client는 **정확히 하나의 Server에 연결**된다. Claude Desktop이 Host이고, GitHub용 Client와 Jira용 Client가 각각 별도로 존재하며, 각 Client가 해당 Server에 1:1로 연결된다. A는 하나의 Client가 여러 Server에 연결되므로 틀림. C는 Host와 Client를 혼동. D는 Server가 Client를 공유할 수 없음.

---

### Q7. 도구 정의 토큰 비용

**문제**: 에이전트에 12개의 도구가 정의되어 있고, 매 API 호출 시 비용이 예상보다 높습니다. 도구 정의와 비용의 관계를 올바르게 설명한 것은?

- A) 도구 정의는 시스템 프롬프트와 별도로 처리되어 비용에 영향을 주지 않음
- B) 도구 정의는 입력 토큰으로 계산되며, 도구가 많을수록 매 요청의 비용이 증가함. Prompt Caching으로 비용을 줄일 수 있음
- C) 도구 정의는 출력 토큰으로 계산되어 도구 호출 시에만 비용 발생
- D) 도구 정의 비용은 최초 1회만 발생하고 이후 캐시됨

**정답**: **B**

> 도구 정의(tool definitions)는 **입력 토큰(input tokens)**으로 계산된다. 12개 도구의 이름, 설명, input_schema가 모두 매 요청에 포함되어 비용이 누적된다. 이것이 4-5개 도구 원칙의 **경제적 근거**이기도 하다. 도구 정의는 요청 간 변하지 않는 정적 콘텐츠이므로 **Prompt Caching** 대상이 되어 비용을 절감할 수 있다. A는 도구 정의가 비용에 영향을 주지 않는다고 하여 틀림. C는 입력이 아닌 출력 토큰이라고 하여 틀림. D는 자동 캐시가 아니라 Prompt Caching을 명시적으로 활용해야 함.

---

## 6. 코드 예제

### 6.1 잘 설계된 Tool Description (고객 지원 5개 도구)

```python
tools = [
    {
        "name": "lookup_customer",
        "description": (
            "Takes a customer_id as input and returns structured JSON containing "
            "purchase history, support ticket history, and account tier. "
            "Use this as the first step in every customer interaction. "
            "Does NOT modify customer data or process any transactions."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "customer_id": {
                    "type": "string",
                    "description": "Unique customer identifier (format: CUS-XXXXX)"
                }
            },
            "required": ["customer_id"]
        }
    },
    {
        "name": "check_policy",
        "description": (
            "Looks up refund policies, escalation rules, and compliance requirements "
            "for a given issue type and customer tier. Returns applicable policy rules "
            "as structured JSON. Must be called BEFORE process_refund. "
            "Does NOT execute refunds or modify account state."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "issue_type": {
                    "type": "string",
                    "enum": ["billing_dispute", "defective_product", "late_delivery", "wrong_item"]
                },
                "customer_tier": {
                    "type": "string",
                    "enum": ["standard", "premium", "vip"]
                }
            },
            "required": ["issue_type", "customer_tier"]
        }
    },
    {
        "name": "process_refund",
        "description": (
            "Executes a refund within authorization limits ($500 max without escalation). "
            "Requires prior check_policy call. Returns confirmation with transaction ID. "
            "Does NOT handle amounts over $500 — those trigger automatic escalation."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "customer_id": {"type": "string"},
                "amount": {"type": "number", "description": "Refund amount in USD (max $500)"},
                "reason": {"type": "string", "enum": ["defective_product", "wrong_item", "late_delivery", "other"]},
                "order_id": {"type": "string"}
            },
            "required": ["customer_id", "amount", "reason", "order_id"]
        }
    },
    {
        "name": "escalate_to_human",
        "description": (
            "Routes the interaction to a human agent with a structured context summary. "
            "Call when: refund > $500, account closure, legal complaint, VIP priority, "
            "or any issue exceeding agent authority. "
            "Does NOT resolve the issue — transfers ownership to human queue."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "customer_id": {"type": "string"},
                "escalation_reason": {"type": "string"},
                "summary": {"type": "string", "description": "Structured summary of interaction so far"},
                "priority": {"type": "string", "enum": ["normal", "high", "urgent"]}
            },
            "required": ["customer_id", "escalation_reason", "summary"]
        }
    },
    {
        "name": "log_interaction",
        "description": (
            "Records an audit log of the interaction including decisions made, "
            "tools called, and outcomes. Call as the LAST step of every interaction. "
            "Does NOT affect the interaction outcome — purely for compliance/audit."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "customer_id": {"type": "string"},
                "interaction_type": {"type": "string"},
                "actions_taken": {"type": "array", "items": {"type": "string"}},
                "outcome": {"type": "string"}
            },
            "required": ["customer_id", "interaction_type", "outcome"]
        }
    }
]
```

### 6.2 PostToolUse 훅 — 프로그래밍적 강제

```python
# PostToolUse callback — 프롬프트가 아닌 코드로 강제
def post_tool_use(tool_name, tool_input, tool_result):
    """확정적(deterministic) 실행: 프롬프트와 달리 절대 생략되지 않음"""
    
    if tool_name == "process_refund":
        amount = tool_input.get("amount", 0)
        if amount > 500:
            return {
                "action": "escalate",
                "reason": "refund_amount_exceeds_limit",
                "amount": amount,
                "limit": 500
            }
    
    return tool_result  # 한도 이내면 통과
```

### 6.3 MCP 설정 스코핑 — 올바른 구조

```json
// ✅ .mcp.json (프로젝트 루트, VCS 추적)
// 팀 전체가 공유하는 서버 정의 — 비밀값 없음
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

```json
// ❌ WRONG — .mcp.json에 크레덴셜 직접 포함
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

---

## 7. 빠른 복습 체크리스트

- [ ] MCP 3 Primitives: Tool(동사/실행), Resource(명사/읽기), Prompt(패턴/템플릿)
- [ ] Tool vs Resource 판별: "실행해서 변화?" → Tool, "읽기만?" → Resource
- [ ] 도구 설명 = 라우팅 메커니즘 (이름이 아닌 **설명** 기반)
- [ ] 좋은 도구 설명 = 긍정 경계 + 부정 경계 + 입출력 명세
- [ ] 에이전트당 4-5개 도구 (아키텍처 원칙, SDK 제한 아님)
- [ ] 12+개 도구 = 서브에이전트로 분할
- [ ] MCP 스코핑: 정의는 `.mcp.json`(팀), 비밀은 `~/.claude.json`(개인)
- [ ] Description-Discernment Loop: 일회성이 아닌 반복적 개선
- [ ] Few-shot: 출력 포맷에 유효, 도구 호출 순서에 무효
- [ ] 프롬프트 = 확률적, 훅 = 확정적 → 비즈니스 규칙은 항상 훅
- [ ] 최소 권한 원칙: 필요한 도구만 부여 (보안 + 정확도)
- [ ] "더 나은 프롬프트" 함정: 12+개 도구 문제는 프롬프트 개선이 아닌 분할로 해결
- [ ] Self-reported confidence 함정: 금융 결정에 사용하면 항상 오답
- [ ] MCP 3계층: Host(사용자 앱) → Client(프로토콜 커넥터) → Server(외부 프로세스)
- [ ] Host 1:N Client, Client 1:1 Server (Client는 Host 내부 커넥터)
- [ ] 도구 정의 = 입력 토큰 비용 → 도구 많으면 매 요청 비용 증가
- [ ] 도구 정의는 Prompt Caching 대상 (정적 콘텐츠)
- [ ] Capability Negotiation: 서버가 선언한 기능만 요청 가능
- [ ] Sampling: MCP 서버 → Client 경유 → LLM 역방향 요청 (직접 호출 아님)
- [ ] Transport: stdio(로컬), Streamable HTTP(원격)
- [ ] Parallel Tool Use: `disable_parallel_tool_use`로 제어
- [ ] `is_error: true`: 도구 실패 시 명시적 에러 시그널링
- [ ] `input_schema`에서 `$ref`, recursive schema 미지원

---

## 8. 외울 숫자

| 숫자 | 의미 |
|------|------|
| **3** | MCP 프리미티브 수 (Tools, Resources, Prompts) |
| **4-5** | 에이전트당 최적 도구 수 |
| **18%** | 이 도메인의 시험 가중치 |
| **~11** | 예상 출제 문항 수 |
| **15+** | 슈퍼에이전트 안티패턴의 도구 수 임계값 |
| **6-8시간** | 권장 학습 시간 (가중치 대비 높음) |
| **1:N:N** | Host 1 → Client N → Server N (MCP 3계층 관계) |
| **7** | 예상 문제 수 (기존 5 + 보완 2) |

---

## 9. 도메인 간 연결 (Cross-Domain Connections)

| 연결 | 이 도메인 (D2) | 다른 도메인 | 출제 시나리오 |
|------|---------------|-----------|-------------|
| 도구 분할 + 아키텍처 | Tool Count Principle | D1 Agentic Architecture | "오라우팅 해결" → 서브에이전트 분할 |
| MCP 스코핑 + 보안 | MCP Scoping | D3 Claude Code Workflows | "크레덴셜 관리" → 스코핑 분리 |
| 프롬프트 vs 훅 | Programmatic Enforcement | D4 Prompt Engineering | "규칙 강제 방법 선택" → 훅 |
| 도구 설명 + 컨텍스트 | Tool Description Routing | D5 Context Management | "컨텍스트 압박 시 도구 선택 저하" |
| Description-Discernment | D-D Loop | D4 Prompt Engineering | "팀 출력 일관성 개선" → 루프 |

---

## Anthropic 공식 문서 보완

> 이 섹션은 Anthropic 공식 문서에서 시험 출제 가능성이 높은 보완 내용을 정리한 것이다. 기존 도메인 가이드와 함께 학습할 것.

### A. MCP Host/Client/Server 3계층 아키텍처 (높은 중요도)

도메인 가이드의 3 Primitives(Tool/Resource/Prompt)에 추가하여 **아키텍처 수준 3계층**을 이해해야 한다.

- **Host**: 사용자 대면 앱 (Claude Desktop, Claude Code). 여러 Client를 관리하고, 보안 정책과 사용자 동의를 제어
- **Client**: Host 안에서 MCP 서버와 통신하는 프로토콜 클라이언트. 서버별로 독립된 연결 관리
- **Server**: 도구/리소스/프롬프트를 제공하는 외부 프로세스. 특정 기능에 집중

**관계**: Host 1:N Client, 각 Client 1:1 Server

```mermaid
graph TD
    HOST["🖥️ Host<br/>(Claude Desktop / Claude Code)<br/>사용자 대면 앱"]
    HOST --> CLIENT_A["🔌 Client A<br/>프로토콜 커넥터"]
    HOST --> CLIENT_B["🔌 Client B<br/>프로토콜 커넥터"]
    HOST --> CLIENT_C["🔌 Client C<br/>프로토콜 커넥터"]
    CLIENT_A --> SERVER_A["⚙️ Server A<br/>GitHub MCP<br/>(Tools + Resources)"]
    CLIENT_B --> SERVER_B["⚙️ Server B<br/>Jira MCP<br/>(Tools + Resources)"]
    CLIENT_C --> SERVER_C["⚙️ Server C<br/>Slack MCP<br/>(Tools + Prompts)"]

    style HOST fill:#8e44ad,color:#fff
    style CLIENT_A fill:#2980b9,color:#fff
    style CLIENT_B fill:#2980b9,color:#fff
    style CLIENT_C fill:#2980b9,color:#fff
    style SERVER_A fill:#27ae60,color:#fff
    style SERVER_B fill:#27ae60,color:#fff
    style SERVER_C fill:#27ae60,color:#fff
```

> **English (Exam Vocabulary)**: The MCP architecture has three layers: Host (user-facing app), Client (protocol connector inside Host), and Server (external process providing tools/resources/prompts). One Host manages multiple Clients, each connected to one Server.

**시험 팁**: "Host와 Client의 차이"를 묻는 문제에서, Client를 독립 앱으로 착각하면 오답. Client는 **Host 내부의 프로토콜 커넥터**이다.

---

### B. 도구 정의의 토큰 비용 (높은 중요도)

도구 정의(tool definitions)는 **입력 토큰(input tokens)**으로 계산된다. 도구가 많으면 매 요청의 비용이 증가한다. 이것이 4-5 도구 규칙의 **경제적 근거**이다.

| 도구 수 | 토큰 영향 | 비용 관리 |
|---------|----------|----------|
| 4-5개 | 최소 오버헤드 | 기본 설정으로 충분 |
| 10+개 | 상당한 토큰 증가 | Prompt Caching 필수 |
| 15+개 | 매 요청 대량 토큰 소비 | 서브에이전트 분할이 경제적 |

**핵심**: 도구 정의 자체도 **Prompt Caching** 대상이다. 도구 정의는 요청 간 변하지 않는 정적 콘텐츠이므로, 캐시를 통해 반복 비용을 크게 줄일 수 있다.

> **English (Exam Vocabulary)**: Tool definitions count as input tokens. More tools mean higher cost per request. Tool definitions are eligible for Prompt Caching since they are static content that doesn't change between requests.

---

### C. Capability Negotiation

연결 초기화 시 클라이언트와 서버가 **지원 기능(capabilities)**을 교환한다. 서버가 `tools` capability만 선언하면 클라이언트는 리소스를 요청하지 않는다.

```
Client → Server: initialize (client capabilities)
Server → Client: initialize response (server capabilities)
Client → Server: initialized (확인)
```

**실무 의미**: 서버가 지원하지 않는 기능을 요청하면 프로토콜 오류가 발생한다. 서버가 선언한 capability 범위 안에서만 통신이 이루어진다.

> **English (Exam Vocabulary)**: During connection initialization, the client and server exchange supported capabilities. If the server only declares `tools` capability, the client will not request resources. This prevents protocol errors from unsupported feature requests.

---

### D. Sampling (역방향 LLM 요청)

MCP 서버가 클라이언트를 통해 **LLM에 완성 요청(completion request)**을 하는 역방향 채널이다. 서버가 직접 모델에 접근하지 않고, **클라이언트(Host)를 경유**하여 인간 감독(human oversight)을 유지한다.

```
Server → Client: sampling/createMessage 요청
Client(Host): 사용자 승인 또는 자동 정책 적용
Client → LLM: 완성 요청
LLM → Client: 응답
Client → Server: 결과 반환
```

**시험 팁**: "MCP 서버가 LLM을 직접 호출한다" → **항상 오답**. 반드시 Client/Host를 경유하여 human-in-the-loop을 유지한다.

> **English (Exam Vocabulary)**: Sampling allows MCP servers to request LLM completions through the client, maintaining human oversight. The server never directly accesses the model — it goes through the client/host layer where human approval policies can be enforced.

---

### E. Transport 메커니즘

| Transport | 방식 | 용도 |
|-----------|------|------|
| **stdio** | 로컬 프로세스 간 stdin/stdout 통신 | 가장 일반적. 로컬 MCP 서버 실행 |
| **Streamable HTTP** | HTTP 기반 원격 통신 | 원격 서버, 클라우드 호스팅 MCP 서버 |

**시험 팁**: `.mcp.json`에서 `"command": "npx"`로 실행하는 로컬 서버는 **stdio** transport를 사용한다. 원격 MCP 서버 호스팅 시에는 **Streamable HTTP**를 사용한다.

> **English (Exam Vocabulary)**: MCP supports two transport mechanisms — stdio (local process communication via stdin/stdout, most common) and Streamable HTTP (remote server communication over HTTP).

---

### F. Parallel Tool Use

Claude는 한 번의 응답에서 **여러 도구를 동시에 요청**할 수 있다. 독립적인 도구 호출을 병렬로 실행하면 전체 응답 시간이 단축된다.

```python
# API 파라미터로 병렬 도구 사용 제어
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    tools=tools,
    tool_choice={"type": "auto", "disable_parallel_tool_use": False},  # 기본값: 병렬 허용
    messages=messages
)
```

- `disable_parallel_tool_use: true` → 한 번에 하나의 도구만 호출 (순차적 의존성이 있을 때)
- `disable_parallel_tool_use: false` (기본값) → 독립적인 도구들을 동시 호출

> **English (Exam Vocabulary)**: Claude can request multiple tool calls in a single response. Use `disable_parallel_tool_use` parameter to control this behavior. Parallel tool use reduces latency when tool calls are independent.

---

### G. `is_error` 필드

도구 실행 실패 시 `tool_result`에 `is_error: true`를 포함하면 Claude가 에러 상황을 이해하고 **적절한 대응**(재시도, 대안 도구 선택, 사용자에게 설명)을 할 수 있다.

```json
{
  "type": "tool_result",
  "tool_use_id": "toolu_01A09q90qw90lq917835lq9",
  "is_error": true,
  "content": "ConnectionError: the weather service API is not available (503)"
}
```

**핵심**: `is_error`를 설정하지 않고 에러 메시지만 반환하면, Claude가 이를 정상 결과로 해석할 수 있다. **명시적 에러 시그널링**이 중요하다.

> **English (Exam Vocabulary)**: When a tool execution fails, include `is_error: true` in the `tool_result` block. This signals Claude that the result is an error, enabling appropriate recovery behavior (retry, fallback, or user notification).

---

### H. JSON Schema `$ref` 미지원

`input_schema`는 JSON Schema 대부분의 기능을 지원하지만, **`$ref`와 recursive schema는 미지원**한다.

| 지원 | 미지원 |
|------|--------|
| `type`, `properties`, `required` | `$ref` (참조) |
| `enum`, `const` | Recursive schema (재귀) |
| `anyOf`, `oneOf` | |
| `description`, `default` | |

**시험 팁**: "복잡한 중첩 스키마를 `$ref`로 정의" → **오답**. 스키마를 인라인으로 풀어서 정의해야 한다.

> **English (Exam Vocabulary)**: Tool `input_schema` supports most JSON Schema features but does NOT support `$ref` (references) or recursive schemas. All schema definitions must be inlined.

---

*Generated: 2026-04-04 | Source: CCA Scenario Deep Dive Series (Rick Hightower)*
