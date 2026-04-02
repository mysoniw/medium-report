# [1/8] Claude Certified Architect: CCA Foundations 시험 완벽 가이드

> 원문: [Claude Certified Architect: The Complete Guide to Passing the CCA Foundations Exam](https://medium.com/towards-artificial-intelligence/claude-certified-architect-the-complete-guide-to-passing-the-cca-foundations-exam-9665ce7342a8) — Rick Hightower, 2026년 3월 25일

---

## 1. 요약

2026년 3월 12일 Anthropic이 **Claude Certified Architect(CCA) Foundations** 시험을 출시했다. AI 업계 최초로 "Claude로 프로덕션 시스템을 실제로 설계할 수 있는가"를 검증하는 전문 자격증이다. 프롬프트를 잘 쓰는지, 튜토리얼을 봤는지가 아니라 **실제 동작하는 소프트웨어를 아키텍팅할 수 있는지**를 시험한다.

저자 Rick Hightower는 Fortune 100 금융사에서 ML/AI 개발을 이끈 기술 임원으로, 이 기사는 8부작 시리즈의 첫 번째 글이다. 시험 형식, 5개 역량 도메인, 6개 프로덕션 시나리오, 합격자와 불합격자를 가르는 5가지 멘탈 모델, 그리고 실제로 점수를 잃는 지점을 기반으로 설계한 **4주 학습 계획**을 제공한다.

핵심 메시지: 이 시험은 "무엇을 해야 하는가"만큼 **"무엇을 하면 안 되는가"**를 시험한다. 안티패턴을 인식하는 속도가 합격을 결정한다.

---

## 2. 상세 내용

### 2.1 왜 CCA가 지금 중요한가

Anthropic이 이 자격증과 함께 **$100M Claude Partner Network 투자**를 발표했다. 파트너사 규모가 이 투자의 의미를 말해준다:

| 파트너 | 규모 |
|--------|------|
| Accenture | 30,000명 전문가 교육, Anthropic Business Group 신설 |
| Cognizant | 350,000명에게 Claude 접근권 부여 |
| Deloitte | 470,000명을 플랫폼에 투입 |
| Infosys | Center of Excellence 구축 |

이들은 파일럿이 아니라 **수십만 명 단위의 인력 전환**이다. 이 모든 조직에 Claude 기반 시스템을 아키텍팅할 수 있는 사람이 필요하고, CCA는 표준화된 검증 신호가 없는 시장에서 **최초의 표준화된 신호**다.

저자의 판단: "시장이 아직 형성 중일 때 CCA 배지를 들고 나타나는 것과, 2년 뒤 모두가 가지고 있을 때 나타나는 것은 전혀 다른 상황이다."

### 2.2 시험 형식

| 항목 | 내용 |
|------|------|
| 문항 수 | 60문항 |
| 시간 | 120분 (문항당 2분) |
| 합격 점수 | 720 / 1,000 |
| 비용 | $99 |
| 난이도 | 301-level (6개월 이상 실무 경험 전제) |
| 형식 | 시나리오 기반 객관식 (150-200단어 시나리오 후 최적 아키텍처 결정 선택) |
| 시험 환경 | 감독관 모니터링, 일시 중지 불가, 외부 도구 사용 불가 |
| 프로덕션 시나리오 | 6개 중 **4개 랜덤 출제** (전부 준비해야 함) |

**시간 관리 전략** (초기 응시자 피드백): 1차 패스로 확실한 문제 먼저 풀고, 망설여지는 문제는 플래그 → 남은 시간에 재방문. 한 문제에 5분 쓰지 말 것.

### 2.3 5개 역량 도메인

| 도메인 | 비중 | 권장 학습 시간 | 핵심 |
|--------|------|---------------|------|
| **1. Agentic Architecture** | 27% | 8-10시간 | 멀티 에이전트 설계, coordinator-subagent 패턴 |
| **2. Claude Code** | 20% | 6-7시간 | CLAUDE.md 계층, CI/CD `-p` 플래그 |
| **3. Prompt Engineering** | 20% | 6-7시간 | 구조화된 출력, tool_choice, validation-retry |
| **4. Tool Design & MCP** | 18% | 6-8시간 | Tool vs Resource 경계 (**가장 많이 실점하는 도메인**) |
| **5. Context Management** | 15% | 4-5시간 | Lost in the Middle, Token Economics |

**도메인 1 — Agentic Architecture (27%)**

시험의 최대 비중. 알아야 할 것:
- **Coordinator-Subagent 패턴**: 코디네이터가 전문 서브에이전트에 작업 위임 → 결과 종합
- **Hub-and-Spoke 패턴**: 병렬 독립 작업 (의존성 없음)
- **핵심 함정**: 서브에이전트는 컨텍스트를 자동 상속하지 않는다. 빈 컨텍스트로 시작. 명시적으로 전달해야 한다.
- **"슈퍼 에이전트" 안티패턴**: 15개+ 도구를 가진 단일 에이전트 → 거의 항상 오답
- **에스컬레이션**: 모델의 자체 판단이 아닌 **결정론적 규칙**(금액, 계정 등급, 이슈 유형)으로 판단

**도메인 2 — Claude Code (20%)**

- **CLAUDE.md 계층**: 프로젝트 레벨(`.claude/CLAUDE.md`, 버전 관리) vs 사용자 레벨(`~/.claude/CLAUDE.md`, 개인). 개인 설정을 프로젝트 CLAUDE.md에 넣는 것은 안티패턴.
- **CI/CD**: `-p` 플래그(비대화 모드) + `--bare`(재현성) + `--output-format json`. CI/CD에서 `-p` 없이 실행 = 시스템 행(hang).
- **Plan 모드 vs Direct 실행**: 복잡한 멀티파일 변경 → Plan 모드. 명확한 저위험 작업 → Direct.

**도메인 3 — Prompt Engineering (20%)**

- **핵심 안티패턴**: 프롬프트로만 JSON 준수를 강제하는 것. "Please respond only in valid JSON"은 대부분 동작하지만 프로덕션에서 실패한다.
- **정답**: `tool_choice` + 입력 스키마, structured outputs API(`client.messages.parse()`), validation-retry 루프.
- **시험 팁**: "시스템 프롬프트에 지시 추가" 또는 "더 상세한 포맷팅 가이드" 같은 선택지는 거의 항상 오답.

**도메인 4 — Tool Design & MCP (18%)**

**가장 많은 예상 외 실점이 발생하는 도메인.** 비중(18%)보다 학습 시간을 더 투자해야 한다.

- **MCP 3대 프리미티브**: Tool(실행 가능한 함수), Resource(읽기 전용 데이터), Prompt(재사용 템플릿). 경계를 정확히 구분하는 것이 이 도메인의 핵심.
- **판별법**: Claude가 action을 취해야 하면 Tool, 컨텍스트로 읽기만 하면 Resource.
- **4-5 Tool 규칙**: 에이전트당 4-5개. 18개 도구를 가진 에이전트 → 선택 정확도 저하. 초과분은 전문 서브에이전트로 분산.
- **Tool Description**: Claude가 도구를 선택하는 주요 메커니즘. 에이전트 이름도, 도구 이름도 아닌 **설명**으로 라우팅한다. 모호하게 쓰면 잘못된 도구가 호출된다.

**도메인 5 — Context Management (15%)**

비중은 가장 낮지만 다른 모든 도메인에 영향을 미친다.

- **"Lost in the Middle" 효과**: 컨텍스트 창의 **중간에 묻힌 정보는 주의를 덜 받는다.** 처음이나 끝에 중요 정보를 배치.
- **Token Economics**: 반드시 암기

| API | 비용 절감 | 지연 시간 | 적합한 용도 |
|-----|----------|-----------|------------|
| Prompt Caching | 최대 90% | 실시간 | 반복 시스템 프롬프트, 정책 문서 |
| Batch API | 50% | 최대 24시간 | 야간 감사, 대량 처리 |
| Real-Time API | 표준 | 실시간 | 사용자 대면 워크플로우 |

**시험 팁**: 사용자가 응답을 기다리는 상황에서 비용 최적화 질문 → 답은 절대 Batch API가 아니라 Prompt Caching.

### 2.4 6개 프로덕션 시나리오

시험마다 6개 중 4개가 랜덤 출제. 전부 준비해야 한다.

| # | 시나리오 | 핵심 함정 |
|---|----------|-----------|
| 1 | **고객 지원 에이전트** | Claude의 자체 신뢰도 점수로 에스컬레이션 결정 → 오답. 결정론적 규칙 사용 |
| 2 | **Claude Code 코드 생성** | 큰 컨텍스트 창이 주의력 분산을 해결한다고 믿는 것 → 오답. Lost in the Middle은 크기와 무관 |
| 3 | **멀티 에이전트 리서치** | 슈퍼 에이전트(18개 도구) → 오답. 4-5개씩 분산. 서브에이전트 컨텍스트 자동 상속 아님 |
| 4 | **개발자 생산성 도구** | Plan 모드 vs Direct 실행 판단, CLAUDE.md 계층 |
| 5 | **CI/CD용 Claude Code** | `-p` 플래그 없이 CI/CD에서 실행 → 오답. `--bare` + `--output-format json` |
| 6 | **구조화 데이터 추출** | 프롬프트만으로 JSON 강제 → 오답. tool_choice + validation-retry |

### 2.5 합격자를 만드는 5가지 멘탈 모델

| # | 멘탈 모델 | 원칙 |
|---|-----------|------|
| 1 | **프로그래밍적 강제 > 프롬프트 가이드** | 프롬프트는 가이드. 코드는 법. 신뢰성이 필요하면 답은 코드 |
| 2 | **서브에이전트는 컨텍스트를 상속하지 않는다** | 빈 슬레이트로 시작. 명시적 전달 필수. 가장 많이 시험되는 개념 |
| 3 | **Tool Description이 라우팅을 결정한다** | 에이전트 이름이 아닌 도구 설명으로 선택. 모호한 설명 = 잘못된 도구 호출 |
| 4 | **"Lost in the Middle" 효과는 실재한다** | 중요 정보를 컨텍스트 처음/끝에 배치. 모든 긴 컨텍스트 시나리오에 적용 |
| 5 | **API를 지연 시간 요구에 맞춰라** | 사용자 대기 → Real-Time + Prompt Caching. 배경 작업 → Batch API |

### 2.6 4주 학습 계획

| 주차 | 과정 | 목표 |
|------|------|------|
| **1주** | Claude 101, AI Fluency Framework | 어휘·멘탈 모델 내재화 (agentic loop, context forking, stop reason, tool_choice 등) |
| **2주** | Building with the Claude API (8-10시간, **최우선**) | validation-retry 루프 직접 구축, tool_choice 구조화 출력, 3-4개 도구를 가진 에이전트 |
| **3주** | MCP Mastery, Claude Code in Action, Agent Skills | MCP 서버 구축 (3 Tool + 1 Resource), CLAUDE.md 설정, CI/CD `-p` 플래그 실행 |
| **4주** | 모의 시험 + 안티패턴 복습 | 실전 조건(무노트, 무문서) 모의 시험 → 900+ 목표 후 본 시험 등록 |

총 학습 시간: **30-37시간** (이미 Claude로 개발 경험이 있는 경우). 초심자는 2-4주 추가.

### 2.7 초기 응시자 피드백

시험 출시 11일 만의 커뮤니티 반응:

- 난이도는 실제로 높다: "튜토리얼 보고 합격하는 자격증이 아니다"
- **MCP Tool 경계**가 가장 예상 외 실점 영역
- 안티패턴 인식이 정답 아는 것만큼 중요
- 시나리오 체인(한 문제의 컨텍스트가 다음에 이어짐)에서 시간 관리 필수
- Reddit에서 985/1000 점수 보고 있음 → 만점에 가까운 점수 가능
- 합격선 720은 의미 있는 오차 범위 제공

### 2.8 학습 자료

**Anthropic 공식:**
- Anthropic Academy: anthropic.skilljar.com (13개 과정, 무료)
- CCA 시험 가이드: SlideShare 공식 가이드
- 모의 시험: Anthropic Academy 내 (900+ 벤치마크)
- 시험 등록: 접근 요청 양식

**공식 문서:**
- Claude Agent SDK, Claude Code, MCP, Advanced Tool Use, Batch Processing, Structured Outputs

**커뮤니티:**
- DEV Community: CCA 프로그램 내부, 준비 로드맵
- FlashGenius: CCA 플래시카드
- Udemy: CCA 모의 시험

---

## 3. 핵심 인사이트 정리

1. **AI 업계 최초의 프로덕션 아키텍처 자격증**: 프롬프트 엔지니어링이 아닌 "실제 시스템을 설계할 수 있는가"를 검증. Anthropic의 $100M 투자와 파트너사 85만+ 인력 전환이 이 자격증의 시장 가치를 증명한다.

2. **"하면 안 되는 것"을 아는 것이 합격의 절반**: 시험은 안티패턴 인식을 정답 선택과 동일한 비중으로 시험한다. 올바른 답을 읽기 전에 함정을 먼저 인식하는 속도가 합격을 결정.

3. **도메인 4(MCP)가 다크호스**: 비중 18%로 가장 낮은 축에 속하지만, 초기 응시자들이 가장 많은 예상 외 실점을 보고. Tool vs Resource 경계 판단은 실제로 구축해봐야만 체화된다.

4. **서브에이전트 컨텍스트 비상속이 가장 많이 시험되는 개념**: 직관에 반하기 때문. 같은 시스템 안의 에이전트가 인식을 공유한다고 가정하는 것이 인간의 자연스러운 오류.

5. **$99로 시장 선점 가능한 기회**: 커뮤니티가 작고 자격증이 신선한 지금 취득하는 것과, 2년 뒤 모두가 가지고 있을 때 취득하는 것은 전혀 다른 포지셔닝. 춘추전국시대의 깃발 꽂기.

6. **준비 과정 자체가 실력 향상**: 시험을 보지 않더라도, 4주 학습 계획을 따르면 tool design, context management, agentic architecture의 엣지 케이스를 발견하게 된다. 실무만으로는 드러나지 않는 지식 간극.

7. **"프롬프트는 가이드, 코드는 법" — 이 한 문장이 시험 전체를 관통**: 비즈니스 룰, JSON 준수, 라우팅 결정 등 모든 신뢰성 질문의 정답은 "더 나은 프롬프트"가 아니라 "코드로 강제".

---

## 4. 원문 영어 표현 해설

### 핵심 개념어

| 원문 | 직역 | 저자가 의도한 뉘앙스 |
|------|------|---------------------|
| **"301-level exam designed for seasoned professionals"** | 301 레벨, 노련한 전문가를 위한 시험 | **301-level** = 미국 대학 과목 번호 체계에서 3학년 수준. 100(입문) → 200(중급) → **300(고급 전공)**. "이건 입문 과정이 아니다"를 학술적 넘버링으로 표현. **seasoned** = 단순히 "경험 있는(experienced)"보다 무거운 단어. 양념이 충분히 배어든, 시간이 지나 숙성된 느낌. 6개월 이상 실무에서 "양념이 밴" 사람만 대상이라는 의미. |
| **"the distractors are plausible"** | 오답지가 그럴듯하다 | **distractor** = 시험학(psychometrics)의 전문 용어. 정답이 아닌 선택지를 "방해물"이라 부른다. **plausible** = "가능해 보이는, 그럴듯한". 오답이 명백히 틀린 게 아니라 실제로 맞는 것처럼 보인다는 경고. 실전 경험 없이는 구분 불가. |
| **"internalized knowledge"** | 내재화된 지식 | 단순 암기가 아닌, 뇌에 **체화된** 지식. "브라우저 탭에 있는 것이 아니라 머릿속에 사는 지식"이라고 저자가 직접 풀어 설명. 외부 도구 없이 시험을 봐야 하는 이유를 이 한 단어로 압축. |

### 비유·수사 표현

| 원문 | 직역 | 문화적 맥락 |
|------|------|------------|
| **"Let that number land for a moment"** | 그 숫자가 착지하도록 잠시 기다려라 | **land** = 비행기가 착륙하듯, 정보가 뇌에 "착륙"하는 순간. $100M이라는 숫자의 무게를 독자가 실감하도록 의도적으로 멈추게 하는 수사. 한국어로는 "그 숫자의 무게를 느껴보라" 정도. |
| **"You showing up with a CCA badge while the market is still forming is a different proposition"** | 시장이 아직 형성 중일 때 CCA 배지를 들고 나타나는 것은 다른 제안이다 | **proposition** = 단순 "상황"이 아닌 비즈니스 제안/가치 명제. "당신의 시장 가치가 달라진다"를 한 단어로. **showing up** = 격식 없는 구어체. "나타나다"보다 더 캐주얼. 면접장에 슬쩍 걸어 들어가는 이미지. |
| **"the knowledge has to live in your head, not in a browser tab"** | 지식이 브라우저 탭이 아닌 당신 머릿속에 살아야 한다 | 개발자가 수십 개 탭을 열어놓고 작업하는 습관을 정확히 겨냥. "탭에 사는 지식"은 즉시 떠오르지 않는 지식. **live in** = 거주하다. 지식을 마치 세입자처럼 비유. 머릿속에 상주해야 한다는 의미. |
| **"Prompts are guidance. Code is law."** | 프롬프트는 가이드. 코드는 법이다. | 블록체인의 "Code is law" 철학에서 차용. 프롬프트는 권고(guidance)에 불과하고, 진짜 강제력은 코드에 있다. 시험의 핵심 멘탈 모델을 6단어로 응축. 법과 가이드의 강제력 차이를 은유. |
| **"a line that is about to get very long"** | 곧 아주 길어질 줄 | 선착순 줄서기 비유. "지금은 줄이 짧다. 곧 길어진다. 지금 서라." FOMO(놓칠까 봐 두려운 심리)를 자극하되 과장하지 않는 톤. |

### 업계 전문 용어

| 원문 | 의미 | 맥락 |
|------|------|------|
| **"agentic loop"** | 에이전트 실행 루프 | 입력 수신 → 추론 → 도구 호출 → 결과 평가 → 다음 단계 결정의 반복 사이클. AI 에이전트의 핵심 실행 패턴. |
| **"context forking"** | 컨텍스트 분기 | 하나의 대화 컨텍스트를 여러 서브에이전트에 분기하는 패턴. Git의 branch와 유사한 개념. |
| **"stop reason"** | 생성 중단 이유 | API가 왜 생성을 멈췄는지 알려주는 신호. `tool_use`(도구 호출 대기), `end_turn`(완료), `max_tokens`(한도 도달). 이것을 확인하지 않으면 tool 결과를 놓친다. |
| **"validation-retry loop"** | 검증-재시도 루프 | 출력을 스키마로 검증 → 실패 시 에러를 Claude에 전달 → 수정 요청. 프로덕션에서 JSON 준수를 보장하는 핵심 패턴. |
| **"tool_choice"** | 도구 선택 제어 | API 파라미터. `auto`(모델 판단), `any`(반드시 도구 사용), 특정 도구(강제 지정). 구조화 출력의 핵심 메커니즘. |
| **"coordinator-subagent pattern"** | 코디네이터-서브에이전트 패턴 | 관리자 에이전트가 전문 에이전트에 작업 위임 후 결과 종합. 마이크로서비스 아키텍처의 orchestrator 패턴과 유사. |
| **"super agent anti-pattern"** | 슈퍼 에이전트 안티패턴 | 15개+ 도구를 가진 단일 에이전트. 도구 선택 정확도 저하 + 범위 과잉. 모놀리스 vs 마이크로서비스 논쟁의 AI 버전. |
| **"lost in the middle"** | 중간에 묻히는 효과 | 트랜스포머 모델이 컨텍스트 처음/끝에 더 주의를 기울이는 현상. 2023년 Stanford 연구에서 명명. |

### 저자 어투 분석

Rick Hightower의 문체는 **기술 강사의 명령형 직설**이 특징이다:

- **"Do not skip the exercises."** — 부드러운 권유가 아닌 명령. "운동을 건너뛰지 마라." 군사 교관의 톤. 이어서 이유를 설명하지만, 명령이 먼저 온다.
- **"Build this loop; do not just read about it."** — 세미콜론으로 명령을 연결. 읽기와 만들기를 대비. 저자의 핵심 교수법: 만들어봐야 안다.
- **"If you have not built an MCP server by the time you take the exam, you are gambling on this domain."** — "도박"이라는 단어로 위험을 체감시킨다. 강사가 학생에게 경고하는 톤.
- **"Handle your logistics beforehand."** — "사전에 환경을 정리해라." 시험 팁을 주면서도 군더더기 없는 문장. 불필요한 수식어 제로.

이전 보고서의 Reza Rezvani가 "데이터 기반 CTO"였다면, Rick Hightower는 **"부트캠프 수석 강사"**다. 명령 → 이유 → 예시 → 다시 명령의 구조를 반복하며, 독자를 학습자로 위치시킨다. "Let me be direct about what you are signing up for"처럼 선언한 뒤 높은 기준을 제시하는 것이 전형적 패턴.

---

*카테고리: AI/자격증*
*태그: `#claude-certified-architect` `#CCA` `#anthropic` `#certification` `#agentic-architecture` `#MCP` `#claude-code` `#tool-design` `#context-management` `#prompt-engineering`*
*키워드: Claude Certified Architect, CCA Foundations, Anthropic 자격증, 에이전트 아키텍처, MCP, Model Context Protocol, tool_choice, validation-retry loop, coordinator-subagent, Claude Code CI/CD, -p flag, CLAUDE.md, lost in the middle, prompt caching, batch API, 안티패턴*
*시리즈: CCA Scenario Deep Dive Series (1/8)*
*관련 문서: [Claude Code 슬래시 커맨드 5가지](../claude-code-slash-commands/report.md), [Boris Cherny의 Claude Code 팁 스킬 분석](../boris-cherny-claude-code-tips-skill/report.md)*
*Generated: 2026-03-31*
