# CCA Foundations 시험 필수 단어집

> **목적**: 실무에서 "아는 단어"인데 시험에서 정확한 정의를 요구하면 흔들리는 용어를 정리한다.
> 각 용어는 **한 줄 정의 → 시험에서 어떻게 출제되는가 → 흔한 오해**로 구성.
>
> 최종 업데이트: 2026-03-31

---

## Domain 1: Agentic Architecture and Orchestration (27%)

### Agentic Loop (에이전트 루프)
- **정의**: 입력 수신 → 추론 → 도구 호출 → 결과 평가 → 다음 단계 결정의 **반복 사이클**
- **시험 포인트**: 각 단계를 순서대로 나열할 수 있어야 한다. "결과 평가" 단계를 빠뜨리는 것이 흔한 실수
- **흔한 오해**: 단순 "입력 → 출력"이 아니다. **루프**(반복)라는 점이 핵심. 도구 결과를 평가한 뒤 계속할지 종료할지 **결정**하는 단계가 있다

### Coordinator-Subagent Pattern (코디네이터-서브에이전트 패턴)
- **정의**: 코디네이터 에이전트가 전문 서브에이전트에 작업을 **위임**하고, 결과를 **종합**하는 패턴
- **시험 포인트**: 서브에이전트는 컨텍스트를 자동 상속하지 않는다 (→ Context Forking 참조)
- **흔한 오해**: "코디네이터가 모든 작업을 순차 실행한다" → 틀림. 병렬 위임 가능. 핵심은 **위임 + 종합**

### Hub-and-Spoke Pattern (허브-앤-스포크 패턴)
- **정의**: 중앙 허브가 **독립적이고 의존성 없는** 작업을 병렬로 분배하는 패턴
- **시험 포인트**: Coordinator-Subagent와의 차이 = 서브에이전트 간 **의존성 유무**. Hub-and-Spoke는 의존성 없음
- **흔한 오해**: 모든 멀티에이전트 = Coordinator-Subagent라고 생각하는 것. 의존성이 없으면 Hub-and-Spoke가 적합

### Context Forking (컨텍스트 분기)
- **정의**: 하나의 대화 컨텍스트를 여러 서브에이전트에 **분기**하는 것
- **시험 포인트**: 분기 시 서브에이전트는 **빈 컨텍스트**로 시작. 필요한 정보를 **명시적으로 전달**해야 한다
- **⚠️ 가장 많이 시험되는 개념**: "같은 시스템 안의 에이전트는 인식을 공유한다"고 가정하면 오답

### Task Decomposition (작업 분해)
- **정의**: 복잡한 요청을 개별 에이전트가 처리할 수 있는 **독립적 하위 작업**으로 나누는 것
- **시험 포인트**: 적절한 **세분화 수준(granularity)**을 판단하는 능력. 너무 크면 에이전트가 처리 불가, 너무 작으면 오버헤드
- **흔한 오해**: "최대한 잘게 나누면 좋다" → 틀림. 에이전트 간 통신 비용이 있다

### Escalation Logic (에스컬레이션 로직)
- **정의**: 에이전트가 처리를 중단하고 사람이나 더 능력 있는 시스템에 **넘기는 규칙**
- **시험 포인트**: **결정론적 규칙**(deterministic rules)이 정답. 모델의 자체 판단(self-reported confidence)은 오답
- **흔한 오해**: "Claude가 '확신이 없다'고 하면 에스컬레이션" → 오답. LLM의 자체 신뢰도는 프로덕션 라우팅에 적합하지 않음

### Super Agent Anti-Pattern (슈퍼 에이전트 안티패턴)
- **정의**: 15개 이상의 도구를 가진 단일 에이전트. 도구 선택 정확도가 **측정 가능하게 저하**됨
- **시험 포인트**: 이 패턴이 보이는 선택지는 거의 항상 오답. 정답은 4-5개 도구를 가진 전문 서브에이전트로 분산
- **기준값**: 에이전트당 **4-5개** 도구 (Anthropic 공식 권장)

---

## Domain 2: Claude Code Configuration and Workflows (20%)

### CLAUDE.md Hierarchy (CLAUDE.md 계층)
- **정의**: 프로젝트 레벨(`.claude/CLAUDE.md`) vs 사용자 레벨(`~/.claude/CLAUDE.md`)
- **시험 포인트**: 프로젝트 레벨 = 버전 관리에 포함, 팀 전체 표준. 사용자 레벨 = 개인, 버전 관리 제외
- **안티패턴**: 개인 설정을 프로젝트 CLAUDE.md에 넣는 것 → 팀 전원에게 강제됨

### Plan Mode vs Direct Execution (계획 모드 vs 직접 실행)
- **Plan Mode**: 복잡한 멀티스텝 작업. Claude가 계획을 먼저 보여주고 승인 후 실행
- **Direct Execution**: 명확하고 저위험한 단일 작업. 즉시 실행
- **시험 포인트**: 시나리오에서 "복잡한 멀티파일 변경"이 나오면 Plan Mode가 정답. Direct로 하면 안티패턴

### `-p` Flag (비대화 모드 플래그)
- **정의**: Claude Code를 **비대화(non-interactive/headless)** 모드로 실행하는 플래그
- **시험 포인트**: CI/CD 파이프라인에서 필수. 없으면 대화형 프롬프트에서 **시스템이 멈춤(hang)**
- **⚠️ 빈출**: CI/CD 시나리오에서 `-p`가 빠진 선택지 = 오답

### `--bare` Flag
- **정의**: 자동 검색(auto-discovery)을 건너뛰고 **재현 가능한** 동작을 보장하는 플래그
- **시험 포인트**: CI/CD에서 `-p`와 함께 사용. 환경에 따라 동작이 달라지는 것을 방지
- **미래**: Anthropic이 `-p`의 기본값으로 만들 예정

### `--output-format json`
- **정의**: Claude Code 출력을 **구조화된 JSON**으로 받는 플래그. `text`, `json`, `stream-json` 모드
- **시험 포인트**: CI/CD 파이프라인에서 출력을 파싱해야 할 때 사용

### Custom Slash Commands / Skills (커스텀 슬래시 커맨드 / 스킬)
- **정의**: 마크다운 기반의 **재사용 가능한 워크플로우**
- **시험 포인트**: 존재를 아는 것이 아니라 **구조**를 아는지 시험한다

---

## Domain 3: Prompt Engineering and Structured Output (20%)

### tool_choice (도구 선택 제어)
- **정의**: API 파라미터. 도구 선택 방식을 제어
  - `auto`: 모델이 판단
  - `any`: 반드시 도구 사용
  - 특정 도구 이름: 해당 도구 강제 사용
- **시험 포인트**: JSON 출력 강제 시 **tool_choice + 입력 스키마**가 정답. 프롬프트로 "JSON만 출력해" = 오답
- **핵심**: 프롬프트는 "대부분" 동작. tool_choice는 "항상" 동작. 시험은 "항상"을 요구

### Structured Outputs API
- **정의**: `client.messages.parse()` + Pydantic 모델로 **프로그래밍적으로** 출력 형식을 강제
- **시험 포인트**: 베타 기능. `anthropic-beta: structured-outputs-2025-11-13` 헤더 필요
- **vs tool_choice**: 둘 다 정답이 될 수 있지만, Pydantic 모델이 있으면 Structured Outputs가 더 적합

### Validation-Retry Loop (검증-재시도 루프)
- **정의**: 출력을 스키마로 검증 → 실패 시 에러 메시지와 함께 Claude에 수정 요청 → 재시도
- **시험 포인트**: `tool_use` stop reason이 검증 시작 신호. 이 루프가 없는 것은 안티패턴
- **핵심 흐름**: API 호출 → 결과 수신 → 스키마 검증 → 실패 시 에러 컨텍스트와 함께 재호출

### Stop Reason (생성 중단 이유)
- **정의**: API가 생성을 왜 멈췄는지 알려주는 신호
  - `tool_use`: 도구 호출 대기 중 (결과를 돌려줘야 함)
  - `end_turn`: 응답 완료
  - `max_tokens`: 토큰 한도 도달
- **시험 포인트**: `tool_use` stop reason을 무시하면 도구 결과를 처리하지 못함. 반드시 확인해야 하는 값

### Few-Shot Prompting (퓨샷 프롬프팅)
- **정의**: 예시 입출력 쌍을 제공하여 Claude의 응답 형식을 유도하는 기법
- **시험 포인트**: 유용하지만 **프로그래밍적 강제의 대체가 아님**. tool_choice + few-shot 조합이 가장 신뢰

---

## Domain 4: Tool Design and MCP Integration (18%)

### MCP (Model Context Protocol)
- **정의**: AI 시스템을 외부 도구/데이터에 연결하는 Anthropic의 **오픈 표준**. 2024년 11월 출시
- **시험 포인트**: OpenAI, Google DeepMind도 채택. 업계 표준화 진행 중

### MCP Tool (MCP 도구)
- **정의**: 모델이 호출할 수 있는 **실행 가능한 함수**. DB 쿼리, API 호출, 파일 쓰기 등 **액션**
- **판별법**: "Claude가 이것을 **실행**해서 뭔가를 **일어나게** 해야 하는가?" → Tool

### MCP Resource (MCP 리소스)
- **정의**: 프롬프트나 RAG 파이프라인에 **읽기 전용**으로 주입되는 데이터. 문서, 스키마, 지식 베이스
- **판별법**: "Claude가 이것을 **읽기만** 하면 되는가?" → Resource
- **⚠️ 가장 많이 실점하는 영역**: Tool vs Resource 경계 판단

### MCP Prompt (MCP 프롬프트)
- **정의**: 미리 정의된 **템플릿이나 워크플로우**. 재사용 가능한 지시 패턴
- **시험 포인트**: Tool(실행), Resource(읽기), Prompt(템플릿) — 세 가지 경계를 정확히 구분

### Tool Description (도구 설명)
- **정의**: Claude가 어떤 도구를 호출할지 결정하는 **주요 메커니즘**
- **⚠️ 핵심**: 에이전트 이름이나 도구 이름이 아닌 **설명(description)**으로 라우팅한다
- **작성법**: "코드베이스를 한 번도 본 적 없는 개발자를 위한 문서"처럼 구체적으로
- **안티패턴**: "handles customer requests" 같은 모호한 설명 → 잘못된 도구 선택

### .mcp.json vs ~/.claude.json
- **`.mcp.json`**: 프로젝트 레벨, 버전 관리에 포함
- **`~/.claude.json`**: 사용자 레벨, 개인
- **시험 포인트**: CLAUDE.md 계층과 동일한 패턴. 하나만 기억하면 둘 다 답할 수 있다

### 4-5 Tool Rule (4-5 도구 규칙)
- **정의**: 에이전트당 **4-5개** 도구가 최적. 초과 시 선택 정확도 저하
- **시험 포인트**: 18개 도구를 가진 에이전트 → 슈퍼 에이전트 안티패턴 → 전문 서브에이전트로 분산이 정답

---

## Domain 5: Context Management and Reliability (15%)

### Lost in the Middle Effect ("중간에 묻히는" 효과)
- **정의**: 트랜스포머 모델이 컨텍스트 **처음과 끝**에 더 주의를 기울이고, **중간**은 덜 주의하는 현상
- **시험 포인트**: 중요 정보를 컨텍스트 **처음 또는 끝**에 배치. 컨텍스트 창 크기와 무관하게 발생
- **흔한 오해**: "컨텍스트 창을 키우면 해결된다" → 틀림. 크기와 무관한 주의력 분포 문제

### Context Degradation (컨텍스트 열화)
- **정의**: 긴 대화에서 초기 컨텍스트의 **신뢰도가 점차 떨어지는** 현상
- **시험 포인트**: 완화 방법 = 구조화된 요약, 핵심 사실 주기적 재진술, 중요 정보를 시작점에 고정

### Prompt Caching (프롬프트 캐싱)
- **정의**: 반복 사용되는 시스템 프롬프트, 정책 문서 등을 캐싱하여 **비용 최대 90% 절감** + **실시간 지연**
- **시험 포인트**: 사용자가 기다리는 상황에서 비용 최적화 → 정답은 항상 Prompt Caching (Batch API 아님)
- **적합**: 반복 시스템 프롬프트, 정책 문서, few-shot 예시

### Batch API (배치 API)
- **정의**: **50% 비용 절감**, 지연 시간 최대 **24시간** (대부분 1시간 내 완료)
- **시험 포인트**: 야간 감사, 대량 처리, 오프라인 작업에 적합. **사용자 대면 워크플로우에 사용 = 안티패턴**
- **⚠️ 함정**: 라이브 고객 지원에 Batch API → 항상 오답

### Real-Time API (실시간 API)
- **정의**: 표준 가격, **실시간 지연**. 사용자가 응답을 기다리는 워크플로우용
- **시험 포인트**: 비용 최적화가 사용자 경험을 희생할 수 없는 경우의 기본 선택

### Programmatic Hook (프로그래밍 훅)
- **정의**: 코드 레벨에서 도구 출력을 검증하거나 변환하는 강제 장치 (예: `PostToolUse`)
- **시험 포인트**: "프롬프트로 지시" vs "코드로 강제" → 시험은 항상 코드를 정답으로

---

## 교차 도메인 핵심 원칙 (멘탈 모델)

### "Prompts are guidance. Code is law." (프롬프트는 가이드, 코드는 법)
- 비즈니스 룰, JSON 준수, 라우팅 결정 → 프롬프트로 요청하지 말고 **코드로 강제**
- 시험에서 "시스템 프롬프트에 지시 추가" 선택지 = 거의 항상 오답

### Deterministic > Model-Driven (결정론적 > 모델 주도)
- 에스컬레이션, 라우팅, 검증 → **결정론적 규칙**이 정답. 모델의 자체 판단은 프로덕션에 부적합
- Claude의 "자신감 점수"로 분기하는 선택지 = 오답

### Actions = Tools, Context = Resources (액션은 도구, 컨텍스트는 리소스)
- 실행이 필요하면 Tool, 읽기만 하면 Resource. 이 경계가 Domain 4의 핵심

---

## 시험 전략 용어

### Distractor (오답 방해물)
- 시험학 용어. 정답이 아닌 선택지. CCA에서는 **매우 그럴듯하게** 설계됨

### Anti-Pattern (안티패턴)
- "하면 안 되는 것". CCA는 정답만큼 안티패턴 인식을 시험한다. 오답을 먼저 제거하면 속도가 올라간다

### Scenario Chain (시나리오 체인)
- 한 문제의 컨텍스트가 다음 문제에 이어지는 연속 문제. 앞 문제를 틀리면 뒤 문제도 흔들릴 수 있다

---

## 암기 체크리스트

시험 전 다음을 문서 없이 정의할 수 있는지 확인:

- [ ] Agentic Loop의 5단계 순서
- [ ] Coordinator-Subagent vs Hub-and-Spoke 차이
- [ ] 서브에이전트가 컨텍스트를 상속하지 않는 이유
- [ ] tool_choice의 3가지 모드 (auto, any, specific)
- [ ] Stop Reason의 3가지 값과 각각의 의미
- [ ] MCP Tool vs Resource vs Prompt 경계
- [ ] CLAUDE.md 프로젝트 vs 사용자 레벨 차이
- [ ] `-p`, `--bare`, `--output-format json` 용도
- [ ] Prompt Caching vs Batch API vs Real-Time API (비용, 지연, 용도)
- [ ] Lost in the Middle 효과와 대응법
- [ ] 4-5 Tool Rule
- [ ] Validation-Retry Loop 흐름
- [ ] "Prompts are guidance. Code is law." 원칙

---

---

## 학습 리소스 (검색으로 확인한 실제 자료)

### 모의 시험 / 연습 문제

| 자료 | URL | 비고 |
|------|-----|------|
| **Udemy CCA 모의 시험** | udemy.com/course/claude-certified-architect-foundations-practice-tests-2026 | 유료, "Practice Tests 2026" |
| **LinkedIn 300+ 문제** | Marc Armstrong의 LinkedIn 포스트 | "Claude Certified Architect Exam Prep: 300+ Questions" |
| **Anthropic Academy 모의 시험** | anthropic.skilljar.com 내 | 공식 모의 시험 (900+ 목표 후 응시) |

### 학습 가이드

| 자료 | URL | 비고 |
|------|-----|------|
| **GitHub 학습 레포** | github.com/paullarionov/claude-certified-architect | 690 stars, 다국어(영/일/러/중) 가이드, PDF 포함 |
| **Tutorials Dojo 가이드** | tutorialsdojo.com/cca-f-study-guide | 도메인별 토픽, 서비스, 스킬 정리 |
| **FlashGenius 가이드** | flashgenius.net/blog-article/a-guide-to-the-claude-certified-architect | 블로그 가이드만 (플래시카드는 미확인) |
| **Stackademic 학습 가이드** | blog.stackademic.com (검색: CCA-F study guide) | 상세 도메인별 분석 |

### 실전 후기 (Reddit)

| 포스트 | 핵심 내용 |
|--------|----------|
| **"The real exam has more scenarios than the exam guide says"** | 공식 가이드는 6개 시나리오이나 실제 시험은 **최대 13개**에서 출제. 모의 시험은 4개만 커버. 가이드에 없는 시나리오도 출제됨. 실제 질문 깊이가 매우 높음. |

### 공식 리소스

| 자료 | URL |
|------|-----|
| Anthropic Academy (13과정, 무료) | anthropic.skilljar.com |
| Claude Agent SDK 문서 | docs.anthropic.com |
| Claude Code 문서 | docs.anthropic.com |
| MCP 문서 | modelcontextprotocol.io |

> **⚠️ Reddit 후기 주의사항**: 공식 가이드의 6개 시나리오 외에 추가 시나리오가 출제된다는 보고가 있다. 6개만 준비하면 부족할 수 있으니, Anthropic Academy의 전체 과정을 수강하고 **도메인 전반의 지식**을 쌓는 것이 안전하다.

*Generated: 2026-03-31 | Source: CCA Foundations Exam Guide by Rick Hightower + web research*
