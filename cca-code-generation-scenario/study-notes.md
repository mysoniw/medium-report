# CCA 코드 생성 시나리오 — 스터디 노트

> 시리즈: CCA Scenario Deep Dive Series (3/8)
> 원문: Rick Hightower, 2026-03-27

---

## 1. 영한 용어표

| English Term | 한국어 | ★ 빈도 | 비고 |
|-------------|--------|--------|------|
| context degradation | 컨텍스트 열화 | ★★★ | 핵심 개념. 용량이 아닌 주의력 문제 |
| attention dilution | 주의력 희석 | ★★★ | 화학 dilution 비유에서 차용 |
| focused per-file passes | 파일별 집중 패스 | ★★★ | 대규모 리팩토링의 정답 패턴 |
| context forking | 컨텍스트 포킹 | ★★☆ | Unix fork()에서 차용. 코디네이터 패턴의 핵심 |
| lost in the middle | 중간부 손실 | ★★★ | 컨텍스트 중간 정보의 주의력 저하 현상 |
| coordinator pattern | 코디네이터 패턴 | ★★☆ | 허브앤스포크 아키텍처의 실전 구현 |
| decomposition | 분해 | ★★★ | 분해 → 실행 → 합성 → 검토 |
| CLAUDE.md hierarchy | CLAUDE.md 계층 | ★★★ | 프로젝트 vs 사용자 레벨 구분 |
| project-level CLAUDE.md | 프로젝트 레벨 CLAUDE.md | ★★★ | .claude/CLAUDE.md, Git 공유, 팀 표준 |
| user-level CLAUDE.md | 사용자 레벨 CLAUDE.md | ★★☆ | ~/.claude/CLAUDE.md, 개인 선호 |
| -p flag (--print) | -p 플래그 (비인터랙티브 모드) | ★★★ | CI/CD 필수. 없으면 파이프라인 행 |
| --bare flag | --bare 플래그 (최소 헤드리스 모드) | ★★★ | 훅/LSP/스킬/메모리 스킵 |
| --output-format json | JSON 출력 포맷 | ★★☆ | 파이프라인 파싱용 |
| Batch API | 배치 API | ★★☆ | 50% 할인, 24시간 윈도우, 비실시간 |
| Real-Time API | 실시간 API | ★★☆ | 블로킹 워크플로우, 즉시 응답 |
| custom skill | 커스텀 스킬 | ★★☆ | 3단계+ 워크플로우 × 2회+ 반복 → 스킬 |
| cross-file consistency | 교차 파일 일관성 | ★★☆ | 명명, import, 인터페이스 계약 |
| programmatic enforcement | 프로그래밍적 강제 | ★★☆ | 프롬프트 기반보다 결정적 |
| prompt-based approach | 프롬프트 기반 접근 | ★☆☆ | 비결정적, CLAUDE.md 대비 열등 |
| hub-and-spoke | 허브앤스포크 | ★★☆ | Article 4와 연결되는 아키텍처 |

---

## 2. 시험 함정 Top 5

### 함정 1: "컨텍스트 윈도우를 늘리면 해결된다"
- **왜 틀린가**: 컨텍스트 열화는 용량이 아닌 주의력 문제. 윈도우를 늘리면 주의력이 더 얇아진다
- **정답 방향**: 컨텍스트를 줄이고 주의력 밀도를 높여라 (focused per-file passes)
- **키워드 감지**: "increase window", "load everything", "larger context" → 즉시 제거

### 함정 2: 팀 표준을 사용자 레벨 CLAUDE.md에 배치
- **왜 틀린가**: 사용자 레벨은 Git 비공유. 새 팀원에게 전파 불가
- **정답 방향**: 팀 표준은 반드시 프로젝트 레벨 `.claude/CLAUDE.md`에
- **키워드 감지**: "manually copy", "each developer's CLAUDE.md", "user-level" + team standard → 오답

### 함정 3: CI/CD에서 -p 플래그 누락
- **왜 틀린가**: 인터랙티브 UI가 사용자 입력 대기 → 파이프라인 무한 행(hang)
- **증상**: 에러도 아니고 느린 것도 아닌 "무한 대기" — 디버깅 어려움
- **정답 방향**: `claude -p "..." --bare` + 필요 시 `--output-format json`
- **연관 함정**: Batch API vs Real-Time API 혼동 (nightly/weekly → Batch, 즉시 응답 → Real-Time)

### 함정 4: 스킬이 CLAUDE.md를 복제하는 패턴
- **왜 틀린가**: 이중 유지보수(dual maintenance). 한쪽만 업데이트되면 불일치 발생
- **정답 방향**: 스킬은 CLAUDE.md를 **참조(reference)**해야지 **복제(duplicate)**하면 안 됨
- **키워드 감지**: "copy rules into skill", "duplicate standards" → 오답

### 함정 5: 단일 세션에서 대규모 리팩토링 시도
- **왜 틀린가**: 47개 파일 × 380K 토큰 → lost in the middle, 교차 파일 충돌
- **정답 방향**: 코디네이터 패턴 → 분해 → 집중 세션 → 합성 → 일관성 검토
- **키워드 감지**: "load all files", "single session refactoring" → 즉시 제거

---

## 3. 연습 문제 5문항

### Q1. 컨텍스트 열화의 본질

팀이 대규모 코드베이스 리팩토링 중 중간 파일에서 품질 저하를 경험합니다. 가장 적절한 설명은?

A) 컨텍스트 윈도우의 토큰 제한에 도달했다
B) 모델의 주의력이 모든 토큰에 분산되어 중간부의 주의력이 희석되었다
C) 중간 파일이 더 복잡한 코드를 포함하고 있다
D) 모델이 처리 시간 제한에 걸렸다

<details>
<summary>정답 및 해설</summary>

**정답: B**

컨텍스트 열화(context degradation)는 **용량(capacity)** 문제가 아니라 **주의력(attention)** 문제입니다. 총 주의력은 고정되어 있고 모든 토큰에 분배되므로, 컨텍스트가 커지면 각 토큰의 주의력이 얇아집니다. 특히 중간부가 가장 큰 영향을 받습니다 ("lost in the middle" 효과).

- A는 용량 문제로 잘못 진단 (열화는 용량 전에 발생)
- C는 파일 복잡도와 무관한 현상
- D는 시간 제한과 무관

</details>

---

### Q2. CLAUDE.md 배치 전략

새로운 팀원이 합류할 때마다 코딩 표준을 따르지 않는 문제가 발생합니다. 가장 효과적인 해결책은?

A) 온보딩 문서에 코딩 표준을 자세히 기술한다
B) 각 개발자의 `~/.claude/CLAUDE.md`에 팀 표준을 복사한다
C) `.claude/CLAUDE.md`에 팀 표준을 정의하고 Git에 커밋한다
D) 매 세션 시작 시 표준을 프롬프트로 입력하도록 교육한다

<details>
<summary>정답 및 해설</summary>

**정답: C**

프로젝트 레벨 CLAUDE.md (`.claude/CLAUDE.md`)는 Git에 커밋되므로 팀 전체가 자동으로 공유받습니다. 매 세션에 자동 주입되어 일관성을 보장합니다.

- A는 사람이 읽어야 하므로 자동 강제가 아님
- B는 사용자 레벨이라 Git 비공유, 수동 복사 필요 (확장 불가)
- D는 프롬프트 기반 접근으로, 프로그래밍적 접근(CLAUDE.md)보다 열등

</details>

---

### Q3. CI/CD 파이프라인 문제 진단

CI/CD 파이프라인에서 Claude Code를 호출한 후 파이프라인이 무한 대기 상태에 빠집니다. 가장 가능성 높은 원인은?

A) API 키 인증 실패
B) 네트워크 타임아웃
C) `-p` 플래그 없이 실행하여 인터랙티브 모드가 사용자 입력을 대기
D) 컨텍스트 윈도우 초과

<details>
<summary>정답 및 해설</summary>

**정답: C**

`-p` (--print) 플래그 없이 Claude Code를 실행하면 인터랙티브 UI가 시작되어 사용자 입력을 기다립니다. CI 환경에는 사용자가 없으므로 파이프라인이 영원히 행(hang)합니다. 에러 메시지도 없고 느려지는 것도 아닌 "무한 대기"가 특징입니다.

올바른 명령: `claude -p "prompt" --bare --output-format json`

</details>

---

### Q4. Batch API vs Real-Time API

매주 월요일 새벽 2시에 전체 코드베이스 보안 스캔을 실행하는 CI 작업을 설정하려 합니다. 어떤 API를 사용해야 합니까?

A) Real-Time API — 보안 문제는 즉시 발견해야 하므로
B) Batch API — 스케줄 작업이며 50% 비용 절감 가능
C) Real-Time API — 대규모 코드베이스이므로 더 빠른 처리 필요
D) Batch API — 항상 더 저렴하므로 기본 선택

<details>
<summary>정답 및 해설</summary>

**정답: B**

"매주(weekly)", "스케줄(scheduled)" 키워드가 핵심입니다. 아무도 결과를 즉시 기다리지 않으므로 Batch API가 적합합니다. 50% 비용 할인과 24시간 처리 윈도우가 주어집니다.

- A는 "즉시"가 맞는 것 같지만, 새벽 2시 스케줄 작업에는 불필요
- C는 처리 속도와 API 선택은 별개 문제
- D는 "항상"이 오류 — 블로킹 워크플로우에서는 Real-Time이 필수

</details>

---

### Q5. 대규모 리팩토링 전략

47개 서비스 파일의 인증 미들웨어를 일관되게 리팩토링해야 합니다. 가장 효과적인 접근법은?

A) 모든 파일을 하나의 세션에 로드하고 한 번에 리팩토링을 요청한다
B) 컨텍스트 윈도우를 최대로 설정하고 전체 `src/` 디렉토리를 로드한다
C) 코디네이터 세션으로 구조를 분석하고, 각 파일을 집중 세션에서 개별 처리한 뒤, 교차 파일 일관성을 검토한다
D) 파일을 알파벳순으로 정렬하고 순차적으로 처리한다

<details>
<summary>정답 및 해설</summary>

**정답: C**

코디네이터 패턴이 정답입니다: (1) 코디네이터가 전체 구조를 가볍게 읽고 작업 계획 수립 (2) 각 파일에 필요한 컨텍스트만 담은 집중 세션 할당 (3) 코디네이터가 교차 파일 일관성 검토 (명명, import, 인터페이스 계약).

- A는 380K 토큰 단일 세션 → lost in the middle, 중간 파일 품질 저하
- B는 컨텍스트를 늘리면 주의력이 더 얇아짐 (항상 오답)
- D는 의존성과 컨텍스트를 무시한 기계적 순차 처리

</details>

---

## 4. 도메인 매핑

### Domain 3: Claude Code Workflows (20%)

이 시나리오에서 커버하는 Domain 3 토픽:

| 토픽 | 시험 비중(추정) | 핵심 포인트 |
|------|---------------|-----------|
| 파일별 집중 패스 워크플로우 | 높음 | 분해 → 실행 → 합성 → 검토 |
| 커스텀 스킬 설계 | 중간 | 3단계+ × 2회+ → 스킬화, CLAUDE.md 참조(복제 금지) |
| CLAUDE.md 계층 및 활용 | 높음 | 프로젝트 vs 사용자 레벨, 자동 주입, 컨텍스트 엔지니어링 |
| 코디네이터 패턴 | 중간 | 가벼운 읽기 → 계획 → 집중 세션 → 일관성 검토 |

### Domain 5: Context Management (15%)

이 시나리오에서 커버하는 Domain 5 토픽:

| 토픽 | 시험 비중(추정) | 핵심 포인트 |
|------|---------------|-----------|
| 컨텍스트 열화 원리 | 높음 | 주의력 문제, lost in the middle, 200K > 1M |
| 컨텍스트 포킹 | 중간 | Unix fork() 비유, 부모→자식 선택적 복제 |
| CI/CD 플래그 (`-p`, `--bare`) | 높음 | 비인터랙티브 모드, 재현 가능한 동작 |
| Batch vs Real-Time API | 중간 | 키워드(nightly/weekly → Batch, 대기 중 → Real-Time) |

### 시나리오 가중치 합산

```
Domain 3 (Claude Code Workflows): 20%
Domain 5 (Context Management):    15%
────────────────────────────────────
이 시나리오 커버리지:              35%
```

시험 전체의 **약 1/3**이 이 시나리오에 집중되어 있습니다. CCA 시험에서 가장 높은 ROI를 가진 학습 영역입니다.

---

## 5. 빠른 복습 체크리스트

- [ ] 컨텍스트 열화 = 주의력 문제 (용량 아님)
- [ ] "윈도우 늘리기"는 항상 오답
- [ ] 대규모 작업: 분해 → 집중 실행 → 합성 → 일관성 검토
- [ ] 팀 표준 → 프로젝트 레벨 CLAUDE.md (사용자 레벨 아님)
- [ ] CI/CD → `-p --bare` 필수
- [ ] nightly/weekly → Batch API / 즉시 대기 → Real-Time API
- [ ] 반복 워크플로우(3단계+ × 2회+) → 커스텀 스킬
- [ ] 스킬은 CLAUDE.md를 참조 (복제 금지)
- [ ] 코디네이터 패턴 → 컨텍스트 포킹 → 허브앤스포크 (Article 4 연결)
