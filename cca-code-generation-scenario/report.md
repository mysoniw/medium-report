# [3/8] CCA 시험 코드 생성 시나리오 공략: 컨텍스트 열화, CLAUDE.md 계층, CI/CD -p 플래그

> 원문: [CCA Exam Prep: Mastering the Code Generation with Claude Code Scenario](https://medium.com/towards-artificial-intelligence/cca-exam-prep-mastering-the-code-generation-with-claude-code-scenario-95f2d8d06742) — Rick Hightower, 2026-03-27

---

## 1. 요약

- CCA 시험의 코드 생성 시나리오는 Claude Code를 **사용할 줄 아는지**가 아니라 **왜 특정 아키텍처 결정이 더 나은 결과를 내는지** 이해하는지를 테스트한다.
- 가장 큰 함정: "더 긴 컨텍스트 윈도우 = 더 나은 출력"이라는 직관. 컨텍스트 열화(context degradation)는 **용량(capacity)** 문제가 아니라 **주의력(attention)** 문제다.
- CLAUDE.md 프로젝트 레벨 vs 사용자 레벨 구분, -p 플래그를 빠뜨린 CI/CD 파이프라인 행(hang) 문제, 커스텀 스킬과 코디네이터 패턴이 핵심 출제 영역이다.
- 이 시나리오는 Claude Code Workflows(20%) + Context Management(15%) = 시험 가중치 35%를 커버한다.

## 2. 상세 내용

### 2.1 컨텍스트 열화: 핵심 개념

**컨텍스트 열화는 주의력 문제이지 용량 문제가 아니다.**

모델이 컨텍스트 윈도우를 처리할 때, 총 주의력은 고정되어 있고 모든 토큰에 분배된다. 컨텍스트가 커지면 각 토큰이 받는 주의력 조각이 얇아진다. 중간에 있는 정보가 가장 얇은 주의력을 받는다 — "lost in the middle" 효과.

**실패 사례**: 팀이 47개 서비스 파일(380K 토큰)을 단일 세션에 로드하고 인증 미들웨어 리팩토링 요청:
- 파일 1-5: 깔끔하고 철저한 리팩토링 ✅
- 파일 15-30: 변수 명명 불일치, 미들웨어 호출 포맷 차이, 엣지 케이스 누락 ⚠️
- 파일 40-47: 품질 회복(끝부분 주의력 상승), 하지만 초기 파일과 import 패턴 충돌 ❌

**안티패턴**: "컨텍스트 윈도우를 늘리자" → 주의력을 더 얇게 분산시킬 뿐. 200K 집중 컨텍스트가 1M 덤프 컨텍스트를 능가한다.

### 2.2 올바른 패턴: 파일별 집중 패스

대규모 코드베이스 작업의 정답은 **분해(decomposition)**:

1. 큰 작업을 파일/모듈 단위로 분해
2. 관련 컨텍스트만 포함한 집중 세션에서 각 단위 실행
3. 결과를 합성(compose)
4. 교차 파일 일관성 검토 (명명, import, 인터페이스 계약)

저자의 비유: "외과의사는 모든 장기를 동시에 수술하지 않는다. 한 영역에 집중하고, 완전한 주의력으로 작업하고, 다음으로 넘어간다."

### 2.3 CLAUDE.md 계층

| 레벨 | 경로 | VCS 공유 | 용도 | 시험 함정 |
|------|------|---------|------|----------|
| **프로젝트** | `.claude/CLAUDE.md` | Yes | 팀 표준, 아키텍처 규칙 | 팀 표준을 여기에 두어야 함 |
| **사용자** | `~/.claude/CLAUDE.md` | No | 개인 선호도 | 팀 표준을 여기에 두면 오답 |

**CLAUDE.md는 컨텍스트 엔지니어링이다**: 매 세션에 자동 주입되므로, 매번 프롬프트에 규칙을 타이핑하는 것(prompt-based)보다 한 번 작성(programmatic)이 우월하다.

**시험 신호**: "일부 개발자만 표준을 따르고 다른 개발자는 아니다" → 사용자 레벨 vs 프로젝트 레벨 혼동. 정답은 항상 프로젝트 레벨.

### 2.4 커스텀 스킬과 슬래시 커맨드

- 워크플로우가 3단계 이상이고 2회 이상 반복되면 → **스킬**로 인코딩
- 스킬은 CLAUDE.md를 참조해야지 복제하면 안 됨 (이중 유지보수 방지)
- Frontmatter로 메타데이터, Markdown 본문으로 지시사항

### 2.5 CI/CD 통합: -p 플래그

`-p` 없이 Claude Code를 CI/CD에서 실행하면 → **파이프라인이 영원히 행(hang)**. 인터랙티브 UI가 사용자 입력을 기다리지만 CI에는 사용자가 없다.

```bash
claude -p "Review this pull request for security issues" --bare
```

- `--bare`: 훅, LSP, 스킬 로딩, 자동 메모리 스킵 → 재현 가능한 동작
- `--output-format json`: 파이프라인 파싱용 구조화된 출력

**Batch vs Real-Time API in CI/CD**:
- 개발자가 머지를 기다리는가? → Real-Time API
- "nightly", "weekly", "scheduled" → Batch API (50% 할인)

### 2.6 코디네이터 패턴

대규모 코드베이스를 위한 고급 패턴:
1. 코디네이터 세션이 전체 구조를 분석 (가벼운 읽기)
2. 작업 계획 생성: 어떤 파일을, 어떤 순서로, 어떤 의존성으로
3. 각 파일이 필요한 컨텍스트만 가진 자체 집중 세션을 받음
4. 코디네이터가 모든 결과의 교차 파일 일관성 검토

이것이 **컨텍스트 포킹(context forking)** — Article 4의 허브앤스포크와 직접 연결.

## 3. 핵심 인사이트 정리

1. **컨텍스트 열화는 용량이 아닌 주의력 문제다** — 컨텍스트 윈도우를 늘리면 문제가 악화된다. 주의력은 유한하고, 토큰이 많을수록 각 토큰의 주의력 배분이 줄어든다.
2. **파일별 집중 패스가 대규모 리팩토링의 정답이다** — "전체 src/를 로드하고 리팩토링"은 항상 오답. 분해 → 실행 → 합성 → 검토 워크플로우가 시험에서 요구하는 패턴이다.
3. **CLAUDE.md 프로젝트 레벨은 팀 표준의 유일한 장소다** — Git에 커밋되어 자동 공유. 사용자 레벨은 개인 선호. 새 팀원 온보딩 시 "수동 복사"가 언급되면 그것이 오답 신호.
4. **-p 플래그 없이 CI/CD에서 Claude Code 실행 = 파이프라인 행** — 에러도 아니고 느린 것도 아니고 "무한 대기". `--bare`와 함께 사용이 Anthropic 권장.
5. **커스텀 스킬은 반복 워크플로우를 표준화한다** — 5명의 개발자가 각자 "스테이징 배포" 프롬프트를 쓰면 5개의 다른 절차가 된다. 스킬이 일관성을 보장.
6. **코디네이터 패턴은 단일 세션의 한계를 멀티에이전트로 확장한다** — Article 4의 허브앤스포크 디자인으로 연결되는 브릿지 개념.

## 4. 원문 영어 표현 해설

### 핵심 개념어

| 원문 | 직역 | 저자가 의도한 뉘앙스 |
|------|------|---------------------|
| **context degradation** | 컨텍스트 열화 | "degradation"은 품질이 점진적으로 나빠지는 과정. "overflow"나 "limit"이 아닌 "열화"를 선택하여 용량이 아닌 품질 저하를 강조 |
| **attention dilution** | 주의력 희석 | 화학의 "dilution"(용액 희석) 비유. 용매(토큰)가 많아지면 농도(주의력)가 낮아진다는 직관적 이미지 |
| **focused per-file passes** | 파일별 집중 패스 | "pass"는 컴파일러의 "패스"에서 차용. 한 번에 하나의 대상을 처리하는 체계적 접근 |
| **context forking** | 컨텍스트 포킹 | Unix의 fork() 시스템 호출에서 차용. 부모 프로세스의 컨텍스트 중 필요한 부분만 자식에게 복제 |

### 비유·수사 표현

| 원문 | 직역 | 문화적 맥락 |
|------|------|-----------|
| **"Think of it like surgery"** | "수술처럼 생각하라" | 의료 비유로 "범위(scope)가 품질을 만든다"는 논지를 생명과 직결시킴 |
| **"the middle is where quality goes to die"** | "중간은 품질이 죽으러 가는 곳" | 의인화로 "lost in the middle"의 심각성을 극적으로 표현. "goes to die"는 구어적 과장 |
| **"a tech lead who is always present, never forgets a rule, and never skips a review"** | "항상 존재하고, 규칙을 잊지 않고, 리뷰를 건너뛰지 않는 테크 리드" | CLAUDE.md를 "이상적인 동료"로 의인화. 프로그래밍적 접근의 장점을 인간 협업 프레임으로 번역 |

### 업계 전문 용어

| 원문 | 의미 | 맥락 |
|------|------|------|
| **-p flag (--print)** | 비인터랙티브 모드 플래그 | Claude Code CLI 전용. 표준 입력으로 프롬프트, 표준 출력으로 응답, 종료 코드 반환 |
| **--bare flag** | 최소 헤드리스 모드 | 훅, LSP, 스킬, 메모리 등 자동 발견 스킵. Anthropic이 CI/CD 기본 모드로 권장 |
| **coordinator pattern** | 코디네이터 패턴 | Agentic Architecture 도메인(27%). 프로젝트 매니저가 티켓을 나누고 결과를 검토하는 구조 |
| **Batch API** | 일괄 처리 API | 50% 할인, 24시간 윈도우. nightly/weekly 작업에 적합, 블로킹 워크플로우에 부적합 |

### 저자 어투 분석

이 아티클에서 Hightower는 **1인칭 교관**에서 **시스템 아키텍트**로 톤이 살짝 전환된다. "Let's get into it", "Walk through what actually happens, file by file"처럼 독자를 워크스루에 초대하는 스타일이 두드러진다. 코드 생성이라는 개발자 일상에 가까운 주제이기에, Article 2의 전투 브리핑보다는 "함께 분석하는" 페어 프로그래밍 톤을 채택했다. 그러나 안티패턴 경고에서는 여전히 "That is the trap", "eliminate any answer"로 시험 전투 프레이밍이 유지된다.

---

*카테고리: AI/자격증*
*태그: `#CCA` `#claude-certified-architect` `#code-generation` `#claude-code` `#context-management` `#CLAUDE-md` `#ci-cd` `#anti-patterns`*
*키워드: CCA, Claude Certified Architect, 코드 생성, context degradation, 컨텍스트 열화, attention dilution, 주의력 희석, lost in the middle, focused per-file passes, CLAUDE.md 계층, 프로젝트 레벨, 사용자 레벨, -p 플래그, --bare, CI/CD, 커스텀 스킬, 코디네이터 패턴, context forking, Batch API, Rick Hightower*
*시리즈: CCA Scenario Deep Dive Series (3/8)*
*관련 문서: [CCA Foundations 시험 가이드](../cca-foundations-exam-guide/report.md), [CCA 멀티에이전트 리서치](../cca-multi-agent-research/report.md), [CCA 개발자 생산성 시나리오](../cca-developer-productivity-scenario/report.md)*
*Generated: 2026-04-02*
