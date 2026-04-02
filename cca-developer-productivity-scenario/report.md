# [7/8] CCA 시험 개발자 생산성 시나리오 완벽 공략: CLAUDE.md 4단계 계층부터 MCP 스코핑, 안티패턴까지

> 원문: [CCA: Master the Developer Productivity scenario for the Claude Certified Architect exam — from CLAUDE.md hierarchies to MCP scoping to the anti-patterns that trip up most candidates](https://medium.com/@richardhightower/cca-master-the-developer-productivity-scenario-for-the-claude-certified-architect-exam-from-e402d9bb277d) — Rick Hightower, 2026-04-02

---

## 1. 요약

- CCA(Claude Certified Architect) 시험의 **개발자 생산성(Developer Productivity) 시나리오**는 단일 도메인이 아니라 5개 역량 도메인을 횡단하는 복합 문제다.
- 핵심 출제 영역은 **CLAUDE.md 4단계 계층 구조**, **MCP 설정 스코핑**, **프로그래밍적 강제 vs 프롬프트 기반 안내**, **에이전트당 4-5개 도구 원칙**, **Description-Discernment 루프**로 압축된다.
- 저자는 CCA 시나리오 딥다이브 시리즈 7번째 아티클로, 대부분의 수험생이 놓치는 managed/org 계층과 CLAUDE.local.md의 존재, 그리고 few-shot 예시로 도구 순서를 제어하려는 안티패턴을 집중 경고한다.
- 연습 문제 워크스루와 토론 질문 3개를 통해 실전 시험 대비 의사결정 프레임워크를 제공한다.

## 2. 상세 내용

### 2.1 왜 개발자 생산성은 다중 도메인 질문인가

개발자 생산성 시나리오는 겉보기에는 Domain 2(Claude Code Configuration, 20%)에 속해 보이지만, 실제로는 5개 도메인 모두에 걸친다:

| 도메인 | 비중 | 개발자 생산성과의 연결 |
|--------|------|----------------------|
| Domain 1: Agentic Architecture | 27% | 멀티에이전트 워크플로우, 커스텀 스킬 |
| Domain 2: Claude Code Workflows | 20% | CLAUDE.md 계층, 훅 설정 |
| Domain 3: Prompt Engineering | 20% | 구조화된 출력, Description-Discernment 루프 |
| Domain 4: Tool Design & MCP | 18% | MCP 서버 스코핑, 도구 설명 |
| Domain 5: Context Management | 15% | 컨텍스트 유실 방지, 장문 세션 관리 |

시험은 "이 설정은 어디에 두어야 하나?"라는 단순해 보이는 질문을 던지지만, 정답을 도출하려면 2-3개 도메인의 지식이 필요하도록 설계되어 있다.

### 2.2 CLAUDE.md 4단계 계층 심화

대다수 학습 자료는 project/user 2단계만 설명하지만, 공식 문서에는 **4단계**가 존재한다:

| 레벨 | 위치 | 버전관리 | 범위 | 제어자 |
|------|------|---------|------|--------|
| **1. Managed/Org** (최고 권한) | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`, Linux: `/etc/claude-code/CLAUDE.md` | No (IT 배포) | 조직 전체 | IT/DevOps |
| **2. Project** | `./CLAUDE.md` 또는 `./.claude/CLAUDE.md` | Yes | 팀 전체 | 팀 (코드리뷰 경유) |
| **3. User** | `~/.claude/CLAUDE.md` | No | 개인, 전 프로젝트 | 개인 |
| **4. Local** | `CLAUDE.local.md` (.gitignore) | No | 개인, 해당 프로젝트만 | 개인 |

**로딩 순서**: Managed/Org → Project → User → Local. 상위 레벨은 하위에서 재정의할 수 없다.

**모노레포 지원**: 루트에 프로젝트 레벨 CLAUDE.md를 두고, 하위 디렉토리에 컴포넌트별 CLAUDE.md를 추가할 수 있다. Claude가 해당 하위 디렉토리의 파일을 읽을 때 자동 로딩된다.

### 2.3 MCP 설정 스코핑

MCP 서버 설정도 CLAUDE.md와 동일한 계층 원리를 따른다:

| 파일 | 위치 | 용도 | 버전관리 |
|------|------|------|---------|
| `.mcp.json` | 프로젝트 루트 | 팀 공유 MCP 서버 정의 | Yes |
| `~/.claude.json` | 홈 디렉토리 | 개인 MCP 서버 + 크레덴셜 | No |

**스코핑 의사결정 트리**:
1. 팀 전체가 필요한가? → No → `~/.claude.json`
2. 개인 크레덴셜이 필요한가? → No → `.mcp.json`에 전부
3. 둘 다 Yes → 서버 정의(비밀 제외)는 `.mcp.json`, 크레덴셜은 `~/.claude.json` 또는 환경변수

### 2.4 도구 수와 도구 설명

- **4-5개 도구 원칙**: 에이전트당 도구 수는 4-5개가 아키텍처 모범 사례. 18개 도구를 가진 에이전트가 잘못된 도구를 선택하는 문제의 해법은 "더 나은 프롬프트"가 아니라 **전문화된 서브에이전트로 분할**이다.
- **도구 설명이 라우팅 메커니즘**: Claude는 도구 이름이 아닌 **설명**을 기반으로 도구를 선택한다. "Analyzes stuff" 같은 모호한 설명은 오라우팅을 유발하고, "Python 소스 파일에 대해 정적 분석을 수행하여 타입 오류, 미사용 import, 스타일 위반을 라인 번호와 함께 반환" 같은 구체적 설명이 정확한 선택을 이끈다.

### 2.5 Description-Discernment 루프

AI Fluency Framework의 4원칙(Delegation, Description, Discernment, Diligence) 중 개발자 생산성에 직결되는 두 가지:

```
Description (CLAUDE.md, 스킬, 도구 설명)
     ↓
Claude 출력 생성
     ↓
Discernment (코드리뷰, 테스트, 아키텍처 리뷰)
     ↓
Discernment 결과를 바탕으로 Description 업데이트
     ↓
(반복)
```

시험에서 "팀원마다 Claude 출력이 다르다"는 시나리오가 나오면, **즉시 수정(Description 개선)**과 **체계적 수정(리뷰 프로세스로 Description을 지속 갱신)**을 모두 포함하는 답이 정답이다.

### 2.6 팀 지식 공유: 스킬 vs 규칙

| 구분 | 경로 | 로딩 시점 | 용도 |
|------|------|----------|------|
| **규칙(Rules)** | `.claude/rules/*.md` | 매 세션 자동 | 항상 컨텍스트에 존재해야 하는 지시 |
| **스킬(Skills)** | `.claude/skills/SKILL.md` | 호출 시 또는 관련 시 | 복잡한 다단계 절차 (온디맨드 로딩) |

규칙은 매 세션 오버헤드를 추가하므로, 긴 다단계 절차는 스킬로 인코딩하는 것이 올바르다. 각 개발자가 자체 프롬프트를 작성하는 것은 안티패턴이다.

### 2.7 훅: 실제로 작동하는 프로그래밍적 강제

CLAUDE.md에 "커밋 전 항상 린터를 실행하라"고 적으면 대부분 따르지만, 컨텍스트 압박 하에서는 생략될 수 있다. **훅은 확정적으로 실행된다**:

- **PostToolUse**: 도구 사용 후 실행 (예: 파일 쓰기 후 자동 린팅)
- **PreToolUse**: 도구 사용 전 실행 (예: 승인된 명령어 목록 검사)
- 기타: `Stop`, `SessionStart`, `SessionEnd`, `UserPromptSubmit`

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "write_file",
        "command": "eslint --fix ${file_path}"
      }
    ]
  }
}
```

**시험 원칙**: "시스템 프롬프트에 지시 추가" vs "프로그래밍 훅 설정" 중 선택이면, **훅이 거의 항상 정답**이다.

### 2.8 안티패턴 갤러리

| # | 안티패턴 | 왜 실패하는가 | 올바른 접근 |
|---|---------|-------------|-----------|
| 1 | Few-shot 예시로 도구 순서 제어 | 도구 선택은 설명 기반, 예시 순서 기반이 아님 | 프로그래밍적 전제조건 또는 단일 도구로 래핑 |
| 2 | 프롬프트로 비즈니스 규칙 강제 | 컨텍스트 압박 시 단계 생략 가능 | PostToolUse/PreToolUse 훅 |
| 3A | 모든 MCP를 프로젝트에 (비밀 포함) | 크레덴셜이 버전관리에 노출 | 서버 정의는 `.mcp.json`, 크레덴셜은 `~/.claude.json` |
| 3B | 모든 MCP를 사용자 레벨에 | 팀원이 공유 도구에 접근 불가 | 공유 서버는 `.mcp.json`에 정의 |
| 4 | 에이전트에 15개+ 도구 | 중복 설명으로 오라우팅 | 4-5개 도구 + 전문화된 서브에이전트 |
| 5 | CLAUDE.md 2단계만 인지 | managed/org, local 질문 오답 | 4단계 모두 숙지 |

### 2.9 시험 전략: 의사결정 프레임워크

1. **"X는 어디에?"** → 4단계 계층 적용. 조직 전체 비재정의 요구사항 = managed/org, 팀 표준 = project, 개인 선호 = user, 개인+프로젝트 한정 = local
2. **"X를 어떻게 강제?"** → 프로그래밍 > 프롬프트. 항상.
3. **"도구 몇 개?"** → 4-5개. 오라우팅 문제 = 서브에이전트 분할
4. **"누가 이 설정을 보나?"** → `.mcp.json`/`.claude/CLAUDE.md` = 팀, `~/.claude.json`/`~/.claude/CLAUDE.md` = 개인
5. **"팀이 시간에 따라 개선하려면?"** → Description-Discernment 루프

### 2.10 연습 문제 워크스루

**문제**: 팀의 import 정렬 규칙을 Claude Code가 간헐적으로 무시한다. 일부 개발자가 개인 `~/.claude/CLAUDE.md`에 지시를 추가했지만 불일치가 계속된다. 가장 효과적인 해결책은?

- A) 각 개발자의 개인 CLAUDE.md에 더 상세한 예시 추가 → **오답** (팀 표준을 개인 파일에)
- B) import 정렬 지시가 포함된 공유 스킬 생성 → **오답** (프로그래밍적 강제 없음)
- C) **프로젝트 레벨 `.claude/CLAUDE.md`에 지시 추가 + PostToolUse 훅으로 자동 정렬** → **정답**
- D) 시스템 프롬프트에 few-shot 예시 → **오답** (도구 순서/출력에 신뢰할 수 없음)

정답 C는 두 원칙을 동시에 테스트한다: (1) 팀 표준은 프로젝트 레벨에, (2) 기계적 규칙은 프로그래밍적 강제로.

## 3. 핵심 인사이트 정리

1. **CLAUDE.md는 4단계 계층이다** — managed/org(IT 관리, 재정의 불가), project(팀 공유), user(개인), local(개인+프로젝트, gitignore). 2단계만 알면 시험에서 치명적이다.
2. **프로그래밍적 강제가 프롬프트 기반 안내를 압도한다** — 결과가 중요한 규칙(보안, 컴플라이언스, 빌드)은 반드시 훅이나 코드로 강제해야 한다. 프롬프트는 "대부분"이지 "항상"이 아니다.
3. **MCP 스코핑은 "팀 정의 + 개인 크레덴셜" 분리 패턴을 따른다** — `.mcp.json`에 서버 정의, `~/.claude.json`에 비밀값. 한쪽에 몰아넣으면 크레덴셜 노출이거나 팀 접근 불가.
4. **에이전트당 4-5개 도구가 아키텍처 모범 사례** — SDK 하드 리밋이 아니라 설계 원칙. 초과 도구는 전문 서브에이전트로 분배한다.
5. **도구 설명이 라우팅의 전부다** — 이름이 아닌 설명으로 선택되므로, 모호한 설명 = 오라우팅. 구체적으로 "무엇을 받아 무엇을 반환하는지" 기술해야 한다.
6. **Description-Discernment 루프가 팀 지식을 축적한다** — 일회성 수정이 아닌, 코드리뷰 → Description 갱신 → 다음 출력 개선의 순환 구조가 정답이다.
7. **Few-shot 예시는 도구 순서를 제어하지 못한다** — 출력 포맷과 추론 스타일에는 유효하지만, 도구 호출 시퀀스에는 프로그래밍적 전제조건이 필요하다.

## 4. 원문 영어 표현 해설

### 핵심 개념어

| 원문 | 직역 | 저자가 의도한 뉘앙스 |
|------|------|---------------------|
| **four-level hierarchy** | 4단계 계층 | 단순 설정 파일이 아닌 "권한 체계"를 강조. hierarchy는 군대식 명령 체계를 연상시키며, 상위가 하위를 통제한다는 구조적 의미를 내포 |
| **programmatic enforcement** | 프로그래밍적 강제 | "enforcement"는 법 집행(law enforcement)에서 차용. 프롬프트의 "guidance"(안내)와 대조하여, 선택이 아닌 강제라는 점을 부각 |
| **resolution chain** | 해석 체인 | DNS resolution이나 모듈 해석(module resolution)에서 차용한 CS 용어. 설정 충돌 시 우선순위에 따라 순차적으로 결정된다는 의미 |
| **scoping** | 범위 지정 | 프로그래밍의 변수 스코프(scope)에서 차용. 설정의 가시 범위와 영향 범위를 동시에 의미 |
| **routing mechanism** | 라우팅 메커니즘 | 네트워크 패킷 라우팅에서 차용. 도구 설명이 "경로 결정 테이블" 역할을 한다는 비유 |

### 비유·수사 표현

| 원문 | 직역 | 문화적 맥락 |
|------|------|-----------|
| **"The Developer Productivity scenario is sneaky"** | "개발자 생산성 시나리오는 교활하다" | 시험 문제를 의인화하여 "함정"의 느낌을 전달. 영미권 시험 준비 문화에서 흔한 수사법으로, 시험을 "상대해야 할 적"으로 프레이밍 |
| **"This scenario sprawls across all five competency domains"** | "이 시나리오는 5개 역량 도메인에 걸쳐 뻗어 있다" | sprawl은 도시가 무계획적으로 퍼져나가는 "스프롤 현상"에서 온 단어. 예상보다 넓게 퍼져 있다는 의외성을 강조 |
| **"Think of the hierarchy like a resolution chain"** | "계층을 해석 체인처럼 생각하라" | 개발자 독자를 겨냥한 비유. DNS 리졸버 체인이나 CSS 캐스케이드와 같은 "우선순위 기반 결정" 패턴을 환기 |
| **"Prompts execute probabilistically"** | "프롬프트는 확률적으로 실행된다" | 통계학/물리학 용어를 차용하여 "deterministically(확정적)"과 대비. LLM의 본질적 불확실성을 한 단어로 압축 |
| **"The loop answer is almost always more correct than the one-shot answer"** | "루프 답이 거의 항상 일회성 답보다 더 정확하다" | ML의 "one-shot learning" 용어를 시험 맥락에 재활용. 체계적 개선 vs 즉흥 수정의 대비 |

### 업계 전문 용어

| 원문 | 의미 | 맥락 |
|------|------|------|
| **Description-Discernment loop** | 기술-판별 순환 | Anthropic의 AI Fluency Framework에서 정의한 4원칙 중 2개를 팀 워크플로우에 적용한 개념. CCA 시험 고유 용어 |
| **PostToolUse / PreToolUse hooks** | 도구 사용 후/전 훅 | Claude Code SDK의 이벤트 훅 시스템. CI/CD의 pre-commit/post-commit 훅과 동일한 패턴 |
| **tool routing** | 도구 라우팅 | LLM이 여러 도구 중 적절한 것을 선택하는 과정. API 게이트웨이의 라우팅과 유사한 개념 |
| **context pressure** | 컨텍스트 압박 | LLM의 컨텍스트 윈도우가 채워지면서 초기 지시를 "잊거나" 우선순위를 낮추는 현상. "lost in the middle" 문제와 관련 |
| **coordinator-subagent** | 조정자-서브에이전트 | 멀티에이전트 아키텍처의 허브앤스포크 패턴. 조정자가 작업을 분배하고 서브에이전트가 전문 도구로 실행 |

### 저자 어투 분석

Rick Hightower는 CCA 시나리오 딥다이브 시리즈(총 8편)를 집필 중인 기술 임원으로, 이전 CCA Foundations 가이드(5번 리포트)와 일관된 **교관형(instructor-mode)** 어투를 유지한다:

- **직접적 2인칭 지시문**: "Here is the fact that trips up most candidates", "Know all four levels cold" — 독자를 수험생으로 직접 호명하며 긴장감 조성
- **안티패턴 기반 구조**: 올바른 방법을 먼저 가르치기보다 **틀린 답을 먼저 보여주고 왜 틀린지** 설명하는 역방향 교육법. 시험 준비 콘텐츠에 최적화된 수사 전략
- **"sneaky", "traps", "punishes"** 같은 의인화 동사: 시험을 의인화하여 경쟁 심리를 자극. 영미권 자격증 prep 문화의 전형적 프레이밍
- **CCA Exam Tip 박스**: 핵심 포인트마다 💡로 시각 분리하여 스캔 가독성 확보. 이전 Foundations 가이드에서도 동일 패턴 사용
- **이전 보고서 저자와의 비교**: Reza Rezvani(Boris Cherny 팁)의 분석적·중립적 어투, Joe Njenga(슬래시 커맨드)의 실용 튜토리얼 어투와 달리, Hightower는 "시험에서 이기는 법"이라는 명확한 프레이밍으로 독자를 코칭하는 스타일

---

*카테고리: AI/자격증*
*태그: `#CCA` `#claude-certified-architect` `#developer-productivity` `#CLAUDE-md` `#MCP` `#claude-code` `#prompt-engineering` `#anti-patterns`*
*키워드: CCA, Claude Certified Architect, 개발자 생산성, CLAUDE.md 계층, MCP 설정, 스코핑, managed org, 프로그래밍적 강제, PostToolUse, PreToolUse, 훅, Description-Discernment 루프, 도구 라우팅, 안티패턴, 4-5 도구 규칙, 커스텀 스킬, 팀 워크플로우, Rick Hightower, Anthropic 자격증*
*시리즈: CCA Scenario Deep Dive Series (7/8)*
*관련 문서: [CCA Foundations 시험 완벽 가이드](../cca-foundations-exam-guide/report.md) (태그 5개 공유: #CCA, #claude-certified-architect, #anthropic, #MCP, #prompt-engineering), [Boris Cherny의 Claude Code 팁 스킬 분석](../boris-cherny-claude-code-tips-skill/report.md) (태그 2개 공유: #claude-code, 워크플로우 주제)*
*Generated: 2026-04-02*
