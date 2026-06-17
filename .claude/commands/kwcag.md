# /kwcag — 웹·모바일 접근성 (KWCAG 2.2 / WCAG 2.2 AA) 설계·점검·인증 지원

시각장애인 등 장애인을 위한 접근성 작업의 진입 커맨드. 상세 지식은
`.claude/skills/kwcag-accessibility/` 스킬에 있다. 이 커맨드는 그 스킬을 호출한다.

## 트리거
- `/kwcag <요청>`
- "접근성", "a11y", "KWCAG", "WCAG", "웹 접근성 인증", "WA 마크", "스크린리더", "시각장애인"

## 동작
요청 의도를 파악해 아래 중 맞는 모드로 진행하고, 필요한 레퍼런스 파일을 읽어 적용한다.

| 요청 유형 | 읽을 파일 | 산출 |
|-----------|-----------|------|
| 전체 개요/어디서 시작? | `kwcag-accessibility/SKILL.md` | 워크플로우 안내 |
| 검사항목/체크리스트 | `SKILL.md` + `checklist.md` | 33항목 평가표 |
| Vue 컴포넌트(모달/폼/메뉴/탭) | `vue-patterns.md` | 접근 가능한 코드 |
| 심화 위젯(토스트/콤보박스/아코디언/테이블/페이지네이션) | `vue-patterns-advanced.md` | 위젯 코드 |
| 라우팅 초점/aria-live | `router-focus.md` | SPA 초점·안내 셋업 |
| Spring Boot 백엔드 | `backend-spring.md` | DTO·검증·i18n·세션·인증 코드 |
| 모바일/반응형/줌/모션/PWA/MA | `mobile-responsive.md` | 모바일 대응 |
| 테스트 자동화/CI | `testing-ci.md` | eslint·axe·playwright·Actions |
| 수동 테스트/감리/VPAT | `manual-testing.md` | 시나리오·평가시트·적합성 선언 |
| 표준/인증/비용/EN 301 549 | `standards.md` | 인증 로드맵 |
| 기존 사이트 점검/감리 | `SKILL.md` §3 + `scripts/a11y-audit.js` | cmux 실시간 DOM 점검 |

## 핵심 사실 (반드시 기억)
- **KWCAG 2.2 = 33개 검사항목** (24개는 2.1). 단, 현행 법정 WA 인증 심사는 **KWCAG 2.1** 기준.
- 목표 표준은 **WCAG 2.2 Level AA** — 국내외 대부분을 동시 충족.
- 자동 도구는 위반의 30~40%만 검출 → 동적·맥락 항목은 **cmux 실시간 모니터링 + 스크린리더 실청취**로 보완.
- 스택: 프론트 Vue.js / 백엔드 Spring Boot — 접근성은 90%가 프론트, 백엔드는 alt·오류메시지·언어헤더로 기여.

## cmux 실시간 점검 (자동화 보완)
```bash
cmux browser open-split <URL>
cmux browser --surface <ID> wait --load-state complete
cmux browser --surface <ID> eval "$(cat .claude/skills/kwcag-accessibility/scripts/a11y-audit.js)"
cmux browser --surface <ID> eval "startA11yMonitor()"   # 상호작용 후 window.__a11yViolations 확인
```

$ARGUMENTS
