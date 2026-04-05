---
title: "CCA: Claude 공인 아키텍트 시험 — 개발자 생산성 시나리오 완벽 공략"
subtitle: "CLAUDE.md 계층 구조부터 MCP 스코핑, 대다수 수험생이 빠지는 안티패턴까지"
author: Rick Hightower
date: 2026-04-02
source: https://medium.com/@richardhightower/cca-master-the-developer-productivity-scenario-for-the-claude-certified-architect-exam-from-e402d9bb277d
series: "CCA 시나리오 딥다이브 시리즈 (7/8)"
---

# CCA: Claude 공인 아키텍트 시험 — 개발자 생산성 시나리오 완벽 공략

*CLAUDE.md 계층 구조부터 MCP 스코핑, 대다수 수험생이 빠지는 안티패턴까지*

---

## 개발자 생산성 시나리오가 "교활한(sneaky)" 이유

**개발자 생산성(Developer Productivity) 시나리오**는 교활합니다. 겉으로는 Domain 2(Claude Code 설정, 20%)에만 해당되는 것처럼 보이지만, 실제로는 **다섯 개 역량 도메인(competency domains) 전체를 관통**합니다. 하나의 문제에 두세 개 도메인의 지식이 동시에 필요하도록 설계되어 있습니다.

| 도메인 | 비중 | 개발자 생산성과의 연결 |
|--------|------|----------------------|
| **Domain 1**: 에이전트 아키텍처(Agentic Architecture) | 27% | 멀티에이전트 워크플로우, 커스텀 스킬(custom skills) |
| **Domain 2**: Claude Code 워크플로우(Workflows) | 20% | CLAUDE.md 계층 구조, 훅(hook) 설정 |
| **Domain 3**: 프롬프트 엔지니어링(Prompt Engineering) | 20% | 구조화된 출력(structured outputs), **기술-판별 루프(Description-Discernment loop)** |
| **Domain 4**: 도구 설계 및 MCP(Tool Design & MCP) | 18% | MCP 서버 스코핑(scoping), 도구 설명(tool descriptions) |
| **Domain 5**: 컨텍스트 관리(Context Management) | 15% | 컨텍스트 유실 방지, 장문 세션 관리 |

시험에서는 "이 설정은 어디에 두어야 하나?"처럼 단순해 보이는 질문을 던지지만, 정답을 도출하려면 복수 도메인의 지식이 필요합니다.

---

## CLAUDE.md 4단계 계층 구조(Four-Level Hierarchy)

대다수 수험생이 놓치는 사실이 바로 이것입니다: 대부분의 학습 자료는 **프로젝트(project)**와 **유저(user)** 2단계만 설명하지만, 공식 문서에는 **4단계**가 존재합니다.

```
                    ┌───────────────────────────┐
                    │  1. Managed / Org         │  ← 최고 권한
                    │    (IT 배포)              │     하위에서 재정의 불가
                    ├───────────────────────────┤
                    │    2. Project             │  ← 팀 공유
                    │  (버전 관리 포함)          │    코드리뷰 경유
                    ├───────────────────────────┤
                    │     3. User               │  ← 개인 설정
                    │  (전체 프로젝트 적용)       │    개인 선호
                    ├───────────────────────────┤
                    │     4. Local              │  ← 개인 + 프로젝트 한정
                    │   (.gitignore 대상)        │    버전 관리 제외
                    └───────────────────────────┘
```

| 레벨 | 위치 | 버전 관리 | 범위 | 제어자 |
|------|------|----------|------|--------|
| **1. Managed/Org** (최고 권한) | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`, Linux: `/etc/claude-code/CLAUDE.md` | No (IT 배포) | 조직 전체 | IT / DevOps |
| **2. Project** | `./CLAUDE.md` 또는 `./.claude/CLAUDE.md` | Yes | 팀 전체 | 팀 (코드리뷰 경유) |
| **3. User** | `~/.claude/CLAUDE.md` | No | 개인, 전 프로젝트 | 개인 |
| **4. Local** | `CLAUDE.local.md` (.gitignore) | No | 개인, 해당 프로젝트만 | 개인 |

**로딩 순서(Resolution order)**: Managed/Org -> Project -> User -> Local. 상위 레벨은 하위 레벨에서 **재정의(override)할 수 없습니다**.

이 계층을 **해석 체인(resolution chain)**으로 이해하면 됩니다 — DNS가 도메인을 네임서버 체인을 따라 순차적으로 해석하듯이, CLAUDE.md 설정도 managed/org부터 local까지 내려오면서 상위가 우선합니다.

> 💡 **시험 포인트**: 네 단계를 확실히 외워야 합니다. 시험은 요구사항이 managed/org, project, user, local 중 어디에 해당하는지를 묻는 시나리오를 제시합니다.

### 모노레포(Monorepo) 지원

저장소 루트에 프로젝트 레벨 CLAUDE.md를 두고, 하위 디렉토리에 컴포넌트별 CLAUDE.md를 추가할 수 있습니다. Claude가 해당 하위 디렉토리의 파일을 읽을 때 **자동으로 로딩**됩니다.

---

## MCP 설정 스코핑(Configuration Scoping)

**MCP 서버 설정**도 CLAUDE.md와 동일한 계층 원리를 따릅니다:

| 파일 | 위치 | 용도 | 버전 관리 |
|------|------|------|----------|
| `.mcp.json` | 프로젝트 루트 | 팀 공유 MCP 서버 정의 | Yes |
| `~/.claude.json` | 홈 디렉토리 | 개인 MCP 서버 + **크레덴셜(credentials)** | No |

### 스코핑 의사결정 트리(Decision Tree)

1. **팀 전체**가 필요한가? -> No -> `~/.claude.json`
2. **개인 크레덴셜**이 필요한가? -> No -> 전부 `.mcp.json`에
3. **둘 다** Yes -> 서버 정의(비밀값 제외)는 `.mcp.json`, 크레덴셜은 `~/.claude.json` 또는 환경변수(environment variables)

> 💡 **시험 포인트**: 시험은 이 분리 패턴을 직접 테스트합니다. 크레덴셜을 `.mcp.json`에 넣으면 = 버전 관리에 비밀값 노출(보안 위반). 전부 `~/.claude.json`에 넣으면 = 팀원이 공유 도구에 접근 불가.

---

## 도구 수(Tool Count)와 도구 설명(Tool Descriptions)

### 에이전트당 4-5개 도구 원칙(4-5 Tool Principle)

아키텍처 모범 사례는 **에이전트당 4-5개 도구**입니다. 18개 도구를 가진 에이전트가 계속 잘못된 도구를 선택한다면, 해법은 "더 나은 프롬프트"가 아니라 **전문화된 서브에이전트(specialized sub-agents)로 분할**하는 것입니다.

이것이 **조정자-서브에이전트(coordinator-subagent) 패턴**입니다: 조정자(coordinator)가 작업을 분배하고 서브에이전트가 집중된 도구 세트로 실행합니다.

### 도구 설명이 라우팅 메커니즘(Routing Mechanism)이다

Claude는 도구 **이름(name)**이 아닌 **설명(description)**을 기반으로 도구를 선택합니다. 설명이 곧 라우팅 테이블(routing table)입니다.

**나쁜 설명** (오라우팅 유발):
```
"Analyzes stuff"
// 분석을 수행한다 — 무엇을? 어떻게? 알 수 없음
```

**좋은 설명** (정확한 선택 유도):
```
"Performs static analysis on Python source files, identifying type errors,
unused imports, and style violations. Returns results with line numbers
and severity ratings."
// Python 소스 파일에 정적 분석을 수행하여 타입 오류, 미사용 import,
// 스타일 위반을 식별한다. 라인 번호 및 심각도 등급과 함께 결과를 반환한다.
```

> 💡 **시험 포인트**: 시험에서 도구 선택 문제가 나오면, **도구 설명의 구체성(specificity)을 높이거나** 에이전트당 도구 수를 줄이는 답을 찾으세요. 이 두 가지가 거의 항상 정답입니다.

---

## 기술-판별 루프(Description-Discernment Loop)

**AI 유창성 프레임워크(AI Fluency Framework)**의 4원칙(위임 Delegation, 기술 Description, 판별 Discernment, 근면 Diligence) 중 개발자 생산성에 직결되는 두 가지:

```
기술 Description (CLAUDE.md, 스킬, 도구 설명)
     │
     ▼
Claude가 출력 생성
     │
     ▼
판별 Discernment (코드리뷰, 테스트, 아키텍처 리뷰)
     │
     ▼
판별 결과를 바탕으로 기술 Description 업데이트
     │
     ▼
(반복)
```

시험에서 "팀원마다 Claude 출력이 다르다"는 시나리오가 나오면, 정답은 **두 가지를 모두 포함**해야 합니다:
- **즉각적 수정**: 기술(Description) 개선 — CLAUDE.md 업데이트, 도구 설명 정제
- **체계적 수정**: 리뷰 프로세스를 통해 기술(Description)을 지속적으로 갱신하는 구조

**루프 답(loop answer)이 일회성 답(one-shot answer)보다 거의 항상 더 정확합니다.**

> 💡 **시험 포인트**: 한 선택지가 프롬프트만 수정하고 다른 선택지가 시간에 따라 기술을 개선하는 피드백 루프를 언급한다면, 루프 답이 정답입니다.

---

## 팀 지식 공유: 스킬(Skills) vs 규칙(Rules)

| 구분 | 경로 | 로딩 시점 | 용도 |
|------|------|----------|------|
| **규칙(Rules)** | `.claude/rules/*.md` | 매 세션 자동 | 항상 컨텍스트에 존재해야 하는 지시 |
| **스킬(Skills)** | `.claude/skills/SKILL.md` | 호출 시 또는 관련 시(on-demand) | 복잡한 다단계 절차 |

규칙은 매 세션 오버헤드를 추가하므로, 긴 다단계 절차는 **스킬**로 인코딩하는 것이 올바릅니다. 각 개발자가 자체 프롬프트를 작성하는 것은 **안티패턴(anti-pattern)**입니다 — 팀 지식은 공유 스킬로 코드화해야 합니다.

---

## 훅(Hooks): 실제로 작동하는 프로그래밍적 강제(Programmatic Enforcement)

CLAUDE.md에 "커밋 전 항상 린터를 실행하라"라고 적으면 **대부분** 따르지만, **컨텍스트 압박(context pressure)** 하에서는 — 컨텍스트 윈도우가 채워지면서 — 단계가 생략될 수 있습니다. **프롬프트는 확률적으로(probabilistically) 실행됩니다.**

**훅은 확정적으로(deterministically) 실행됩니다:**

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
// PostToolUse 훅: write_file 도구 사용 후
// 자동으로 ESLint를 실행하여 코드를 정리한다
```

> 💡 **시험 포인트**: "시스템 프롬프트에 지시 추가" vs "프로그래밍 훅 설정" 중 선택이면, **훅이 거의 항상 정답**입니다. 예외 없이 따라야 하는 규칙에는 프로그래밍적 강제가 프롬프트 기반 안내를 항상 이깁니다.

---

## 안티패턴 갤러리(Anti-Pattern Gallery)

| # | 안티패턴 | 왜 실패하는가 | 올바른 접근 |
|---|---------|-------------|-----------|
| 1 | Few-shot 예시로 도구 순서 제어 | 도구 선택은 **설명(description) 기반**이지 예시 순서 기반이 아님 | 프로그래밍적 전제조건(preconditions) 또는 단일 도구로 래핑(wrapping) |
| 2 | 프롬프트로 비즈니스 규칙 강제 | **컨텍스트 압박(context pressure)** 시 단계 생략 가능 | PostToolUse / PreToolUse 훅 |
| 3A | 모든 MCP를 프로젝트에 (비밀 포함) | 크레덴셜이 버전 관리에 노출 | 서버 정의는 `.mcp.json`, 크레덴셜은 `~/.claude.json` |
| 3B | 모든 MCP를 사용자 레벨에 | 팀원이 공유 도구에 접근 불가 | 공유 서버는 `.mcp.json`에 정의 |
| 4 | 에이전트에 15개+ 도구 부여 | 중복 설명으로 오라우팅(mis-routing) 유발 | 4-5개 도구 + 전문화된 서브에이전트 |
| 5 | CLAUDE.md 2단계만 인지 | managed/org과 local 관련 질문에서 오답 | 4단계 모두 숙지 |

---

## 시험 전략: 의사결정 프레임워크(Decision Framework)

개발자 생산성 문제를 만났을 때 적용할 프레임워크:

1. **"X는 어디에?"** -> 4단계 계층 적용. 조직 전체 비재정의 요구사항 = managed/org, 팀 표준 = project, 개인 선호 = user, 개인+프로젝트 한정 = local
2. **"X를 어떻게 강제?"** -> 프로그래밍적 > 프롬프트. 항상(always).
3. **"도구 몇 개?"** -> 에이전트당 4-5개. 오라우팅 문제 = 서브에이전트로 분할
4. **"누가 이 설정을 보나?"** -> `.mcp.json` / `.claude/CLAUDE.md` = 팀, `~/.claude.json` / `~/.claude/CLAUDE.md` = 개인
5. **"팀이 시간에 따라 개선하려면?"** -> 기술-판별 루프(Description-Discernment loop)

---

## 연습 문제 워크스루(Practice Question Walkthrough)

**문제**: 팀의 import 정렬 규칙을 Claude Code가 간헐적으로 무시합니다. 일부 개발자가 개인 `~/.claude/CLAUDE.md`에 지시를 추가했지만 불일치가 계속됩니다. 가장 효과적인 해결책은?

- **A)** 각 개발자의 개인 CLAUDE.md에 더 상세한 예시 추가
  -> **오답** — 팀 표준을 개인 파일에 두는 것은 잘못된 레벨 선택; 강제 메커니즘도 없음
- **B)** import 정렬 지시가 포함된 공유 스킬 생성
  -> **오답** — 프로그래밍적 강제 없음
- **C)** 프로젝트 레벨 `.claude/CLAUDE.md`에 지시 추가 + PostToolUse 훅으로 자동 정렬
  -> **정답** — 두 원칙을 동시에 테스트: (1) 팀 표준은 프로젝트 레벨에, (2) 기계적 규칙은 프로그래밍적 강제로
- **D)** 시스템 프롬프트에 few-shot 예시 추가
  -> **오답** — few-shot 예시는 도구 동작/출력을 신뢰성 있게 제어하지 못함

> 💡 정답 C는 두 가지 원칙을 동시에 테스트합니다: 팀 표준은 **프로젝트 레벨**에, 기계적 규칙은 **프로그래밍적 강제**로.

---

## 토론 질문(Discussion Questions)

1. **조직이 모든 Claude Code 세션에서 특정 보안 지침을 따르도록 요구하며, 개별 개발자가 이를 재정의할 수 없어야 합니다. 어떤 CLAUDE.md 레벨을 사용해야 하며, 그 이유는?**
   - 답: Managed/Org 레벨 — 최고 권한이며 하위 레벨에서 재정의 불가능합니다.

2. **팀의 MCP 서버에 공유 설정과 개별 API 키가 모두 필요합니다. 어떻게 구조화해야 하나요?**
   - 답: 서버 정의(비밀값 제외)는 `.mcp.json`(버전 관리 포함)에, API 키는 `~/.claude.json` 또는 환경변수(버전 관리 제외)에 분리합니다.

3. **12개 도구를 가진 에이전트가 상세한 프롬프트에도 불구하고 자주 잘못된 도구를 선택합니다. 어떤 아키텍처 변경을 권장하시겠습니까?**
   - 답: 조정자 에이전트(coordinator)와 전문화된 서브에이전트(sub-agents)로 분할하여, 각 서브에이전트가 구체적 설명을 가진 4-5개의 집중된 도구를 보유하게 합니다.

---

*CCA 시나리오 딥다이브 시리즈 7편 (Rick Hightower 저)*
