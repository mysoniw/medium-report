# 초점(Focus) 관리 — 심화 가이드

초점은 **키보드·스크린리더 사용자의 위치**다. 초점을 잃거나, 안 보이거나, 엉뚱한 곳으로
가거나, 갇히면 그 사용자는 길을 잃는다. 시각장애 인증에서 가장 자주 실패하는 영역이라
별도 심화로 정리한다. (관련: 모달은 `vue-patterns.md`, SPA 라우팅은 `router-focus.md`)

---

## 0. 초점 관련 검사항목 매핑

| KWCAG 2.2 | WCAG 2.2 | 핵심 |
|-----------|----------|------|
| #10 키보드 사용 보장 | 2.1.1 Keyboard | 모든 기능 키보드 가능 |
| #11 초점 이동과 표시 | 2.4.3 Focus Order / 2.4.7 Focus Visible | 논리적 순서 + **보이는 초점** |
| (키보드 함정 금지) | 2.1.2 No Keyboard Trap | 어디에도 갇히지 않음 |
| 사용자 요구에 따른 실행 | 3.2.1 On Focus | 초점만으로 맥락 변경 금지 |
| (WCAG 2.2 신규 AA) | **2.4.11 Focus Not Obscured** | 초점 요소가 고정 헤더 등에 **가려지지 않음** |
| (WCAG 2.2 신규 AAA) | 2.4.12 / 2.4.13 | 완전 비가림 / 초점 외형 강화 |

> 2.4.11(초점 가림 방지)은 KWCAG 2.2 인증 항목과 별개여도 **스티키 헤더가 흔한 한국 사이트
> 에서 실질적 차별**이 되므로 본 가이드에서 함께 다룬다(§7).

---

## 1. 초점 표시 (Focus Visible) — 절대 지우지 마라

가장 흔한 위반 #1: `outline: none`. 디자인 이유로 지웠다면 **반드시 대체 표시**를 줘야 한다.

```css
/* 1) 전역 리셋이 outline을 지웠다면 복구 */
:focus-visible {
  outline: 3px solid #1a73e8;
  outline-offset: 2px;
  border-radius: 2px;
}
/* 2) 마우스 클릭 시엔 안 보이고, 키보드 탐색 시에만 보이게 (:focus-visible 핵심) */
:focus:not(:focus-visible) { outline: none; }

/* 3) Windows 고대비/강제 색 모드에서도 초점이 보이도록 */
@media (forced-colors: active) {
  :focus-visible { outline: 3px solid Highlight; }
}
```
- 대비: 초점 표시는 인접 색과 **3:1 이상** 대비(WCAG 2.4.13 권장값) — 옅은 회색 outline 금지.
- 커스텀 컴포넌트(카드형 버튼 등)도 `:focus-visible`에 `box-shadow`/`ring`을 반드시 부여.
- **포커스 표시를 색상 변경에만 의존하지 말 것**(테두리·그림자 등 형태 변화 병행).

---

## 2. 초점 순서 (Focus Order) — DOM 순서 = 시각 순서

- 키보드 초점 순서는 **DOM 순서**를 따른다 → CSS(`order`, `position:absolute`, `flex-direction:row-reverse`)
  로 시각 순서만 바꾸면 **초점 순서와 어긋난다**(2.4.3 위반).
- 해법: 시각적으로 재배치해야 하면 **마크업 순서 자체**를 논리적으로 둔다.

### tabindex 규칙
| 값 | 의미 | 사용 |
|----|------|------|
| (없음) | 네이티브 포커서블만 초점 | 기본 |
| `tabindex="0"` | Tab 순서에 포함(DOM 위치) | 커스텀 위젯 루트 |
| `tabindex="-1"` | Tab으론 못 가지만 `.focus()`로는 가능 | **프로그램적 초점 타깃** |
| `tabindex="1+"` | ❌ 순서 왜곡 | **절대 금지**(2.4.3 위반) |

---

## 3. 프로그램적 초점 이동 (Programmatic Focus)

언제 직접 초점을 옮기나: 모달 열기/닫기, 라우팅, 동적 콘텐츠 노출, 폼 오류, 삭제 후 잔여 위치.

```js
// 안전한 초점 이동 헬퍼
export function focusEl(el, { preventScroll = false } = {}) {
  if (!el) return
  // 원래 포커서블이 아니면 임시로 -1 부여 (포커스 후 자연 정리)
  if (!el.matches('a[href],button,input,select,textarea,[tabindex]')) {
    el.setAttribute('tabindex', '-1')
  }
  el.focus({ preventScroll })           // preventScroll: 점프 방지가 필요할 때
}
```
**Vue 타이밍**: DOM이 그려진 뒤 옮겨야 한다 → `await nextTick()` 또는
`requestAnimationFrame`. `v-if`로 막 나타난 요소는 `nextTick` 없이 `focus()`하면 실패한다.

```js
import { nextTick } from 'vue'
async function openPanel() {
  showPanel.value = true
  await nextTick()
  focusEl(panelRef.value)
}
```

---

## 4. 초점 가두기 (Focus Trap) — 재사용 컴포저블

모달·드로어·풀스크린 메뉴는 열린 동안 초점이 **그 안에서만** 순환해야 한다(2.1.2 역설:
일반 콘텐츠엔 트랩 금지지만, 모달은 의도적 트랩 + Esc 탈출이 정답).

```js
// composables/useFocusTrap.js
import { onBeforeUnmount } from 'vue'

const SEL = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

export function useFocusTrap(containerRef, { onEscape } = {}) {
  function items() {
    return Array.from(containerRef.value?.querySelectorAll(SEL) || [])
      .filter(el => el.offsetParent !== null) // 보이는 것만
  }
  function onKeydown(e) {
    if (e.key === 'Escape') { onEscape?.(); return }
    if (e.key !== 'Tab') return
    const list = items()
    if (!list.length) { e.preventDefault(); return }
    const first = list[0], last = list[list.length - 1]
    const active = document.activeElement
    if (e.shiftKey && (active === first || !containerRef.value.contains(active))) {
      e.preventDefault(); last.focus()
    } else if (!e.shiftKey && active === last) {
      e.preventDefault(); first.focus()
    }
  }
  function activate() { document.addEventListener('keydown', onKeydown, true) }
  function deactivate() { document.removeEventListener('keydown', onKeydown, true) }
  onBeforeUnmount(deactivate)
  return { activate, deactivate, focusables: items }
}
```
> 더 견고하게: 배경 요소에 **`inert` 속성**을 토글하면 트랩 로직 없이도 배경이 초점/스크린리더
> 양쪽에서 제외된다(최신 브라우저). 라이브러리: `focus-trap` / `@headlessui/vue`.

---

## 5. 초점 복귀 (Focus Restoration) — 컴포저블

모달/메뉴/드로어를 닫으면 **열기 전 위치(트리거 버튼)로 초점을 되돌린다.** 안 하면 초점이
`<body>`로 떨어져 스크린리더 사용자가 처음부터 다시 탐색한다.

```js
// composables/useFocusReturn.js
export function useFocusReturn() {
  let saved = null
  function save() { saved = document.activeElement }      // 열기 직전 호출
  function restore() {                                     // 닫은 직후 호출
    if (saved && typeof saved.focus === 'function') saved.focus()
    saved = null
  }
  return { save, restore }
}
```
```js
// 사용 (모달)
const trap = useFocusTrap(dialogRef, { onEscape: close })
const { save, restore } = useFocusReturn()
watch(() => open.value, async (v) => {
  if (v) { save(); await nextTick(); focusEl(firstFocusable()); trap.activate() }
  else   { trap.deactivate(); restore() }
})
```

---

## 6. 로빙 탭인덱스 (Roving tabindex) — 복합 위젯

메뉴·탭·툴바·그리드·라디오그룹처럼 **여러 항목이 한 묶음**인 위젯은 Tab으로 항목을 하나씩
밟지 않는다. 묶음은 Tab 한 번으로 진입하고, **내부는 화살표 키**로 이동한다(APG 표준).
구현: 활성 항목만 `tabindex="0"`, 나머지는 `-1`.

```js
// composables/useRovingTabindex.js
import { ref } from 'vue'
export function useRovingTabindex(count, { orientation = 'horizontal', loop = true } = {}) {
  const active = ref(0)
  const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
  const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
  function onKeydown(e, focusByIndex) {
    let i = active.value
    if (e.key === nextKey) i++
    else if (e.key === prevKey) i--
    else if (e.key === 'Home') i = 0
    else if (e.key === 'End') i = count.value - 1
    else return
    e.preventDefault()
    if (loop) i = (i + count.value) % count.value
    else i = Math.max(0, Math.min(count.value - 1, i))
    active.value = i
    focusByIndex(i)            // 실제 DOM 요소에 .focus()
  }
  const tabindexFor = (i) => (i === active.value ? 0 : -1)
  return { active, onKeydown, tabindexFor }
}
```
```vue
<!-- 사용 예: 툴바 -->
<script setup>
import { ref, computed } from 'vue'
import { useRovingTabindex } from '@/composables/useRovingTabindex'
const btns = ['굵게', '기울임', '밑줄']
const refs = ref([])
const { onKeydown, tabindexFor } = useRovingTabindex(computed(() => btns.length))
</script>
<template>
  <div role="toolbar" aria-label="서식" @keydown="e => onKeydown(e, i => refs[i]?.focus())">
    <button v-for="(b,i) in btns" :key="b" :ref="el => refs[i]=el" :tabindex="tabindexFor(i)">{{ b }}</button>
  </div>
</template>
```
> 대안 패턴: **`aria-activedescendant`** — 초점은 입력/컨테이너에 고정하고 `aria-activedescendant`
> 로 논리적 활성 항목만 가리킨다(콤보박스·리스트박스). `vue-patterns-advanced.md` 콤보박스 참고.

---

## 7. 초점 가림 방지 (WCAG 2.2 신규, 2.4.11) — 스티키 헤더 주의

고정(sticky) 헤더/푸터/쿠키 배너가 **키보드로 막 초점받은 요소를 가리면** 안 된다. 흔한
한국 사이트 패턴이라 특히 주의.

```css
/* 스크롤 시 초점 요소가 고정 헤더 밑으로 숨지 않도록 여백 확보 */
:root { --sticky-header-h: 64px; }
html { scroll-padding-top: var(--sticky-header-h); }  /* 초점 이동 시 스크롤 보정 */
:target, [tabindex]:focus { scroll-margin-top: var(--sticky-header-h); }
```
- 모달/드롭다운이 초점 요소를 덮지 않게 z-index/위치 점검.
- cmux로 검증: 초점 이동 후 해당 요소가 뷰포트에서 가려지지 않는지 `getBoundingClientRect()` 확인(§9).

---

## 8. 동적 콘텐츠·오류에서의 초점

- **새로 펼친 콘텐츠**(아코디언/탭 패널): 보통 초점은 트리거에 두되, 패널이 길면 패널로 이동.
- **삭제 후**: 삭제한 행의 **다음 항목**(없으면 이전/목록 컨테이너)으로 초점 이동 — `<body>` 낙하 방지.
- **폼 제출 오류**: 첫 오류 필드로 초점(`vue-patterns.md`), 또는 상단 **오류 요약 박스**로 초점 후
  각 오류를 해당 필드 앵커로 링크.
  ```vue
  <div v-if="errorList.length" ref="errSummary" tabindex="-1" role="alert" aria-labelledby="err-h">
    <h2 id="err-h">{{ errorList.length }}개 항목을 확인해주세요</h2>
    <ul><li v-for="e in errorList" :key="e.field"><a :href="`#${e.field}`">{{ e.message }}</a></li></ul>
  </div>
  <!-- 제출 실패 시 await nextTick(); errSummary.value.focus() -->
  ```
- **로딩/지연**: 비동기 완료 후 결과 영역으로 초점 또는 `aria-live` 안내(`router-focus.md`).

---

## 9. cmux / DevTools로 초점 디버깅 (SKILL.md §3 연계)

```bash
# 현재 초점 요소 (라우팅/모달/삭제 후 올바른 위치인가)
cmux browser --surface <ID> eval "(()=>{const a=document.activeElement;return{tag:a.tagName,id:a.id,text:(a.innerText||'').slice(0,40),tabindex:a.getAttribute('tabindex')}})()"

# 초점이 body로 떨어졌는지 (가장 흔한 버그)
cmux browser --surface <ID> eval "document.activeElement === document.body ? 'LOST: body로 떨어짐' : 'OK'"

# Tab 순서(시각 순서와 비교)
cmux browser --surface <ID> eval "Array.from(document.querySelectorAll('a[href],button,input,select,textarea,[tabindex]:not([tabindex=\"-1\"])')).filter(el=>el.offsetParent).map((el,i)=>i+':'+el.tagName+':'+(el.innerText||el.ariaLabel||'').slice(0,20))"

# 양수 tabindex 탐지 (순서 왜곡 위반)
cmux browser --surface <ID> eval "Array.from(document.querySelectorAll('[tabindex]')).filter(el=>+el.getAttribute('tabindex')>0).map(el=>el.tagName+'='+el.getAttribute('tabindex'))"

# 초점 가림 검사 (2.4.11): 초점 요소가 뷰포트 안에서 안 가려지는지
cmux browser --surface <ID> eval "(()=>{const r=document.activeElement.getBoundingClientRect();return{top:r.top,bottom:r.bottom,inView:r.top>=0&&r.bottom<=innerHeight}})()"
```
> DevTools(§3-5): Rendering 패널로 `:focus-visible` 표시 상태, 색각/강제색 모드에서 초점이
> 여전히 보이는지 육안 확인.

---

## 10. 흔한 초점 버그 체크리스트
- [ ] `outline:none` 후 대체 표시 없음 → **focus 안 보임**(2.4.7)
- [ ] 모달 열어도 초점이 배경에 남음 / 닫아도 트리거로 안 돌아옴
- [ ] 모달 안에서 Tab이 배경으로 새어 나감(트랩 실패)
- [ ] 라우팅 후 초점이 `<body>`로 떨어짐(`router-focus.md`)
- [ ] 항목 삭제 후 초점 소실
- [ ] 메뉴/탭/툴바를 Tab으로 일일이 밟음(roving tabindex 미적용)
- [ ] `tabindex` 양수 사용
- [ ] CSS로 시각 순서만 바꿔 DOM 순서와 불일치
- [ ] 스티키 헤더가 초점 요소를 가림(2.4.11)
- [ ] 초점만 받아도 자동 제출/페이지 이동(3.2.1)

## 11. 테스트
- **수동**(`manual-testing.md`): 마우스 없이 Tab/Shift+Tab/화살표로 전 위젯 + 항상 초점이 보이는가.
- **Playwright**(`testing-ci.md`):
  ```js
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: '열기' })).toBeFocused() // 복귀 검증
  ```
- **cmux/DevTools**(§9): 동적 상황의 `activeElement` 실시간 추적.
