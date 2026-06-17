---
name: kwcag-accessibility
description: >-
  시각장애인 등 장애인을 위한 웹/모바일 접근성을 설계·구현·점검·인증할 때 사용한다.
  한국형 웹 콘텐츠 접근성 지침 KWCAG 2.2(4원칙·14지침·33검사항목), WCAG 2.2 AA,
  EN 301 549/EAA 등 국내외 표준과 WA 품질마크 인증 절차를 다룬다. Vue.js 접근 가능
  컴포넌트(모달·폼·메뉴·콤보박스·테이블), vue-router 초점 관리 + aria-live, Spring Boot
  백엔드, 모바일/반응형, 테스트 자동화(axe·playwright)와 cmux 브라우저 DOM 실시간
  모니터링 플레이북, 수동 점검·VPAT까지 제공한다.
when_to_use: >-
  사용자가 접근성·a11y·KWCAG·WCAG·웹 접근성 인증·WA 마크·스크린리더·시각장애인·
  접근성 점검/감리를 언급하거나, Vue·Spring Boot로 접근성 준수 사이트를 만들거나
  점검·인증 준비할 때.
argument-hint: "[개요|체크리스트|컴포넌트|라우팅|백엔드|모바일|테스트|인증|점검 <URL>]"
---

# KWCAG 2.2 웹·모바일 접근성 스킬

시각장애인을 비롯한 장애인 사용자가 이용 가능한 사이트를 만들고 **국내외 접근성 인증을
통과**하기 위한 단일 진입점. Claude가 관련 요청에 자동 활성화하거나, `/kwcag [요청]`으로
직접 호출한다.

## 요청 라우팅 (이 스킬이 받은 요청)

요청: **$ARGUMENTS**

위 요청을 §1 레퍼런스 표에서 매칭해 **필요한 파일만 읽어** 적용한다(점진적 로딩).
URL이 주어지면 모드 B(점검)로, 빈 요청이면 이 개요와 §2 워크플로우를 안내한다.

## 0. 한눈에 보는 목표

| 항목 | 결론 |
|------|------|
| 1차 목표 표준 | **WCAG 2.2 Level AA** (이걸 맞추면 국내외 대부분 커버) |
| 국내 인증 | **WA 품질마크** — 심사 기준은 **현행 KWCAG 2.1** (2.2는 최신 권고 표준) |
| 해외 | **EN 301 549 / EAA**(EU, 2025.6.28 시행), **Section 508/ADA**(미국) |
| 주 사용자 보조기술 | 스크린리더 — 국내 **센스리더**, 해외 **NVDA·JAWS·VoiceOver·TalkBack** |
| 자동 검출 한계 | 자동 도구는 위반의 **30~40%만** 검출 → 나머지는 수동 + cmux 모니터링 |

> ⚠️ **중요**: "KWCAG 2.2 = 24개 검사항목"은 흔한 오해다. **24개는 KWCAG 2.1**이고,
> **KWCAG 2.2는 33개 검사항목**(인식 9 · 운용 15 · 이해 7 · 견고 2)이다.
> 다만 2026년 6월 현재 **법정 인증(정보통신접근성 인증/WA마크)의 심사 기준은 아직
> KWCAG 2.1**이므로, 인증 제출용은 2.1을, 향후 대비·최신 권고는 2.2를 함께 본다.

## 1. 레퍼런스 파일 (필요할 때 읽어라)

| 파일 | 언제 읽나 |
|------|-----------|
| [`checklist.md`](./checklist.md) | KWCAG 2.2 33개 검사항목 + WCAG 2.2 SC 매핑 + 시각장애 우선순위 |
| [`vue-patterns.md`](./vue-patterns.md) | 접근 가능한 Vue 컴포넌트(모달·폼·메뉴·탭) 완성 코드 |
| [`vue-patterns-advanced.md`](./vue-patterns-advanced.md) | 심화 위젯(토스트·콤보박스·아코디언·정렬테이블·페이지네이션·로딩·빵부스러기) |
| [`router-focus.md`](./router-focus.md) | SPA 라우팅 초점 관리, 페이지 제목, `aria-live` 알림 셋업 |
| [`backend-spring.md`](./backend-spring.md) | Spring Boot 백엔드 — DTO alt 필드·검증오류·i18n·세션·인증 코드 |
| [`mobile-responsive.md`](./mobile-responsive.md) | 모바일/터치/줌·리플로우/모션·고대비/PWA/MA 인증 |
| [`testing-ci.md`](./testing-ci.md) | 자동화 — eslint-a11y·vitest-axe·axe-playwright·Lighthouse·GitHub Actions |
| [`manual-testing.md`](./manual-testing.md) | 수동 시나리오(키보드·스크린리더·저시력) + 평가시트 + VPAT/적합성 선언 |
| [`standards.md`](./standards.md) | 국내외 표준·인증기관·비용·절차·법적 근거(출처 포함) |
| [`scripts/a11y-audit.js`](./scripts/a11y-audit.js) | 브라우저에 주입하는 실시간 DOM 점검 스크립트 |

## 2. 작업 워크플로우

### 모드 A — 신규 구축 (설계부터 접근성 내장)
1. `vue-patterns.md` + `vue-patterns-advanced.md` 패턴으로 UI를 만든다(시맨틱 HTML 우선, ARIA는 보조).
2. `router-focus.md`로 라우팅 초점·`aria-live`·`lang`·문서 제목을 셋업한다.
3. 백엔드는 `backend-spring.md`, 모바일/반응형/모션은 `mobile-responsive.md`를 따른다.
4. `testing-ci.md`로 eslint-a11y + vitest-axe + axe-playwright + Lighthouse CI 게이트를 건다.
5. 머지 전 §3 cmux 실시간 감리 + `manual-testing.md` 수동 점검으로 동적·맥락 항목을 검증한다.

### 모드 B — 기존 사이트 감리/인증 준비
1. `checklist.md` 33항목을 페이지별로 평가표에 매핑한다.
2. **자동 검출 가능 항목**: axe-core / Lighthouse / `scripts/a11y-audit.js`로 1차 스캔.
3. **자동 검출 불가 항목**: §3 cmux 플레이북으로 DOM 변화를 실시간 추적하며 수동 검증.
4. 위반을 KWCAG 항목번호 + WCAG SC + 심각도로 리포트한다.
5. 스크린리더 실청취(키보드만으로 전체 플로우) 결과를 첨부한다.

## 3. cmux 브라우저 실시간 DOM 모니터링 (자동화 보완)

자동 정적 검사로 못 잡는 **동적·상호작용 항목**(초점 이동, 모달 포커스 트랩, 라우팅 후
초점, `aria-live` 알림 발화, 동적 콘텐츠 변경, 키보드 조작 가능성)은 cmux로 실제 브라우저를
띄워 DOM 변화를 실시간 관찰하며 검증한다. (※ cmux는 로컬 실행 환경에서 동작)

### 3-1. 페이지 열고 점검 스크립트 주입
```bash
# 1) 대상 페이지 열기 (분할 화면)
cmux browser open-split http://localhost:5173

# 2) 로드 완료 대기 (surface ID는 open-split 출력에서 확인)
cmux browser --surface <ID> wait --load-state complete

# 3) 점검 스크립트 주입 → JSON 위반 목록 수집
cmux browser --surface <ID> eval "$(cat .claude/skills/kwcag/scripts/a11y-audit.js)"
```

### 3-2. DOM 변화 실시간 감시 (MutationObserver 등록)
`a11y-audit.js`의 `startA11yMonitor()`를 주입하면 `MutationObserver`가 DOM 추가/속성 변경을
감시하다가 **새로 생긴 위반**을 `window.__a11yViolations`에 누적한다. 상호작용 후 폴링한다.
```bash
# 감시 시작
cmux browser --surface <ID> eval "startA11yMonitor()"

# 메뉴 열기/모달 띄우기 등 상호작용 수행
cmux browser --surface <ID> eval "document.querySelector('#open-modal').click()"

# 상호작용으로 새로 생긴 위반 확인 (동적 콘텐츠/모달 검증)
cmux browser --surface <ID> eval "JSON.stringify(window.__a11yViolations, null, 2)"
```

### 3-3. 초점(Focus) 흐름 추적 — 키보드 접근성 핵심
```bash
# 현재 포커스된 요소가 무엇인지 (라우팅/모달 후 초점이 올바른 곳에 갔는지)
cmux browser --surface <ID> eval "(()=>{const a=document.activeElement;return {tag:a.tagName,text:(a.innerText||'').slice(0,40),role:a.getAttribute('role'),label:a.getAttribute('aria-label')}})()"

# Tab 키 시뮬레이션으로 초점 순서가 시각적 순서와 일치하는지 확인
cmux browser --surface <ID> eval "Array.from(document.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex=\"-1\"])')).filter(el=>el.offsetParent!==null).map(el=>el.tagName+':'+(el.innerText||el.getAttribute('aria-label')||'').slice(0,25))"
```

### 3-4. aria-live 발화 검증
```bash
# 라이브 영역 존재/속성 확인 (비동기 결과가 스크린리더로 안내되는지)
cmux browser --surface <ID> eval "Array.from(document.querySelectorAll('[aria-live],[role=alert],[role=status]')).map(el=>({live:el.getAttribute('aria-live'),role:el.getAttribute('role'),text:el.innerText.slice(0,50)}))"
```

> cmux가 없는 환경(원격 CI 등)에서는 Playwright로 동일 패턴을 구현할 수 있다.
> `page.evaluate(auditFn)` + `page.on('domcontentloaded')` + `MutationObserver` 조합.

## 4. Spring Boot 백엔드 (요약 — 상세 코드는 `backend-spring.md`)

접근성은 90%가 프론트지만 백엔드가 데이터·오류·언어·시간을 어떻게 내려주느냐가 좌우한다.
- 이미지/미디어 응답에 **대체텍스트(alt)·캡션 필드를 데이터 모델에 포함**, 업로드 시 alt 필수 검증.
- 폼 검증 오류는 **`{field, message}` 구조 + i18n**으로 반환 → 프론트가 `aria-describedby`/`role=alert` 매핑.
- **정직한 HTTP 상태코드**(200에 에러 금지), `Content-Language` 헤더 + 메시지 i18n.
- **세션 남은시간/연장 API**(WCAG 2.2.1), 인증에서 붙여넣기·자동완성 허용(WCAG 3.3.8).

## 5. 자주 지적되는 Top 위반 (시각장애 관점)
1. 의미 없는 alt(`alt="image"`) 또는 alt 누락 — **5.1.1**
2. `<div @click>` 버튼화로 키보드 조작 불가 — **운용/키보드 사용 보장**
3. 라벨 미연결 폼(`<label for>` / `aria-label` 없음) — **레이블 제공**
4. 명도 대비 4.5:1 미달 — **명도 대비**
5. SPA 라우팅 후 초점·페이지 제목 미갱신 — `router-focus.md`로 해결
6. 모달에서 포커스 트랩 미구현 / 닫을 때 트리거로 초점 복귀 안 됨
7. focus ring(`outline`) 제거 — **초점 이동과 표시**

자세한 코드/항목은 위 레퍼런스 파일 참조.
