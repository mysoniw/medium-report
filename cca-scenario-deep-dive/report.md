# CCA Scenario Deep Dive Series — 시리즈 인덱스

> 원문 시리즈: [CCA Scenario Deep Dive Series](https://medium.com/@richardhightower) — Rick Hightower, 2026-03-25 ~ 2026-04-02

---

## 시리즈 개요

Anthropic의 **Claude Certified Architect (CCA) Foundations** 시험은 5개 역량 도메인과 6개 프로덕션 시나리오로 구성된다. Rick Hightower는 각 시나리오를 개별 아티클로 심층 분석하여 총 8편의 시리즈를 집필 중이다 (현재 7편 발행).

이 시리즈의 핵심 관통 원칙:
- **프로그래밍적 강제 > 프롬프트 기반 안내** — 결과가 중요한 규칙은 코드로 강제
- **결정론적 규칙 > 확률적 자기 평가** — LLM 신뢰도 점수에 의존하지 않음
- **4-5개 도구/에이전트** — 초과 시 전문 서브에이전트로 분할
- **구조화된 출력 + 검증 + 재시도** — 3계층 신뢰성 모델

---

## 시리즈 목차

### Article 1: CCA Foundations 시험 완벽 가이드

📄 [전체 리포트 →](../cca-foundations-exam-guide/report.md)

시험 전체 지도. 5개 도메인 가중치, 6개 시나리오 개요, 합격을 결정하는 5가지 멘탈 모델, 안티패턴 카탈로그, 4주 학습 계획.

| 항목 | 내용 |
|------|------|
| 도메인 | 전체 5개 도메인 개요 |
| 핵심 개념 | 멘탈 모델 5가지, $100M Partner Network, 85만+ 인력 전환 |
| 시험 가중치 | Agentic Architecture 27%, Claude Code 20%, Prompt Engineering 20%, Tool Design 18%, Context Management 15% |

---

### Article 2: 고객 지원 에이전트 시나리오

📄 [전체 리포트 →](../cca-customer-support-agent/report.md)

6개 시나리오 중 가장 위험한 시나리오. 익숙함이 함정 — "고객 지원은 안다"는 직관이 오답을 선택하게 만든다.

| 항목 | 내용 |
|------|------|
| 관련 도메인 | Agentic Architecture(27%) + Tool Design(18%) + Context Management(15%) = **60%** |
| 핵심 안티패턴 | ① LLM 자기보고 신뢰도로 에스컬레이션 ② Batch API로 라이브 지원 ③ 프롬프트로 컴플라이언스 |
| 올바른 패턴 | 결정론적 비즈니스 규칙, Prompt Caching(90% 절감), PostToolUse 훅 |
| 비용 최적화 | Prompt Caching(90%) > Batch API(50%). Batch는 24시간 윈도우로 라이브에 부적합 |

**시험 킬러 질문**: "$600 환불, 92% 신뢰도 → 처리? 에스컬레이션?" → **$600 > $500 한도이므로 신뢰도와 무관하게 에스컬레이션**

---

### Article 3: 코드 생성 시나리오

📄 [전체 리포트 →](../cca-code-generation-scenario/report.md)

Claude Code를 "사용할 줄 아는지"가 아니라 "왜 특정 결정이 더 나은 결과를 내는지"를 테스트. 시험 가중치 35% 커버.

| 항목 | 내용 |
|------|------|
| 관련 도메인 | Claude Code Workflows(20%) + Context Management(15%) = **35%** |
| 핵심 개념 | **컨텍스트 열화 = 주의력 문제, 용량 문제 아님** |
| 최대 함정 | "컨텍스트 윈도우를 늘리자" → 주의력을 더 얇게 분산시킬 뿐 |
| 올바른 패턴 | 파일별 집중 패스: 분해 → 실행 → 합성 → 검토 |
| CI/CD 필수 | `-p` = 비인터랙티브, `--bare` = 재현 가능 |

**47파일 리팩토링 사례**: 파일 1-5 ✅ → 파일 15-30 ⚠️(변수명 드리프트) → 파일 40-47 ❌(import 충돌). 용량은 충분했지만 **주의력이 열화**.

---

### Article 4: 멀티에이전트 리서치 시나리오

📄 [전체 리포트 →](../cca-multi-agent-research/report.md)

시리즈의 정점. 3대 핵심 도메인을 동시 테스트하며 시험 가중치 60% 커버.

| 항목 | 내용 |
|------|------|
| 관련 도메인 | Agentic Architecture(27%) + Tool Design(18%) + Context Management(15%) = **60%** |
| 아키텍처 | 허브앤스포크: 코디네이터(허브) + 전문 서브에이전트(스포크) |
| 핵심 규칙 | **서브에이전트는 코디네이터 컨텍스트를 상속하지 않는다** |
| 슈퍼에이전트 | 18개 도구 = 실패 / 4-5개 도구 × 전문 에이전트 = 성공 |
| 사일런트 실패 | `{"status":"success","data":null}` → 코디네이터가 "데이터 없음"으로 오해. 구조화된 에러 컨텍스트 필수 |

**뉴스룸 비유**: 편집자(코디네이터)가 기자들(서브에이전트)에게 취재 지시. 기자들은 **서로 대화하지 않는다** — 모든 조율은 편집자를 통해서만.

---

### Article 5: CI/CD 시나리오

📄 [전체 리포트 →](../cca-cicd-scenario/report.md)

가장 운영적으로 구체적인 시나리오. 정확한 플래그, 구문, 적용 시점을 외워야 한다.

| 항목 | 내용 |
|------|------|
| 관련 도메인 | Claude Code Workflows(20%) + Prompt Engineering(20%) + Context Management(15%) |
| 필수 플래그 | `-p`(비인터랙티브) + `--bare`(재현성) + `--output-format json`(기계 파싱) |
| ZDR 제약 | **Batch API는 Zero Data Retention 대상이 아님** → 규제 산업은 Real-Time API만 |
| Prompt Caching | 캐시 읽기 **90% 절감** / 캐시 쓰기 **25% 추가**(5분 TTL) |
| 샌드박싱 | `--tools` = 도구 **제한** / `--allowedTools` = 도구 **사전 승인** (다른 개념!) |

**시험 최빈출 질문**: "파이프라인이 무한 행(hang)" → 답은 항상 **`-p` 플래그 누락**.

---

### Article 6: 구조화된 데이터 추출 시나리오

📄 [전체 리포트 →](../cca-structured-data-extraction/report.md)

가장 많은 수험생을 탈락시키는 시나리오. "데모에서 90% 작동"과 "프로덕션에서 100% 작동"의 차이를 정밀 테스트.

| 항목 | 내용 |
|------|------|
| 관련 도메인 | Prompt Engineering(20%) + Context Management(15%) + Agentic Architecture(27%) |
| 3계층 모델 | Level 1: 프롬프트 안내 → Level 2: JSON 스키마 강제 → Level 3: 프로그래밍적 시맨틱 검증 |
| SDK 패턴 | `tool_choice` (tool-forcing) / `client.messages.parse()` (Pydantic) |
| SDK 함정 | `with_structured_output()`는 **LangChain** 메서드. "네이티브 SDK"에서 이 답 = 오답 |
| 재시도 루프 | **informed**(구체적 에러 피드백) + **bounded**(2-3회) + **인간 에스컬레이션** |

**3계층이 필수인 이유**: Level 1은 확률적 넛지(보장 아님). Level 2는 구조만 보장(의미 미검증). Level 3만이 "total이 line_items 합계와 일치하는가"를 검증.

---

### Article 7: 개발자 생산성 시나리오

📄 [전체 리포트 →](../cca-developer-productivity-scenario/report.md)

겉보기에는 Claude Code 설정 질문이지만, 실제로는 5개 도메인을 모두 횡단하는 복합 시나리오.

| 항목 | 내용 |
|------|------|
| 관련 도메인 | 5개 도메인 전부 횡단 |
| CLAUDE.md | **4단계 계층**: Managed/Org → Project → User → Local (2단계만 알면 치명적) |
| MCP 스코핑 | 서버 정의는 `.mcp.json` / 크레덴셜은 `~/.claude.json` — 분리 필수 |
| 핵심 루프 | Description-Discernment 루프: 기술 → 출력 → 리뷰 → 기술 갱신 (반복) |
| 훅 | PostToolUse/PreToolUse — 프롬프트는 "대부분", 훅은 "항상" |

**Managed/Org 레벨**: IT가 배포, 개발자가 재정의 불가. "조직 전체 보안 정책" 질문의 정답.

---

### Article 8: 60 Review Questions ⬜ 미발행

종합 연습 문제 60개와 답안 해설. 시리즈 전체를 관통하는 실전 시뮬레이션.

---

## 시리즈 관통 안티패턴 × 올바른 패턴

| 주제 | 안티패턴 (오답) | 올바른 패턴 (정답) | 출현 아티클 |
|------|---------------|------------------|-----------|
| 에스컬레이션 | LLM 자기보고 신뢰도 | 결정론적 비즈니스 규칙 | 2, 6 |
| 규칙 강제 | 프롬프트 기반 안내 | 프로그래밍적 훅/코드 | 2, 3, 7 |
| 비용 최적화 | Batch API로 라이브 지원 | Prompt Caching (90% 절감) | 2, 5 |
| 도구 수 | 15-18개 도구 단일 에이전트 | 4-5개 × 전문 서브에이전트 | 2, 4, 7 |
| 컨텍스트 | 윈도우 확대로 품질 해결 | 파일별 집중 패스 / 분해 | 3, 4 |
| JSON 출력 | "Always return JSON" 프롬프트 | --output-format json / tool-forcing | 5, 6 |
| 재시도 | Blind/무한 재시도 | Informed + bounded(2-3회) + 에스컬레이션 | 5, 6 |
| 에이전트 간 컨텍스트 | 자동 상속 가정 | 명시적 컨텍스트 전달 | 4 |
| CLAUDE.md | 2단계(project/user)만 인지 | 4단계(managed/org/project/user/local) | 3, 7 |
| CI/CD | -p 플래그 누락 | `claude --bare -p` | 3, 5 |

## CCA 시험 5개 도메인 × 시리즈 매핑

| 도메인 | 가중치 | 주요 커버 아티클 |
|--------|--------|----------------|
| Agentic Architecture | 27% | Article 2, **4**, 6 |
| Claude Code Workflows | 20% | Article **3**, **5**, 7 |
| Prompt Engineering | 20% | Article 2, **6**, 7 |
| Tool Design & MCP | 18% | Article 2, **4**, 7 |
| Context Management | 15% | Article **3**, **4**, 5 |

---

*카테고리: AI/자격증*
*태그: `#CCA` `#claude-certified-architect` `#anthropic` `#certification` `#agentic-architecture` `#MCP` `#claude-code` `#prompt-engineering` `#context-management` `#tool-design` `#anti-patterns`*
*키워드: CCA, Claude Certified Architect, CCA Foundations, Anthropic 자격증, 시나리오 딥다이브, Rick Hightower, 에이전트 아키텍처, 도구 설계, 컨텍스트 관리, 프롬프트 엔지니어링, Claude Code, CI/CD, 멀티에이전트, 데이터 추출, 고객 지원, 코드 생성, 개발자 생산성*
*시리즈: CCA Scenario Deep Dive Series (인덱스 — 7/8편 보유)*
*Generated: 2026-04-02*
