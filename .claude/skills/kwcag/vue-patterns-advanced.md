# 접근 가능한 Vue 컴포넌트 — 심화 위젯

`vue-patterns.md`(모달·폼·메뉴·탭)에 이어, 실서비스에서 자주 쓰지만 **접근성 함정이 큰**
위젯들. 모두 WAI-ARIA Authoring Practices(APG) 패턴 기반. (KWCAG #33, WCAG 4.1.2)

> 원칙 재확인: 라이브러리(`@headlessui/vue`, `radix-vue`, `PrimeVue`)는 이 패턴들을 검증된
> 형태로 제공한다. 직접 구현이 부담되면 우선 검토. 아래는 동작 원리 이해·커스터마이징용.

---

## 1. 토스트 / 스낵바 알림 (aria-live)

가장 흔한 실수: 토스트를 시각적으로만 띄우고 스크린리더에 안 읽힘. `router-focus.md`의
`LiveAnnouncer`와 연동하거나, 토스트 컨테이너 자체를 라이브 영역으로.

```vue
<!-- ToastHost.vue -->
<script setup>
import { ref } from 'vue'
const toasts = ref([])  // {id, type:'info'|'error', msg}
let seq = 0
function push(msg, type = 'info') {
  const id = ++seq
  toasts.value.push({ id, msg, type })
  setTimeout(() => dismiss(id), type === 'error' ? 8000 : 4000) // 에러는 더 길게
}
function dismiss(id) { toasts.value = toasts.value.filter(t => t.id !== id) }
defineExpose({ push })
</script>

<template>
  <!-- 일반은 polite, 에러는 assertive 별도 영역으로 분리하는 게 이상적 -->
  <div class="toast-host" aria-live="polite" aria-atomic="false">
    <div
      v-for="t in toasts" :key="t.id"
      :role="t.type === 'error' ? 'alert' : 'status'"
      class="toast" :class="t.type"
    >
      {{ t.msg }}
      <button type="button" @click="dismiss(t.id)" aria-label="알림 닫기">✕</button>
    </div>
  </div>
</template>
```
> 자동 사라짐 시간은 **충분히** 길게(읽을 시간). 중요한 알림은 자동 사라짐 금지(WCAG 2.2.1).

---

## 2. 자동완성 콤보박스 (combobox + listbox)

검색·주소·태그 입력에서 빈출. 키보드(↑↓ 이동, Enter 선택, Esc 닫기) + `aria-activedescendant`로
시각 초점은 입력창에 두되 논리 초점만 옵션으로 이동.

```vue
<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ options: Array }) // ['서울','부산',...]
const emit = defineEmits(['select'])
const query = ref('')
const open = ref(false)
const activeIdx = ref(-1)
const filtered = computed(() =>
  props.options.filter(o => o.includes(query.value)).slice(0, 8))

function onKey(e) {
  if (!open.value && ['ArrowDown', 'ArrowUp'].includes(e.key)) open.value = true
  if (e.key === 'ArrowDown') { activeIdx.value = (activeIdx.value + 1) % filtered.value.length; e.preventDefault() }
  else if (e.key === 'ArrowUp') { activeIdx.value = (activeIdx.value - 1 + filtered.value.length) % filtered.value.length; e.preventDefault() }
  else if (e.key === 'Enter' && activeIdx.value >= 0) { choose(filtered.value[activeIdx.value]); e.preventDefault() }
  else if (e.key === 'Escape') { open.value = false; activeIdx.value = -1 }
}
function choose(v) { query.value = v; emit('select', v); open.value = false; activeIdx.value = -1 }
</script>

<template>
  <div>
    <label for="cb-input">지역 검색</label>
    <input
      id="cb-input" type="text" v-model="query" role="combobox"
      :aria-expanded="open" aria-controls="cb-list" aria-autocomplete="list"
      :aria-activedescendant="activeIdx >= 0 ? `opt-${activeIdx}` : undefined"
      @input="open = true" @keydown="onKey"
    />
    <ul v-show="open && filtered.length" id="cb-list" role="listbox">
      <li
        v-for="(o, i) in filtered" :key="o"
        :id="`opt-${i}`" role="option"
        :aria-selected="i === activeIdx"
        :class="{ active: i === activeIdx }"
        @click="choose(o)" @mousemove="activeIdx = i"
      >{{ o }}</li>
    </ul>
  </div>
</template>
```

---

## 3. 아코디언 (disclosure)

```vue
<script setup>
import { ref } from 'vue'
defineProps({ items: Array })  // [{id,title,body}]
const openId = ref(null)
</script>

<template>
  <div v-for="it in items" :key="it.id">
    <h3>
      <button
        type="button"
        :aria-expanded="openId === it.id"
        :aria-controls="`acc-${it.id}`"
        :id="`acc-btn-${it.id}`"
        @click="openId = openId === it.id ? null : it.id"
      >{{ it.title }} <span aria-hidden="true">{{ openId === it.id ? '▲' : '▼' }}</span></button>
    </h3>
    <div
      v-show="openId === it.id"
      :id="`acc-${it.id}`" role="region" :aria-labelledby="`acc-btn-${it.id}`"
    >{{ it.body }}</div>
  </div>
</template>
```

---

## 4. 정렬 가능한 데이터 테이블

KWCAG #3 표의 구성. `scope`, `caption`, 정렬 상태는 `aria-sort`.

```vue
<script setup>
import { ref, computed } from 'vue'
const props = defineProps({ rows: Array, columns: Array }) // columns:[{key,label}]
const sortKey = ref(null), asc = ref(true)
const sorted = computed(() => {
  if (!sortKey.value) return props.rows
  return [...props.rows].sort((a, b) =>
    (a[sortKey.value] > b[sortKey.value] ? 1 : -1) * (asc.value ? 1 : -1))
})
function sortBy(k) { asc.value = sortKey.value === k ? !asc.value : true; sortKey.value = k }
</script>

<template>
  <table>
    <caption>사용자 목록 (총 {{ rows.length }}건)</caption>
    <thead>
      <tr>
        <th
          v-for="c in columns" :key="c.key" scope="col"
          :aria-sort="sortKey === c.key ? (asc ? 'ascending' : 'descending') : 'none'"
        >
          <button type="button" @click="sortBy(c.key)">
            {{ c.label }}
            <span aria-hidden="true">{{ sortKey === c.key ? (asc ? '▲' : '▼') : '' }}</span>
          </button>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(r, i) in sorted" :key="i">
        <td v-for="c in columns" :key="c.key">{{ r[c.key] }}</td>
      </tr>
    </tbody>
  </table>
</template>
```

---

## 5. 페이지네이션 (nav + aria-current)

```vue
<template>
  <nav aria-label="페이지 탐색">
    <ul class="pagination">
      <li>
        <button type="button" :disabled="page === 1" @click="$emit('change', page - 1)"
          aria-label="이전 페이지">‹</button>
      </li>
      <li v-for="p in totalPages" :key="p">
        <button type="button"
          :aria-current="p === page ? 'page' : undefined"
          :aria-label="`${p}페이지${p === page ? ', 현재 페이지' : ''}`"
          @click="$emit('change', p)">{{ p }}</button>
      </li>
      <li>
        <button type="button" :disabled="page === totalPages" @click="$emit('change', page + 1)"
          aria-label="다음 페이지">›</button>
      </li>
    </ul>
  </nav>
</template>
```

---

## 6. 로딩 상태 (busy + 안내)

비동기 로딩이 스크린리더에 안 알려지면 사용자는 멈춘 줄 안다.

```vue
<template>
  <section aria-busy="true" v-if="loading">
    <!-- 스피너는 장식이므로 숨기고, 텍스트로 상태 안내 -->
    <span class="spinner" aria-hidden="true"></span>
    <p role="status">콘텐츠를 불러오는 중입니다…</p>
  </section>
  <section v-else aria-busy="false">
    <slot />
    <p class="sr-only" role="status">{{ count }}건을 불러왔습니다.</p>
  </section>
</template>
```

---

## 7. 빵부스러기(Breadcrumb)

```vue
<template>
  <nav aria-label="현재 위치">
    <ol class="breadcrumb">
      <li v-for="(c, i) in crumbs" :key="c.path">
        <RouterLink v-if="i < crumbs.length - 1" :to="c.path">{{ c.label }}</RouterLink>
        <span v-else aria-current="page">{{ c.label }}</span>
      </li>
    </ol>
  </nav>
</template>
```

## 공통 점검
- 모든 위젯: 키보드만으로 완전 조작(↑↓←→ Enter Esc Tab), 보이는 focus 표시 유지.
  복합 위젯(탭·메뉴·툴바)의 **로빙 탭인덱스/`aria-activedescendant`** 구현은 `focus-management.md` §6.
- 상태 변화(열림/선택/정렬/로딩)는 `aria-expanded/selected/sort/current/busy` 또는 라이브 영역으로 안내.
  라이브 리전이 스크린리더별로 어떻게 읽히는지(polite/assertive 차이·지원 편차)는 `screen-readers.md` §5.
- 아이콘/화살표 등 장식 요소는 `aria-hidden="true"`, 의미는 텍스트나 `aria-label`로.
