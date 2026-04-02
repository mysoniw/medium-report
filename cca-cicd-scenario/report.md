# [5/8] CCA 시험 CI/CD 시나리오 공략: -p 플래그, --bare, JSON 스키마, 토큰 경제학

> 원문: [Claude Certified Architect: Master the CI/CD scenario for the CCA Foundations Exam — the flags, output formats, and pipeline patterns that separate passing](https://medium.com/@richardhightower/claude-certified-architect-master-the-ci-cd-scenario-for-the-cca-foundations-exam-the-flags-de2478a346da) — Rick Hightower, 2026-04-01

---

## 1. 요약

- CCA 시험 6개 시나리오 중 **CI/CD 시나리오**는 가장 운영적으로 구체적인(operationally concrete) 시나리오다. 정확한 플래그, 구문, 적용 시점을 외워야 한다.
- 핵심 3요소: `-p`(비인터랙티브 필수), `--bare`(재현 가능한 동작), `--output-format json`(기계 파싱 가능 출력). 이 중 하나라도 빠지면 파이프라인이 깨진다.
- **ZDR(Zero Data Retention) 제약**: Batch API는 ZDR 대상이 아니므로, 규제 산업(의료/금융/정부)에서는 야간 배치도 Real-Time API를 사용해야 한다.
- Prompt Caching 비용 구조: 캐시 읽기 90% 절감, 캐시 쓰기 25% 추가(5분 TTL). "90% 절감"은 읽기 토큰에만 적용.

## 2. 상세 내용

### 2.1 -p 플래그: 비인터랙티브의 필수 조건

`-p`(=`--print`) 없이 CI/CD에서 Claude Code 실행 → **파이프라인이 무한 행(hang)**. 에러도 아니고 느린 것도 아닌 "입력을 기다리는" 상태.

```bash
# 올바른 패턴
claude --bare -p "Review this pull request for security vulnerabilities"
```

**시험 함정**: "파이프라인 타임아웃을 120분으로 늘려라" → 증상 치료, 원인 무시. 행의 원인은 -p 누락.

### 2.2 --bare 플래그: Anthropic의 CI/CD 기본 권장

`--bare`가 스킵하는 것: 훅, LSP, 플러그인 동기화, 스킬 디렉토리 스캔, 자동 메모리, OAuth/키체인 인증.

**왜 필요한가**: `--bare` 없이 `-p`만 쓰면, 개발자 로컬에서는 개인 CLAUDE.md/MCP 서버/훅이 로드되고 CI 러너에서는 없음 → **같은 명령어, 다른 동작**.

> 공식 문서: "--bare는 스크립트/SDK 호출의 권장 모드이며, 향후 -p의 기본값이 될 예정."

**인증 주의**: `--bare`는 OAuth/키체인을 스킵하므로 `ANTHROPIC_API_KEY` 환경변수를 명시적으로 설정해야 한다.

### 2.3 기계 파싱 가능 출력

**안티패턴 1 — Regex 파싱**: 자연어 출력을 regex로 파싱 → 실행마다 포맷이 달라 간헐적 실패.

**안티패턴 2 — 프롬프트 전용 JSON**: "Always return your response as valid JSON" → 프롬프트는 안내, 플래그는 보장. Claude가 마크다운 코드 블록으로 감싸거나 설명 텍스트를 추가할 수 있다.

**올바른 패턴**:
```bash
claude --bare -p "Review the diff" \
  --output-format json \
  --json-schema '{"type":"object","properties":{"issues":{"type":"array"},"approve":{"type":"boolean"}},"required":["issues","approve"]}'
```

**시험 주의**: `--json-schema` 사용 시 결과는 `structured_output` 필드에 있다 (`result` 필드가 아님).

### 2.4 도구 샌드박싱

| 플래그 | 역할 | CI/CD 사용 |
|--------|------|-----------|
| `--tools "Read,Bash"` | 사용 가능한 도구를 **제한** | ✅ 실제 샌드박싱 |
| `--allowedTools "Read,Bash"` | 해당 도구를 권한 프롬프트 없이 **사전 승인** | ❌ 제한 아님 |

CI/CD에서 의도하지 않은 동작 방지: `--tools`를 사용.

### 2.5 파이프라인 아키텍처 패턴

**패턴 1 — 자동 PR 코드 리뷰** (가장 빈출):
```yaml
- name: Review PR
  run: |
    DIFF=$(gh pr diff ${{ github.event.pull_request.number }})
    echo "$DIFF" | claude --bare -p "Review for security issues" \
      --output-format json --tools "Read,Bash" \
      --json-schema '...'
```

**패턴 2 — 자동 테스트 생성**: nightly 실행 → Batch API 후보.

**패턴 3 — 수정 파이프라인**: 실패 → Claude로 수정 시도 → 테스트 재실행 → 실패 시 에러 피드백과 함께 재시도 (최대 3회) → 인간 에스컬레이션.

### 2.6 토큰 경제학

**Prompt Caching 정밀 비용**:

| 유형 | 비용 | 설명 |
|------|------|------|
| 캐시 읽기 | 기본의 **0.1x** (90% 절감) | 반복 토큰의 핵심 절감 |
| 캐시 쓰기 (5분 TTL) | 기본의 **1.25x** (25% 추가) | 첫 쓰기 프리미엄 |
| 캐시 쓰기 (1시간 TTL) | 기본의 **2.0x** (100% 추가) | 장기 캐시 프리미엄 |

**시험 함정**: "Prompt Caching으로 모든 토큰 90% 절감" → **오답**. 90%는 캐시 읽기 토큰에만 적용.

**ZDR 제약** — CCA 시험 핵심 사실:

> **Message Batches API는 Zero Data Retention 대상이 아니다.**

의료/금융/정부처럼 ZDR이 필요한 고객은 Batch API를 쓸 수 없다. 야간 분석도 Real-Time API + Prompt Caching으로.

**의사결정 프레임워크**:

| 시나리오 | API | 비용 도구 | ZDR 호환 |
|---------|-----|---------|---------|
| PR 리뷰 (개발자 대기) | Real-Time | Prompt Caching | Yes |
| 배포 게이트 (릴리스 블로킹) | Real-Time | Prompt Caching | Yes |
| Nightly 테스트 생성 (ZDR 불필요) | Batch | Caching + Batch | No |
| Nightly 분석 (ZDR 필요) | Real-Time | Prompt Caching | Yes |

### 2.7 안티패턴 종합

| 안티패턴 | 증상 | 올바른 패턴 |
|---------|------|-----------|
| -p 누락 | 파이프라인 행 | `claude --bare -p` |
| --bare 누락 | CI vs 로컬 동작 차이 | `--bare` 추가 |
| Regex 파싱 | 간헐적 실패 | `--output-format json` |
| 프롬프트 전용 JSON | 비JSON 텍스트 포함 | `--output-format json` 강제 |
| 블로킹 워크플로우에 Batch API | 개발자가 시간 단위로 대기 | Real-Time API |
| ZDR 환경에서 Batch API | 컴플라이언스 위반 | Real-Time + Caching |
| 유효성 검사 없음 | Claude 출력 맹신 | 스키마 검증 후 동작 |
| 재시도 없음 | 첫 에러에 파이프라인 실패 | 에러 피드백과 함께 2-3회 재시도 |
| --tools 누락 | Claude가 의도하지 않은 동작 | `--tools`로 도구 제한 |

## 3. 핵심 인사이트 정리

1. **`-p` + `--bare`가 CI/CD의 기본 조합이다** — `-p`만으로는 재현성이 보장되지 않고, `--bare`만으로는 비인터랙티브가 아니다. 둘 다 필요하며, Anthropic은 이것이 향후 기본값이 될 것이라 명시.
2. **프롬프트로 JSON을 요청하는 것과 플래그로 강제하는 것은 다르다** — 전자는 90% 작동, 후자는 100% 작동. 시험은 이 차이를 명확히 테스트한다.
3. **Batch API는 ZDR 대상이 아니다** — 규제 산업의 비용 절감 질문에서 "Batch API"가 나오면 즉시 제거.
4. **Prompt Caching의 "90% 절감"은 읽기 토큰에만 적용** — 쓰기 토큰은 25-100% 추가 비용. 시험에서 "모든 토큰 90% 절감"은 오답.
5. **validation-retry 루프의 재시도는 2-3회로 제한** — 무한 재시도는 신뢰성 실패. 구체적 에러 피드백 없는 "blind retry"도 안티패턴.
6. **`--tools`는 제한, `--allowedTools`는 사전 승인** — CI/CD 샌드박싱에는 `--tools`, 편의성에는 `--allowedTools`. 시험에서 "의도하지 않은 동작 방지"는 `--tools`.

## 4. 원문 영어 표현 해설

### 핵심 개념어

| 원문 | 직역 | 저자가 의도한 뉘앙스 |
|------|------|---------------------|
| **non-interactive imperative** | 비인터랙티브 명령 | "imperative"는 문법의 명령형이자 "반드시 해야 하는 것". 선택이 아닌 필수를 강조 |
| **machine-parseable output** | 기계 파싱 가능 출력 | "parseable"을 명시하여 "human-readable"과 대비. 파이프라인의 요구사항은 가독성이 아닌 파싱 가능성 |
| **Zero Data Retention (ZDR)** | 제로 데이터 보유 | 규제 산업 컴플라이언스 용어. 데이터가 처리 후 보유되지 않는 정책. Batch API의 치명적 제약 |

### 비유·수사 표현

| 원문 | 직역 | 문화적 맥락 |
|------|------|-----------|
| **"Not slowly, not with an error. It just sits there, waiting for input that will never arrive."** | "느리게도 아니고, 에러도 아니다. 그냥 거기 앉아서, 절대 오지 않을 입력을 기다린다." | 3문장 점강법으로 -p 누락의 증상을 극적으로 묘사. "never arrive"의 결정적 불가능성 강조 |
| **"90% reliability is acceptable"** | "90% 신뢰도는 수용 가능하다" | 시험이 의도적으로 제시하는 "합리적으로 들리는" 오답. 프로덕션에서 10%의 실패는 수용 불가 |

### 업계 전문 용어

| 원문 | 의미 | 맥락 |
|------|------|------|
| **--bare flag** | 최소 헤드리스 모드 플래그 | 훅/LSP/스킬/메모리 스킵. 향후 -p의 기본값 예정 |
| **--json-schema** | JSON 스키마 강제 플래그 | 출력 구조를 특정 스키마로 제약. 결과는 `structured_output` 필드 |
| **validation-retry loop** | 유효성 검사-재시도 루프 | 추출 → 검증 → 실패 시 에러 피드백과 함께 재시도 → 제한 횟수 초과 시 에스컬레이션 |
| **defense-in-depth** | 심층 방어 | 보안 용어. `--bare`(컨텍스트 방어) + `--tools`(도구 방어)의 다층 보호 |
| **exit codes** | 종료 코드 | 0=성공, 비0=실패. 파이프라인 게이트의 결정 근거 |

### 저자 어투 분석

CI/CD 시나리오에서 Hightower는 시리즈 중 가장 **기술 매뉴얼에 가까운** 어투를 채택한다. 구체적 플래그 구문, 정확한 비용 수치, YAML 파이프라인 예시가 아티클의 절반 이상을 차지한다. "Memorize the details"라고 직접 언급하는 것은 시리즈의 다른 "이해하라(understand)" 톤과 대비된다. 이 시나리오가 "암기형"임을 저자가 인정하는 셈이다. 그럼에도 "Ignore the noise. If Claude Code is running in CI without -p, it is waiting for input."처럼 복잡한 상황을 한 문장으로 압축하는 능력은 여전히 돋보인다.

---

*카테고리: AI/자격증*
*태그: `#CCA` `#claude-certified-architect` `#ci-cd` `#claude-code` `#headless-mode` `#prompt-caching` `#batch-api` `#anti-patterns`*
*키워드: CCA, Claude Certified Architect, CI/CD, -p 플래그, --bare, --output-format json, --json-schema, 비인터랙티브, headless mode, GitHub Actions, Prompt Caching, Batch API, ZDR, Zero Data Retention, validation-retry loop, 파이프라인 행, 도구 샌드박싱, --tools, --allowedTools, structured_output, Rick Hightower*
*시리즈: CCA Scenario Deep Dive Series (5/8)*
*관련 문서: [CCA Foundations 시험 가이드](../cca-foundations-exam-guide/report.md), [CCA 코드 생성 시나리오](../cca-code-generation-scenario/report.md), [CCA 개발자 생산성 시나리오](../cca-developer-productivity-scenario/report.md)*
*Generated: 2026-04-02*
