---
title: "CCA 구조화된 데이터 추출 — 스터디 노트"
source: https://medium.com/@richardhightower/cca-exam-prep-structured-data-extraction-86ad3c7541a3
series: "CCA Scenario Deep Dive Series (6/8)"
domains:
  - "Domain 4: Prompt Engineering (20%)"
  - "Domain 3: Context Management (15%)"
  - "Domain 5: Agentic Architecture (27%)"
---

# CCA 구조화된 데이터 추출 — 스터디 노트

## 1. 영한 용어표

| English | 한국어 | ★ 빈도 | 비고 |
|---------|--------|--------|------|
| **structured data extraction** | 구조화된 데이터 추출 | ★★★ | 시나리오 전체 주제 |
| **Three-Level Reliability Model** | 3계층 신뢰성 모델 | ★★★ | 핵심 프레임워크 |
| **prompt guidance** | 프롬프트 안내 | ★★★ | Level 1 |
| **schema enforcement** | 스키마 강제 | ★★★ | Level 2 |
| **programmatic semantic validation** | 프로그래밍적 시맨틱 검증 | ★★★ | Level 3 |
| **tool-forcing** | 도구 강제 | ★★★ | `tool_choice` 파라미터로 구현 |
| **tool_choice** | 도구 선택 (API 파라미터) | ★★★ | `{"type": "tool", "name": "..."}` |
| **client.messages.parse()** | 메시지 파싱 (SDK 메서드) | ★★☆ | Pydantic 모델 직접 전달 |
| **with_structured_output()** | 구조화 출력 (LangChain) | ★★★ | 함정! 네이티브 SDK 아님 |
| **probabilistic nudge** | 확률적 넛지 | ★★☆ | Level 1의 본질적 한계 |
| **structural reliability** | 구조적 신뢰성 | ★★☆ | JSON 파싱 가능 여부 |
| **semantic reliability** | 의미적 신뢰성 | ★★☆ | 데이터 정확성 여부 |
| **hallucinated values** | 환각된 값 | ★★☆ | 존재하지 않는 데이터 생성 |
| **self-reported confidence** | 자기보고 신뢰도 | ★★☆ | 안티패턴 |
| **blind retry** | 맹목적 재시도 | ★★★ | 항상 오답 |
| **informed retry** | 정보 기반 재시도 | ★★★ | 올바른 패턴 |
| **unbounded retry** | 무한 재시도 | ★★★ | 항상 오답 |
| **bounded retry** | 횟수 제한 재시도 | ★★★ | 2-3회 + 에스컬레이션 |
| **human escalation** | 인간 에스컬레이션 | ★★★ | 최대 재시도 후 필수 |
| **human-in-the-loop** | 인간 참여 루프 | ★★☆ | Context Management 핵심 |
| **hard failure** | 하드 실패 | ★★☆ | API/스키마/응답 형태 오류 |
| **soft failure** | 소프트 실패 | ★★☆ | 시맨틱 검증 실패 |
| **compound failure mode** | 복합 실패 모드 | ★★☆ | 구조+의미 동시 실패 |
| **lost-in-the-middle** | 중간 정보 손실 | ★★☆ | 긴 문서 정확도 하락 |
| **enum constraints** | 열거형 제약 | ★☆☆ | 카테고리 필드 환각 방지 |
| **Message Batches API** | 메시지 배치 API | ★★☆ | 대량 처리, 50% 할인 |
| **input_schema** | 입력 스키마 | ★★☆ | 도구 정의의 JSON 스키마 |

---

## 2. 시험 함정 Top 5

### 함정 1: "Always return JSON" 프롬프트가 충분하다

> **왜 함정인가**: Level 1 프롬프트 안내는 확률적 넛지(probabilistic nudge)일 뿐이다. 마크다운 래핑, 설명 텍스트 추가, 스키마 불일치, 환각 값, 긴 문서 절단 등 다양한 실패 모드가 존재한다.
>
> **정답 패턴**: Level 2 스키마 강제(tool-forcing) + Level 3 프로그래밍적 검증이 필요하다.
>
> **식별 키워드**: "프롬프트에 JSON 형식을 지정하여", "시스템 프롬프트로 출력 형식을 제어"

### 함정 2: `with_structured_output()`가 네이티브 SDK 메서드이다

> **왜 함정인가**: `with_structured_output()`는 **LangChain** 메서드이다. Anthropic SDK의 네이티브 메서드가 아니다.
>
> **정답 패턴**: `tool_choice={"type": "tool", "name": "..."}` 또는 `client.messages.parse(output_format=PydanticModel)`
>
> **식별 키워드**: "네이티브 Anthropic SDK로 구현하라", "SDK 기본 기능만 사용하여"

### 함정 3: LLM 자기보고 신뢰도로 검증한다

> **왜 함정인가**: Claude에게 "1-10 척도로 추출 신뢰도를 평가하라"고 하면, 환각된 데이터에도 높은 신뢰도를 보고할 수 있다. LLM은 자기 출력의 정확성을 객관적으로 평가할 수 없다.
>
> **정답 패턴**: 프로그래밍적 검증 — 외부 ground truth에 대해 독립적으로 확인. Claude에게 아무것도 묻지 않는다.
>
> **식별 키워드**: "모델에게 신뢰도를 평가하게 하여", "추출 품질을 자체 평가"

### 함정 4: 맹목적 또는 무한 재시도

> **왜 함정인가**: Blind retry("다시 해봐")는 에러 정보 없이 같은 실수를 반복한다. Unbounded retry("성공할 때까지")는 무한 루프 위험이 있고 인간 에스컬레이션이 없다.
>
> **정답 패턴**: Informed(구체적 에러 메시지) + Bounded(2-3회) + Human escalation
>
> **식별 키워드**: "실패 시 자동 재시도", "성공할 때까지 반복", "재시도 로직 추가"

### 함정 5: Hard failure만 또는 Soft failure만 처리

> **왜 함정인가**: API/스키마 실패(hard)만 처리하고 시맨틱 실패(soft)를 무시하거나, 그 반대인 경우. 불완전한 신뢰성 패턴이다.
>
> **정답 패턴**: 하나의 재시도 루프에서 hard failure(try/except)와 soft failure(validate 함수) 모두 처리. 복합 실패 모드 문제에서는 모든 증상을 해결하는 답을 선택.
>
> **식별 키워드**: "구조적 오류 처리를 추가하여", "비즈니스 규칙 검증만"

---

## 3. 연습 문제 5문항

### 문제 1
**송장 데이터 추출 시스템에서 Claude가 가끔 마크다운 코드 펜스로 JSON을 감싸서 반환합니다. 이 문제를 해결하는 가장 적절한 접근법은?**

A) 시스템 프롬프트에 "마크다운 코드 펜스 없이 순수 JSON만 반환하라"고 명시  
B) 응답에서 코드 펜스를 제거하는 후처리 파서 추가  
C) `tool_choice` 파라미터로 특정 도구 호출을 강제하여 스키마 적합 JSON만 반환  
D) 응답 형식을 텍스트에서 JSON 모드로 변경

<details>
<summary>정답 및 해설</summary>

**정답: C**

A는 Level 1 프롬프트 안내로, 확률적 넛지일 뿐 보장하지 않는다. B는 증상만 치료하고 근본 원인(구조적 강제 부재)을 해결하지 않는다. D는 Anthropic SDK에 존재하지 않는 기능이다. C의 tool-forcing은 Level 2 스키마 강제로, Claude가 도구의 input_schema에 맞는 JSON만 반환하도록 구조적으로 보장한다.

**도메인**: Domain 4 — Prompt Engineering (20%)
</details>

---

### 문제 2
**구조화된 데이터 추출 후 검증에서 total 필드가 150이지만 line_items 합계가 175로 불일치합니다. 재시도 시 가장 적절한 접근법은?**

A) "추출을 다시 시도하세요"라는 메시지로 재시도  
B) "total은 150이지만 line items 합계는 175입니다. 소스 문서를 재검토하세요"라는 구체적 피드백과 함께 재시도, 최대 3회 후 인간 에스컬레이션  
C) 성공할 때까지 자동으로 재시도하되, 매 시도마다 temperature를 조정  
D) Claude에게 추출 신뢰도를 1-10으로 자체 평가하게 하고, 8 이상이면 수용

<details>
<summary>정답 및 해설</summary>

**정답: B**

A는 blind retry로 항상 오답. C는 unbounded retry로 항상 오답이며 temperature 조정은 근본 해결이 아니다. D는 자기보고 신뢰도(self-reported confidence) 안티패턴 — 환각 데이터에도 높은 점수를 매길 수 있다. B는 informed(구체적 에러) + bounded(3회) + human escalation의 올바른 패턴이다.

**도메인**: Domain 5 — Agentic Architecture (27%)
</details>

---

### 문제 3
**네이티브 Anthropic SDK를 사용하여 Pydantic 모델 기반으로 구조화된 출력을 받으려면 어떤 메서드를 사용해야 합니까?**

A) `client.messages.create()` with `response_format="json"`  
B) `client.messages.with_structured_output(PydanticModel)`  
C) `client.messages.parse(output_format=PydanticModel)`  
D) `client.completions.create(schema=PydanticModel)`

<details>
<summary>정답 및 해설</summary>

**정답: C**

A의 `response_format` 파라미터는 OpenAI API 패턴이다. B의 `with_structured_output()`는 **LangChain** 메서드로 네이티브 Anthropic SDK가 아니다 — 이것이 시험의 대표적 함정이다. D는 존재하지 않는 메서드이다. C의 `client.messages.parse()`가 Pydantic 모델을 직접 전달하여 타입된 출력을 받는 네이티브 SDK 메서드이다.

**도메인**: Domain 4 — Prompt Engineering (20%)
</details>

---

### 문제 4
**50페이지 분량의 계약서에서 데이터를 추출할 때, 문서 중간에 있는 조항의 추출 정확도가 현저히 떨어집니다. 가장 적절한 해결책은?**

A) 컨텍스트 윈도우가 더 큰 모델로 업그레이드  
B) 시스템 프롬프트에 "문서 전체를 주의 깊게 읽으라"고 지시  
C) 문서를 청크로 나누어 각 청크에서 독립 추출 후 결과를 병합하고 중복 제거  
D) 추출 시 temperature를 0으로 설정하여 결정적 출력 보장

<details>
<summary>정답 및 해설</summary>

**정답: C**

이것은 "lost-in-the-middle" 현상이다. A는 컨텍스트 윈도우 크기와 무관한 어텐션 분포 문제이다. B는 Level 1 프롬프트 안내로 근본 해결이 아니다. D의 temperature 조정은 중간 정보 손실과 무관하다. C의 청크 분할 → 독립 추출 → 병합/중복 제거가 lost-in-the-middle의 표준 해결 패턴이다.

**도메인**: Domain 3 — Context Management (15%)
</details>

---

### 문제 5
**5,000건의 송장에서 구조화된 데이터를 추출해야 합니다. 각 송장은 독립적이며 실시간 응답이 불필요합니다. 가장 효율적인 접근법은?**

A) 비동기 루프로 5,000건을 동시에 `client.messages.create()` 호출  
B) Message Batches API를 사용하여 일괄 처리  
C) 5개 스레드로 병렬 처리하되 각각 1,000건씩 실시간 API 호출  
D) 큐 시스템에 넣고 워커가 하나씩 순차 처리

<details>
<summary>정답 및 해설</summary>

**정답: B**

A는 동시 5,000건 API 호출로 rate limit에 걸리고 비용도 전액이다. C는 병렬이지만 여전히 실시간 API 호출이므로 비효율적이다. D는 순차 처리로 가장 느리다. B의 Message Batches API는 대량 처리에 최적화되어 있으며 **50% 비용 할인**을 제공한다. 실시간 응답이 불필요한 대량 추출에서 Batches API를 사용하지 않는 것은 안티패턴이다.

**도메인**: Domain 5 — Agentic Architecture (27%)
</details>

---

## 4. 도메인 매핑 (Domain Mapping)

### Domain 4: Prompt Engineering (20%)

| 토픽 | 시험 포인트 | 핵심 키워드 |
|------|-----------|-----------|
| Level 1 프롬프트 안내 | 확률적 넛지의 한계 이해, 이것만으로 충분하지 않음 | probabilistic nudge, prompt guidance |
| 구조화된 출력 프롬프트 | tool-forcing vs Pydantic parse 구분 | tool_choice, input_schema |
| SDK vs 프레임워크 구분 | `with_structured_output()` = LangChain 함정 | native SDK, LangChain trap |
| enum 제약 | 카테고리 필드에서 환각 방지 | enum constraints, hallucination prevention |

### Domain 3: Context Management (15%)

| 토픽 | 시험 포인트 | 핵심 키워드 |
|------|-----------|-----------|
| 긴 문서 처리 | lost-in-the-middle → 청크 분할 + 독립 추출 + 병합 | chunking, deduplication |
| 인간 에스컬레이션 | 최대 재시도 후 반드시 인간 개입 경로 | human-in-the-loop, escalation |
| 컨텍스트 압박 | 긴 문서에서 JSON 절단 위험 | truncation, context pressure |

### Domain 5: Agentic Architecture (27%)

| 토픽 | 시험 포인트 | 핵심 키워드 |
|------|-----------|-----------|
| 검증-재시도 루프 | informed + bounded + escalation | validation-retry loop |
| Hard vs Soft failure | 두 유형 모두 처리하는 완전한 패턴 | compound failure mode |
| MCP 추출기 | 다양한 문서 유형 → 전문 서브에이전트 + 코디네이터 | sub-agent extractors |
| Batch API | 대량 처리 시 Message Batches API 사용 (50% 할인) | Message Batches API |
| 자기보고 신뢰도 | LLM에게 품질 평가를 맡기지 않음 | self-reported confidence, anti-pattern |

---

## 5. 빠른 복습 체크리스트

- [ ] 3계층 신뢰성 모델의 순서와 각 레벨의 한계를 설명할 수 있는가?
- [ ] `tool_choice`와 `client.messages.parse()` 코드를 기억하는가?
- [ ] `with_structured_output()`가 왜 함정인지 설명할 수 있는가?
- [ ] Blind / Informed / Unbounded 재시도의 차이를 구분할 수 있는가?
- [ ] Hard failure와 Soft failure의 차이와 처리 방법을 아는가?
- [ ] Lost-in-the-middle 해결 패턴(청크 → 추출 → 병합)을 기억하는가?
- [ ] 대량 처리 시 Message Batches API를 선택해야 하는 이유를 아는가?
- [ ] 자기보고 신뢰도가 왜 안티패턴인지 설명할 수 있는가?
