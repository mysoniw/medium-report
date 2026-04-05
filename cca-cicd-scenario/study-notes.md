# CCA CI/CD 시나리오 — Study Notes

> CCA Scenario Deep Dive Series Part 6/8
> Domain 3: Claude Code (20% of exam)

---

## 1. 영한 용어표 (English-Korean Glossary)

| English Term | 한국어 | 빈도 | 비고 |
|-------------|--------|------|------|
| **`-p` / `--print`** | 비인터랙티브 모드 플래그 | ★★★ | 누락 시 파이프라인 행(hang) |
| **`--bare`** | 헤드리스 모드 플래그 | ★★★ | 훅/LSP/스킬/메모리 스킵 |
| **`--output-format json`** | JSON 출력 강제 플래그 | ★★★ | 기계 파싱 가능 출력 보장 |
| **`--json-schema`** | JSON 스키마 제약 플래그 | ★★☆ | 결과는 `structured_output` 필드 |
| **`--tools`** | 도구 제한 플래그 | ★★★ | 실제 샌드박싱 (제한) |
| **`--allowedTools`** | 도구 사전 승인 플래그 | ★★☆ | 사전 승인 (제한 아님) |
| non-interactive imperative | 비인터랙티브 필수 조건 | ★★☆ | -p가 선택 아닌 필수임을 강조 |
| machine-parseable output | 기계 파싱 가능 출력 | ★★☆ | human-readable과 대비 |
| Zero Data Retention (ZDR) | 제로 데이터 보유 | ★★★ | Batch API는 ZDR 미지원 |
| Prompt Caching | 프롬프트 캐싱 | ★★★ | 읽기 90% 절감, 쓰기 25-100% 추가 |
| Batch API / Message Batches API | 배치 API | ★★★ | 50% 비용 절감, 높은 지연시간 |
| Real-Time API | 실시간 API | ★★☆ | ZDR 호환, 블로킹 워크플로우용 |
| validation-retry loop | 유효성 검사-재시도 루프 | ★★☆ | 2-3회 제한, 에러 피드백 필수 |
| defense-in-depth | 심층 방어 | ★☆☆ | 다층 보호 전략 |
| exit codes | 종료 코드 | ★☆☆ | 0=성공, 비0=실패 |
| blind retry | 맹목적 재시도 | ★★☆ | 에러 피드백 없는 재시도 = 안티패턴 |
| one-shot execution | 일회성 실행 | ★☆☆ | -p의 동작 방식 |
| structured_output | 구조화된 출력 (필드명) | ★★★ | --json-schema 사용 시 결과 위치 |
| tool sandboxing | 도구 샌드박싱 | ★★☆ | --tools로 도구 접근 제한 |
| headless mode | 헤드리스 모드 | ★☆☆ | --bare의 별칭 |

---

## 2. 시험 함정 Top 5 (Exam Traps)

### 함정 1: `-p` vs 타임아웃 연장 ★★★
**문제 상황**: CI/CD 파이프라인이 타임아웃된다.
- ❌ "파이프라인 타임아웃을 120분으로 늘려라" → 증상 치료
- ✅ `-p` 플래그를 추가하라 → 근본 원인 해결
- **핵심**: 행(hang)의 원인은 `-p` 누락. 타임아웃 연장은 "절대 오지 않을 입력"을 더 오래 기다릴 뿐

### 함정 2: `--tools` vs `--allowedTools` 혼동 ★★★
**문제 상황**: CI/CD에서 Claude가 의도하지 않은 동작을 한다.
- ❌ `--allowedTools "Read,Bash"` → 사전 승인만 함, 다른 도구도 사용 가능
- ✅ `--tools "Read,Bash"` → 이 두 도구만 사용 가능하도록 **제한**
- **핵심**: 이름이 비슷하지만 역할이 정반대. "restrict" = `--tools`, "pre-approve" = `--allowedTools`

### 함정 3: Prompt Caching "90% 절감" 범위 ★★★
**문제 상황**: Prompt Caching의 비용 절감 효과를 물어본다.
- ❌ "모든 토큰이 90% 절감된다" → 읽기 토큰에만 해당
- ✅ 캐시 읽기 = 90% 절감 / 캐시 쓰기(5분 TTL) = 25% 추가 / 캐시 쓰기(1시간 TTL) = 100% 추가
- **핵심**: 90%는 읽기(read) 토큰의 절감률. 쓰기(write)는 오히려 비용 증가

### 함정 4: 규제 산업 + Batch API ★★★
**문제 상황**: 의료/금융/정부 환경에서 비용 절감 방법을 물어본다.
- ❌ "Batch API로 야간 분석 비용을 50% 절감하라" → ZDR 미지원으로 컴플라이언스 위반
- ✅ "Real-Time API + Prompt Caching" → ZDR 호환
- **핵심**: Message Batches API는 ZDR 대상이 아님. 규제 산업 문제에서 Batch API 선택지 → 즉시 제거

### 함정 5: 프롬프트 전용 JSON vs 플래그 JSON ★★☆
**문제 상황**: Claude의 출력을 JSON으로 받는 방법을 물어본다.
- ❌ 프롬프트에 "Always return JSON" 추가 → 90% 작동 (마크다운 래핑, 설명 텍스트 가능)
- ✅ `--output-format json` 플래그 → 100% 작동
- **핵심**: "프롬프트는 안내(guidance), 플래그는 보장(guarantee)"

---

## 3. 연습 문제 5문항

### Q1. CI/CD 필수 플래그 조합

CI/CD 파이프라인에서 Claude Code를 실행할 때 **비인터랙티브 모드**와 **재현 가능한 동작**을 모두 보장하기 위해 필요한 최소 플래그 조합은?

A) `-p` 만으로 충분하다
B) `--bare` 만으로 충분하다
C) `-p --bare` 두 개를 함께 사용해야 한다
D) `-p --bare --output-format json` 세 개를 모두 사용해야 한다

<details>
<summary>정답 보기</summary>

**정답: C**

- `-p`는 비인터랙티브 모드(입력 대기 없이 실행 후 종료)를 보장한다.
- `--bare`는 훅/LSP/스킬/메모리를 스킵하여 환경 간 재현성을 보장한다.
- `--output-format json`은 기계 파싱 가능 출력을 보장하지만, 문제는 "비인터랙티브 + 재현성"만 물었으므로 필수는 아니다.
- Anthropic은 이 조합이 향후 `-p`의 기본값이 될 것이라 명시했다.

**도메인**: Domain 3 — Claude Code (20%)
</details>

---

### Q2. `--tools` vs `--allowedTools`

CI/CD 파이프라인에서 Claude Code가 `Read`와 `Bash` 도구만 사용하도록 **제한**하려면 어떤 플래그를 사용해야 하는가?

A) `--allowedTools "Read,Bash"`
B) `--tools "Read,Bash"`
C) `--disableTools "Write,Edit"`
D) `--sandbox "Read,Bash"`

<details>
<summary>정답 보기</summary>

**정답: B**

- `--tools "Read,Bash"`: 사용 가능한 도구를 Read와 Bash로 **제한**한다. 이것이 실제 샌드박싱이다.
- `--allowedTools "Read,Bash"`: 해당 도구를 권한 프롬프트 없이 **사전 승인**할 뿐, 다른 도구 사용을 막지 않는다.
- C, D는 존재하지 않는 플래그이다.

**도메인**: Domain 3 — Claude Code (20%)
</details>

---

### Q3. ZDR과 Batch API

금융 규제 기관의 야간 코드 분석 파이프라인에서 비용을 최적화하면서 **Zero Data Retention 정책**을 준수해야 한다. 올바른 접근법은?

A) Batch API를 사용하여 50% 비용 절감을 달성한다
B) Batch API + Prompt Caching을 조합하여 비용을 최소화한다
C) Real-Time API + Prompt Caching을 사용한다
D) ZDR 정책은 API 선택과 무관하다

<details>
<summary>정답 보기</summary>

**정답: C**

- Message Batches API는 Zero Data Retention 대상이 **아니다**.
- 규제 산업(금융)에서 ZDR이 필요하면 Batch API를 사용할 수 없다.
- Real-Time API는 ZDR과 호환되며, Prompt Caching으로 비용 최적화가 가능하다.
- A, B는 컴플라이언스 위반이다.

**도메인**: Domain 3 — Claude Code (20%)
</details>

---

### Q4. `--json-schema` 결과 필드

`--json-schema`를 사용하여 Claude Code의 출력을 구조화했을 때, 결과는 응답 JSON의 어떤 필드에 위치하는가?

A) `result`
B) `output`
C) `structured_output`
D) `json_response`

<details>
<summary>정답 보기</summary>

**정답: C**

- `--json-schema` 사용 시 결과는 `structured_output` 필드에 위치한다.
- `result` 필드가 아님에 주의 — 이것은 시험에서 자주 나오는 함정이다.
- B, D는 존재하지 않는 필드명이다.

**도메인**: Domain 3 — Claude Code (20%)
</details>

---

### Q5. Prompt Caching 비용 구조

Prompt Caching의 비용 구조에 대한 설명 중 **올바른** 것은?

A) 모든 토큰이 90% 절감된다
B) 캐시 읽기는 90% 절감, 캐시 쓰기(5분 TTL)는 25% 추가 비용이다
C) 캐시 읽기와 쓰기 모두 동일하게 절감된다
D) 캐시 쓰기는 비용이 발생하지 않는다

<details>
<summary>정답 보기</summary>

**정답: B**

- 캐시 읽기: 기본의 0.1배 (90% 절감) — 핵심 절감 포인트
- 캐시 쓰기(5분 TTL): 기본의 1.25배 (25% 추가)
- 캐시 쓰기(1시간 TTL): 기본의 2.0배 (100% 추가)
- "모든 토큰 90% 절감"은 시험의 대표적 함정 오답이다.

**도메인**: Domain 3 — Claude Code (20%)
</details>

---

## 4. 도메인 매핑 (Domain Mapping)

### Domain 3: Claude Code (20%)

이 아티클은 CCA 시험의 **Domain 3: Claude Code**에 직접 매핑된다. 전체 시험의 20%를 차지한다.

| 시험 토픽 | 아티클 내 해당 섹션 | 출제 가능성 |
|----------|-------------------|-----------|
| CI/CD 통합 필수 플래그 (`-p`, `--bare`) | 2.1, 2.2 | ★★★ |
| 기계 파싱 가능 출력 (`--output-format json`) | 2.3 | ★★★ |
| `--json-schema` + `structured_output` | 2.3 | ★★☆ |
| 도구 샌드박싱 (`--tools` vs `--allowedTools`) | 2.4 | ★★★ |
| 파이프라인 아키텍처 패턴 (PR 리뷰, 테스트 생성, 수정 루프) | 2.5 | ★★☆ |
| 토큰 경제학 (Prompt Caching 비용 구조) | 2.6 | ★★★ |
| ZDR + Batch API 제약 | 2.6 | ★★★ |
| 안티패턴 식별 (9가지) | 2.7 | ★★☆ |
| defense-in-depth 전략 | 전체 | ★☆☆ |

### 관련 도메인 참조

| 도메인 | 비중 | 이 아티클과의 관련성 |
|-------|------|-------------------|
| Domain 1: LLM Fundamentals | 20% | 토큰 경제학, Prompt Caching 비용 구조 |
| Domain 2: Anthropic Products | 25% | Batch API, Real-Time API, ZDR 정책 |
| **Domain 3: Claude Code** | **20%** | **핵심 도메인 — 전체 아티클이 직접 매핑** |
| Domain 4: AI Safety | 15% | 도구 샌드박싱, defense-in-depth |
| Domain 5: Solution Architecture | 20% | 파이프라인 아키텍처 패턴, 의사결정 프레임워크 |

---

## 5. 빠른 참조 카드 (Quick Reference)

### CI/CD 명령어 기본 템플릿

```bash
claude --bare -p "<PROMPT>" \
  --output-format json \
  --tools "Read,Bash" \
  --json-schema '<SCHEMA>'
```

### 의사결정 흐름

```
파이프라인 실행?
├── 개발자가 대기하는가? → Real-Time API
├── 야간 배치인가?
│   ├── ZDR 필요? → Real-Time API + Prompt Caching
│   └── ZDR 불필요? → Batch API + Prompt Caching
└── 출력을 파싱해야 하는가?
    ├── 프롬프트로 JSON 요청 → ❌ 90% 신뢰도
    └── --output-format json → ✅ 100% 보장
```

### 숫자 암기표

| 항목 | 값 | 시험 포인트 |
|------|-----|-----------|
| 캐시 읽기 절감률 | 90% (0.1x) | "모든 토큰" 아님 |
| 캐시 쓰기 추가(5분) | 25% (1.25x) | 쓰기는 비용 증가 |
| 캐시 쓰기 추가(1시간) | 100% (2.0x) | 장기 캐시 프리미엄 |
| Batch API 비용 절감 | 50% | ZDR 미지원 |
| 재시도 제한 횟수 | 2-3회 | 무한 재시도 = 안티패턴 |
| 안티패턴 총 수 | 9가지 | 표로 암기 |
