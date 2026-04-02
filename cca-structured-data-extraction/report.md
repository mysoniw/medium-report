# [6/8] CCA 시험 구조화된 데이터 추출 시나리오 공략: 3계층 신뢰성 모델, JSON 스키마, 재시도 루프

> 원문: [CCA Exam Prep: Structured Data Extraction](https://medium.com/@richardhightower/cca-exam-prep-structured-data-extraction-86ad3c7541a3) — Rick Hightower, 2026-03-28

---

## 1. 요약

- CCA 시험에서 **구조화된 데이터 추출** 시나리오는 가장 많은 수험생을 탈락시키는 시나리오다. "데모에서 작동"과 "프로덕션에서 작동"의 차이를 정밀하게 테스트한다.
- **3계층 신뢰성 모델**: Level 1(프롬프트 안내) → Level 2(JSON 스키마 강제) → Level 3(프로그래밍적 시맨틱 검증). 시험은 항상 Level 3 답을 보상한다.
- 핵심 안티패턴: "Always return JSON" 프롬프트 의존, LLM 자기보고 신뢰도, 무한/맹목적 재시도.
- SDK 패턴: tool-forcing(`tool_choice`)과 `client.messages.parse()`(Pydantic). `with_structured_output()`는 LangChain 메서드이므로 함정.
- 3개 도메인: Prompt Engineering(20%), Context Management(15%), Agentic Architecture(27%).

## 2. 상세 내용

### 2.1 3계층 신뢰성 모델

| 레벨 | 메커니즘 | 해결하는 문제 | 한계 |
|------|---------|-------------|------|
| **Level 1**: 프롬프트 안내 | "Always return valid JSON" | Claude가 무엇을 해야 하는지 안내 | 확률적 넛지, 보장 아님 |
| **Level 2**: 스키마 강제 | tool-forcing / `--json-schema` | 구조적 적합성 보장 | 의미적 정확성 미검증 |
| **Level 3**: 프로그래밍적 검증 | 비즈니스 규칙 코드 | 추출된 데이터의 실제 정확성 검증 | - |

**왜 이 순서인가**: 각 레이어는 이전 레이어가 성공해야 의미가 있다. 구조가 유효하지 않은 데이터에 시맨틱 검증을 실행하면 비용만 낭비.

### 2.2 Level 1이 실패하는 이유

"Always return valid JSON" 프롬프트는 확률 분포를 JSON 쪽으로 강하게 이동시키지만, 다른 가능성을 **제거하지 못한다**:

| 실패 모드 | 예시 |
|----------|------|
| 마크다운 코드 펜스 래핑 | ````json { ... } ```` |
| 설명 텍스트 추가 | "Here is the extracted data:" + JSON |
| 스키마 불일치 | 예상 외 필드, 누락 필드, 타입 오류 |
| 환각 값 | "payment pending" → `"status": "completed"` |
| 컨텍스트 압박 시 절단 | 긴 문서에서 닫는 중괄호 누락 |

### 2.3 Level 2: 스키마 강제 — SDK 패턴

**Approach 1 — Tool-forcing**:
```python
response = client.messages.create(
    model="claude-sonnet-4-6",
    tools=[extraction_tool],
    tool_choice={"type": "tool", "name": "extract_invoice"},
    messages=[{"role": "user", "content": f"Extract: {document_text}"}]
)
extracted = response.content[0].input
```

`tool_choice`가 핵심 — Claude를 특정 도구 호출로 **강제**. 마크다운 래퍼도 설명 텍스트도 없이 스키마 적합 JSON만 반환.

**Approach 2 — `client.messages.parse()`** (Pydantic):
```python
response = client.messages.parse(
    model="claude-sonnet-4-6",
    output_format=Invoice,  # Pydantic 모델
    messages=[{"role": "user", "content": f"Extract: {document_text}"}]
)
extracted = response.parsed_output  # 타입된 Pydantic 객체
```

**시험 함정**: `with_structured_output()`는 **LangChain** 메서드. "네이티브 Anthropic SDK로" 문제에서 이 선택지가 나오면 즉시 제거.

### 2.4 Level 3: 프로그래밍적 시맨틱 검증

스키마가 `total` 필드를 `number` 타입으로 강제해도, 그 숫자가 line_items 합계와 일치하는지는 검증하지 않는다.

```python
def validate_invoice(extracted: dict) -> tuple[bool, list[str]]:
    errors = []
    # 날짜 형식 검증
    # line_items 합계 vs total 검증
    # total 양수 검증
    # 알려진 vendor 목록 대조
    return (len(errors) == 0, errors)
```

**자기보고 신뢰도 함정**: "1-10 척도로 추출 신뢰도를 평가하라" → Claude가 9점을 매겨도 데이터가 틀릴 수 있다. 환각된 vendor 이름도 모델에게는 정확한 것만큼 "확신"이 있다. 프로그래밍적 검증은 Claude에게 아무것도 묻지 않는다.

### 2.5 Validation-Retry 피드백 루프

```
추출 → 검증 → [통과] → 저장
              → [실패] → 피드백 → 재시도 → 검증
                                        → [최대 횟수] → 인간 에스컬레이션
```

**3가지 재시도 유형**:

| 유형 | 예시 | 시험 판정 |
|------|------|---------|
| **Blind retry** | "Try again." | 항상 오답 |
| **Informed retry** | "total은 150이지만 line items 합계는 175. 소스 재검토." | 올바른 패턴 |
| **Unbounded retry** | "성공할 때까지 재시도" | 항상 오답 |

유일한 정답: **informed + bounded(2-3회) + 인간 에스컬레이션**.

### 2.6 완전한 신뢰성 패턴 vs 불완전한 패턴

저자는 의도적으로 **불완전한 코드**를 먼저 보여주고 "어디가 잘못되었는지 찾아보라"고 요구한다.

불완전한 패턴의 가정: API 호출 항상 성공, response.content 항상 비어있지 않음, content[0]이 항상 tool_use 블록 → 이 가정이 깨지면 validate_invoice에 도달하기 전에 크래시.

**완전한 패턴**: try/except로 API/스키마/응답 형태 실패를 잡고, 시맨틱 실패와 함께 재시도 루프에서 **두 유형 모두** 처리.

### 2.7 긴 문서의 Lost-in-the-Middle

50페이지 이상 문서에서 추출 정확도 하락 → 문서를 청크로 나누고, 청크별 독립 추출 후 병합/중복 제거.

### 2.8 연관 CCA 개념

- **MCP**: 4-5개 집중 추출 도구. 10개 문서 유형 = 전문 서브에이전트 추출기 + 코디네이터.
- **Batch API**: 5,000건 송장 추출 → Message Batches API (50% 할인). Real-Time으로 하나씩 처리는 안티패턴.

## 3. 핵심 인사이트 정리

1. **프롬프트 기반 JSON은 완전한 답이 아니다** — "Always return JSON"은 확률적 넛지. Admiral Ackbar의 "It's a trap"이다. 시험에서 프롬프트 강화 답변이 나오면 즉시 제거.
2. **3계층 모델은 임의가 아니라 의존적 순서다** — 구조(Level 2) 없이 의미(Level 3)를 검증하면 파싱도 안 되는 데이터에 비싼 검증을 실행하게 된다.
3. **tool-forcing이 네이티브 SDK 패턴이다** — 도구의 input_schema가 JSON 스키마 역할. `with_structured_output()`는 LangChain이므로 "네이티브 SDK" 문제에서 함정.
4. **LLM 자기보고 신뢰도는 프로덕션 검증 메커니즘이 될 수 없다** — 환각된 값도 높은 신뢰도를 보고할 수 있다. 프로그래밍적 검증만이 ground truth에 대해 독립적으로 확인한다.
5. **재시도는 informed + bounded + 에스컬레이션이어야 한다** — 구체적 에러 메시지("total은 X이지만 합계는 Y")가 재시도 수렴 여부를 결정. 맹목적/무한 재시도는 모두 안티패턴.
6. **hard failure와 soft failure를 모두 처리하는 것이 완전한 신뢰성** — API/스키마 실패(hard)와 시맨틱 실패(soft)를 하나의 재시도 루프에서 처리. 한쪽만 처리하면 불완전.
7. **복합 실패 모드 문제에서는 모든 증상을 해결하는 답을 선택** — 구조적 + 시맨틱 실패가 동시에 제시되면, 하나만 개선하는 답은 함정.

## 4. 원문 영어 표현 해설

### 핵심 개념어

| 원문 | 직역 | 저자가 의도한 뉘앙스 |
|------|------|---------------------|
| **structural reliability** | 구조적 신뢰성 | JSON 파싱이 되는지 여부. "reliability"를 구조/의미/복구 3층으로 세분화한 것이 저자의 프레임워크 핵심 |
| **semantic reliability** | 의미적 신뢰성 | 파싱된 데이터가 실제로 맞는지 여부. 구조와 의미가 다른 문제임을 분리 |
| **probabilistic nudge** | 확률적 넛지 | 행동경제학의 "nudge"(넛지 이론)에서 차용. 프롬프트가 강제가 아닌 "살짝 밀어주는" 것임을 강조 |
| **tool-forcing** | 도구 강제 | 실제로는 아무 동작도 하지 않는 도구를 정의하고 호출을 강제하여 스키마 적합 출력을 얻는 패턴 |

### 비유·수사 표현

| 원문 | 직역 | 문화적 맥락 |
|------|------|-----------|
| **"In the words of Admiral Ackbar: 'It's a trap'"** | "애크바 제독의 말처럼: '함정이다'" | 스타워즈 밈. 기술 블로그에서 팝컬처 레퍼런스로 긴장을 풀면서도 메시지를 강화하는 전형적 수법 |
| **"a perfectly formatted check is not the same as a check that will clear"** | "완벽하게 포맷된 수표가 결제되는 수표와 같지 않다" | 금융 비유로 구조 vs 의미의 차이를 일상 언어로 전환. 형식이 맞아도 잔고가 없으면 무의미 |
| **"like debugging — when a compiler tells you 'line 47, undeclared variable' vs 'something went wrong'"** | "디버깅처럼 — 컴파일러가 '47줄, 미선언 변수' vs '무언가 잘못됨'이라고 알려줄 때" | 개발자 독자를 직접 겨냥한 비유. informed vs blind retry의 차이를 컴파일러 에러 메시지의 구체성으로 설명 |

### 업계 전문 용어

| 원문 | 의미 | 맥락 |
|------|------|------|
| **tool_choice** | Anthropic API 파라미터 | `{"type": "tool", "name": "..."}` — 특정 도구 호출을 강제. 스키마 강제의 핵심 메커니즘 |
| **client.messages.parse()** | Anthropic SDK 메서드 | Pydantic 모델을 직접 전달하여 타입된 출력을 받는 고수준 패턴 |
| **with_structured_output()** | LangChain 메서드 | Anthropic SDK가 **아닌** 외부 라이브러리 메서드. 시험 함정 |
| **enum constraints** | 열거형 제약 | 카테고리 필드(상태, 통화)에서 Claude가 존재하지 않는 값을 발명하는 것을 방지 |
| **human-in-the-loop** | 인간 참여 루프 | 최대 재시도 후 인간에게 에스컬레이션. Context Management & Reliability 도메인의 핵심 패턴 |

### 저자 어투 분석

이 아티클에서 Hightower는 시리즈 중 가장 **교육적 장치가 풍부한** 스타일을 보여준다. 의도적으로 불완전한 코드를 먼저 제시하고 "어디가 잘못되었는지 찾아보라"고 도전하는 **역방향 교수법**은, 수험생이 시험에서 "겉보기에 괜찮은" 답을 식별하는 훈련을 직접 시킨다. "Burn this into your memory"라는 명령은 시리즈의 교관 톤이 절정에 달한 표현이다. Admiral Ackbar 밈 사용은 28분짜리 기술 글의 긴장을 풀어주면서도 "함정 식별"이라는 핵심 메시지를 팝컬처로 고정시키는 수사적 기교다.

---

*카테고리: AI/자격증*
*태그: `#CCA` `#claude-certified-architect` `#structured-data` `#data-extraction` `#prompt-engineering` `#validation` `#json-schema` `#anti-patterns`*
*키워드: CCA, Claude Certified Architect, 구조화된 데이터 추출, structured data extraction, 3계층 신뢰성 모델, JSON 스키마, tool-forcing, tool_choice, client.messages.parse, Pydantic, with_structured_output, LangChain 함정, 프로그래밍적 검증, validation-retry loop, informed retry, bounded retry, blind retry, 시맨틱 검증, 프롬프트 넛지, lost in the middle, Rick Hightower*
*시리즈: CCA Scenario Deep Dive Series (6/8)*
*관련 문서: [CCA Foundations 시험 가이드](../cca-foundations-exam-guide/report.md), [CCA CI/CD 시나리오](../cca-cicd-scenario/report.md), [CCA 멀티에이전트 리서치](../cca-multi-agent-research/report.md)*
*Generated: 2026-04-02*
