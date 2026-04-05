# CCA 모의시험 60문항 — 스터디 노트

> 원문: [Claude Certified Architect Practice Exam: 60 Questions with Detailed Explanations](https://medium.com/@richardhightower/claude-certified-architect-practice-exam-60-questions-with-detailed-explanations-3a4d2267603d) — Rick Hightower

---

## 1. 도메인별 문제 분류표 (60문항 → 5 도메인 매핑)

### 도메인 1: 에이전틱 아키텍처 & 오케스트레이션 (27%) — Q1~Q16, 16문항

| 문항 | 난이도 | 핵심 주제 | 키워드 |
|------|--------|----------|--------|
| Q1 | Easy | 코디네이터-서브에이전트 패턴 | hub-and-spoke, coordinator-subagent |
| Q2 | Medium | 에이전틱 루프 순서 | generate → tool_use → execute → result → end_turn |
| Q3 | Hard | 서브에이전트 컨텍스트 격리 | context isolation, prompt string only |
| Q4 | Medium | 작업 분해 전략 | 독립=병렬, 의존=코디네이터 합성 |
| Q5 | Medium | 사일런트 실패 처리 | structured status, error reporting |
| Q6 | Medium | tool_choice 설정 | auto/any/none/named-tool |
| Q7 | Hard | 컨텍스트 포킹 | fork_session=True |
| Q8 | Easy | 시스템 프롬프트 목적 | 역할 정의, 행동 지침 |
| Q9 | Hard | 에스컬레이션 패턴 | bounded retry 2-3회 + 인간 에스컬레이션 |
| Q10 | Easy | 도구 수 한계 | 4-5개 규칙, 서브에이전트 분할 |
| Q11 | Easy | 서브에이전트 간 통신 | 직접 통신 불가, 코디네이터 경유만 |
| Q12 | Medium | 의존성 기반 실행 전략 | A→B 순차, C 병렬 |
| Q13 | Medium | 에스컬레이션 트리거 기준 | 결정론적 비즈니스 규칙 |
| Q14 | Hard | 사일런트 실패 안티패턴 | success+null vs failure |
| Q15 | Easy | tool_choice: none | 텍스트 전용 응답 |
| Q16 | Medium | AI Fluency 4D | Delegation, Description, Discernment, Diligence |

### 도메인 2: 컨텍스트 엔지니어링 (20%) — Q17~Q28, 12문항

| 문항 | 난이도 | 핵심 주제 | 키워드 |
|------|--------|----------|--------|
| Q17 | Easy | CLAUDE.md 프로젝트 레벨 위치 | ./CLAUDE.md, 버전 관리 |
| Q18 | Hard | CLAUDE.md 4단계 계층 | Managed/Org → Project → User → Local |
| Q19 | Medium | CLAUDE.local.md 용도 | gitignored, 개인+프로젝트별 |
| Q20 | Medium | Skills vs CLAUDE.md | 온디맨드 vs 항상 로드 |
| Q21 | Easy | MCP 설정: .mcp.json | 프로젝트 레벨, 팀 공유, 버전 관리 |
| Q22 | Medium | Lost in the Middle 효과 | 컨텍스트 열화, 주의력 문제 |
| Q23 | Easy | 대규모 리팩토링 접근법 | 분해→실행→합성→검토 |
| Q24 | Hard | 모노레포 CLAUDE.md 구성 | 루트 + 컴포넌트별 계층 |
| Q25 | Medium | MCP 자격증명 저장 | ~/.claude.json (비버전관리) |
| Q26 | Medium | 정보 배치 최적화 | 시작/끝에 배치, 중간 피하기 |
| Q27 | Easy | 사용자 레벨 설정 | ~/.claude/CLAUDE.md |
| Q28 | Hard | Managed/Org 레벨 | 최고 권한, 오버라이드 불가 |

### 도메인 3: 도구 설계 & 통합 (20%) — Q29~Q40, 12문항

| 문항 | 난이도 | 핵심 주제 | 키워드 |
|------|--------|----------|--------|
| Q29 | Easy | CI/CD 필수 플래그 | -p + --bare |
| Q30 | Medium | --output-format json | 기계 파싱 가능 출력 |
| Q31 | Medium | PreToolUse hook | 프로그래밍적 강제 vs 확률적 |
| Q32 | Easy | 도구 선택 메커니즘 | tool description이 핵심 |
| Q33 | Hard | MCP 3 프리미티브 | Tool, Resource, Prompt |
| Q34 | Medium | --tools vs --allowedTools | 제한 vs 사전 승인 |
| Q35 | Medium | structured_output 필드 | JSON 스키마 출력 위치 |
| Q36 | Easy | --bare가 건너뛰는 것 | hooks, LSP, plugins, skills, memory, OAuth |
| Q37 | Hard | 모호한 도구 설명 | 잘못된 도구 선택 유발 |
| Q38 | Medium | JSON 구조 보장 | tool-forcing (tool_choice + input_schema) |
| Q39 | Medium | stop_reason: tool_use | 도구 실행 요청 신호 |
| Q40 | Hard | 3계층 신뢰성 모델 | 프롬프트 → 스키마 → 시맨틱 검증 |

### 도메인 4: 보안 & 컴플라이언스 (18%) — Q41~Q48, 8문항

| 문항 | 난이도 | 핵심 주제 | 키워드 |
|------|--------|----------|--------|
| Q41 | Easy | PII 처리 | 익명화 선행 + 훅으로 강제 |
| Q42 | Medium | 최소 권한 원칙 | least privilege |
| Q43 | Hard | 금융 거래 한도 강제 | PreToolUse hook |
| Q44 | Medium | 규제 산업 출력 준수 | 프로그래밍적 검증 |
| Q45 | Easy | 감사 로깅 | PostToolUse hooks |
| Q46 | Hard | $600 환불 + 92% 신뢰도 | 비즈니스 규칙 > 신뢰도 점수 |
| Q47 | Medium | 프로그래밍적 vs 프롬프트 강제 | 결정론적 vs 확률적 |
| Q48 | Medium | ZDR (Zero Data Retention) | Real-Time API만 지원 |

### 도메인 5: 성능 & 비용 최적화 (15%) — Q49~Q60, 12문항

| 문항 | 난이도 | 핵심 주제 | 키워드 |
|------|--------|----------|--------|
| Q49 | Easy | 비용 최적화: 사용자 대면 | Prompt Caching (90% 절감) |
| Q50 | Medium | Prompt Caching 비용 구조 | 읽기 0.1x / 쓰기 1.25x |
| Q51 | Medium | 비실시간 대량 처리 | Batch API (50% 절감) |
| Q52 | Easy | -p 플래그 누락 결과 | 파이프라인 무한 대기 |
| Q53 | Hard | --bare 없이 CI 실행 | 환경 간 다른 동작 |
| Q54 | Medium | CI/CD 권장 플래그 조합 | -p --bare --output-format json --tools |
| Q55 | Medium | 무한 재시도 안티패턴 | bounded retry 2-3회 |
| Q56 | Easy | 90% 비용 절감 기법 | Prompt Caching 캐시 읽기 |
| Q57 | Hard | Batch API 고객 대면 문제 | 24시간 레이턴시, 실시간 부적합 |
| Q58 | Medium | output-format 3가지 모드 | text, json, stream-json |
| Q59 | Medium | few-shot 역할 | 형식/품질 시연, 순서 강제 불가 |
| Q60 | Hard | 통합 아키텍처 설계 | RT API + Caching + PreToolUse + PostToolUse |

---

## 2. 오답 주의 패턴 Top 10

### 패턴 1: 자기보고 신뢰도 의존 ⚠️
**빈출 문항:** Q9, Q13, Q46
- "에이전트가 85% 신뢰도를 보고하면..." → **항상 오답**
- LLM 신뢰도 점수는 보정되지 않음 (not calibrated)
- 순환 논리: 틀릴 수 있는 시스템에게 자신의 정확도를 평가하게 함
- **올바른 패턴:** 결정론적 비즈니스 규칙 ($500 초과, 계정 해지 등)

### 패턴 2: 서브에이전트 컨텍스트 상속 착각 ⚠️
**빈출 문항:** Q3, Q11, Q14
- "서브에이전트가 부모 히스토리를 자동으로 상속한다" → **항상 오답**
- 서브에이전트는 prompt string + 자체 system prompt만 받음
- **올바른 패턴:** 코디네이터가 프롬프트에 관련 컨텍스트를 명시적으로 포함

### 패턴 3: 프롬프트 기반 보안/컴플라이언스 ⚠️
**빈출 문항:** Q31, Q41, Q43, Q44, Q47
- "시스템 프롬프트에 규칙을 추가하라" → **보안/컴플라이언스에서 항상 오답**
- 프롬프트 = 확률적 넛지 (무시 가능)
- **올바른 패턴:** hooks (PreToolUse/PostToolUse)로 프로그래밍적 강제

### 패턴 4: 컨텍스트 윈도우 확대로 해결 ⚠️
**빈출 문항:** Q22, Q23, Q26
- "더 큰 컨텍스트 윈도우를 사용하라" → **항상 오답**
- 열화는 용량 문제가 아닌 주의력 문제 (Lost in the Middle)
- **올바른 패턴:** 분해 → 집중 세션 → 합성 → 검토

### 패턴 5: Batch API를 사용자 대면에 적용 ⚠️
**빈출 문항:** Q49, Q51, Q57
- "비용 절감을 위해 Batch API 사용" (실시간 시나리오에서) → **항상 오답**
- Batch API = 최대 24시간 레이턴시 → 사용자 대면 불가
- **올바른 패턴:** 실시간 = Prompt Caching (90% 절감) / 비실시간 = Batch API (50% 절감)

### 패턴 6: -p 플래그 누락 우회 시도 ⚠️
**빈출 문항:** Q29, Q52
- "파이프라인 타임아웃을 늘리자" → **증상 치료, 근본 해결 아님**
- 행의 원인은 -p 누락으로 대화형 모드 진입
- **올바른 패턴:** `-p` (비대화형) + `--bare` (재현성)

### 패턴 7: --tools와 --allowedTools 혼동 ⚠️
**빈출 문항:** Q34, Q54
- `--allowedTools`가 도구를 제한한다고 생각 → **오해**
- `--allowedTools` = 사전 승인 (권한 프롬프트 생략)
- `--tools` = 사용 가능 도구 **제한** (샌드박싱)
- **시험 신호:** "의도치 않은 동작 방지" → `--tools`

### 패턴 8: 무한 재시도 ⚠️
**빈출 문항:** Q9, Q55
- 재시도 상한 없이 반복 → **안티패턴**
- **올바른 패턴:** 바운디드 리트라이 2~3회 + 구체적 에러 피드백 + 에스컬레이션

### 패턴 9: 사일런트 실패 (success + null) ⚠️
**빈출 문항:** Q5, Q14
- `{"status": "success", "data": null}` → "데이터 없음"과 "검색 실패" 혼동
- **올바른 패턴:** 구조화된 상태 보고 (status + error_type + details)

### 패턴 10: few-shot으로 도구 순서 제어 ⚠️
**빈출 문항:** Q59
- few-shot 예시가 도구 호출 순서를 제어한다고 생각 → **오해**
- few-shot = 출력 형식/품질 시연용
- **순서 강제:** tool_choice 또는 hooks

---

## 3. 도메인별 정답률 자가진단표

각 도메인의 문항을 풀고 정답률을 기록하세요.

### 1차 풀이 기록

| 도메인 | 문항 범위 | 총 문항 | 가중치 | 정답 수 | 정답률 | 판정 |
|--------|----------|---------|--------|---------|--------|------|
| 1. 에이전틱 아키텍처 | Q1–Q16 | 16 | 27% | __/16 | __% | |
| 2. 컨텍스트 엔지니어링 | Q17–Q28 | 12 | 20% | __/12 | __% | |
| 3. 도구 설계 & 통합 | Q29–Q40 | 12 | 20% | __/12 | __% | |
| 4. 보안 & 컴플라이언스 | Q41–Q48 | 8 | 18% | __/8 | __% | |
| 5. 성능 & 비용 최적화 | Q49–Q60 | 12 | 15% | __/12 | __% | |
| **합계** | | **60** | **100%** | **__/60** | **___%** | |

### 판정 기준

| 정답률 | 판정 | 다음 단계 |
|--------|------|----------|
| 90%+ | ✅ 합격 수준 | 유지 + 약점 도메인 집중 |
| 80-89% | 🟡 거의 합격 | 오답 패턴 분석 → 해당 시나리오 재학습 |
| 70-79% | 🟠 경계선 | 해당 도메인 딥다이브 아티클 정독 |
| 70% 미만 | 🔴 미달 | 기초부터 재학습 필요 |

### 2차 풀이 기록 (1차 학습 후)

| 도메인 | 1차 정답률 | 2차 정답률 | 향상 |
|--------|-----------|-----------|------|
| 1. 에이전틱 아키텍처 | __% | __% | __% |
| 2. 컨텍스트 엔지니어링 | __% | __% | __% |
| 3. 도구 설계 & 통합 | __% | __% | __% |
| 4. 보안 & 컴플라이언스 | __% | __% | __% |
| 5. 성능 & 비용 최적화 | __% | __% | __% |
| **합계** | **___%** | **___%** | **__%** |

---

## 4. 핵심 용어 빈출 순위

60문항 전체에서 등장 빈도를 기준으로 정리했습니다.

### Tier 1: 최고 빈출 (5회 이상 등장)

| 순위 | 용어 | 등장 문항 | 횟수 |
|------|------|----------|------|
| 1 | **programmatic enforcement** (프로그래밍적 강제) | Q31, Q41, Q43, Q44, Q45, Q47, Q60 | 7 |
| 2 | **coordinator-subagent pattern** (코디네이터-서브에이전트 패턴) | Q1, Q3, Q4, Q10, Q11, Q12 | 6 |
| 3 | **tool_choice** | Q6, Q15, Q38, Q40, Q59 | 5 |
| 4 | **bounded retry** (바운디드 리트라이 2-3회) | Q5, Q9, Q13, Q55 | 5* |
| 5 | **context isolation** (컨텍스트 격리) | Q1, Q3, Q11, Q14 | 5* |
| 6 | **Prompt Caching** | Q49, Q50, Q51, Q56, Q57, Q60 | 6 |

### Tier 2: 고빈출 (3~4회 등장)

| 순위 | 용어 | 등장 문항 | 횟수 |
|------|------|----------|------|
| 7 | **CLAUDE.md hierarchy** (4단계 계층) | Q17, Q18, Q19, Q27, Q28 | 5 |
| 8 | **-p flag** (비대화형 모드) | Q29, Q52, Q53, Q54 | 4 |
| 9 | **--bare flag** | Q29, Q36, Q53, Q54 | 4 |
| 10 | **PreToolUse hook** | Q31, Q43, Q45, Q60 | 4 |
| 11 | **Batch API** | Q49, Q51, Q57, Q60 | 4 |
| 12 | **silent failure** (사일런트 실패) | Q5, Q14 | 3* |
| 13 | **schema enforcement** (스키마 강제) | Q38, Q40, Q44 | 3 |
| 14 | **MCP primitives** | Q21, Q25, Q33 | 3 |
| 15 | **Lost in the Middle** | Q22, Q23, Q26 | 3 |

### Tier 3: 중빈출 (2회 등장) — 반드시 숙지

| 용어 | 등장 문항 |
|------|----------|
| **self-reported confidence** (자기보고 신뢰도) | Q9, Q46 |
| **fork_session** (세션 포크) | Q7 |
| **4-5 tool rule** (도구 수 규칙) | Q10, Q33 |
| **--tools vs --allowedTools** | Q34, Q54 |
| **structured_output field** | Q35 |
| **ZDR (Zero Data Retention)** | Q48 |
| **agentic loop** (에이전틱 루프) | Q2, Q39 |
| **stop_reason: tool_use** | Q2, Q39 |
| **PostToolUse callback** | Q45, Q60 |
| **output-format json** | Q30, Q58 |

---

## 5. 빠른 참조 카드

### 필수 암기: 숫자

| 항목 | 값 | 문맥 |
|------|---|------|
| 에이전트당 도구 수 | **4-5개** | 초과 시 서브에이전트 분할 |
| 바운디드 리트라이 | **2-3회** | 초과 시 에스컬레이션 |
| Prompt Caching 읽기 절감 | **90%** (0.1x) | 캐시 읽기에만 적용 |
| Prompt Caching 쓰기 비용 | **+25%** (1.25x) | 5분 TTL 기준 |
| Batch API 절감 | **50%** | 비실시간 전용 |
| Batch API 레이턴시 | **최대 24시간** | 사용자 대면 불가 |
| 합격 기준 | **720/1000** ≈ 43/60 | 72% |
| 시험 시간 | **120분** | 2분/문항 |
| CLAUDE.md 계층 | **4단계** | Managed/Org → Project → User → Local |
| tool_choice 값 | **4가지** | auto, any, none, named-tool |
| MCP 프리미티브 | **3가지** | Tool, Resource, Prompt |
| 3계층 신뢰성 모델 | **3레벨** | Prompt → Schema → Semantic |

### 필수 암기: 원칙

1. **프로그래밍적 강제 > 프롬프트 기반** — 전 도메인 관통
2. **결정론적 규칙 > 확률적 자기 평가** — 에스컬레이션 핵심
3. **Batch API ≠ 사용자 대면** — 레이턴시 문제
4. **서브에이전트 ≠ 컨텍스트 상속** — 가장 큰 함정
5. **컨텍스트 열화 = 주의력 문제** — 용량 문제 아님
6. **Batch API ≠ ZDR** — 규제 산업 주의
