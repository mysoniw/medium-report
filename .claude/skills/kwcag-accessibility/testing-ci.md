# 접근성 테스트 자동화 + CI 게이트

자동 검사는 위반의 **30~40%만** 잡지만, **회귀를 막는 안전망**으로 필수다. 3계층으로 건다:
① 개발 중 린트 → ② 컴포넌트 단위 테스트 → ③ E2E + Lighthouse → ④ CI 차단.
나머지 60~70%는 수동(`manual-testing.md`) + cmux(`SKILL.md` §3) + 스크린리더.

---

## 1. 개발 중 — ESLint (정적, 가장 싸고 빠름)

```bash
npm i -D eslint-plugin-vuejs-accessibility
```
```js
// eslint.config.js (Flat Config)
import vueA11y from 'eslint-plugin-vuejs-accessibility'
export default [
  ...vueA11y.configs['flat/recommended'],
  // 규칙 강도 조정 예
  { rules: { 'vuejs-accessibility/label-has-for': ['error', { required: { some: ['nesting', 'id'] } }] } },
]
```
잡아주는 것: alt 누락, label 미연결, 양수 tabindex, `<div>` 클릭 핸들러, `aria-*` 오타,
이벤트 키보드 짝(click엔 keydown) 등.

---

## 2. 컴포넌트 단위 — vitest + axe-core

```bash
npm i -D vitest @vitest/browser vitest-axe @vue/test-utils
```
```js
// AccessibleModal.a11y.test.js
import { render } from '@testing-library/vue'
import { axe } from 'vitest-axe'
import { expect, test } from 'vitest'
import Modal from '@/components/AccessibleModal.vue'

test('모달은 접근성 위반이 없어야 한다', async () => {
  const { container } = render(Modal, { props: { modelValue: true, title: '알림' } })
  const results = await axe(container)
  expect(results.violations).toEqual([])
})
```
> jsdom은 레이아웃/대비를 못 재므로 색 대비·포커스 트랩은 E2E(아래)에서 검증한다.

---

## 3. E2E — Playwright + @axe-core/playwright

```bash
npm i -D @playwright/test @axe-core/playwright
```
```js
// e2e/a11y.spec.js
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const PAGES = ['/', '/login', '/mypage']

for (const path of PAGES) {
  test(`a11y: ${path}`, async ({ page }) => {
    await page.goto(path)
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([])
  })
}

test('모달 포커스 트랩 + 초점 복귀', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: '열기' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  // Esc로 닫으면 트리거로 초점 복귀
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: '열기' })).toBeFocused()
})

test('라우팅 후 제목·초점 갱신', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: '로그인' }).click()
  await expect(page).toHaveTitle(/로그인/)
  await expect(page.locator('#main-content')).toBeFocused()
})
```

> **cmux와의 관계**: Playwright는 CI(헤드리스)용 자동 게이트, cmux는 개발자가 **눈으로
> DOM 변화를 실시간 보며** 탐색적으로 점검하는 용도. `SKILL.md`의 `a11y-audit.js`는 양쪽에서
> 재사용 가능(`page.evaluate(auditFn)` ↔ `cmux ... eval`).

---

## 4. Lighthouse CI (접근성 점수 게이트)

```bash
npm i -D @lhci/cli
```
```json
// lighthouserc.json
{
  "ci": {
    "collect": { "url": ["http://localhost:4173/", "http://localhost:4173/login"] },
    "assert": { "assertions": { "categories:accessibility": ["error", { "minScore": 0.95 }] } }
  }
}
```

---

## 5. GitHub Actions — CI 차단

```yaml
# .github/workflows/a11y.yml
name: accessibility
on: [pull_request]
jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint            # eslint-plugin-vuejs-accessibility
      - run: npm run test:unit       # vitest-axe
      - run: npx playwright install --with-deps chromium
      - run: npm run build && npm run preview &  # 프리뷰 서버 기동
      - run: npx wait-on http://localhost:4173
      - run: npx playwright test e2e/a11y.spec.js
      - run: npx lhci autorun
```

> 백엔드(Spring Boot)도 통합 E2E가 필요하면 `services:`로 DB 컨테이너 + `./gradlew bootRun &`
> 기동 후 같은 잡에서 Playwright 실행.

---

## 6. 도구별 역할 요약

| 계층 | 도구 | 잡는 것 | 한계 |
|------|------|---------|------|
| 린트 | eslint-plugin-vuejs-accessibility | 마크업/속성 정적 패턴 | 런타임·동적 X |
| 단위 | vitest-axe | 컴포넌트 ARIA/구조 | 색대비·포커스 X(jsdom) |
| E2E | @axe-core/playwright | 렌더된 DOM·대비·구조 | 의미·맥락 X |
| 점수 | Lighthouse CI | 회귀 게이트(점수) | 정밀도 낮음 |
| 탐색 | **cmux + a11y-audit.js** | 실시간 DOM 변화·초점·aria-live | 사람 판단 필요 |
| 수동 | NVDA/VoiceOver/센스리더 | **나머지 60~70%** | 자동화 불가 |

## CI 체크리스트
- [ ] `npm run lint`에 eslint-a11y 포함, PR에서 실패 시 차단
- [ ] 주요 컴포넌트 vitest-axe 테스트
- [ ] 핵심 라우트 axe-playwright E2E + 모달/라우팅 초점 시나리오
- [ ] Lighthouse a11y ≥ 0.95 게이트
- [ ] 머지 전 cmux/스크린리더 수동 점검 1회(자동이 못 잡는 부분)
