# Boris Cherny의 42개 Claude Code 팁이 하나의 스킬이 되었다 — 전체 컬렉션이 밝히는 것

> 원문: [Boris Cherny's Claude Code Tips Are Now a Skill. Here Is What the Complete Collection Reveals.](https://alirezarezvani.medium.com/boris-chernys-claude-code-tips-are-now-a-skill-here-is-what-the-complete-collection-reveals-b410a942636b) — Reza Rezvani, 2026년 3월 23일

---

## 1. 요약

Boris Cherny(Claude Code 제작자)가 2026년 1월~3월에 걸쳐 트위터에 공유한 **57개 Claude Code 팁**(8개 스레드)을 @CarolinaCherry가 하나의 설치 가능한 Claude Code 스킬(`~/.claude/skills/boris/SKILL.md`)로 컴파일했다. 이 기사의 저자 Reza Rezvani는 해당 스킬을 healthtech 스타트업 7인 팀에서 1주간 실전 운영한 후, 개별 팁이 아닌 **전체 시스템으로서의 설계 철학**을 분석했다.

핵심 주장: 57개 팁은 원하는 것만 골라 쓰는 메뉴가 아니라, 아래부터 쌓아야 위가 동작하는 **스택**이다. 특히 1월에 바이럴된 Part 1-2 이후, **거의 아무도 다루지 않은 Part 3-5**가 전체 워크플로우를 완성시키는 결정적 구간이다.

---

## 2. 상세 내용

### 2.1 8개 파트 구조

Boris는 8주에 걸쳐 8개 스레드로 팁을 공개했다. 저자는 이것이 순차적 공개가 아닌 **의도된 의존 구조**라고 분석한다.

| 파트 | 공개일 | 팁 수 | 핵심 주제 | 성격 |
|------|--------|-------|-----------|------|
| Part 1 | 1/2 | 13 | 병렬 실행, Plan 모드, CLAUDE.md, 검증 | 기초 (7.9M views) |
| Part 2 | 1/31 | 10 | 팀 패턴, 공유 설정, 데이터/분석 | 팀 레이어 |
| Part 3 | 2/11 | 12 | Output Styles, Custom Agents, Sandboxing | **커스터마이징 (과소평가)** |
| Part 4 | 2/20 | 5 | `--worktree` 네이티브 격리 | 격리 레이어 |
| Part 5 | 2/27 | 2 | `/simplify`, `/batch` | 복합 연산 |
| Part 6 | 3/7~10 | 3 | `/loop`, Code Review Agents, `/btw` | 반복 + 리뷰 |
| Part 7 | 3/13 | 8 | `/effort max`, Remote Control, Voice Mode | 고급 모드 |
| Part 8 | 3/23~26 | 4 | Auto Mode, `/schedule`, iMessage, Auto-Memory | 자율화 |

### 2.2 스택 의존성 구조

```
Part 8: 자율화 (Auto Mode, /schedule, Auto-Memory)
  ↑ 전제: 모든 설정이 안정화되어야 자율 동작이 안전
Part 7: 고급 모드 (/effort max, Remote Control, Voice)
  ↑ 전제: 커스터마이징 + 격리가 완료된 환경
Part 5-6: 복합 연산 (/simplify, /batch, /loop)
  ↑ 전제: worktree 격리 + 팀 규칙이 CLAUDE.md에 축적됨
Part 4: 네이티브 Worktree 격리
  ↑ 전제: 충분한 병렬 세션 경험으로 격리의 필요성을 체감
Part 3: 커스터마이징 (Output Styles, Custom Agents, Sandboxing)
  ↑ 전제: 어떤 모드와 제약이 필요한지 판단할 경험 축적
Part 1-2: 기초 (병렬 세션, Plan 모드, CLAUDE.md, 팀 패턴)
```

저자의 핵심 관찰: "Boris did not share 42 tips. He shared one workflow, incrementally." — Boris는 42개 팁을 공유한 게 아니라 하나의 워크플로우를 점진적으로 공유한 것이다.

### 2.3 Part 1-2: 1월에 바이럴된 기초 (널리 알려진 부분)

1월 첫 스레드가 790만 뷰를 기록하며 세 가지 팁이 집중 조명되었다:

1. **병렬 세션**: 5-10개 Claude 인스턴스를 동시 실행. 터미널 5개 + claude.ai/code 5-10개.
2. **Plan 모드**: Shift+Tab으로 계획 모드 진입 → 계획이 충분하면 auto-accept로 전환 → Claude가 1-shot 구현.
3. **CLAUDE.md**: "Update your CLAUDE.md so you don't make that mistake again." Claude가 자기 규칙을 스스로 작성. Boris는 이것이 "eerily good(소름 끼칠 정도로 잘한다)"이라 표현.

### 2.4 Part 3: 과소평가된 커스터마이징 레이어

2월 11일 공개. 12개 팁 중 대부분이 "cosmetic"으로 치부되었으나, 저자는 3가지가 핵심이라 분석한다.

**Output Styles — 톤이 아닌 인지 모드 변경**

| 스타일 | 효과 |
|--------|------|
| Explanatory | 변경 이유를 설명하면서 코드를 작성 → PR에 reasoning이 붙어서 도착 |
| Learning | 코드를 만들어주는 대신 사용자를 코치 → 학습 목적에 적합 |

저자의 팀: 주니어 엔지니어에게 Explanatory를 기본값으로 설정 → PR 리뷰 시간 단축 (리뷰어가 결정을 재구성할 필요 없이 결정 자체를 리뷰)

**Custom Agents — `.claude/agents/*.md`로 역할별 에이전트 정의**

Boris는 `code-simplifier`, `verify-app`을 표준 서브에이전트로 사용. 저자의 팀은 `backend-reviewer`(API 표준 사전 로드), `migration-guard`(스키마 히스토리 읽기 전용)를 구축. `settings.json`의 `agent` 또는 `--agent` 플래그로 기본 에이전트를 설정하면, 메인 세션 자체가 특정 역할과 제약을 가진 엔티티로 변환된다.

**Sandboxing — 보안이 아닌 신뢰 가속**

`/sandbox`로 파일/네트워크 격리 활성화. 보안 효과도 있지만 실제 팀에서 더 큰 가치는: 컨테인먼트를 신뢰하면 auto-accept를 더 빠르게 누른다. "Claude가 뭔가 건드리면 어쩌지?"라는 인지 과부하(cognitive overhead)가 사라지면서 전체 루프가 가속된다.

### 2.5 Part 4: Worktree 네이티브 지원

2월 20일 공개. `claude --worktree my_feature`로 CLI에서 직접 worktree를 생성하고, `--tmux`와 조합하면 자체 세션까지 할당된다. 서브에이전트도 worktree 격리를 사용할 수 있어, Boris가 공유한 마이그레이션 프롬프트가 가능해진다:

> "Migrate all sync io to async. Batch up the changes, and launch 10 parallel agents with worktree isolation. Make sure each agent tests its changes end to end, then have it put up a PR."

10개 병렬 에이전트, 각각 격리, 각각 테스트, 각각 PR 생성.

### 2.6 Part 5: `/simplify`와 `/batch`

2월 27일 공개. 가장 밀도 높은 릴리스.

**/simplify — 코드 리뷰 1차 패스 자동화**

변경된 코드를 병렬 에이전트가 검토: 중복 로직 통합, 과도한 중첩 → guard clause, 스케일 안 되는 쿼리 등 구조적 이슈를 탐지. Boris는 일상적으로 프롬프트 끝에 붙여 사용: `hey claude make this code change then run /simplify`

저자의 5일간 평가: 시니어 엔지니어가 리뷰 첫 5분에 잡는 수준의 이슈를 탐지. 도메인 특화 검증(API 계약, read replica 라우팅 등)은 못 잡음. 코드 리뷰 대체가 아닌 **baseline 향상**.

**/batch — 대규모 병렬 마이그레이션**

인터랙티브 계획 → 병렬 에이전트 실행 → 각각 worktree에서 테스트 → 각각 PR 생성. 저자의 실전: 14개 파일 로깅 포맷 변환 → 6 에이전트 → **11분** → 5/6 PR 수정 없이 머지. 나머지 1개는 조건부 로깅 엣지 케이스에서 오류 (사람의 판단이 필요한 수준).

### 2.7 Part 6-8: 최신 기능

| 기능 | 설명 |
|------|------|
| `/loop` | 지정 간격으로 프롬프트 반복 실행 (배포 모니터링 등) |
| Code Review Agents | 서브에이전트로 버그 헌팅 |
| `/btw` | 작업 중 Claude에게 질문 끼워넣기 |
| `/effort max` | 최대 추론 모드 활성화 |
| Remote Control | 원격 세션 생성 |
| Voice Mode | 음성으로 Claude 제어 |
| Auto Mode | 안전한 권한 자동 승인 |
| `/schedule` | 클라우드 크론 작업 |
| Auto-Memory & Auto-Dream | 자동 기억 축적 + 자가 정리 |

---

## 3. 실전 운영 결과 (7인 팀, 1주)

| 지표 | Before | After |
|------|--------|-------|
| 코드 리뷰 사이클 | 2-3일 | **4시간 이내** |
| 주니어 PR 리뷰 시간 | 길었음 | **단축** (reasoning이 코드에 붙어서 도착) |
| "pnpm not npm" 반복 실수 | 지속 | **소멸** (CLAUDE.md에 규칙 자동 축적) |
| 로깅 마이그레이션 (14파일) | 수동 | **11분** (6 에이전트 병렬, 5/6 무수정 머지) |

---

## 4. 저자의 솔직한 평가 (Honest Concerns)

| 항목 | 평가 |
|------|------|
| Opus 비용 | Boris는 전부 Opus 사용. 저자의 팀은 모니터링/단순 작업은 Sonnet, 아키텍처/디버깅만 Opus로 라우팅. 스킬 자체는 비용 전략을 다루지 않음 |
| `/simplify` 한계 | 구조적 이슈는 잡지만 도메인 특화(API 계약, read replica 라우팅)는 못 잡음. 코드 리뷰 대체가 아닌 baseline 향상 |
| Worktree 전환 비용 | 기존 git checkout 방식에서 전환 시 팀 컨벤션 정리에 반나절 소요 |
| 도입 순서 | 고급 기능부터 시작한 개발자들은 인지 과부하로 단일 세션으로 회귀. 12주 순차 ramp가 현실적 |
| Spinner verbs / Keybindings | 진짜 cosmetic. 5분 설정 후 잊어도 됨 |

---

## 5. 핵심 인사이트 정리

1. **팁은 메뉴가 아닌 스택이다**: 57개 팁에 의존 관계가 있다. `/batch`는 worktree 없이 의미 없고, worktree는 CLAUDE.md 없이 효과 반감. 순서대로 도입해야 각 단계의 가치가 발현된다.

2. **Part 3이 전체의 키 포인트**: Output Styles(인지 모드 변경), Custom Agents(역할 정의), Sandboxing(신뢰 가속)은 "cosmetic"이 아니라 생산성 루프의 **마찰 제거** 계층이다.

3. **병렬 에이전트의 실전 경제학**: `/batch`로 14파일 마이그레이션 → 11분, 5/6 무수정 머지. 완벽하지 않지만 "인간 주의력이 가장 가치 있는 지점에서 병목을 줄인다"는 것이 핵심. 나머지 1/6에 사람이 집중.

4. **12주 순차 도입이 현실적**: 고급 기능부터 시작하면 인지 과부하 → 포기. 기초(병렬, Plan, CLAUDE.md) → 팀 → 커스터마이징 → 격리 → 복합 순으로 근육 기억(muscle memory)을 쌓아야 한다.

5. **스킬이라는 새로운 문서 형태**: Boris의 팁이 정적 블로그가 아닌 Claude Code 세션 안에서 **참조 가능한 스킬**로 존재한다. 도구를 설명하는 문서가 도구 안에 살면서, 필요한 시점에 접근 가능. "living inside the tool it describes."

6. **비용 라우팅은 각자 해결**: 스킬은 Opus 전제로 작성됨. 팀 규모/예산에 따라 Sonnet/Opus 분리 전략이 별도로 필요.

---

## 6. 스킬 설치 및 사용법

```bash
# 설치
mkdir -p ~/.claude/skills/boris
curl -L -o ~/.claude/skills/boris/SKILL.md \
  https://howborisusesclaudecode.com/api/install

# 세션에서 로드
/boris

# 버전 체크: 로드 시 자동으로 최신 버전 확인 후 업데이트 안내
```

현재 설치 버전: v3.0.0 (2026-03-26), 731줄, 57개 팁, 45개 토픽.

---

## 7. 원문 영어 표현 해설

### 핵심 개념어

| 원문 | 직역 | 저자가 의도한 뉘앙스 |
|------|------|---------------------|
| **"The tips are not a menu. They are a stack."** | 팁은 메뉴가 아니다. 스택이다. | **menu** = 뷔페처럼 원하는 것만 골라 먹는 것. **stack** = TCP/IP 스택, 기술 스택처럼 아래부터 쌓아야 위가 성립하는 의존적 계층. 엔지니어에게 "stack"은 즉시 "순서를 무시하면 무너진다"를 연상시킨다. 기사 전체의 논지를 두 문장으로 응축한 핵심 문장. |
| **"cognitive overhead"** | 인지적 과부하 | 단순히 "복잡하다"가 아니라, 뇌가 처리해야 할 **배경 연산량**이 과다하여 본래 작업에 집중 못 하는 상태. UX 분야의 전문 용어. 여기서는 "Claude가 뭔가 건드리면 어쩌지?"라는 불안감이 auto-accept를 늦추는 심리적 비용을 가리킨다. |
| **"Each part presupposes the previous one."** | 각 파트는 이전 것을 전제한다. | **presuppose** = 단순 "require(필요하다)"보다 학문적이고 논리적. 형식논리학에서 "전제가 빠지면 결론이 성립하지 않는다"는 무게를 실은 단어 선택. "이건 선택이 아니라 논리적 필연"이라는 메시지. |

### 비유·수사 표현

| 원문 | 직역 | 문화적 맥락 |
|------|------|------------|
| **"I starred the tweet, implemented two tips, and moved on."** | 트윗에 별표 찍고, 팁 두 개 적용하고, 넘어갔다. | 개발자 문화의 전형적 패턴을 자조적으로 묘사. "star → 잊어버리기"는 GitHub star, 북마크 저장 후 안 보는 행위와 동일. "나도 그랬는데..."라는 공감을 유도하는 수사. |
| **"eerily good at writing rules for itself"** | 소름 끼칠 정도로 자기 규칙을 잘 쓴다 | **eerily** = uncanny valley 같은 감정. "놀랍다(amazingly)"가 아닌 "약간 불편할 정도로 잘한다"는 뉘앙스. AI가 자기 자신을 규정하는 능력에 대한 경외감과 불안이 공존. Claude Code 제작자 본인의 말이라 무게가 더하다. |
| **"The whole thing click into place"** | 전체가 딱 맞아 들어갔다 | 퍼즐 조각이 **찰칵** 맞는 순간. 한국어: "아, 이거였구나!" 흩어진 정보가 하나의 체계로 통합되는 유레카 모먼트. |
| **"Boris did not share 42 tips. He shared one workflow, incrementally."** | Boris는 42개 팁을 공유한 게 아니다. 하나의 워크플로우를 점진적으로 공유한 것이다. | 대구법(antithesis). "42 tips vs one workflow"로 양(quantity)과 체계(system)의 대비. **incrementally** = incremental build처럼 조금씩 쌓아가는 방식. 기사의 논지를 한 문장으로 응축. |
| **"That ratio matters."** | 그 비율이 중요하다. | 5/6 성공률에 대한 판단. "matters"는 "important"보다 실용적이고 현장감 있는 단어. 완벽은 아니지만 **충분히 가치 있다**는 엔지니어적 판단. |

### 업계 전문 용어

| 원문 | 의미 | 맥락 |
|------|------|------|
| **"1-shots the implementation"** | 한 번에 구현 완성 | ML의 "one-shot learning"에서 차용. Plan이 충분하면 시행착오 없이 완성한다는 의미. |
| **"blast radius"** | 실수의 영향 범위 | 군사 용어에서 DevOps/SRE로 차용. Sandboxing이 blast radius를 줄인다 = 실수해도 피해가 제한됨. |
| **"guard clause"** | 함수 초입에서 예외를 먼저 걸러내고 return | 깊은 중첩을 피하는 리팩토링 기법. `/simplify`가 잡는 대표적 이슈. |
| **"read replica routing"** | DB 읽기를 복제본으로 분산 | `/simplify`가 이런 도메인 로직은 못 잡는다는 한계를 설명하며 등장. |
| **"twelve-week ramp"** | 12주 적응 기간 | ramp-up의 줄임. 스타트업에서 신입 온보딩 기간을 "ramp period"라 부름. 여기서는 스킬 도입의 현실적 타임라인. |
| **"muscle memory"** | 근육 기억 | 반복 연습으로 몸에 밴 자동화된 행동. Boris 팁의 순차 도입이 "판단력"이 아닌 "습관"에 기반해야 한다는 의미. |

### 저자 어투 분석

Reza Rezvani의 문체는 **실전 CTO의 절제된 솔직함**이 특징이다:

- **"The honest assessment:"** — 마케팅이 아닌 실전 경험 기반임을 명시. 기술 블로그에서 신뢰를 확보하는 장치.
- **"Does it replace code review? No."** — 자문자답 후 단음절 부정. 과장 없이 한계를 인정하는 어투. 이어서 "Does it mean the code that arrives at code review is already past the first pass of obvious issues? Yes."로 실제 가치를 제시.
- **"I initially read that as permission to pick and choose. I now read it differently."** — 자신의 인식 변화를 시간순으로 솔직하게 서술. 독자에게도 같은 인식 전환을 유도하는 구조.
- **"The developers I have seen struggle..."** — 3인칭 관찰자 시점. 자기 팀의 실패를 직접 말하지 않고 일반화하여, 독자가 방어적이지 않게 같은 교훈을 흡수하도록 배려.

이전 보고서의 Joe Njenga가 "경험 많은 동료가 커피 마시며 알려주는" 톤이었다면, Reza Rezvani는 "주간 기술 리뷰에서 데이터 기반으로 발표하는 CTO" 톤이다. 숫자(7.9M views, 14 files, 11 minutes, 5/6 ratio)를 근거로 쓰고, 감정이 아닌 비율과 트레이드오프로 판단한다.

---

*카테고리: 개발 도구/생산성*
*태그: `#claude-code` `#claude-code-skills` `#workflow-optimization` `#parallel-agents` `#worktree` `#CLAUDE-md` `#plan-mode` `#code-review` `#developer-productivity` `#boris-cherny`*
*키워드: Boris Cherny, Claude Code 스킬, 병렬 에이전트, /simplify, /batch, worktree 격리, Output Styles, Custom Agents, Sandboxing, 12주 도입, 스택 의존성*
*관련 문서: [Claude Code 슬래시 커맨드 5가지](../claude-code-slash-commands/report.md)*
*Generated: 2026-03-29*
