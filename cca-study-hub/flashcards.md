# CCA Foundations Exam Flashcards

> 100장 | Anki 호환 | 도메인 가중치 반영
> D1 Agentic Architecture (27%) | D2 Tool Design & MCP (18%) | D3 Claude Code (20%) | D4 Prompt Engineering (20%) | D5 Context Management (15%)

---

## Domain 1: Agentic Architecture (27%) — Cards 001~027

### Card 001 | D1 | ★★☆

**Q**: 코디네이터-서브에이전트 패턴(Coordinator-Subagent Pattern)이란 무엇인가?

<details>
<summary>정답 보기</summary>

**A**: 중앙 코디네이터(Hub)가 작업을 전문 서브에이전트(Spoke)에 위임하고, 결과를 수집/종합하는 멀티에이전트 아키텍처 패턴이다. 허브앤스포크(Hub-and-Spoke) 아키텍처의 실전 구현이다.

**암기 포인트**: 뉴스룸 비유 — 편집자(코디네이터)가 기자(서브에이전트)에게 취재를 위임하고 기사를 종합한다

</details>

---

### Card 002 | D1 | ★★★

**Q**: 서브에이전트는 코디네이터의 컨텍스트를 자동으로 상속하는가?

<details>
<summary>정답 보기</summary>

**A**: 아니다. 서브에이전트는 빈 상태(blank slate)에서 시작하며, 코디네이터가 명시적으로 전달(explicit context passing)한 정보만 알 수 있다. 자동 상속은 없다.

**암기 포인트**: "서브에이전트 = blank slate + 명시적 전달만" — CCA 시험에서 가장 많이 출제되는 단일 개념

</details>

---

### Card 003 | D1 | ★★★

**Q**: 슈퍼 에이전트 안티패턴(Super Agent Anti-Pattern)이란 무엇이며, 왜 문제인가?

<details>
<summary>정답 보기</summary>

**A**: 단일 에이전트에 15개 이상의 도구를 부여하는 잘못된 설계. 도구 수가 많아지면 주의력 세금(attention tax)으로 도구 선택 정확도가 측정 가능하게 저하되고, 보안 리스크도 증가한다.

**암기 포인트**: 에이전트당 4-5개 도구가 최적, 15개+ = 슈퍼 에이전트 안티패턴

</details>

---

### Card 004 | D1 | ★★★

**Q**: 에스컬레이션 결정에서 "Claude가 92% 확신을 보고하면 처리를 허용"하는 접근이 왜 오답인가?

<details>
<summary>정답 보기</summary>

**A**: LLM의 자기보고 신뢰도(self-reported confidence)는 보정되지 않은(not calibrated) 텍스트 생성일 뿐이다. 순환 논증 구조이며, 90-100% 구간에서 과잉 확신(overconfidence)이 입증되었다. 프로덕션 라우팅에 부적합하다.

**암기 포인트**: "confidence score" 키워드 = 즉시 오답 제거

</details>

---

### Card 005 | D1 | ★★★

**Q**: 에스컬레이션에 적합한 결정론적 비즈니스 규칙(Deterministic Business Rules)의 유형 5가지는?

<details>
<summary>정답 보기</summary>

**A**: (1) 금액 기반: 환불 > $500, (2) 계정 행위 기반: 폐쇄/취소, (3) 고객 등급 기반: VIP/enterprise, (4) 이슈 유형 기반: 법적/규제 분쟁, (5) 정책 엔진 참조 기반. 모두 동일 입력 → 동일 출력을 보장한다.

**암기 포인트**: 결정론적 규칙 > 모델 판단 — 에스컬레이션의 황금률

</details>

---

### Card 006 | D1 | ★★★

**Q**: "Prompts are guidance. Code is law."의 의미는 무엇인가?

<details>
<summary>정답 보기</summary>

**A**: 프롬프트는 확률적 안내(probabilistic guidance)이고, 코드는 결정론적 강제(deterministic enforcement)이다. 비즈니스 룰, JSON 준수, 라우팅 결정, 컴플라이언스는 프롬프트가 아닌 코드로 강제해야 한다. 시험에서 "시스템 프롬프트에 지시 추가" 선택지 = 거의 항상 오답이다.

**암기 포인트**: "프롬프트는 확률, 코드는 확정" — 전 도메인 관통 원칙

</details>

---

### Card 007 | D1 | ★★☆

**Q**: 프로그래밍적 강제(Programmatic Enforcement)와 PostToolUse 콜백의 관계는?

<details>
<summary>정답 보기</summary>

**A**: PostToolUse 콜백은 Claude Agent SDK의 라이프사이클 훅으로, 도구 호출 후 프로그래밍적 검증을 삽입하는 지점이다. 예: 에이전트가 $600 환불을 제안 → PostToolUse에서 $500 한도 초과 감지 → 에스컬레이션. 프롬프트가 아닌 코드로 비즈니스 규칙을 강제한다.

**암기 포인트**: PostToolUse = 도구 실행 후 비즈니스 규칙 검증 삽입 지점

</details>

---

### Card 008 | D1 | ★★★

**Q**: 허브앤스포크(Hub-and-Spoke) 패턴에서 서브에이전트 간 직접 통신이 허용되는가?

<details>
<summary>정답 보기</summary>

**A**: 아니다. 스포크(서브에이전트) 간 직접 통신은 절대 허용되지 않는다. 모든 데이터 흐름은 허브(코디네이터)를 경유해야 한다. "서브에이전트 A가 B에 직접 결과를 전달" = 항상 오답이다.

**암기 포인트**: 기자끼리 기사를 공유하지 않는다 — 편집자가 중개한다

</details>

---

### Card 009 | D1 | ★★☆

**Q**: 에이전틱 루프(Agentic Loop)의 실행 순서는?

<details>
<summary>정답 보기</summary>

**A**: generate → tool_use → execute → result → end_turn. 모델이 응답을 생성하고, 도구 사용이 필요하면 stop_reason: tool_use를 반환하고, 오케스트레이터가 도구를 실행하고, 결과를 모델에 반환하고, 최종 응답을 생성한다.

**암기 포인트**: stop_reason: tool_use = 도구 실행 요청 신호

</details>

---

### Card 010 | D1 | ★★★

**Q**: 사일런트 실패(Silent Failure)란 무엇이며, 어떻게 방지하는가?

<details>
<summary>정답 보기</summary>

**A**: `{"status": "success", "data": null}` 형태로 에러가 성공으로 위장되는 실패 모드. "데이터 없음"과 "소스 접근 불가"를 혼동하게 만든다. 방지법: 구조화된 에러 컨텍스트(structured error context)로 error_type, source, retry_eligible을 포함한 에러 응답을 반환한다.

**암기 포인트**: success + null = 사일런트 실패의 전형, 항상 오답

</details>

---

### Card 011 | D1 | ★★☆

**Q**: 컨텍스트 포킹(Context Forking)이란 무엇인가?

<details>
<summary>정답 보기</summary>

**A**: Unix fork()에서 차용한 개념으로, 코디네이터가 서브에이전트에 필요한 컨텍스트만 선택적으로 복제하는 것이다. 전체 컨텍스트를 복사하는 것이 아니라, 작업 설명, 제약 조건, 출력 형식 등 필요한 것만 전달한다.

**암기 포인트**: fork() = 전체 복사가 아닌 선택적 복제

</details>

---

### Card 012 | D1 | ★★☆

**Q**: 작업 분해 DAG(Task Decomposition DAG)란 무엇인가?

<details>
<summary>정답 보기</summary>

**A**: 빌드 시스템 의존성 그래프 원리를 적용하여, 독립 작업은 병렬로, 의존 작업은 순차적으로 실행하는 방식이다. 예: A→B 순차(B가 A 결과 의존), C는 병렬(독립 작업).

**암기 포인트**: 독립 = 병렬, 의존 = 코디네이터 합성

</details>

---

### Card 013 | D1 | ★★☆

**Q**: 소스 신뢰도 랭킹(Source Reliability Ranking)의 순서는?

<details>
<summary>정답 보기</summary>

**A**: peer-reviewed(동료 심사 논문) > 공식 문서 > 뉴스 > 블로그 > 소셜 미디어. 수량이 아닌 품질이 기준이다. "먼저 도착한 결과가 이긴다(first result wins)"는 안티패턴이다.

**암기 포인트**: 블로그 3개 < 논문 1개 — 수량이 아닌 품질

</details>

---

### Card 014 | D1 | ★★★

**Q**: Prompt Caching과 Batch API를 실시간 고객 채팅 시스템에서 비용 최적화에 사용할 때, 어떤 것이 적합한가?

<details>
<summary>정답 보기</summary>

**A**: Prompt Caching이 정답이다. 최대 90% 비용 절감 + 실시간 호환. Batch API는 50% 절감이지만 최대 24시간 처리 지연이므로 사용자 대면 워크플로우에서 항상 오답이다.

**암기 포인트**: "누가 기다리는가?" → 사용자 대면 = Prompt Caching, 비실시간 = Batch API

</details>

---

### Card 015 | D1 | ★★☆

**Q**: PCI-DSS 컴플라이언스를 보장하기 위해 "시스템 프롬프트에 규칙을 상세히 기술"하는 것이 왜 부적합한가?

<details>
<summary>정답 보기</summary>

**A**: 프롬프트는 안내(guidance)이지 강제(enforcement)가 아니다. "대부분 작동"은 돈과 규정이 걸린 상황에서 불충분하다. 정답은 프로그래밍적 강제 — redaction(마스킹), validation(검증), audit logging(감사 로깅)이다.

**암기 포인트**: "That is not a compliance strategy. That is a hope."

</details>

---

### Card 016 | D1 | ★★☆

**Q**: 에스컬레이션 핸드오프 시 "완전한 대화 기록(full transcript)"을 전달하는 것이 왜 부적합한가?

<details>
<summary>정답 보기</summary>

**A**: 비구조화된 텍스트에 핵심 정보가 매몰되어 다음 처리자가 핵심 결정 사항을 찾기 어렵다. 정답은 구조화된 JSON 요약(customer_id, tier, issue_type, disputed_amount, escalation_reason 등)이다.

**암기 포인트**: "충분한 컨텍스트"보다 "정확한 컨텍스트"가 우선

</details>

---

### Card 017 | D1 | ★★☆

**Q**: 충돌 해결(Conflict Resolution)에서 올바른 접근법 3가지는?

<details>
<summary>정답 보기</summary>

**A**: (1) 소스 신뢰도 랭킹 (peer-reviewed > 공식 문서 > 뉴스 > 블로그 > 소셜 미디어), (2) 다수결 합의, (3) 해결 불가능한 고위험 주장에 대한 인간 에스컬레이션. "먼저 응답한 소스 채택"은 안티패턴이다.

**암기 포인트**: 충돌 해결 = 신뢰도 랭킹 + 다수결 + 인간 에스컬레이션

</details>

---

### Card 018 | D1 | ★★★

**Q**: CCA 시험에서 매력적 오답의 전형적 구조인 "3가지 사실 + 1가지 결함" 패턴이란?

<details>
<summary>정답 보기</summary>

**A**: 선택지에 3가지 정확한 사실(실제 API, 실제 비용 절감, 모델 품질)을 포함하지만 1가지 치명적 결함(예: 24시간 지연)을 숨기는 구조이다. 사실 3개가 참이어도 치명적 결함 1개면 오답이다.

**암기 포인트**: 3 true + 1 fatal = 여전히 오답

</details>

---

### Card 019 | D1 | ★★☆

**Q**: 고객 지원 에이전트의 표준 도구셋(5개)과 호출 순서는?

<details>
<summary>정답 보기</summary>

**A**: (1) lookup_customer (첫 번째, 필수), (2) check_policy (재정 결정 전, 필수), (3) process_refund (정책 확인 후, 조건부), (4) escalate_to_human (규칙 요구 시, 조건부), (5) log_interaction (마지막, 필수).

**암기 포인트**: 고객 조회 → 정책 확인 → 처리 → 에스컬레이션 → 로깅

</details>

---

### Card 020 | D1 | ★★☆

**Q**: tool_choice 파라미터의 4가지 값은?

<details>
<summary>정답 보기</summary>

**A**: (1) auto: 모델이 도구 사용 여부 결정, (2) any: 반드시 도구를 하나 이상 사용, (3) none: 텍스트 전용 응답 (도구 사용 불가), (4) named-tool: `{"type": "tool", "name": "..."}` 형태로 특정 도구 강제 호출.

**암기 포인트**: tool_choice = auto / any / none / named-tool (4가지)

</details>

---

### Card 021 | D1 | ★★☆

**Q**: AI Fluency Framework의 4D란?

<details>
<summary>정답 보기</summary>

**A**: (1) Delegation: 작업을 AI에 위임하는 능력, (2) Description: CLAUDE.md, 스킬에 표준을 문서화하는 능력, (3) Discernment: 코드리뷰 등으로 AI 출력 품질을 판별하는 능력, (4) Diligence: 지속적으로 개선 루프를 유지하는 능력.

**암기 포인트**: 4D = Delegation, Description, Discernment, Diligence

</details>

---

### Card 022 | D1 | ★★★

**Q**: 검증-재시도 루프(Validation-Retry Loop)의 올바른 패턴은?

<details>
<summary>정답 보기</summary>

**A**: Informed(구체적 에러 메시지 포함) + Bounded(2-3회 제한) + Human Escalation(최대 재시도 후 인간 개입). Blind retry("다시 해봐")와 Unbounded retry("성공할 때까지")는 항상 오답이다.

**암기 포인트**: 재시도 = 에러 피드백 + 2-3회 제한 + 에스컬레이션

</details>

---

### Card 023 | D1 | ★★☆

**Q**: $450 환불 요청, 에이전트 한도 $500, Claude가 75% 신뢰도를 보고할 때 올바른 행동은?

<details>
<summary>정답 보기</summary>

**A**: $450 < $500 한도이므로 비즈니스 규칙에 따라 환불 처리한다. 신뢰도 점수(75%)는 에스컬레이션 결정과 무관하다. 결정론적 비즈니스 규칙(금액 vs. 한도)만이 결정 기준이다.

**암기 포인트**: 신뢰도 점수 무시, 비즈니스 규칙(금액)만 확인

</details>

---

### Card 024 | D1 | ★★☆

**Q**: 코디네이터가 APA 인용 형식을 요구했는데 서브에이전트가 MLA를 반환했다. 원인은?

<details>
<summary>정답 보기</summary>

**A**: 인용 형식 요구사항이 서브에이전트에 명시적으로 전달되지 않았다. 서브에이전트는 코디네이터 컨텍스트를 상속하지 않으므로, 전달하지 않은 지시는 서브에이전트가 모른다.

**암기 포인트**: "상속 실패"라는 표현 자체가 함정 — 상속이 기본 동작이라는 전제를 깔고 있으므로 오답

</details>

---

### Card 025 | D1 | ★★☆

**Q**: 비실시간 대량 처리(5,000건 송장)에 가장 효율적인 API는?

<details>
<summary>정답 보기</summary>

**A**: Message Batches API가 정답이다. 대량 처리에 최적화되어 50% 비용 할인을 제공한다. 실시간 응답이 불필요한 대량 처리에서 Batches API를 사용하지 않는 것이 안티패턴이다.

**암기 포인트**: 비실시간 + 대량 = Batch API (50% 절감)

</details>

---

### Card 026 | D1 | ★★★

**Q**: 규제 산업(금융/의료)에서 야간 분석 비용 최적화 시 Batch API를 사용할 수 있는가?

<details>
<summary>정답 보기</summary>

**A**: 아니다. Message Batches API는 Zero Data Retention(ZDR) 대상이 아니다. 규제 산업에서 ZDR이 필요하면 Real-Time API + Prompt Caching 조합을 사용해야 한다. "규제 산업 + Batch API" = 즉시 오답 제거.

**암기 포인트**: Batch API = ZDR 미지원, 규제 산업에서 Batch 보이면 즉시 제거

</details>

---

### Card 027 | D1 | ★★☆

**Q**: 최소 권한 원칙(Principle of Least Privilege)은 AI 에이전트에도 적용되는가?

<details>
<summary>정답 보기</summary>

**A**: 그렇다. 인간과 동일하게 AI 에이전트에도 적용된다. 불필요한 도구 접근은 보안 리스크를 확대하며, 프롬프트 인젝션(prompt injection)에 의한 피해 범위를 넓힌다. 고객 지원 에이전트가 HR/마케팅 데이터에 접근하는 것은 위반이다.

**암기 포인트**: 불필요한 도구 접근 = 보안 리스크 + 프롬프트 인젝션 피해 확대

</details>

---

## Domain 2: Tool Design & MCP (18%) — Cards 028~045

### Card 028 | D2 | ★★★

**Q**: MCP의 3대 프리미티브(Primitives)와 그 유추는?

<details>
<summary>정답 보기</summary>

**A**: (1) Tools = 동사(실행 가능한 함수, 상태 변경), (2) Resources = 명사(읽기 전용 데이터, 스키마/카탈로그), (3) Prompts = 패턴(재사용 가능한 템플릿). "동사, 명사, 패턴"으로 외운다.

**암기 포인트**: Tools(동사) vs Resources(명사) vs Prompts(패턴) — 3가지

</details>

---

### Card 029 | D2 | ★★★

**Q**: 주문 내역 조회와 주문 취소를 MCP 프리미티브로 매핑하면?

<details>
<summary>정답 보기</summary>

**A**: 주문 내역 조회 = Resource (읽기 전용 데이터 접근), 주문 취소 = Tool (상태를 변경하는 액션). 읽기 작업에 Tool을 할당하는 것은 과도하고, 상태 변경에 Resource를 사용하는 것은 오답이다.

**암기 포인트**: 읽기 = Resource, 쓰기/변경 = Tool

</details>

---

### Card 030 | D2 | ★★★

**Q**: 에이전트당 적정 도구 수는 몇 개이며, 이 제한의 성격은?

<details>
<summary>정답 보기</summary>

**A**: 4-5개가 Anthropic 공식 가이드라인이다. 이 제한은 SDK 하드 리밋(기술적 제약)이 아니라 아키텍처 모범 사례(설계 원칙)이다. 초과 시 서브에이전트로 분할이 정답.

**암기 포인트**: 4-5개 = 설계 원칙, "SDK가 도구 수를 제한한다" = 오답

</details>

---

### Card 031 | D2 | ★★★

**Q**: 도구 설명(Tool Description)이 Claude의 도구 선택에서 하는 역할은?

<details>
<summary>정답 보기</summary>

**A**: 도구 설명은 Claude의 1차 도구 라우팅(routing) 메커니즘이다. Claude는 도구 이름이 아닌 설명(description)을 기반으로 도구를 선택한다. 모호한 설명은 오라우팅(mis-routing)을 유발한다.

**암기 포인트**: 도구 이름이 아닌 설명이 라우팅 결정 — 구체적 입출력 명시 필수

</details>

---

### Card 032 | D2 | ★★☆

**Q**: 부정 경계(Negative Bounds)란 무엇이며 왜 필요한가?

<details>
<summary>정답 보기</summary>

**A**: 도구 설명에서 "이 도구가 하지 않는 것"을 명시하는 것이다. 유사한 도구 간 모호함을 방지하여 오라우팅을 줄인다. 좋은 도구 설명 = 긍정 경계(하는 것) + 부정 경계(하지 않는 것).

**암기 포인트**: 좋은 도구 설명 = 긍정 경계 + 부정 경계

</details>

---

### Card 033 | D2 | ★★☆

**Q**: 도구 설명 개선만으로 12개 도구의 오라우팅 문제를 해결할 수 있는가?

<details>
<summary>정답 보기</summary>

**A**: 아니다. 부분적으로 맞지만 증상 치료일 뿐이다. 12개 도구는 Anthropic 권고(4-5개)를 초과하는 근본 원인이 미해결이다. 정답은 4-5개 도구로 축소 + 전문 서브에이전트 분리이다.

**암기 포인트**: 도구 수가 과다하면 설명 개선보다 분할이 우선

</details>

---

### Card 034 | D2 | ★★★

**Q**: MCP 설정 스코핑(Scoping)에서 서버 정의와 크레덴셜은 각각 어디에 저장해야 하는가?

<details>
<summary>정답 보기</summary>

**A**: 서버 정의(비밀값 제외) = `.mcp.json` (팀 공유, VCS 관리), 크레덴셜 = `~/.claude.json` 또는 환경변수 (개인, non-VCS). `.mcp.json`에 크레덴셜을 넣으면 VCS에 노출된다.

**암기 포인트**: "정의는 팀에, 비밀은 나에게" (Definitions to team, secrets to me)

</details>

---

### Card 035 | D2 | ★★★

**Q**: `--tools`와 `--allowedTools`의 차이점은?

<details>
<summary>정답 보기</summary>

**A**: `--tools "Read,Bash"` = 이 두 도구만 사용 가능하도록 제한(실제 샌드박싱). `--allowedTools "Read,Bash"` = 해당 도구를 권한 프롬프트 없이 사전 승인할 뿐, 다른 도구 사용을 막지 않는다. 역할이 정반대이다.

**암기 포인트**: restrict = --tools, pre-approve = --allowedTools

</details>

---

### Card 036 | D2 | ★★☆

**Q**: 도구 설명 작성의 올바른 원칙은?

<details>
<summary>정답 보기</summary>

**A**: 입력/출력을 구체적으로 명시해야 한다. "고객 관련 처리" (X) → "customer_id를 입력으로 받아 purchase_history, support_tickets, account_tier를 포함한 JSON 반환" (O). 호출 시점 가이드도 포함해야 한다.

**암기 포인트**: 모호한 설명 = 오라우팅, 구체적 입출력 명시 = 정확한 라우팅

</details>

---

### Card 037 | D2 | ★★☆

**Q**: 14개 테스트 도구를 가진 QA 에이전트가 오라우팅을 겪을 때 최적 해결책은?

<details>
<summary>정답 보기</summary>

**A**: QA 에이전트를 API 테스트 서브에이전트(4개 도구)와 UI 테스트 서브에이전트(4개 도구)로 분할하고, 각 도구 설명을 구체화한다. 프롬프트 튜닝이나 도구 이름 변경은 효과가 제한적이다.

**암기 포인트**: "도구 많으면 쪼개라, 설명 모호하면 구체화하라"

</details>

---

### Card 038 | D2 | ★★☆

**Q**: Few-shot 예시의 유효 범위와 한계는?

<details>
<summary>정답 보기</summary>

**A**: Few-shot 예시는 출력 포맷/추론 스타일에는 유효하지만, 도구 호출 시퀀스(순서) 제어에는 무효하다. 도구 순서 강제에는 프로그래밍적 전제조건(preconditions), tool_choice, 또는 hooks를 사용해야 한다.

**암기 포인트**: few-shot = 포맷 OK, 순서 NO → 순서는 hooks/tool_choice

</details>

---

### Card 039 | D2 | ★★☆

**Q**: PreToolUse 훅과 PostToolUse 훅의 차이는?

<details>
<summary>정답 보기</summary>

**A**: PreToolUse = 도구 실행 전 검증 (예: 금융 거래 한도 확인, PII 익명화 선행). PostToolUse = 도구 실행 후 검증 (예: 환불 금액 한도 초과 감지, 감사 로깅, Prettier 실행). 둘 다 확정적(deterministic) 실행이다.

**암기 포인트**: Pre = 실행 전 차단, Post = 실행 후 검증/로깅

</details>

---

### Card 040 | D2 | ★★☆

**Q**: 주의력 세금(Attention Tax)이란 무엇인가?

<details>
<summary>정답 보기</summary>

**A**: 도구가 많을수록 매 선택에서 모델이 지불하는 인지적 비용이다. 도구 수가 증가하면 각 도구에 대한 주의력이 분산되어 선택 정확도가 저하된다. 이것이 4-5개 도구 규칙의 근거이다.

**암기 포인트**: 도구 수 증가 → 주의력 분산 → 선택 정확도 저하

</details>

---

### Card 041 | D2 | ★★☆

**Q**: 스킬(Skills)과 규칙(Rules)의 차이는?

<details>
<summary>정답 보기</summary>

**A**: 규칙(Rules) = 매 세션마다 항상 로딩되는 지침 (CLAUDE.md 등). 스킬(Skills) = 필요할 때만 온디맨드(on-demand)로 로딩되는 워크플로우. 3단계 이상의 워크플로우를 2회 이상 반복하면 스킬로 만든다.

**암기 포인트**: 항상 필요 = 규칙(매 세션), 가끔 필요 = 스킬(온디맨드)

</details>

---

### Card 042 | D2 | ★★☆

**Q**: 스킬이 CLAUDE.md를 복제(duplicate)하면 왜 문제인가?

<details>
<summary>정답 보기</summary>

**A**: 이중 유지보수(dual maintenance) 문제가 발생한다. 한쪽만 업데이트되면 불일치가 생긴다. 스킬은 CLAUDE.md를 참조(reference)해야지 복제하면 안 된다.

**암기 포인트**: "copy rules into skill" = 안티패턴 → 참조만 허용

</details>

---

### Card 043 | D2 | ★★☆

**Q**: Scope Creep이 에이전트 도구 설계에서 왜 위험한가?

<details>
<summary>정답 보기</summary>

**A**: 에이전트 도구가 점진적으로 늘어나는 현상으로, Swiss Army Agent(만능 에이전트) 안티패턴으로 이어진다. 15개 이상이 되면 도구 선택 정확도가 하락하고 최소 권한 원칙을 위반하게 된다.

**암기 포인트**: 범위 확대 → 도구 과잉 → 슈퍼 에이전트 안티패턴

</details>

---

### Card 044 | D2 | ★★☆

**Q**: 도구 강제(Tool-Forcing)란 무엇이며 어떻게 구현하는가?

<details>
<summary>정답 보기</summary>

**A**: tool_choice 파라미터를 `{"type": "tool", "name": "특정_도구"}` 형태로 설정하여 Claude가 반드시 해당 도구를 호출하도록 강제하는 것이다. 도구의 input_schema에 맞는 JSON만 반환되므로 구조적 신뢰성을 보장한다.

**암기 포인트**: tool_choice + input_schema = Level 2 스키마 강제

</details>

---

### Card 045 | D2 | ★★☆

**Q**: 감사 로깅(Audit Logging)은 어떤 훅으로 구현하는가?

<details>
<summary>정답 보기</summary>

**A**: PostToolUse 훅으로 구현한다. 모든 도구 호출 후 자동으로 실행되어 재정 행위, 데이터 접근 등을 확정적으로 기록한다. 프롬프트로 "로깅하라"고 지시하는 것은 확률적이므로 부적합하다.

**암기 포인트**: 감사 로깅 = PostToolUse hooks (확정적 실행)

</details>

---

## Domain 3: Claude Code (20%) — Cards 046~065

### Card 046 | D3 | ★★★

**Q**: CI/CD에서 Claude Code 실행 시 `-p` 플래그의 역할은?

<details>
<summary>정답 보기</summary>

**A**: `-p` (--print)는 비인터랙티브 모드(non-interactive mode)를 활성화한다. 프롬프트를 받아 실행 후 즉시 종료하는 일회성 실행(one-shot execution)을 보장한다. 누락 시 인터랙티브 UI가 사용자 입력을 대기하여 파이프라인이 무한 행(hang)한다.

**암기 포인트**: -p 누락 = 파이프라인 무한 대기 (에러도 아니고 느린 것도 아닌 "무한 대기")

</details>

---

### Card 047 | D3 | ★★★

**Q**: `--bare` 플래그는 무엇을 건너뛰는가?

<details>
<summary>정답 보기</summary>

**A**: hooks, LSP, plugins, skills, memory, OAuth를 모두 건너뛴다. 환경 간 재현 가능한 동작(reproducible behavior)을 보장하는 헤드리스 모드(headless mode)이다.

**암기 포인트**: --bare = 훅/LSP/스킬/메모리 스킵 → 재현성 보장

</details>

---

### Card 048 | D3 | ★★★

**Q**: CI/CD에서 "비인터랙티브 + 재현성"을 보장하는 최소 플래그 조합은?

<details>
<summary>정답 보기</summary>

**A**: `-p --bare` 두 개가 최소 조합이다. `-p`는 비인터랙티브, `--bare`는 재현성. `--output-format json`은 기계 파싱에 필요하지만 최소 필수는 아니다.

**암기 포인트**: CI/CD 최소 = -p --bare, 완전 = -p --bare --output-format json --tools

</details>

---

### Card 049 | D3 | ★★★

**Q**: CI/CD 파이프라인이 타임아웃될 때 "타임아웃을 120분으로 늘리자"는 왜 오답인가?

<details>
<summary>정답 보기</summary>

**A**: 증상 치료일 뿐이다. 행(hang)의 원인은 `-p` 플래그 누락으로 인한 인터랙티브 모드 진입이다. 타임아웃 연장은 "절대 오지 않을 입력"을 더 오래 기다릴 뿐이다.

**암기 포인트**: CI/CD 행 = -p 누락이 근본 원인, 타임아웃 연장 = 증상 치료

</details>

---

### Card 050 | D3 | ★★★

**Q**: `--output-format json`과 프롬프트에 "Always return JSON"의 차이는?

<details>
<summary>정답 보기</summary>

**A**: 프롬프트 지시 = 약 90% 작동 (마크다운 래핑, 설명 텍스트 추가 가능). `--output-format json` 플래그 = 100% 보장. "프롬프트는 안내(guidance), 플래그는 보장(guarantee)"이다.

**암기 포인트**: 프롬프트 JSON = 90% 신뢰도, 플래그 JSON = 100% 보장

</details>

---

### Card 051 | D3 | ★★☆

**Q**: `--json-schema` 사용 시 결과는 응답 JSON의 어떤 필드에 위치하는가?

<details>
<summary>정답 보기</summary>

**A**: `structured_output` 필드에 위치한다. `result`나 `output`이 아님에 주의 — 이것은 시험에서 자주 나오는 함정이다.

**암기 포인트**: --json-schema → structured_output 필드 (result 아님!)

</details>

---

### Card 052 | D3 | ★★★

**Q**: CLAUDE.md 4단계 계층(Four-Level Hierarchy)의 순서와 각 레벨의 특징은?

<details>
<summary>정답 보기</summary>

**A**: (1) Managed/Org: IT 배포, 하위 재정의 불가, 최고 권한, (2) Project: `.claude/CLAUDE.md`, Git 공유, 팀 표준, (3) User: `~/.claude/CLAUDE.md`, 개인 선호, (4) Local: `CLAUDE.local.md`, .gitignore 대상, 개인+프로젝트 한정.

**암기 포인트**: "M-P-U-L" (Managed → Project → User → Local, 위에서 아래로 우선순위)

</details>

---

### Card 053 | D3 | ★★★

**Q**: 조직 전체 보안 정책을 개발자가 재정의할 수 없게 하려면 CLAUDE.md 어느 레벨에 설정해야 하는가?

<details>
<summary>정답 보기</summary>

**A**: Managed/Org 레벨 (`/Library/Application Support/ClaudeCode/CLAUDE.md`)에 IT 팀이 배포한다. 최고 권한으로, 하위 레벨(project, user, local)에서 재정의할 수 없다.

**암기 포인트**: 재정의 불가 보안 정책 = Managed/Org 레벨

</details>

---

### Card 054 | D3 | ★★★

**Q**: 팀 코딩 표준은 CLAUDE.md 어느 레벨에 설정해야 하는가?

<details>
<summary>정답 보기</summary>

**A**: 프로젝트 레벨 (`.claude/CLAUDE.md`)에 정의하고 Git에 커밋한다. Git을 통해 팀 전체가 자동으로 공유받으며, 매 세션에 자동 주입되어 일관성을 보장한다. 사용자 레벨에 놓으면 Git 비공유이므로 수동 복사가 필요하다.

**암기 포인트**: 팀 표준 → 프로젝트 레벨 (.claude/CLAUDE.md), 사용자 레벨 = 오답

</details>

---

### Card 055 | D3 | ★★☆

**Q**: CLAUDE.local.md의 용도와 특징은?

<details>
<summary>정답 보기</summary>

**A**: `.gitignore` 대상이며, 개인+프로젝트 한정 설정을 담는다. 버전 관리되지 않으므로 팀 표준에는 부적합하다. 개인적 환경 설정이나 로컬 전용 규칙에 사용한다.

**암기 포인트**: CLAUDE.local.md = .gitignore 대상, 개인+프로젝트 한정

</details>

---

### Card 056 | D3 | ★★★

**Q**: CI/CD에서 Claude Code의 표준 명령어 템플릿은?

<details>
<summary>정답 보기</summary>

**A**: `claude --bare -p "<PROMPT>" --output-format json --tools "Read,Bash" --json-schema '<SCHEMA>'`. `-p`(비인터랙티브) + `--bare`(재현성) + `--output-format json`(파싱) + `--tools`(샌드박싱)이 핵심 조합이다.

**암기 포인트**: -p --bare --output-format json --tools = CI/CD 4종 세트

</details>

---

### Card 057 | D3 | ★★☆

**Q**: `--bare` 없이 CI에서 Claude Code를 실행하면 어떤 문제가 발생하는가?

<details>
<summary>정답 보기</summary>

**A**: 환경 간 다른 동작이 발생한다. 로컬에서는 훅/스킬/메모리가 로드되어 특정 동작을 하지만, CI 환경에서는 다를 수 있어 재현성이 깨진다.

**암기 포인트**: --bare 미사용 = 환경 간 동작 불일치 (재현성 파괴)

</details>

---

### Card 058 | D3 | ★★☆

**Q**: output-format의 3가지 모드는?

<details>
<summary>정답 보기</summary>

**A**: (1) text: 사람이 읽을 수 있는 기본 텍스트 출력, (2) json: 기계 파싱 가능한 JSON 출력, (3) stream-json: 스트리밍 JSON 출력. CI/CD에서는 json을 사용한다.

**암기 포인트**: text / json / stream-json (3가지)

</details>

---

### Card 059 | D3 | ★★☆

**Q**: Description-Discernment 루프란 무엇인가?

<details>
<summary>정답 보기</summary>

**A**: (1) Description(기술): CLAUDE.md, 스킬에 팀 표준 문서화 → (2) Discernment(판별): 코드리뷰로 AI 출력 품질 검증 → (3) 판별 결과로 기술 업데이트 = 지속적 개선 루프. 일회성 공유가 아닌 반복적 개선 프로세스이다.

**암기 포인트**: 기술 → 판별 → 업데이트 = 지속적 개선 루프 (one-shot이 아님)

</details>

---

### Card 060 | D3 | ★★★

**Q**: PostToolUse 훅으로 확정적(deterministic) 실행을 하는 것과 CLAUDE.md에 규칙을 적는 것의 차이는?

<details>
<summary>정답 보기</summary>

**A**: CLAUDE.md 규칙 = 확률적(probabilistic) 실행으로, 컨텍스트 압박(context pressure) 시 간헐적으로 무시될 수 있다. 훅 = 확정적(deterministic) 실행으로, 항상 실행이 보장된다. 보안/컴플라이언스/빌드 규칙에는 항상 훅이 정답이다.

**암기 포인트**: "프롬프트는 확률, 훅은 확정" — 강제 규칙엔 항상 훅

</details>

---

### Card 061 | D3 | ★★☆

**Q**: 모노레포(Monorepo)에서 CLAUDE.md는 어떻게 구성하는가?

<details>
<summary>정답 보기</summary>

**A**: 루트 CLAUDE.md + 하위 디렉토리별 CLAUDE.md로 계층 구성한다. 루트에 공통 표준, 각 컴포넌트 디렉토리에 세부 규칙을 정의하면 자동으로 로딩된다.

**암기 포인트**: 모노레포 = 루트(공통) + 하위(세부) CLAUDE.md 자동 로딩

</details>

---

### Card 062 | D3 | ★★☆

**Q**: Batch API vs Real-Time API 선택 기준의 핵심 키워드는?

<details>
<summary>정답 보기</summary>

**A**: "nightly", "weekly", "scheduled" = Batch API. "대기 중", "즉시 응답", "사용자 대면" = Real-Time API. 핵심 질문: "누가 결과를 기다리는가?"

**암기 포인트**: 아무도 안 기다림 = Batch, 누군가 기다림 = Real-Time

</details>

---

### Card 063 | D3 | ★★☆

**Q**: 매주 월요일 새벽 2시 코드베이스 보안 스캔에 적합한 API는?

<details>
<summary>정답 보기</summary>

**A**: Batch API가 정답이다. "매주(weekly)", "스케줄(scheduled)" 키워드가 핵심. 아무도 결과를 즉시 기다리지 않으므로 50% 비용 할인을 받을 수 있다. "보안 문제는 즉시 발견해야 한다"는 함정이다.

**암기 포인트**: scheduled + 비실시간 = Batch API (50% 할인)

</details>

---

### Card 064 | D3 | ★★☆

**Q**: 커스텀 스킬(Custom Skill)을 만들어야 하는 기준은?

<details>
<summary>정답 보기</summary>

**A**: 3단계 이상의 워크플로우를 2회 이상 반복할 때 스킬로 만든다. 스킬은 온디맨드로 로딩되어 매 세션의 컨텍스트 오버헤드를 줄인다.

**암기 포인트**: 3단계+ 워크플로우 x 2회+ 반복 → 스킬화

</details>

---

### Card 065 | D3 | ★★☆

**Q**: CCA 시험의 기본 수치(문항 수, 시간, 합격 점수, 비용)는?

<details>
<summary>정답 보기</summary>

**A**: 60문항, 120분(2분/문항), 합격 720/1000(약 72%, 43/60문항), 비용 $99. 프로덕션 시나리오 6개 중 4개가 랜덤 출제된다.

**암기 포인트**: 60문항 / 120분 / 720점 합격 / $99

</details>

---

## Domain 4: Prompt Engineering (20%) — Cards 066~085

### Card 066 | D4 | ★★★

**Q**: 3계층 신뢰성 모델(Three-Level Reliability Model)이란?

<details>
<summary>정답 보기</summary>

**A**: Level 1: 프롬프트 안내(prompt guidance) — 확률적 넛지(probabilistic nudge). Level 2: 스키마 강제(schema enforcement) — tool_choice + input_schema. Level 3: 프로그래밍적 시맨틱 검증(programmatic semantic validation) — 외부 데이터로 독립 검증.

**암기 포인트**: Prompt → Schema → Semantic (3레벨, Level 1만으로는 부족)

</details>

---

### Card 067 | D4 | ★★★

**Q**: "프롬프트에 JSON 형식을 지정하면 충분하다"가 왜 오답인가?

<details>
<summary>정답 보기</summary>

**A**: Level 1 프롬프트 안내는 확률적 넛지(probabilistic nudge)일 뿐이다. 마크다운 래핑, 설명 텍스트 추가, 스키마 불일치, 환각 값, 긴 문서 절단 등 다양한 실패 모드가 존재한다. Level 2 스키마 강제 + Level 3 검증이 필요하다.

**암기 포인트**: "Always return JSON" = Level 1만 = 불충분

</details>

---

### Card 068 | D4 | ★★★

**Q**: `with_structured_output()`는 네이티브 Anthropic SDK 메서드인가?

<details>
<summary>정답 보기</summary>

**A**: 아니다. `with_structured_output()`는 LangChain 메서드이다. Anthropic SDK 네이티브 메서드가 아니다. 네이티브 SDK에서는 `tool_choice={"type": "tool", "name": "..."}` 또는 `client.messages.parse(output_format=PydanticModel)`을 사용한다.

**암기 포인트**: with_structured_output() = LangChain 함정, 네이티브 = messages.parse()

</details>

---

### Card 069 | D4 | ★★★

**Q**: 구조적 신뢰성(Structural Reliability)과 의미적 신뢰성(Semantic Reliability)의 차이는?

<details>
<summary>정답 보기</summary>

**A**: 구조적 신뢰성 = JSON 파싱 가능 여부 (tool_choice로 보장). 의미적 신뢰성 = 데이터 정확성 여부 (프로그래밍적 검증 필요). 구조적으로 유효한 JSON이 의미적으로 정확하다는 보장은 없다.

**암기 포인트**: 구조 = 형식 OK? (tool_choice), 의미 = 내용 맞나? (프로그래밍 검증)

</details>

---

### Card 070 | D4 | ★★★

**Q**: Blind retry와 Informed retry의 차이는?

<details>
<summary>정답 보기</summary>

**A**: Blind retry = "다시 해봐"라는 에러 정보 없는 재시도 (항상 오답). Informed retry = "total은 150이지만 line items 합계는 175입니다"와 같은 구체적 에러 피드백 포함 재시도 (정답 패턴).

**암기 포인트**: Blind = 에러 정보 없음 = 오답, Informed = 구체적 피드백 = 정답

</details>

---

### Card 071 | D4 | ★★★

**Q**: Hard failure와 Soft failure의 차이는?

<details>
<summary>정답 보기</summary>

**A**: Hard failure = API/스키마/응답 형태 오류 (try/except로 처리). Soft failure = 시맨틱 검증 실패 — 구조는 유효하지만 데이터가 부정확 (validate 함수로 처리). 완전한 신뢰성 패턴은 두 유형 모두 처리해야 한다.

**암기 포인트**: Hard = 형태 오류, Soft = 의미 오류 → 둘 다 처리가 정답

</details>

---

### Card 072 | D4 | ★★★

**Q**: 환각된 값(Hallucinated Values)을 방지하는 방법은?

<details>
<summary>정답 보기</summary>

**A**: (1) enum 제약(enum constraints)으로 카테고리 필드의 허용 값을 제한, (2) 프로그래밍적 시맨틱 검증으로 외부 ground truth에 대해 독립적으로 확인, (3) Claude에게 품질을 자체 평가하게 하는 것은 안티패턴이다.

**암기 포인트**: 환각 방지 = enum + 프로그래밍 검증, 자기보고 신뢰도 = 안티패턴

</details>

---

### Card 073 | D4 | ★★☆

**Q**: 시스템 프롬프트(System Prompt)의 주요 목적은?

<details>
<summary>정답 보기</summary>

**A**: 역할 정의와 행동 지침을 설정하는 것이다. 불변 규칙은 system 역할에, 세션별 변동 컨텍스트는 user 역할에 배치한다. 비즈니스 룰 강제 수단으로 사용하는 것은 부적합하다 (확률적 넛지에 불과).

**암기 포인트**: system = 불변 규칙, user = 세션 컨텍스트

</details>

---

### Card 074 | D4 | ★★★

**Q**: `client.messages.parse()`의 역할은?

<details>
<summary>정답 보기</summary>

**A**: Anthropic SDK의 네이티브 메서드로, Pydantic 모델을 직접 전달하여 타입된 구조화 출력을 받는다. `output_format=PydanticModel` 형태로 사용하며, 반환값이 자동으로 해당 Pydantic 타입으로 파싱된다.

**암기 포인트**: messages.parse() = 네이티브 SDK Pydantic 출력 메서드

</details>

---

### Card 075 | D4 | ★★☆

**Q**: 확률적 넛지(Probabilistic Nudge)란?

<details>
<summary>정답 보기</summary>

**A**: Level 1 프롬프트 안내의 본질적 성격이다. 프롬프트 지시가 모델의 출력을 특정 방향으로 기울이지만 보장하지는 않는다. "대부분 작동"하지만 프로덕션에 "대부분"은 충분하지 않다.

**암기 포인트**: 프롬프트 = 넛지(기울임), 코드 = 강제(보장)

</details>

---

### Card 076 | D4 | ★★☆

**Q**: 50페이지 계약서에서 중간 조항 추출 정확도가 떨어질 때 해결법은?

<details>
<summary>정답 보기</summary>

**A**: Lost-in-the-middle 현상이다. 해결: 문서를 청크로 나누어 각 청크에서 독립 추출 후 결과를 병합하고 중복 제거한다. "컨텍스트 윈도우가 더 큰 모델로 업그레이드"는 오답 (어텐션 분포 문제이므로).

**암기 포인트**: 긴 문서 추출 = 청크 분할 → 독립 추출 → 병합/중복 제거

</details>

---

### Card 077 | D4 | ★★☆

**Q**: Unbounded retry(무한 재시도)가 왜 항상 오답인가?

<details>
<summary>정답 보기</summary>

**A**: 무한 루프 위험이 있고, 인간 에스컬레이션 경로가 없다. "성공할 때까지 반복"은 비용과 시간을 낭비하며, 같은 에러를 반복할 수 있다. 정답은 2-3회 제한 + 에스컬레이션이다.

**암기 포인트**: "성공할 때까지" = 무한 재시도 = 항상 오답

</details>

---

### Card 078 | D4 | ★★☆

**Q**: 시스템 프롬프트에 "절대 카드 번호를 로깅하지 마세요"라는 지침이 왜 부적합한가?

<details>
<summary>정답 보기</summary>

**A**: 프롬프트는 확률적 넛지이므로 무시될 수 있다. PCI-DSS와 같은 컴플라이언스는 프로그래밍적 강제(카드 번호 패턴 redaction, validation, audit logging)로 구현해야 한다. 프롬프트는 맥락 제공만 담당한다.

**암기 포인트**: 컴플라이언스 = 코드로 강제, 프롬프트 = 맥락 제공만

</details>

---

### Card 079 | D4 | ★★☆

**Q**: tool_choice: none의 용도는?

<details>
<summary>정답 보기</summary>

**A**: 도구 사용을 불가능하게 하여 텍스트 전용 응답(text-only response)을 강제한다. 모델이 도구를 호출하지 않고 텍스트만 생성해야 하는 상황에 사용한다.

**암기 포인트**: tool_choice: none = 텍스트 전용, 도구 사용 불가

</details>

---

### Card 080 | D4 | ★★☆

**Q**: stop_reason: tool_use의 의미는?

<details>
<summary>정답 보기</summary>

**A**: 모델이 응답 생성을 중단하고 도구 실행을 요청하는 신호이다. 오케스트레이터가 이 신호를 받으면 해당 도구를 실행하고 결과를 모델에 반환한다. 에이전틱 루프의 핵심 메커니즘이다.

**암기 포인트**: stop_reason: tool_use = "도구를 실행해 달라"는 신호

</details>

---

### Card 081 | D4 | ★★☆

**Q**: "response_format='json'"이 Anthropic SDK에서 왜 오답인가?

<details>
<summary>정답 보기</summary>

**A**: `response_format` 파라미터는 OpenAI API 패턴이다. Anthropic SDK에는 존재하지 않는다. Anthropic에서 구조화된 출력은 tool_choice + input_schema 또는 client.messages.parse()를 사용한다.

**암기 포인트**: response_format = OpenAI 패턴, Anthropic SDK에 없음

</details>

---

### Card 082 | D4 | ★★☆

**Q**: 복합 실패 모드(Compound Failure Mode)란?

<details>
<summary>정답 보기</summary>

**A**: 구조적 실패(hard failure)와 의미적 실패(soft failure)가 동시에 발생하는 상태이다. 불완전한 신뢰성 패턴은 하나만 처리하므로, 모든 증상을 해결하는 답을 선택해야 한다.

**암기 포인트**: 복합 실패 = hard + soft 동시 → 둘 다 해결하는 답 선택

</details>

---

### Card 083 | D4 | ★★☆

**Q**: enum 제약(Enum Constraints)의 역할은?

<details>
<summary>정답 보기</summary>

**A**: 카테고리 필드에서 허용되는 값을 미리 정의하여 환각(hallucination)을 방지한다. 예: status 필드에 "pending", "completed", "cancelled"만 허용. 모델이 임의의 값을 생성하는 것을 구조적으로 제한한다.

**암기 포인트**: enum = 허용 값 사전 정의 → 카테고리 환각 방지

</details>

---

### Card 084 | D4 | ★★☆

**Q**: LLM에게 "추출 신뢰도를 1-10 척도로 자체 평가하라"는 접근이 왜 안티패턴인가?

<details>
<summary>정답 보기</summary>

**A**: LLM은 자기 출력의 정확성을 객관적으로 평가할 수 없다. 환각된 데이터에도 높은 신뢰도를 보고할 수 있다 (순환 논증). 정답은 프로그래밍적 검증 — 외부 ground truth에 대해 독립적으로 확인하는 것이다.

**암기 포인트**: "모델에게 품질을 묻지 마라" — 외부 검증만이 신뢰 가능

</details>

---

### Card 085 | D4 | ★★★

**Q**: 구조화된 데이터 추출에서 올바른 재시도 패턴의 3요소는?

<details>
<summary>정답 보기</summary>

**A**: (1) Informed: "total은 150이지만 line items 합계는 175입니다"와 같은 구체적 에러 메시지, (2) Bounded: 최대 2-3회 제한, (3) Human escalation: 최대 재시도 후 반드시 인간 개입 경로 확보.

**암기 포인트**: Informed + Bounded(2-3회) + Human Escalation = 재시도 3요소

</details>

---

## Domain 5: Context Management (15%) — Cards 086~100

### Card 086 | D5 | ★★★

**Q**: Lost in the Middle 효과란 무엇인가?

<details>
<summary>정답 보기</summary>

**A**: LLM이 컨텍스트 윈도우의 시작과 끝에 주의를 집중하고, 중간 부분의 정보를 소홀히 하는 주의력 분포(attention distribution) 문제이다. 컨텍스트 윈도우 크기와 무관하며, 200K 토큰에서도 발생한다.

**암기 포인트**: 시작 = 높은 주의, 중간 = 낮은 주의, 끝 = 높은 주의

</details>

---

### Card 087 | D5 | ★★★

**Q**: "컨텍스트 윈도우를 키우면 Lost in the Middle이 해결된다"가 왜 항상 오답인가?

<details>
<summary>정답 보기</summary>

**A**: Lost in the Middle은 용량(capacity) 문제가 아니라 주의력(attention) 문제이다. 윈도우를 늘리면 오히려 주의력이 더 얇게 분산된다. 정답은 중요 정보를 컨텍스트 처음/끝에 배치하거나, 분해 → 집중 세션을 사용하는 것이다.

**암기 포인트**: "윈도우 늘리기" = 항상 오답, 열화 = 주의력 문제

</details>

---

### Card 088 | D5 | ★★★

**Q**: 컨텍스트 열화(Context Degradation)의 완화 전략 2가지는?

<details>
<summary>정답 보기</summary>

**A**: (1) 매 턴 시작에 구조화된 요약 삽입하여 핵심 정보를 높은 주의 영역(시작)에 배치, (2) 대규모 작업은 분해 → 집중 세션(focused per-file passes) → 합성 → 일관성 검토 패턴을 사용한다.

**암기 포인트**: 요약을 시작에 배치 + 작업 분해/집중 세션

</details>

---

### Card 089 | D5 | ★★★

**Q**: Prompt Caching의 비용 구조를 정확히 설명하라.

<details>
<summary>정답 보기</summary>

**A**: 캐시 읽기 = 기본의 0.1배 (90% 절감). 캐시 쓰기(5분 TTL) = 기본의 1.25배 (25% 추가). 캐시 쓰기(1시간 TTL) = 기본의 2.0배 (100% 추가). "모든 토큰이 90% 절감"은 오답이다.

**암기 포인트**: 읽기 90% 절감 / 쓰기 5분 +25% / 쓰기 1시간 +100%

</details>

---

### Card 090 | D5 | ★★★

**Q**: Prompt Caching은 어떤 상황에서 가장 효과적인가?

<details>
<summary>정답 보기</summary>

**A**: 동일한 시스템 프롬프트/정책 문서가 매 대화마다 반복되는 실시간 시스템에서 가장 효과적이다. 예: 30,000건/일 고객 채팅에서 60,000 토큰 정책 컨텍스트 반복. 실시간 호환 + 최대 90% 절감.

**암기 포인트**: 반복 컨텍스트 + 실시간 = Prompt Caching 최적 시나리오

</details>

---

### Card 091 | D5 | ★★☆

**Q**: Batch API의 비용 절감률과 최대 처리 시간은?

<details>
<summary>정답 보기</summary>

**A**: 50% 비용 절감, 최대 24시간 처리 윈도우. 비실시간 대량 작업(nightly 보안 스캔, weekly 코드 분석, 대량 데이터 추출)에 적합하다. 사용자 대면 워크플로우에서는 항상 오답이다.

**암기 포인트**: Batch = 50% 절감 + 24시간 레이턴시 + 비실시간 전용

</details>

---

### Card 092 | D5 | ★★★

**Q**: 대규모 리팩토링(47개 파일)의 올바른 접근법은?

<details>
<summary>정답 보기</summary>

**A**: 코디네이터 패턴: (1) 코디네이터가 전체 구조를 가볍게 읽고 작업 계획 수립, (2) 각 파일에 필요한 컨텍스트만 담은 집중 세션(focused per-file passes) 할당, (3) 합성, (4) 코디네이터가 교차 파일 일관성 검토 (명명, import, 인터페이스 계약).

**암기 포인트**: 분해 → 집중 실행 → 합성 → 일관성 검토

</details>

---

### Card 093 | D5 | ★★★

**Q**: 주의력 희석(Attention Dilution)이란?

<details>
<summary>정답 보기</summary>

**A**: 화학의 dilution에서 차용한 개념으로, 컨텍스트가 커지면 총 주의력은 고정된 채 모든 토큰에 분배되므로, 각 토큰의 주의력이 얇아지는 현상이다. 컨텍스트 열화(context degradation)의 핵심 원인이다.

**암기 포인트**: 컨텍스트 커짐 → 주의력 얇아짐 → 중간부 품질 저하

</details>

---

### Card 094 | D5 | ★★☆

**Q**: 교차 파일 일관성(Cross-File Consistency)이란?

<details>
<summary>정답 보기</summary>

**A**: 여러 파일에 걸친 명명 규칙, import 경로, 인터페이스 계약의 일관성을 의미한다. 파일별 집중 패스 후 코디네이터가 검토해야 한다. 단일 세션에서 모든 파일을 로드하면 lost-in-the-middle로 오히려 불일치가 발생한다.

**암기 포인트**: 일관성 검토 = 코디네이터의 마지막 단계

</details>

---

### Card 095 | D5 | ★★☆

**Q**: 정보 배치 최적화(Information Placement)의 원칙은?

<details>
<summary>정답 보기</summary>

**A**: 중요한 정보를 컨텍스트의 시작과 끝에 배치하고, 중간에는 배치하지 않는다. Lost in the Middle 효과 때문에 중간 정보는 주의력이 낮아 소홀해질 수 있다.

**암기 포인트**: 핵심 정보 → 시작/끝 배치, 중간 = 위험 구간

</details>

---

### Card 096 | D5 | ★★☆

**Q**: 인간 참여 루프(Human-in-the-Loop)가 필요한 상황은?

<details>
<summary>정답 보기</summary>

**A**: (1) 최대 재시도(2-3회) 후에도 검증 실패, (2) 해결 불가능한 고위험 충돌, (3) 결정론적 규칙으로 판단 불가한 경계 사례. 인간 에스컬레이션 경로 없는 자동화는 안티패턴이다.

**암기 포인트**: 재시도 소진 / 고위험 충돌 / 경계 사례 → 반드시 인간 개입

</details>

---

### Card 097 | D5 | ★★☆

**Q**: 단일 세션에서 47개 파일, 380K 토큰을 한 번에 로드하면 어떤 문제가 발생하는가?

<details>
<summary>정답 보기</summary>

**A**: Lost in the Middle으로 중간 파일의 품질이 저하되고, 교차 파일 충돌이 발생한다. 주의력이 380K 토큰에 분산되어 각 파일에 대한 주의력이 극도로 희석된다.

**암기 포인트**: "load all files" / "single session" = 즉시 제거 키워드

</details>

---

### Card 098 | D5 | ★★☆

**Q**: 구조화된 핸드오프(Structured Handoff)와 원시 대화 기록(Raw Transcript) 전달의 차이는?

<details>
<summary>정답 보기</summary>

**A**: 구조화된 핸드오프 = JSON 요약으로 핵심 정보를 정확한 위치에 배치하여 즉시 파악 가능. 원시 대화 기록 = 비구조화된 텍스트에 정보가 매몰되어 핵심 결정 사항을 찾기 어려움. 핸드오프에는 항상 구조화된 JSON을 사용한다.

**암기 포인트**: "full transcript" = 오답, "structured JSON summary" = 정답

</details>

---

### Card 099 | D5 | ★★☆

**Q**: 시스템 프롬프트(system)와 사용자 메시지(user) 역할의 컨텍스트 분리 원칙은?

<details>
<summary>정답 보기</summary>

**A**: 불변 규칙(역할 정의, 행동 지침, 정책) = system 역할에 배치. 세션별 변동 컨텍스트(현재 고객 정보, 대화 요약) = user 역할에 배치. 이 분리가 Prompt Caching 효율도 높인다 (system 부분이 캐시됨).

**암기 포인트**: 불변 = system (캐시 가능), 변동 = user

</details>

---

### Card 100 | D5 | ★★★

**Q**: CCA 시험을 관통하는 6대 핵심 원칙을 나열하라.

<details>
<summary>정답 보기</summary>

**A**: (1) 프로그래밍적 강제 > 프롬프트 기반 — 전 도메인 관통, (2) 결정론적 규칙 > 확률적 자기 평가 — 에스컬레이션 핵심, (3) Batch API =/= 사용자 대면 — 레이턴시 문제, (4) 서브에이전트 =/= 컨텍스트 상속 — 가장 큰 함정, (5) 컨텍스트 열화 = 주의력 문제 — 용량 문제 아님, (6) Batch API =/= ZDR — 규제 산업 주의.

**암기 포인트**: 6대 원칙 = 코드>프롬프트, 규칙>신뢰도, Batch=/=실시간, 서브에이전트=/=상속, 열화=주의력, Batch=/=ZDR

</details>

---

## Quick Reference: 도메인별 카드 분포

| Domain | Range | Count |
|--------|-------|-------|
| D1 Agentic Architecture (27%) | 001-027 | 27 |
| D2 Tool Design & MCP (18%) | 028-045 | 18 |
| D3 Claude Code (20%) | 046-065 | 20 |
| D4 Prompt Engineering (20%) | 066-085 | 20 |
| D5 Context Management (15%) | 086-100 | 15 |
| **Total** | | **100** |

---

*Generated: 2026-04-04 | Source: CCA Foundations Exam Study Notes Series (8 articles) by Rick Hightower*
