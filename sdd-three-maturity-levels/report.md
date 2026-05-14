# SDD 3단계 성숙도 — 모든 AI 팀이 알아야 할 사다리

> 원문: [Spec Driven Development — Three Maturity Levels Every AI Team Should Know](https://medium.com/@wasowski.jarek/spec-driven-development-three-maturity-levels-every-ai-team-should-know-648c93cf1e1d) — Jarosław Wasowski, 2026-04-11, 12분 분량

---

## 1. 요약

- 저자는 Spec Driven Development(SDD)를 **성숙도 사다리**로 재정의한다 — **L1 Spec-First**(CLAUDE.md), **L2 Spec-Anchored**(살아 있는 스펙), **L3 Spec-as-Source**(코드는 생성 산출물). CLAUDE.md·`.cursorrules`·AGENTS.md를 쓰는 모든 팀은 이미 L1을 실천 중이지만, 본인이 어느 칸에 있는지 모를 뿐이라는 도발적 명제로 시작한다.
- 가장 강력한 실증 데이터는 **SLUMP 벤치마크**다. 사양을 채팅 대화에서 **영속 파일로 빼내는 단 하나의 구조 변경**이 잃어버린 구현 충실도(faithfulness)의 **90%를 회복**시킨다(120개→181개 충실 컴포넌트). 저자가 "처음에는 SDD를 마크다운으로 분장한 워터폴이라 의심했다가 SLUMP 데이터를 보고 마음을 바꿨다"고 직접 고백한다.
- 페일링 데이터도 인색하지 않다 — 대규모 코드베이스에서 **숙련 개발자는 AI 사용 시 19% 느려지지만 주관적으로 20% 빠르다고 믿는다**. GitClear 2.11억 줄 분석: **리팩토링 -60%**, 코드 처닝 3.1% → 5.7%, 코드 중복 **8배** 증가. CLAUDE.md 200줄을 넘기면 IFScale 기준 지시 준수율이 100%(10개)에서 **68%(500개)** 로 추락한다.
- 단, 저자는 L3 Spec-as-Source(Tessl, $125M)에 대해 신중하다. **MDA(2001)가 똑같은 약속을 했다가 실패**한 역사를 인용하며, "Watch it, don't adopt it"으로 마무리. 2026년의 현실적 목표는 **L2 Spec-Anchored**다.
- 핵심 처방은 단 한 줄로 요약된다 — "이번 주, 사양을 대화창에서 꺼내 레포지토리 안 영속 파일로 옮겨라."

## 2. 상세 내용

### 2.1 도발적 진단 — 우리 모두 이미 SDD를 한다, 단 최하단에서

저자는 도입부부터 도덕화(moralizing) 톤을 거부하고 진단부터 시작한다.

> "If you use CLAUDE.md, .cursorrules, or AGENTS.md, you're already practicing Spec Driven Development. You just don't know what level you're at yet."

이 진단은 두 가지 효과를 노린다. (1) SDD를 "도입할까 말까"의 선택 문제가 아니라 **"어느 단(rung)에 있는가"의 위치 문제**로 재프레임. (2) 거부감을 가진 독자도 자기 자신이 이미 참여자라는 사실을 인정하게 만들어 논쟁의 출발점을 옮긴다.

저자가 즉시 제시하는 비유 — "신입 직원에게 첫날 구두로 느슨한 지시를 던져 주는 것과 같다. 처음엔 통한다. 3개월 뒤 코드가 왜 그 모양인지 아무도 — AI도 — 모른다." 이 비유는 본 아티클을 관통하는 모티프다.

### 2.2 바이브 코딩의 청구서 — 측정 가능한 페일링

저자는 "vibe coding"이 게으름이 아니라 **2024년 미성숙한 도구에 대한 합리적 반응**이었다고 인정한다. 문제는 도구가 성숙했음에도 대다수 팀이 그 모드에 갇혀 있다는 것.

| 측정 | 데이터 | 출처 |
|------|--------|------|
| 대규모 코드베이스 AI 생산성 | **-19% 실측 / +20% 주관 인지** | 독립 측정 |
| 리팩토링 비율 | -60% | GitClear 2.11억 줄 (2020-2024) |
| 코드 처닝 (작성 후 2주 내 변경) | 3.1% → 5.7% | GitClear |
| 코드 중복 | **8배 증가** | GitClear |
| 변곡점 | AI 코딩 대량 도입과 일치 | GitClear |

저자가 인용하는 비유 — AI는 **"프로젝트를 모르는 임시 협력자(temporary collaborator who doesn't know the project)"** 처럼 코드를 만든다. 매 세션마다 백지에서 시작하는 협력자.

#### 2.2.1 Specification Drift — 실패의 형식 메커니즘

저자는 이 현상에 형식적 이름을 부여한다 — **specification drift**. 정의:

> AI 에이전트가 개발자 의도(intent)에서 점진적으로 발산(diverge)하는 현상. 그 의도가 코드 생성 시점에 사용 가능한 파일로 형식화(formalize)되지 않았기 때문.

에이전트는 **국지적 함수 정확성(local functional correctness)** 만 최적화하고 **전역 아키텍처 제약(global architectural constraints)** 은 모른다. 시스템 아키텍처는 개발자 머릿속에 있고, 에이전트는 매 세션마다 무(無)에서 출발한다.

이 정의는 본 논의의 첫 핵심 — Karpathy 자신도 "agentic engineering"으로 후퇴(2026년)했다는 사실을 인용하며 "vibe coding은 충분치 않다"는 합의가 형성됐다고 못 박는다.

### 2.3 살아 있는 사양의 4가지 속성 — 죽은 위키와의 차이

저자는 SDD의 혁신이 "코드 전 사양 작성"이라는 아이디어 자체에 있지 않다고 명시한다 — Design by Contract(1986), TDD(1999), BDD(2006)가 이미 같은 아이디어를 제시했기 때문. SDD의 차별점은 사양을 **살아 있는 기계 계약(living machine contract)** 으로 만드는 4가지 구조적 속성에 있다.

| 속성 | 설명 | 워터폴과의 차이 |
|------|------|----------------|
| **레포 안 코드 옆 버전 관리** | Confluence/Google Docs 아님. git history에 변경이 보임 | — |
| **양방향 업데이트** | 구현이 사양이 예상치 못한 것을 드러내면, 사양이 업데이트됨 | **워터폴은 코딩 시작 전 동결, SDD는 동결 안 됨** |
| **기계 가독 포맷** | Markdown / YAML / 구조화된 plain text. PDF·슬라이드·Word 아님 | — |
| **프로덕션 피드백 루프** | 인시던트·성능 메트릭·사용자 행동이 사양 업데이트로 환류 | — |

> "Writing before coding doesn't mean freezing before coding."

이 한 문장이 SDD를 워터폴과 분리하는 결정적 라인이다. **양방향성(bidirectionality)** 이 없으면 사양은 "그저 화려한 프롬프트(just fancy prompts)"에 불과하다.

#### 2.3.1 사양의 4가지 역할 — 단일 산출물의 다중 정체

SDD 사양은 **하나의 산출물이 동시에 4가지 역할**을 수행한다:

1. **계약(contract)** — AI가 만들어야 할 것
2. **스티어링 문서(steering document)** — 매 세션 시작 시 에이전트 컨텍스트로 로드
3. **테스트 오라클(test oracle)** — 테스트가 여기서 도출됨
4. **살아 있는 문서(living document)** — 구현 기반으로 업데이트

저자는 Confluence PRD가 SDD 사양이 될 수 없는 이유를 이 정의로 단번에 정리한다 — 기계 가독이 아니고, 레포에 살지 않으며, 피드백 루프가 없다. CLAUDE.md는 조건 1·3은 만족하지만 2·4는 만족 못 한다 → **CLAUDE.md는 사다리의 첫 단일 뿐**.

### 2.4 Level 1 — Spec-First — 당신은 이미 여기 있다

L1의 워크플로우는 모든 도구에서 동일하다:

```
Constitution (협상 불가 원칙)
  → Specify (요구사항)
    → Plan (아키텍처)
      → Tasks (원자적 작업 단위)
        → Implement (계약 경계 내 생성)
```

사양은 **슈퍼 프롬프트(super-prompt)** 역할 — 컨텍스트는 제공하지만, 피처가 머지되면 더 이상 유지되지 않음.

#### 2.4.1 L1을 정의하는 3개 도구

| 도구 | 형태 | 핵심 기능 |
|------|------|-----------|
| **GitHub Spec Kit** | 오픈소스 CLI | `/specify`, `/plan`, `/tasks` 슬래시 커맨드 + `constitution.md` (협상 불가 아키텍처 원칙) |
| **Amazon Kiro** | 첫 SDD 전용 IDE (VS Code fork) | **EARS notation** — `WHEN [trigger], THE SYSTEM SHALL [response]` |
| **spec-workflow-mcp** | MCP 서버 | Requirements → Design → Tasks 순서 강제, 단계별 명시적 인간 승인 |

#### 2.4.2 IFScale 벤치마크 — Spec-First의 천장

저자는 자신의 CLAUDE.md에서 직접 발견한 한계를 IFScale 벤치마크로 확증한다:

| 동시 지시 수 | 최고 모델 준수율 | 약한 모델 |
|-------------|----------------|----------|
| 10개 | ~100% | ~100% |
| 500개 | **68%** | **단자릿수 추락** |

**CLAUDE.md 200줄을 넘기면** — 의외로 쉽게 넘김 — 실질 준수율 하락 발생. 이것이 L1의 천장이다.

저자의 진단: **"Spec-first는 '에이전트가 컨텍스트를 모른다'는 문제는 풀지만, '사양이 일주일 뒤 썩는다'는 문제는 풀지 못한다."** L2가 필요한 이유.

### 2.5 Level 2 — Spec-Anchored — 돌파 지점

저자는 L1 → L2 이동을 **"가장 어려우면서 동시에 가장 ROI가 높은 도입 지점"** 으로 못 박는다. L2에서 사양은 구현 후 폐기되지 않고, **코드 옆에 살며, 코드와 함께 진화하며, 모든 수정의 진리원(source of truth)** 이 된다.

#### 2.5.1 SLUMP 벤치마크 — 90% 회복의 한 가지 구조 변경

가장 강력한 실증 증거는 **SLUMP**(Faithfulness Loss Under Emergent Specification, 출현하는 사양 하의 충실도 손실).

**실험 설계:**
- 20개 복잡한 ML 구현, 371개 원자 컴포넌트
- 조건 A: 완전한 사양으로 처음부터 제공
- 조건 B: 60개 점진적 요청으로 사양이 대화에서 "출현"

**결과**: 조건 B에서 에이전트는 충실도를 잃음 — 이전 결정을 잊고, 모듈 간 통합을 깨뜨리고, 이전 지시와 모순되는 로직을 환각(hallucinate).

**개입(ProjectGuard)**: 사양을 대화 이력 밖 영속 레이어로 유지.

| 지표 | Before (대화 기반) | After (영속 파일) | 회복률 |
|------|------------------|------------------|--------|
| 충실 컴포넌트 수 | 118개 | **181개** | — |
| 잃어버린 충실도 | — | — | **90% 회복** |

저자의 자기 고백:

> "Initially, I was skeptical of SDD — it looked like waterfall dressed up in Markdown. I changed my mind when I saw the SLUMP data."

#### 2.5.2 Constitutional SDD — 은행 프로덕션 데이터

은행권 도입 사례 (CWE/MITRE Top 25를 협상 불가 보안 원칙으로 정의한 Constitution을 사양 영속 요소로 둠):

| 지표 | 개선 |
|------|------|
| 보안 결함 | **-73%** |
| 첫 보안 빌드 도달 시간 | **-56%** |
| 컴플라이언스 문서 커버리지 | **4.3배** |

이 데이터는 [15개 SDD 프레임워크 비교](../15-sdd-frameworks-comparison/report.md)에서 인용된 Marri의 arXiv:2602.02584 논문과 동일한 출처다. 같은 저자가 두 글에서 일관되게 같은 데이터를 인용한다.

#### 2.5.3 멀티 에이전트의 조정 프로토콜

저자가 짧지만 결정적인 한 문장을 남긴다:

> "In multi-agent architectures, a living spec becomes an inter-agent coordination protocol — parallel agents read the same contract as their source of truth. Without a shared specification, they inevitably diverge."

병렬 에이전트는 **공유 사양 없이는 필연적으로 발산한다**. 이 명제는 [하네스 엔지니어링](../anthropics-harness-engineering/report.md), [서브에이전트 조율](../claude-code-subagents-coordination/report.md) 의 컨텍스트와 직결된다.

### 2.6 Level 3 — Spec-as-Source — 코드는 부산물

L3의 정의: **사양이 인간이 편집하는 유일한 산출물**. 코드에는 헤더가 붙는다 — `GENERATED FROM SPEC — DO NOT EDIT`. 개발자 역할은 코드 작성에서 **계약 설계(designing contracts)** 로 전환.

#### 2.6.1 Tessl — $125M의 베팅

| 항목 | 내용 |
|------|------|
| 투자 | $125M (밸류에이션 $500M 이상) |
| 창업자 | Guy Podjarny (Snyk 창업자) |
| 제품 1 | **Tessl Framework** — MCP 호환 |
| 제품 2 | **Tessl Spec Registry** — 인기 라이브러리 1만+ 사용 사양 패키지. 에이전트의 API 환각 문제 해결 |
| Podjarny 예측 | "에이전트와 일하는 개발자는 곧 대부분 시간 동안 코드를 보지 않게 될 것" |

#### 2.6.2 MDA의 유령 — 왜 신중해야 하는가

저자는 역사적 정직함을 의무로 본다:

| 항목 | MDA (2001) | SDD L3 (2026) |
|------|-----------|---------------|
| 기본 형식 | UML | **Markdown** |
| 표준 | 벤더별 | **MCP** (오픈) |
| 반복 비용 | 수개월 | **수분** |
| Martin Fowler 평가 | "Night of the Living Case Tools" | (아직) |
| 결과 | 추상화 임피던스, 도구 락인, 가파른 역량 장벽 → 실패 | 미정 |

저자의 결론: **"L3는 지평선(horizon)이지 출발점이 아니다. 2026년 현실 목표는 L2."**

### 2.7 가장 강력한 반론 — Beck, Zaninotto, Sutton

저자는 자기 입장을 강화하기 위해 가장 날카로운 비판들을 정면으로 인용한다.

#### 2.7.1 Kent Beck (TDD 창시자, Agile Manifesto 서명자)

> "내가 본 SDD 설명은 구현 전 완전한 사양을 작성하는 것을 강조한다. 그건 구현 중 아무것도 배우지 않을 거라는 기이한 가정을 전제한다."

저자의 응답: **이 비판은 L1에는 적중하지만 L2에는 빗나간다**. L2는 구현이 명시적으로 사양에 환류된다.

#### 2.7.2 François Zaninotto (Marmelab CEO)

타임 트래킹 앱에서 **단지 날짜 표시 하나에 8개 파일과 1,300줄**이 생성됐다. 7가지 실전 문제:

1. 컨텍스트 맹시(context blindness)
2. 마크다운 매드니스(markdown madness)
3. 체계적 관료주의(systematic bureaucracy)
4. 페이크 애자일(faux agile)
5. 이중 코드 리뷰
6. 거짓 안전감 — **에이전트가 테스트를 작성하지 않고 done으로 표시**
7. 브라운필드 프로젝트에서 수확체감

저자: **"이건 허수아비 논쟁이 아니라 진짜 문제다."**

#### 2.7.3 Rich Sutton — The Bitter Lesson

> 일반 메서드(general methods)가 계산 규모(computational scale)를 활용하여 역사적으로 손으로 만든 규칙(hand-crafted rules)을 이겨 왔다.

저자의 적용: **사양은 규칙이고, 규칙은 천장이다.** SDD가 모든 변수를 마이크로매니지하면 비효율적·비대한 프로그래밍 언어가 되고, MDA처럼 죽는다.

#### 2.7.4 대안 — Obie Fernandez의 TDD

Obie Fernandez는 Claude Code + TDD로 13,000줄의 프로덕션 코드를 만들었다 — "TDD가 나를 루프 안에 가뒀다 — 테스트는 무엇이 만들어지는지 이해하도록 강제하는 강제 함수(forcing function)다."

저자: **"진짜 옵션이지만, 영속 아키텍처 사양 없는 TDD는 멀티 에이전트로 스케일하지 않는다."**

### 2.8 BDD 경로 vs MDA 경로 — 운명의 분기

저자가 자기 입장을 명시한다 — SDD는 **BDD 경로를 따를 것**이고, MDA 경로가 아니다. 3가지 이유:

1. **마크다운이 UML을 대체** → 진입 장벽 제거
2. **MCP가 표준** → 벤더 락인 제거
3. **반복 비용이 수개월에서 수분으로** → 빠른 피드백 가능

**비협상 조건(non-negotiable condition):**

> "사양은 **WHAT과 BOUNDARIES**를 정의해야 하지 **HOW를 정의하면 안 된다**. 사양이 라인별로 구현을 받아쓰는 순간 SDD는 죽고, The Bitter Lesson이 이긴다."

### 2.9 처방 — 월요일 아침부터의 행동 계획

저자는 추상적 권고 대신 4개 구체적 단계를 제시한다:

| # | 행동 | 산출물 |
|---|------|--------|
| 1 | **감사(Audit)** — CLAUDE.md가 아키텍처 제약을 정의하는지(단순 포매팅 외) 점검. 아니면 제약부터 시작 | CLAUDE.md 진단 보고 |
| 2 | **도구 채택** — Spec Kit / Kiro / spec-workflow-mcp 중 하나를 기존 워크플로우에 통합 | 1개 도구 도입 |
| 3 | **2026 Q2 목표** — 한 프로젝트를 spec-first → spec-anchored로 마이그레이션. 사양이 레포에 살고, 매 구현 후 양방향 업데이트 | 마이그레이션 PoC 1건 |
| 4 | **관찰** — Tessl Spec Registry, DORA 2026 결과, SWE-bench Pro의 human-augmented specs 진화 | 모니터링 리스트 |

마지막 호소(저자 직접 인용):

> "이번 주, 사양을 대화창에서 꺼내 레포 영속 파일로 옮겨라."

## 3. 핵심 인사이트 정리

1. **SDD는 도입 여부의 문제가 아니라 위치의 문제**다. CLAUDE.md·`.cursorrules`·AGENTS.md를 쓰는 모든 팀은 이미 L1에 있다. 진짜 질문은 "L2로 언제 올라갈 것인가"다 — 도입 결정의 프레임 자체가 다르다.

2. **L1 → L2 이동이 가장 높은 ROI를 가진다**. 단 한 가지 구조 변경 — 사양을 채팅에서 영속 파일로 분리 — 만으로 SLUMP 충실도의 90%가 회복된다(118 → 181 컴포넌트). 가장 어려운 동시에 가장 강력한 도약이다.

3. **CLAUDE.md 200줄은 보이지 않는 천장**이다. IFScale 기준 동시 지시 500개에서 최고 모델도 68% 준수율로 추락한다. CLAUDE.md를 더 채우는 게 답이 아니라, 사양 매체 자체를 L2로 바꾸는 것이 답이다.

4. **"양방향성"이 SDD를 워터폴과 분리하는 단 하나의 라인**이다. "코드 전 작성"은 "코드 전 동결"이 아니다. 양방향 피드백 루프가 없으면 SDD 사양은 화려한 프롬프트에 불과하다 — 워터폴 시즌 2가 된다.

5. **L3 Spec-as-Source는 지평선이지 출발점이 아니다**. Tessl이 $125M을 베팅했지만, MDA(2001)도 같은 약속을 하다 죽었다. 차이가 있다(Markdown·MCP·빠른 반복) 해도, 프로덕션 데이터가 부재하다. **"Watch it, don't adopt it."**

6. **반론은 L1에는 적중하지만 L2에는 빗나간다**. Beck의 "구현 중 학습 못 한다"는 비판은 L1에는 맞지만, L2의 양방향 업데이트는 정확히 이 학습을 사양에 환류한다. 비판을 회피하지 않고 끌어안되, 레벨 구분으로 무력화하는 변증법.

7. **Bitter Lesson을 인정하는 비협상 조건이 SDD의 생존선**이다 — 사양은 **WHAT과 BOUNDARIES**만 정의해야지 **HOW를 정의하면 안 된다**. 이 라인을 넘는 순간 SDD는 비대한 프로그래밍 언어가 되어 MDA처럼 죽는다.

## 4. 원문 영어 표현 해설

### 핵심 개념어

| 원문 | 직역 | 저자가 의도한 뉘앙스 |
|------|------|---------------------|
| **Spec-first / Spec-anchored / Spec-as-source** | 사양 우선 / 사양 정박 / 사양이 곧 소스 | 단순 단계가 아닌 **'사양과 코드의 관계'** 의 변화. *first*는 시간적 순서, *anchored*는 공간적 결박(코드가 사양에 닻을 내림), *as-source*는 본질적 환원(코드의 원천). 영어가 가진 전치사·접미사 미세 차이를 활용한 정밀한 명명 |
| **Living specification** | 살아 있는 사양 | "Living"은 정적/동결의 반대. 미국 비즈니스 영어에서 *living document* 는 위키·정책·헌법 개정 맥락에서 자주 쓰임. 사양에 적용함으로써 "버전 관리되는 헌법" 이미지 환기 |
| **Specification drift** | 사양 표류 | *drift* 는 항해·천문·지질에서 차용된 단어. **의도된 항로에서 천천히, 무의식적으로 벗어남**의 함의. *deviation*보다 부드럽고, *divergence*보다 점진적. 책임 소재가 모호해지는 뉘앙스 — 누가 잘못한 게 아니라 자연스럽게 일어난다는 면죄부적 어감 |
| **Maturity ladder** | 성숙도 사다리 | *ladder* 는 *level/tier/stage*보다 **수직 진보**의 시각적 강도가 강함. CMMI(Capability Maturity Model Integration)의 5단계 사다리에서 차용된 산업 영어 관습 |
| **Machine contract** | 기계 계약 | *contract* 는 Design by Contract(Bertrand Meyer, 1986)에서 차용. **법적 강제력의 비유** — 위반 시 명확한 결과. *agreement/promise*보다 무거운 단어. AI에게 "약속"이 아니라 "계약"을 거는 뉘앙스 |
| **Forcing function** | 강제 함수 | 항공·시스템 안전 공학 용어 — **사용자가 다음 단계로 가려면 반드시 거쳐야 하는 메커니즘**. 자동차 시동을 걸려면 브레이크를 밟아야 하는 식. TDD 테스트가 그 역할이라는 Obie Fernandez 인용에서 등장 |
| **Steering document** | 조타 문서 | *steering* 은 자동차·선박의 조향. **방향을 잡되 동력을 제공하지는 않는** 문서의 역할. 정책/거버넌스 영어에서 *steering committee* 와 같은 패밀리 |
| **Test oracle** | 테스트 오라클 | 소프트웨어 테스팅 용어 — 입력에 대해 **올바른 출력을 알려 주는 권위 있는 원천**. 그리스 신탁(oracle)에서 차용. SDD 사양이 신탁 역할을 한다는 비유 |

### 비유·수사 표현

| 원문 | 직역 | 문화적 맥락 |
|------|------|-------------|
| **"Like handing a new employee a set of loose verbal instructions on day one"** | 신입에게 첫날 구두로 느슨한 지시를 던지는 것 같다 | 미국 직장 영어의 *day one*(입사 첫날) 관용구. 한국어 "신입에게 사수 없이 구두 인계" 정서와 정확히 대응 |
| **"Temporary collaborator who doesn't know the project"** | 프로젝트를 모르는 임시 협력자 | *temporary* 는 미국 비즈니스에서 *temp worker*(파견·임시직) 함의 — 책임감 부재, 컨텍스트 부재. AI를 인격화하면서 동시에 그 한계를 명확히 하는 이중 효과 |
| **"Just fancy prompts"** | 그저 화려한 프롬프트 | *fancy* 는 본질 없이 외양만 꾸민 것을 비웃는 단어. *fancy* 단어 하나로 SDD를 마케팅으로 환원하려는 회의론자를 무장 해제 |
| **"Marketing dressed up in Markdown" / "Waterfall dressed up in Markdown"** | 마크다운으로 분장한 마케팅/워터폴 | *dressed up* 은 본질 위장의 시각적 비유. 저자가 자기 과거 회의(L2 SDD를 처음엔 "마크다운 워터폴"로 봤다)를 솔직히 노출. **자기 비판 → 신뢰 증대** 수사 |
| **"Night of the Living Case Tools"** (Martin Fowler 인용) | 살아 있는 케이스 툴의 밤 | 영화 *Night of the Living Dead*(1968) 좀비 영화 패러디. CASE Tools(MDA 시대의 코드 생성 도구)가 좀비처럼 죽지 않고 돌아다닌다는 풍자. **Fowler의 위트가 SDD 진영에 부메랑으로 돌아올 수 있다는 경고**의 차용 |
| **"Plans are useless, but planning is indispensable"** (Eisenhower 인용) | 계획은 쓸모없으나 계획 행위는 필수다 | 군사령관·대통령의 격언. 정적 산출물(plan)과 동적 프로세스(planning)의 분리. SDD 양방향성 메시지의 권위 부여 |
| **"A contract is a form of trust that doesn't require trust"** (Niklas Luhmann) | 계약은 신뢰를 요구하지 않는 형태의 신뢰다 | 독일 사회학자의 시스템 이론. AI에게 신뢰를 묻지 말고 **계약 구조로 신뢰를 대체**하라는 메시지의 학술적 정당화 |
| **"History doesn't repeat itself, but it rhymes"** (Mark Twain) | 역사는 반복되지 않지만 운(韻)을 맞춘다 | MDA(2001)와 SDD L3(2026)의 패턴 유사성을 함의. **운(rhyme)** 단어가 정확한 반복이 아닌 패턴 닮음을 시적으로 표현 |

### 업계 전문 용어

| 원문 | 의미 | 맥락 |
|------|------|------|
| **Vibe coding** | 바이브 코딩 — 개발자가 "바이브에 완전히 굴복"하여 AI 생성 코드를 리뷰 없이 수용하는 모드 | Andrej Karpathy의 2025년 2월 트윗에서 기원. 1년 후 Karpathy 본인이 *agentic engineering* 으로 후퇴 |
| **EARS notation** | Easy Approach to Requirements Syntax — `WHEN [trigger], THE SYSTEM SHALL [response]` | 시스템 공학(ESA, 항공우주)에서 발원. Amazon Kiro IDE가 SDD에 도입. **SHALL** 은 ISO/IEEE 표준 요구사항 작성에서 의무를 표시하는 형식어 |
| **Constitution / constitution.md** | 헌법 — 협상 불가 아키텍처 원칙 | Spec Kit(2025년 하반기), Constitutional SDD(Marri arXiv:2602.02584)의 명명. 회사 내규처럼 매 세션 로드. [15개 SDD 비교](../15-sdd-frameworks-comparison/report.md) 에서 6개 프레임워크가 채택 |
| **CWE / MITRE Top 25** | Common Weakness Enumeration / MITRE의 Top 25 위험 가중 보안 약점 목록 | 보안 업계 표준. Constitutional SDD가 이 목록을 협상 불가 보안 원칙으로 헌법화 |
| **Specification drift** | 사양 표류 (재게재) | AI 에이전트 평가에서 등장한 신조어 — *concept drift*(머신러닝의 데이터 분포 변화)에서 차용 |
| **Brownfield project** | 갈색 부지 프로젝트 — 기존 코드베이스 위에서 진행되는 프로젝트 | 부동산 *brownfield*(이전 산업 부지) vs *greenfield*(미개발지) 차용. SDD가 brownfield에서 ROI가 떨어진다는 Zaninotto 비판의 함의 |
| **Code churn** | 코드 처닝 — 작성 후 짧은 시간 내 변경되는 코드 비율 | GitClear가 측정 지표로 정의(2주 윈도우). 높을수록 불안정 코드. *churn* 은 우유 휘저음(휘발성)의 비유 |
| **Specification faithfulness** | 사양 충실도 — 구현이 사양을 따르는 정도 | SLUMP 벤치마크 핵심 지표. *fidelity*보다 *faithfulness* 가 더 도덕적·관계적 함의 |
| **Spec Registry** | 사양 레지스트리 | npm·PyPI 같은 패키지 매니저에서 차용. Tessl이 라이브러리별 사용 사양 1만+ 개를 패키지화 |
| **The Bitter Lesson** | 쓰라린 교훈 | Rich Sutton의 2019년 에세이. RL/AI 역사 70년의 교훈 — 인간이 만든 규칙은 결국 일반 메서드 + 계산 규모에 진다 |
| **Multi-agent coordination protocol** | 멀티 에이전트 조정 프로토콜 | 분산 시스템·게임 이론에서 차용. SDD 사양이 에이전트 간 **공유 진리원** 역할을 한다는 정의 |

### 저자 어투 분석

Jarosław Wasowski의 어조는 **이중 변증(double dialectic)** 과 **공개적 자기 수정(public self-correction)** 으로 특징지어진다 — [15개 SDD 프레임워크 비교](../15-sdd-frameworks-comparison/report.md) 와 동일한 패턴.

1. **공개적 자기 수정 — 신뢰 증폭의 수사**

   "Initially, I was skeptical of SDD — it looked like waterfall dressed up in Markdown. I changed my mind when I saw the SLUMP data."

   저자는 자기 입장 변경을 숨기지 않는다. 같은 톤이 [15개 비교](../15-sdd-frameworks-comparison/report.md) 의 "처음엔 인기 도구 2~3개만 보면 된다고 생각했지만 15개 전체를 봐야 했다"에서도 반복. **자기 회의를 노출 → 독자의 회의를 선제적으로 흡수 → 결론의 신뢰 증폭**.

2. **반론 우선 인용 — 변증의 강도**

   Kent Beck, François Zaninotto, Rich Sutton — 이 셋은 SDD의 가장 위협적인 비판자다. 저자는 이들의 비판을 **자기 입장보다 먼저, 더 강하게** 인용한다. 이는 두 가지 효과:
   - 독자가 가질 수 있는 가장 강한 반론을 선제적으로 무력화
   - 비판을 모르는 척하지 않음으로써 학자적 권위 확보

3. **격언 인용의 위계**

   에피그라프(epigraph) 배치가 의도적이다 — Alain(철학) → Eisenhower(군사·정치) → Luhmann(사회학) → Lao Tzu(고대 중국) → Kant(독일 철학) → Gibson(SF) → Twain(문학) → Buscaglia(교육). **다양한 권위 영역의 인용**으로 SDD 논의가 단순 기술 트렌드가 아닌 **인류 보편의 문제**라는 격을 부여.

4. **데이터 인용의 정확성과 출처 명시**

   GitClear 2.11억 줄, IFScale 10/500, SLUMP 118→181, Constitutional SDD 73%/56%/4.3x, Tessl $125M/$500M — **숫자에 출처가 있다**. 이는 [15개 비교](../15-sdd-frameworks-comparison/report.md) 의 Marri arXiv:2602.02584, Piskala arXiv:2602.00180 인용 패턴과 일치. **arXiv 번호까지 박는 학술 정밀성**.

5. **명명의 정밀성 (linguistic precision)**

   *spec-first / spec-anchored / spec-as-source* — 같은 단어 *spec* 에 다른 접미사·전치사를 붙여 미세 차이를 새긴다. *first*(시간), *anchored*(공간), *as-source*(본질). 비슷한 패턴이 [15개 비교](../15-sdd-frameworks-comparison/report.md) 의 *Solo / Enterprise / Brownfield / Security-critical* 4-결정-경로에서도. **저자는 단어를 정원처럼 가꾸는 사람**.

6. **이전 글 자기 인용 — 출판물 구축 의도**

   "Check out how to effectively manage context using SDD in my publication: Managing Agent Context at Every Stage of the SDLC" — 저자는 자기 publication을 구축하고 있다. [15개 비교](../15-sdd-frameworks-comparison/report.md) 의 후속 글로 본 글을 위치시킴으로써 **연재 시리즈로서의 권위**를 누적.

7. **마무리의 행동 명령 (call to action)**

   "이번 주, 사양을 대화창에서 꺼내 영속 파일로 옮겨라" — 추상적 권유가 아닌 **구체적·즉각적 행동 1개**. 같은 패턴이 [15개 비교](../15-sdd-frameworks-comparison/report.md) 결론의 "내 컨텍스트는 무엇인가를 한 문장으로 적으라"에서도. **이 저자는 항상 마지막에 한 줄짜리 실행 명령을 남긴다.**

---

*카테고리: AI Engineering/개발 방법론*
*태그: `#SDD` `#spec-driven-development` `#maturity-model` `#spec-first` `#spec-anchored` `#spec-as-source` `#CLAUDE-md` `#living-spec` `#specification-drift` `#SLUMP` `#constitution-pattern` `#vibe-coding`*
*키워드: SDD, Spec Driven Development, 성숙도 모델, maturity ladder, CLAUDE.md, living specification, spec-first, spec-anchored, spec-as-source, specification drift, 사양 표류, vibe coding, 바이브 코딩, SLUMP, ProjectGuard, IFScale, GitClear, Constitutional SDD, Spec Kit, Amazon Kiro, spec-workflow-mcp, Tessl, Spec Registry, EARS, MDA, BDD, TDD, Kent Beck, Zaninotto, Bitter Lesson, Karpathy*
*관련 문서: [15개 SDD 프레임워크 비교](../15-sdd-frameworks-comparison/report.md) (동일 저자), [아젠틱 코딩 프레임워크 실전 가이드](../agentic-frameworks-practical-guide/report.md), [에이전틱 AI 엔지니어링을 위한 SDLC](../sdlc-agentic-ai-engineering/report.md), [Anthropic 하네스 엔지니어링](../anthropics-harness-engineering/report.md), [서브에이전트 조율](../claude-code-subagents-coordination/report.md)*
*Generated: 2026-05-14*
