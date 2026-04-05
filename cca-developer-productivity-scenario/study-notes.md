# CCA Developer Productivity Scenario - Study Notes

> CCA 시나리오 딥다이브 시리즈 Part 7 | Rick Hightower | 2026-04-02
> Domain 2: Claude Code Workflows (20%) + Domain 4: Tool Design & MCP (18%)

---

## 1. 영한 용어표 (English-Korean Glossary)

| English Term | 한국어 | ★ 빈도 | 시험 출제 |
|-------------|--------|--------|----------|
| **four-level hierarchy** | 4단계 계층 구조 | ★★★ | 핵심 |
| **managed/org level** | 관리/조직 레벨 | ★★★ | 핵심 |
| **resolution chain** | 해석 체인 | ★★ | 중요 |
| **programmatic enforcement** | 프로그래밍적 강제 | ★★★ | 핵심 |
| **prompt-based guidance** | 프롬프트 기반 안내 | ★★ | 대비 개념 |
| **context pressure** | 컨텍스트 압박 | ★★ | 중요 |
| **PostToolUse / PreToolUse hooks** | 도구 사용 후/전 훅 | ★★★ | 핵심 |
| **Description-Discernment loop** | 기술-판별 루프 | ★★★ | 핵심 |
| **tool routing / mis-routing** | 도구 라우팅 / 오라우팅 | ★★ | 중요 |
| **routing mechanism** | 라우팅 메커니즘 | ★★ | 중요 |
| **coordinator-subagent pattern** | 조정자-서브에이전트 패턴 | ★★ | 중요 |
| **4-5 tool principle** | 에이전트당 4-5개 도구 원칙 | ★★★ | 핵심 |
| **scoping** | 범위 지정 / 스코핑 | ★★ | 중요 |
| **MCP configuration scoping** | MCP 설정 스코핑 | ★★★ | 핵심 |
| **anti-pattern** | 안티패턴 | ★★ | 오답 제거용 |
| **few-shot examples** | 퓨샷 예시 | ★★ | 안티패턴 |
| **skills vs rules** | 스킬 vs 규칙 | ★★ | 중요 |
| **on-demand loading** | 온디맨드 로딩 | ★ | 배경 |
| **AI Fluency Framework** | AI 유창성 프레임워크 | ★ | 배경 |
| **deterministic vs probabilistic** | 확정적 vs 확률적 | ★★ | 중요 |
| **CLAUDE.local.md** | 로컬 CLAUDE 설정 파일 | ★★ | 함정 |
| **monorepo support** | 모노레포 지원 | ★ | 보조 |

---

## 2. 시험 함정 Top 5 (Exam Traps)

### Trap 1: CLAUDE.md 2단계 vs 4단계 계층 혼동
- **함정**: 대부분의 학습 자료가 project/user 2단계만 다루므로, managed/org와 local 레벨을 모르고 시험에 응시
- **빠지는 유형**: "조직 전체 보안 정책을 어디에?" -> managed/org가 정답인데 project를 선택
- **핵심 구분**:
  - Managed/Org: IT 배포, 하위 재정의 불가, `/Library/Application Support/ClaudeCode/CLAUDE.md`
  - Local: `.gitignore` 대상, 개인+프로젝트 한정, `CLAUDE.local.md`
- **암기법**: "M-P-U-L" (Managed -> Project -> User -> Local, 위에서 아래로 우선순위)

### Trap 2: MCP 스코핑 — "전부 한쪽에" 안티패턴
- **함정**: `.mcp.json`에 크레덴셜까지 넣거나, 전부 `~/.claude.json`에 넣는 선택지
- **빠지는 유형**: "편의를 위해 한 파일로 통합" 답변을 고르는 것
- **정답 패턴**: 서버 정의(비밀 제외) = `.mcp.json` (팀 공유, VCS), 크레덴셜 = `~/.claude.json` 또는 환경변수 (개인, non-VCS)
- **암기법**: "정의는 팀에, 비밀은 나에게" (Definitions to team, secrets to me)

### Trap 3: "더 나은 프롬프트"로 도구 선택 문제 해결
- **함정**: 에이전트가 잘못된 도구를 선택할 때 "프롬프트를 개선하라"는 답변
- **빠지는 유형**: 도구가 12-18개인 에이전트에 프롬프트 튜닝으로 해결하려는 접근
- **정답**: 전문화된 서브에이전트로 분할 (4-5개 도구 원칙) + 도구 설명 구체화
- **암기법**: "도구 많으면 쪼개라, 설명 모호하면 구체화하라"

### Trap 4: Few-shot 예시로 도구 호출 순서 제어
- **함정**: few-shot 예시가 도구 **순서**를 제어할 수 있다는 가정
- **빠지는 유형**: "시스템 프롬프트에 도구 호출 순서 예시를 추가하라"
- **정답**: 프로그래밍적 전제조건(preconditions) 또는 단일 도구로 래핑
- **핵심 구분**: few-shot은 **출력 포맷/추론 스타일**에는 유효하지만 **도구 호출 시퀀스**에는 무효

### Trap 5: 프롬프트 vs 훅 — "시스템 프롬프트에 추가" 유혹
- **함정**: "CLAUDE.md에 규칙을 추가하면 충분하다"는 선택지
- **빠지는 유형**: 보안/컴플라이언스/빌드 규칙을 프롬프트만으로 강제하려는 답변
- **정답**: PostToolUse/PreToolUse 훅 = 확정적(deterministic) 실행
- **황금률**: "시스템 프롬프트 지시" vs "프로그래밍 훅" 중 선택 -> **항상 훅**
- **암기법**: "프롬프트는 확률, 훅은 확정" (Prompts = probabilistic, Hooks = deterministic)

---

## 3. 연습 문제 5문항

### Q1. CLAUDE.md 계층 구조
**문제**: 신입 개발자가 Claude Code를 사용하기 시작했습니다. 회사의 보안팀이 "모든 개발자의 Claude Code 세션에서 민감 데이터를 외부 API로 전송하는 것을 금지"하는 규칙을 적용하고 싶습니다. 개발자가 이 규칙을 재정의할 수 없어야 합니다. 이 규칙은 어디에 설정해야 합니까?

- A) 각 프로젝트의 `.claude/CLAUDE.md`에 추가
- B) 각 개발자의 `~/.claude/CLAUDE.md`에 추가
- C) `/Library/Application Support/ClaudeCode/CLAUDE.md`에 IT 팀이 배포
- D) 각 프로젝트의 `CLAUDE.local.md`에 추가

**정답**: **C**
> Managed/Org 레벨은 최고 권한으로, 하위 레벨(project, user, local)에서 재정의할 수 없습니다. 조직 전체에 강제해야 하고 개발자가 변경 불가능해야 하는 보안 정책은 managed/org 레벨에 배치합니다.

---

### Q2. MCP 스코핑
**문제**: 팀이 GitHub MCP 서버와 Jira MCP 서버를 사용합니다. GitHub 서버는 팀 전체가 동일한 설정으로 접근하고, Jira 서버는 각 개발자의 개인 API 토큰이 필요합니다. 올바른 설정 방법은?

- A) 두 서버 모두 `.mcp.json`에 API 토큰 포함하여 정의
- B) 두 서버 모두 `~/.claude.json`에 정의
- C) GitHub는 `.mcp.json`에, Jira는 `~/.claude.json`에 전부 정의
- D) 두 서버 정의는 `.mcp.json`에, Jira API 토큰만 `~/.claude.json` 또는 환경변수에 분리

**정답**: **D**
> 서버 정의(비밀값 제외)는 팀 공유를 위해 `.mcp.json`에, 개인 크레덴셜은 `~/.claude.json` 또는 환경변수에 분리합니다. A는 크레덴셜이 VCS에 노출되고, B는 팀원이 GitHub 서버에 접근 불가하며, C는 Jira 서버 정의 자체를 팀이 공유할 수 없습니다.

---

### Q3. 도구 라우팅 문제
**문제**: QA 에이전트에 14개의 테스트 도구가 있습니다. 에이전트가 "API 응답 검증" 도구 대신 "UI 렌더링 검증" 도구를 자주 잘못 선택합니다. 시니어 아키텍트가 제안해야 할 해결책은?

- A) 시스템 프롬프트에 "API 테스트 시 반드시 API 응답 검증 도구를 사용하라"는 지시 추가
- B) 각 도구의 few-shot 예시에 올바른 사용 순서를 명시
- C) QA 에이전트를 API 테스트 서브에이전트(4개 도구)와 UI 테스트 서브에이전트(4개 도구)로 분할하고, 각 도구 설명을 구체화
- D) 도구 이름을 더 명확하게 변경 (예: `api_response_validator`, `ui_render_checker`)

**정답**: **C**
> 14개 도구는 4-5개 원칙 초과로, 설명이 겹쳐 오라우팅이 발생합니다. 서브에이전트 분할 + 구체적 도구 설명이 정답입니다. A는 확률적 실행, B는 few-shot이 도구 선택을 제어하지 못함, D는 Claude가 이름이 아닌 설명으로 도구를 선택하므로 효과 제한적.

---

### Q4. 프로그래밍적 강제 vs 프롬프트
**문제**: 팀의 코딩 표준에서 모든 TypeScript 파일은 저장 시 Prettier로 포매팅되어야 합니다. 현재 CLAUDE.md에 "파일 저장 전 Prettier를 실행하라"고 적혀 있지만, 장문 세션에서 간헐적으로 무시됩니다. 가장 효과적인 해결책은?

- A) CLAUDE.md의 지시를 더 강조하여 재작성 (예: "반드시", "절대로 생략하지 마라")
- B) 매 세션 시작 시 Prettier 규칙을 상기시키는 규칙 파일 추가
- C) PostToolUse 훅을 설정하여 `write_file` 후 자동으로 `prettier --write` 실행
- D) 개발자에게 수동으로 Prettier를 실행하도록 교육

**정답**: **C**
> 프롬프트는 확률적(probabilistically)으로 실행되어 컨텍스트 압박 시 생략 가능하지만, 훅은 확정적(deterministically)으로 실행됩니다. A/B는 여전히 프롬프트 기반이므로 동일한 문제가 재발할 수 있고, D는 자동화의 이점을 포기합니다.

---

### Q5. Description-Discernment 루프
**문제**: 5명의 개발자로 구성된 팀에서 Claude Code의 코드 생성 품질이 개발자마다 크게 다릅니다. 한 개발자는 일관되게 좋은 결과를 얻지만, 나머지는 매번 다른 품질의 출력을 받습니다. 팀 전체의 일관성을 높이기 위한 최적의 접근법은?

- A) 좋은 결과를 얻는 개발자의 프롬프트를 팀 전체에 공유
- B) 각 개발자가 자신만의 CLAUDE.md 설정을 최적화하도록 교육
- C) 프로젝트 레벨 CLAUDE.md에 코딩 표준을 문서화하고, 코드리뷰에서 발견된 패턴을 기반으로 CLAUDE.md와 스킬을 지속적으로 업데이트하는 프로세스 도입
- D) 모든 Claude Code 출력에 대해 수동 코드리뷰를 의무화

**정답**: **C**
> Description-Discernment 루프의 핵심: (1) 기술(Description) = CLAUDE.md, 스킬에 팀 표준 문서화, (2) 판별(Discernment) = 코드리뷰로 검증, (3) 판별 결과로 기술 업데이트 = 지속적 개선 루프. A는 일회성 공유(one-shot), B는 개인화가 팀 일관성을 해침, D는 판별만 있고 기술 개선이 없음.

---

## 4. 도메인 매핑 (Exam Domain Mapping)

### Domain 2: Claude Code Workflows (20%)

이 아티클에서 다루는 Domain 2 토픽:

| 토픽 | 출제 포인트 | 핵심 키워드 |
|------|-----------|-----------|
| CLAUDE.md 4단계 계층 | managed/org vs project vs user vs local 레벨 선택 | four-level hierarchy, resolution chain |
| 모노레포 지원 | 루트 + 하위 디렉토리 CLAUDE.md 자동 로딩 | monorepo, subdirectory loading |
| 훅 설정 | PostToolUse/PreToolUse로 확정적 실행 | hooks, deterministic execution |
| 스킬 vs 규칙 | 매 세션 로딩(rules) vs 온디맨드(skills) | on-demand loading, per-session overhead |
| CLAUDE.local.md | .gitignore 대상, 개인+프로젝트 한정 | local level, not version-controlled |

### Domain 4: Tool Design & MCP (18%)

이 아티클에서 다루는 Domain 4 토픽:

| 토픽 | 출제 포인트 | 핵심 키워드 |
|------|-----------|-----------|
| MCP 설정 스코핑 | `.mcp.json` (팀) vs `~/.claude.json` (개인+크레덴셜) | scoping, credentials separation |
| 에이전트당 도구 수 | 4-5개 원칙, 초과 시 서브에이전트 분할 | 4-5 tool principle, sub-agents |
| 도구 설명 = 라우팅 | 이름이 아닌 설명으로 선택, 구체적 기술 필요 | routing mechanism, description specificity |
| 조정자-서브에이전트 패턴 | 허브앤스포크, 도구 분산 아키텍처 | coordinator-subagent, hub-and-spoke |

### 도메인 간 연결 (Cross-Domain Connections)

| 연결 | Domain A | Domain B | 출제 시나리오 |
|------|----------|----------|-------------|
| 프롬프트 vs 훅 | D2 (Workflows) | D3 (Prompt Eng.) | "규칙 강제 방법 선택" |
| Description-Discernment | D3 (Prompt Eng.) | D2 (Workflows) | "팀 출력 일관성 개선" |
| 도구 분할 + 아키텍처 | D4 (Tool/MCP) | D1 (Agentic Arch.) | "오라우팅 해결" |
| 컨텍스트 압박 + 훅 | D5 (Context Mgmt.) | D2 (Workflows) | "장문 세션에서 규칙 누락" |
| MCP 스코핑 + 보안 | D4 (Tool/MCP) | D2 (Workflows) | "크레덴셜 관리" |

---

## 5. 빠른 복습 체크리스트

- [ ] CLAUDE.md 4단계: Managed/Org -> Project -> User -> Local (상위 우선, 재정의 불가)
- [ ] MCP 스코핑: 정의는 `.mcp.json`, 비밀은 `~/.claude.json`
- [ ] 도구 수: 에이전트당 4-5개, 초과면 서브에이전트 분할
- [ ] 도구 선택: 이름이 아닌 **설명** 기반
- [ ] 프롬프트 = 확률적, 훅 = 확정적 -> 강제 규칙엔 훅
- [ ] Description-Discernment 루프: 일회성이 아닌 반복적 개선
- [ ] Few-shot: 출력 포맷에는 유효, 도구 순서에는 무효
- [ ] 스킬 vs 규칙: 긴 절차 = 스킬(온디맨드), 항상 필요 = 규칙(매 세션)
- [ ] 안티패턴 5개 모두 식별 가능한가?

---

*Generated: 2026-04-04*
