# [4/8] CCA 시험 멀티에이전트 리서치 시나리오 공략: 허브앤스포크, 컨텍스트 격리, 슈퍼에이전트 안티패턴

> 원문: [CCA Exam Prep: Mastering the Multi-Agent Research System Scenario](https://medium.com/@richardhightower/cca-exam-prep-mastering-the-multi-agent-research-system-scenario-aa0c446a5e7d) — Rick Hightower, 2026-03-31

---

## 1. 요약

- CCA 시험에서 **멀티에이전트 리서치 시스템**은 가장 포괄적인 시나리오로, 3대 핵심 도메인(Agentic Architecture 27% + Tool Design 18% + Context Management 15% = **60%**)을 동시 테스트한다.
- 핵심 개념 4가지: (1) 허브앤스포크 코디네이터 패턴, (2) 서브에이전트는 코디네이터 컨텍스트를 상속하지 않는다(컨텍스트 격리), (3) 에이전트당 4-5개 도구(슈퍼에이전트 안티패턴 경고), (4) 사일런트 실패는 구조화된 에러 컨텍스트로 방지한다.
- 여기서 배운 패턴(컨텍스트 격리, 집중 도구, 구조화된 에러 핸들링, 명시적 컨텍스트 전달)은 시험 전반에 걸쳐 반복 출제된다.

## 2. 상세 내용

### 2.1 허브앤스포크 아키텍처

코디네이터(허브)가 전문화된 서브에이전트(스포크)에 작업을 위임하는 구조.

**뉴스룸 비유**: 편집자(코디네이터)가 취재 지시를 내리고, 정치 기자/금융 기자/탐사 기자(서브에이전트)가 각자 취재 후 기사를 제출하면, 편집자가 하나의 기사로 조합한다. 기자들은 **서로 대화하지 않는다** — 모든 조율은 편집자를 통해서만.

**시스템 구성**:

| 에이전트 | 도구 (4-5개) | 역할 |
|---------|------------|------|
| Web Researcher | search_web, fetch_page, extract_text, summarize_source | 웹 콘텐츠 검색/처리 |
| Document Analyzer | parse_document, extract_sections, identify_claims, check_citations | 문서 구조/주장 분석 |
| Data Extractor | query_database, transform_data, validate_schema, format_output | 데이터 추출/구조화 |
| Fact Checker | verify_claim, cross_reference, score_reliability, flag_conflict | 사실 확인/신뢰도 평가 |
| Coordinator | delegate_task, collect_results, resolve_conflicts, compile_report | 오케스트레이션/종합 |

### 2.2 컨텍스트 격리: 가장 많은 수험생을 탈락시키는 개념

**서브에이전트는 코디네이터의 컨텍스트를 상속하지 않는다.**

멀티스레드 프로그래밍의 "공유 메모리" 멘탈 모델이 이전되지 않는다. 각 에이전트는 독립된 컨텍스트이며, 코디네이터가 서브에이전트를 생성할 때 **빈 상태(blank slate)**로 시작한다.

**실패 사례**: 코디네이터 컨텍스트에 "모든 인용은 APA 형식"이 있지만, Document Analyzer에 위임 시 이 요구사항을 명시적으로 전달하지 않음 → MLA 인용이 돌아옴.

**명시적 컨텍스트 전달(explicit context passing)**:

서브에이전트가 **받는 것**:
- 구체적 작업 설명
- 관련 제약 조건과 요구사항
- 기대 출력 형식
- 작업에 필요한 컨텍스트

서브에이전트가 **받지 않는 것**:
- 코디네이터의 전체 대화 이력
- 다른 서브에이전트의 결과 (명시적으로 전달하지 않는 한)
- 전체 리서치 계획 (명시적으로 전달하지 않는 한)

### 2.3 슈퍼에이전트 안티패턴

18개 도구를 가진 단일 에이전트 = **실패**. 4-5개 도구를 가진 전문 에이전트 5개 = **성공**.

**왜 실패하는가 — 주의력 세금(Attention Tax)**:
- 매 도구 선택 시 18개 설명을 모두 평가해야 함
- 유사한 도구(search_web, search_docs, search_db, search_archive, search_kb)가 모호함 유발
- 작업과 무관한 도구가 매 결정마다 주의력을 소비

저자의 비유: **쇼 트럭 vs 작업 트럭** — 크롬 도금에 오버사이즈 타이어를 단 트럭은 전시용이지 작업용이 아니다. "목장 없이 10갤런 카우보이 모자를 쓰는 것"과 같다. 더 많은 역량 ≠ 더 많은 효과.

### 2.4 사일런트 서브에이전트 실패

**안티패턴**: 서브에이전트가 API 타임아웃을 만나고 `{"status": "success", "data": null}`을 반환 → 코디네이터가 "관련 데이터 없음"으로 해석 → 보고서에서 반박 증거가 누락된 채 "완전한" 보고서 생성.

**올바른 패턴 — 구조화된 에러 컨텍스트**:
```json
{
  "status": "error",
  "error_type": "timeout",
  "source": "api.example.com",
  "attempted_at": "2026-03-23T14:30:00Z",
  "retry_eligible": true,
  "partial_data": null,
  "fallback_available": false
}
```

이로써 코디네이터가: 재시도 가능한 실패를 재시도하고, 보고서에 데이터 갭을 명시하고, 누락 소스에 의존하는 결론의 신뢰도를 조정할 수 있다.

### 2.5 MCP 통합과 도구 설명

**MCP 3대 프리미티브** (시험 어휘 테스트):
- **Tools**: 에이전트가 호출하는 실행 가능한 함수 (동사)
- **Resources**: 에이전트가 조회하는 데이터 스키마/카탈로그 (명사)
- **Prompts**: 공통 작업용 템플릿 (패턴)

**도구 설명에 부정 경계(negative bounds) 포함**:
```
✅ search_web: 쿼리와 일치하는 정보를 공개 웹에서 검색. URL, 제목, 스니펫 반환.
   전체 페이지 콘텐츠를 가져오지 않음(fetch_page 사용).
   비공개 DB나 내부 문서를 검색하지 않음.
```

### 2.6 작업 분해 전략

| 단계 | 작업 | 병렬/순차 | 근거 |
|------|------|----------|------|
| Phase 1 | 웹 검색 + 문서 분석 | **병렬** | 상호 독립적 입력 |
| Phase 2 | 주장 추출 | 순차 | Phase 1 결과에 의존 |
| Phase 3 | 사실 확인 | 순차 | 추출된 주장에 의존 |
| Phase 4 | 충돌 해결 | 순차 | 사실 확인 결과에 의존 |
| Phase 5 | 보고서 작성 | 순차 | 해결된 결과에 의존 |

## 3. 핵심 인사이트 정리

1. **서브에이전트는 코디네이터 컨텍스트를 상속하지 않는다** — 명시적으로 전달한 것만 안다. "왜 서브에이전트가 코디네이터 지시를 따르지 않았는가?"의 답은 항상 "지시가 전달되지 않았다".
2. **18개 도구 = 실패, 4-5개 = 성공** — SDK 하드 리밋이 아닌 아키텍처 모범 사례. 도구 수가 많을수록 선택 정확도 저하는 예측 가능한 결과.
3. **사일런트 실패는 가장 위험한 실패 모드** — "데이터 없음"과 "소스 불가"를 구분할 수 없으면, 불완전한 결과가 완전한 것처럼 보인다. 구조화된 에러 컨텍스트가 유일한 해결책.
4. **도구 설명에 "하지 않는 것"을 명시해야 오라우팅을 방지한다** — 긍정 경계만으로는 Claude가 범위 밖 입력을 시도할 수 있다.
5. **충돌 해결 전략이 필요하다** — 소스 신뢰도 랭킹, 다수결 합의, 고위험 주장은 인간 리뷰 에스컬레이션. "먼저 도착한 결과가 이긴다"는 안티패턴.
6. **허브앤스포크에서 스포크는 서로 대화하지 않는다** — 모든 조율은 허브(코디네이터)를 통해서만. 직접 통신이나 자동 컨텍스트 공유는 오답.

## 4. 원문 영어 표현 해설

### 핵심 개념어

| 원문 | 직역 | 저자가 의도한 뉘앙스 |
|------|------|---------------------|
| **context isolation** | 컨텍스트 격리 | 네트워크 보안의 "isolation"에서 차용. 격리가 제한이 아니라 신뢰성의 근거라는 역설적 프레이밍 |
| **explicit context passing** | 명시적 컨텍스트 전달 | "explicit"를 반복 강조하여 "implicit inheritance"와의 대비를 극대화. 시험 정답 언어 |
| **silent failure** | 사일런트 실패 | 소프트웨어 엔지니어링의 "fail-silent" 시스템 유형에서 차용. 크래시보다 위험한 실패 모드 |
| **attention tax** | 주의력 세금 | "세금"은 피할 수 없는 비용. 도구가 많을수록 매 결정에서 의무적으로 지불해야 하는 인지적 비용 |

### 비유·수사 표현

| 원문 | 직역 | 문화적 맥락 |
|------|------|-----------|
| **"newsroom" mental model** | "뉴스룸" 멘탈 모델 | 편집자-기자 관계로 코디네이터-서브에이전트를 설명. 기자가 서로 기사를 공유하지 않듯, 서브에이전트도 컨텍스트를 공유하지 않는다 |
| **"show truck vs work truck"** | "쇼 트럭 vs 작업 트럭" | 미국 남부/중서부 문화의 픽업 트럭 비유. "10-gallon cowboy hat with no ranch"는 과시적 역량 vs 실질적 효과의 대비 |
| **"Like wearing a 10-gallon cowboy hat with no ranch"** | "목장 없이 10갤런 카우보이 모자를 쓰는 것" | 미국 카우보이 문화의 과시 비판. 도구가 많지만 실질적 역량이 없는 에이전트에 대한 조롱 |

### 업계 전문 용어

| 원문 | 의미 | 맥락 |
|------|------|------|
| **hub-and-spoke** | 허브앤스포크 | 항공 네트워크 설계에서 차용한 분산 시스템 패턴. 중앙 허브가 모든 라우팅 담당 |
| **context forking** | 컨텍스트 포킹 | Unix fork()에서 차용. 부모의 컨텍스트 중 필요한 부분만 선택적으로 자식에게 복제 |
| **negative bounds** | 부정 경계 | 도구 설명에서 "하지 않는 것"을 명시. API 문서의 "Limitations" 섹션과 유사한 역할 |
| **validation-retry loop** | 유효성 검사-재시도 루프 | Prompt Engineering 도메인의 핵심 패턴. 출력 검증 → 실패 시 에러 피드백과 함께 재시도 |
| **task decomposition DAG** | 작업 분해 방향 비순환 그래프 | 빌드 시스템(Make, Gradle)의 의존성 그래프와 동일. 병렬/순차 실행 결정의 근거 |

### 저자 어투 분석

이 아티클에서 Hightower는 시리즈 중 가장 **다양한 비유 레퍼토리**를 펼친다. 뉴스룸, 건설 현장, 쇼 트럭, 레스토랑 메뉴까지 4가지 비유를 사용하여 동일한 "전문화가 범용보다 낫다"는 논지를 반복 강화한다. 특히 "쇼 트럭" 비유는 미국 남부 문화에 깊이 뿌리박힌 것으로, 글로벌 독자보다는 미국 개발자를 1차 타깃으로 삼고 있음을 시사한다. "Good luck on the exam"으로 마무리하는 것은 시리즈 중 유일하게 개인적 응원을 담은 결어로, Article 4가 시리즈의 정점임을 암시한다.

---

*카테고리: AI/자격증*
*태그: `#CCA` `#claude-certified-architect` `#multi-agent` `#agentic-architecture` `#context-isolation` `#tool-design` `#hub-and-spoke` `#anti-patterns`*
*키워드: CCA, Claude Certified Architect, 멀티에이전트 리서치, hub-and-spoke, 허브앤스포크, 코디네이터 패턴, 컨텍스트 격리, context isolation, explicit context passing, 슈퍼에이전트 안티패턴, 4-5 도구 규칙, 사일런트 실패, 구조화된 에러, MCP 프리미티브, 도구 설명, negative bounds, 작업 분해, Rick Hightower, Anthropic 자격증*
*시리즈: CCA Scenario Deep Dive Series (4/8)*
*관련 문서: [CCA Foundations 시험 가이드](../cca-foundations-exam-guide/report.md), [CCA 고객 지원 에이전트](../cca-customer-support-agent/report.md), [CCA 코드 생성 시나리오](../cca-code-generation-scenario/report.md)*
*Generated: 2026-04-02*
