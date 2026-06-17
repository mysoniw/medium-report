# 접근 가능한 Vue.js 컴포넌트 패턴

Vue 3 `<script setup>` 기준. **원칙: 시맨틱 HTML 우선, ARIA는 보조.** 네이티브 `<button>`,
`<nav>`, `<dialog>`로 되는 일을 `<div>`+ARIA로 재발명하지 않는다.

> 개발 중 자동 회귀 방지: `eslint-plugin-vuejs-accessibility` 활성화.
> ```js
> // eslint.config.js
> import vueA11y from 'eslint-plugin-vuejs-accessibility'
> export default [ ...vueA11y.configs['flat/recommended'] ]
> ```

---

## 1. 접근 가능한 모달 (포커스 트랩 + 초점 복귀)

KWCAG #11(초점) · #33(웹앱 접근성). 핵심: ① 열 때 모달로 초점 이동 ② 트랩(Tab 순환)
③ Esc 닫기 ④ 닫을 때 **트리거 버튼으로 초점 복귀** ⑤ 배경 `aria-hidden`/inert.

```vue
<!-- AccessibleModal.vue -->
<script setup>
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'

const props = defineProps({ modelValue: Boolean, title: String })
const emit = defineEmits(['update:modelValue'])

const dialogRef = ref(null)
let lastFocused = null

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])'

function close() { emit('update:modelValue', false) }

function onKeydown(e) {
  if (e.key === 'Escape') { close(); return }
  if (e.key !== 'Tab') return
  // 포커스 트랩: 첫↔마지막 순환
  const items = dialogRef.value.querySelectorAll(FOCUSABLE)
  if (!items.length) return
  const first = items[0], last = items[items.length - 1]
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
}

watch(() => props.modelValue, async (open) => {
  if (open) {
    lastFocused = document.activeElement          // 트리거 기억
    await nextTick()
    const first = dialogRef.value?.querySelector(FOCUSABLE)
    ;(first || dialogRef.value)?.focus()          // 모달로 초점 이동
    document.addEventListener('keydown', onKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
    lastFocused?.focus()                          // 트리거로 초점 복귀
  }
})
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>

<template>
  <!-- 배경: 클릭 닫기. role=dialog + aria-modal + aria-labelledby -->
  <div v-if="modelValue" class="overlay" @click.self="close">
    <div
      ref="dialogRef"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="'modal-title'"
      tabindex="-1"
    >
      <h2 id="modal-title">{{ title }}</h2>
      <slot />
      <button type="button" @click="close" aria-label="닫기">✕ 닫기</button>
    </div>
  </div>
</template>
```
> 배경 비활성화는 `inert` 속성(지원 시) 또는 배경 요소에 `aria-hidden="true"`를 토글하면 더 견고하다.
> 라이브러리 대안: `@headlessui/vue`의 `<Dialog>`(트랩·복귀 내장), `focus-trap` 패키지.

---

## 2. 접근 가능한 폼 (라벨·오류·aria-live)

KWCAG #29(레이블) · #28(오류 정정) · #6(색 무관). 모든 입력에 **명시적 `<label for>`**,
오류는 `aria-describedby`+`aria-invalid`+`role=alert`.

```vue
<script setup>
import { ref, reactive } from 'vue'
const form = reactive({ email: '', pw: '' })
const errors = reactive({ email: '', pw: '' })

function submit() {
  errors.email = /.+@.+\..+/.test(form.email) ? '' : '올바른 이메일 형식을 입력하세요.'
  errors.pw = form.pw.length >= 8 ? '' : '비밀번호는 8자 이상이어야 합니다.'
  if (errors.email || errors.pw) {
    // 첫 오류 필드로 초점 이동 (스크린리더 사용자가 바로 인지)
    document.getElementById(errors.email ? 'email' : 'pw')?.focus()
  }
}
</script>

<template>
  <form @submit.prevent="submit" novalidate>
    <div>
      <label for="email">이메일</label>
      <input
        id="email" type="email" v-model="form.email"
        autocomplete="email"
        :aria-invalid="!!errors.email"
        :aria-describedby="errors.email ? 'email-err' : undefined"
      />
      <!-- role=alert → 즉시 발화. 색(빨강)에만 의존하지 말고 텍스트로도 안내 -->
      <p v-if="errors.email" id="email-err" role="alert" class="err">⚠ {{ errors.email }}</p>
    </div>

    <div>
      <label for="pw">비밀번호</label>
      <input
        id="pw" type="password" v-model="form.pw"
        autocomplete="current-password"
        :aria-invalid="!!errors.pw"
        :aria-describedby="errors.pw ? 'pw-err' : 'pw-hint'"
      />
      <p id="pw-hint">8자 이상 입력하세요.</p>
      <p v-if="errors.pw" id="pw-err" role="alert" class="err">⚠ {{ errors.pw }}</p>
    </div>

    <button type="submit">로그인</button>
  </form>
</template>
```
> 체크 포인트: placeholder를 라벨 대용으로 쓰지 말 것(초점 시 사라짐 → #29 위반).
> 필수 표시는 `*`만이 아니라 `<abbr title="필수">*</abbr>` 또는 `aria-required="true"`.

---

## 3. 접근 가능한 메뉴 / 내비게이션

KWCAG #10·#11(키보드/초점). 단순 사이트 내비게이션은 **그냥 링크 목록**이 가장 접근성 좋다.
ARIA `menu` 역할은 앱 메뉴(데스크톱 앱식)에만 쓴다 — 잘못 쓰면 오히려 스크린리더 혼란.

### 3-1. 기본 내비게이션 (권장 — 단순 링크)
```vue
<template>
  <nav aria-label="주 메뉴">
    <ul>
      <li v-for="item in items" :key="item.path">
        <!-- 현재 페이지는 aria-current로 알림 -->
        <RouterLink :to="item.path" :aria-current="isActive(item.path) ? 'page' : undefined">
          {{ item.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
```

### 3-2. 드롭다운 (disclosure 패턴 — aria-expanded)
```vue
<script setup>
import { ref } from 'vue'
const open = ref(false)
const btn = ref(null)
function onKeydown(e){ if(e.key==='Escape'){ open.value=false; btn.value?.focus() } }
</script>

<template>
  <div @keydown="onKeydown">
    <button
      ref="btn" type="button"
      :aria-expanded="open" aria-haspopup="true" aria-controls="submenu"
      @click="open = !open"
    >메뉴 {{ open ? '▲' : '▼' }}</button>

    <ul v-show="open" id="submenu">
      <li v-for="i in subItems" :key="i.path"><RouterLink :to="i.path">{{ i.label }}</RouterLink></li>
    </ul>
  </div>
</template>
```

---

## 4. 탭 (WAI-ARIA Tabs 패턴)

KWCAG #33. `role=tablist/tab/tabpanel` + 화살표 키 이동 + `aria-selected`.

```vue
<script setup>
import { ref } from 'vue'
const props = defineProps({ tabs: Array })  // [{id,label}]
const active = ref(0)
const tabRefs = ref([])
function onKey(e) {
  if (e.key === 'ArrowRight') active.value = (active.value + 1) % props.tabs.length
  else if (e.key === 'ArrowLeft') active.value = (active.value - 1 + props.tabs.length) % props.tabs.length
  else return
  e.preventDefault()
  tabRefs.value[active.value]?.focus()
}
</script>

<template>
  <div role="tablist" aria-label="탭" @keydown="onKey">
    <button
      v-for="(t,i) in tabs" :key="t.id"
      :ref="el => tabRefs[i] = el"
      role="tab"
      :id="`tab-${t.id}`"
      :aria-selected="active === i"
      :aria-controls="`panel-${t.id}`"
      :tabindex="active === i ? 0 : -1"
      @click="active = i"
    >{{ t.label }}</button>
  </div>

  <div
    v-for="(t,i) in tabs" :key="t.id"
    v-show="active === i"
    role="tabpanel"
    :id="`panel-${t.id}`"
    :aria-labelledby="`tab-${t.id}`"
    tabindex="0"
  ><slot :name="t.id" /></div>
</template>
```

---

## 5. 공통 규칙 (전 컴포넌트)
- **아이콘 버튼**: 텍스트 없으면 `aria-label` 필수. 장식 아이콘은 `aria-hidden="true"`.
- **focus ring 제거 금지**: `:focus-visible`로 명확한 표시 유지.
  ```css
  :focus-visible { outline: 3px solid #1a73e8; outline-offset: 2px; }
  ```
- **스킵 링크**(#17): 앱 최상단에 `<a href="#main" class="skip">본문 바로가기</a>`,
  `:focus` 시에만 보이게.
- **이미지**: `<img :alt="...">` — 정보성은 의미 기술, 장식성은 `alt=""`.
- **동적 카운트/상태**: `aria-live` 영역으로 안내(→ `router-focus.md`).
- **명도 대비**: 디자인 토큰 단계에서 4.5:1 검증(도구: `npm i -D @adobe/leonardo-contrast-colors` 또는 axe).
