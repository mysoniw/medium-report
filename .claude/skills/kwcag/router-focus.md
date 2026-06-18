# vue-router 초점 관리 + aria-live 셋업

SPA의 가장 큰 접근성 함정: **라우팅이 바뀌어도 스크린리더가 모른다.** 전통 웹은 페이지가
새로 로드되며 초점이 상단으로 가고 제목이 읽히지만, SPA는 DOM 일부만 갈아끼우므로
초점이 사라진 자리(또는 이전 링크)에 남고, `<title>`도 안 바뀐다. → KWCAG #18(제목 제공),
#11(초점), #26(예측 가능성) 위반.

해결 3종 세트: **① 페이지 제목 갱신 ② 라우팅 후 초점 이동 ③ aria-live로 전환 안내.**

> 연계: 초점 이동·표시·트랩·복귀 일반론은 **`focus-management.md`**, 라이브 리전이 스크린리더별로
> 어떻게 읽히는지(지원 편차·삽입 타이밍)는 **`screen-readers.md` §5**를 함께 본다.

---

## 1. 라우트 메타에 제목 정의

```js
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/',        component: Home,    meta: { title: '홈' } },
  { path: '/login',   component: Login,   meta: { title: '로그인' } },
  { path: '/mypage',  component: MyPage,  meta: { title: '마이페이지' } },
]

export const router = createRouter({ history: createWebHistory(), routes })
```

## 2. afterEach — 제목 갱신 + 초점/안내 트리거

```js
// router/index.js (이어서)
const SITE = '우리서비스'

router.afterEach((to) => {
  const pageTitle = to.meta.title || ''
  // ① 문서 제목 갱신 (KWCAG #18, WCAG 2.4.2)
  document.title = pageTitle ? `${pageTitle} - ${SITE}` : SITE

  // ②③ 초점 이동 + 라이브 안내는 DOM 갱신 후 실행 → nextTick 보장 위해 미세 지연
  requestAnimationFrame(() => {
    moveFocusToMain(pageTitle)
    announce(`${pageTitle} 페이지로 이동했습니다.`)
  })
})
```

## 3. 라우팅 후 초점 이동 (두 가지 전략)

```js
// utils/a11y-focus.js
// 전략 A(권장): 메인 영역 컨테이너로 초점 이동 — 사용자가 새 콘텐츠 시작점에서 시작
export function moveFocusToMain(label) {
  const main = document.getElementById('main-content')
  if (!main) return
  main.setAttribute('tabindex', '-1')   // 프로그램적 초점 허용
  if (label) main.setAttribute('aria-label', label)
  main.focus()
  // 포커스 후 outline이 거슬리면 blur 시 tabindex 제거
  main.addEventListener('blur', () => main.removeAttribute('tabindex'), { once: true })
}
```
> 전략 B: 페이지의 `<h1>`으로 초점 이동(콘텐츠 제목을 바로 읽어줌). 어느 쪽이든 **일관성**이 중요.
> 모달/검색 등에서 돌아올 때는 직전 트리거로 복귀(→ `vue-patterns.md` 모달 참고).

### App.vue — main 랜드마크 + 스킵 링크
```vue
<template>
  <a href="#main-content" class="skip-link">본문 바로가기</a>  <!-- KWCAG #17 -->
  <header><AppNav /></header>

  <main id="main-content">   <!-- 초점 타깃 + 랜드마크 -->
    <RouterView />
  </main>

  <footer>…</footer>

  <!-- 전역 라이브 영역 (4절) -->
  <LiveAnnouncer />
</template>

<style>
.skip-link { position:absolute; left:-9999px; }
.skip-link:focus { left:8px; top:8px; position:fixed; z-index:1000; background:#000; color:#fff; padding:8px; }
</style>
```

---

## 4. aria-live 전역 안내자 (LiveAnnouncer)

라우팅·비동기 작업·검증 결과 등 **시각적 변화를 스크린리더로 전달**. KWCAG #33, WCAG 4.1.3.

```vue
<!-- components/LiveAnnouncer.vue -->
<script setup>
import { ref } from 'vue'
const politeMsg = ref('')
const assertiveMsg = ref('')

// 같은 문자열 연속 안내 시에도 발화되도록 초기화 후 재설정
function set(target, msg) {
  target.value = ''
  requestAnimationFrame(() => { target.value = msg })
}
defineExpose({
  polite:    (m) => set(politeMsg, m),   // 일반 안내(라우팅·완료)
  assertive: (m) => set(assertiveMsg, m) // 긴급(에러)
})
</script>

<template>
  <!-- 화면엔 안 보이지만 스크린리더는 읽는 영역 -->
  <div class="sr-only" aria-live="polite"    aria-atomic="true">{{ politeMsg }}</div>
  <div class="sr-only" aria-live="assertive" role="alert" aria-atomic="true">{{ assertiveMsg }}</div>
</template>

<style>
.sr-only {
  position:absolute; width:1px; height:1px; padding:0; margin:-1px;
  overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; border:0;
}
</style>
```

### 전역에서 호출할 수 있게 연결 (composable)
```js
// composables/useAnnounce.js
let announcer = null
export function registerAnnouncer(instance) { announcer = instance }
export function announce(msg, urgent = false) {
  if (!announcer) return
  urgent ? announcer.assertive(msg) : announcer.polite(msg)
}
```
```js
// main.js 또는 App.vue onMounted 에서
import { registerAnnouncer } from '@/composables/useAnnounce'
const liveRef = ref(null)
onMounted(() => registerAnnouncer(liveRef.value))
```

이제 어디서든:
```js
import { announce } from '@/composables/useAnnounce'
announce('3건의 검색 결과를 찾았습니다.')          // polite
announce('저장에 실패했습니다. 다시 시도하세요.', true) // assertive(에러)
```

---

## 5. 언어 속성 (KWCAG #25, WCAG 3.1.1/3.1.2)
- 진입 시 `index.html`에 `<html lang="ko">`.
- 다국어 전환 시 `document.documentElement.lang = locale` 동기화.
- 본문 중 외국어 구절은 `<span lang="en">…</span>`.

---

## 6. cmux로 라우팅 초점 검증 (SKILL.md §3 연계)
라우팅 직후 초점과 제목이 올바른지 실제 브라우저로 확인:
```bash
# 라우팅 트리거
cmux browser --surface <ID> eval "document.querySelector('a[href=\"/mypage\"]').click()"
# 1) 문서 제목 갱신됐나
cmux browser --surface <ID> eval "document.title"
# 2) 초점이 main(또는 h1)으로 이동했나
cmux browser --surface <ID> eval "document.activeElement.id + ' / ' + document.activeElement.tagName"
# 3) 라이브 영역에 안내 메시지가 들어갔나
cmux browser --surface <ID> eval "document.querySelector('[aria-live=polite]').innerText"
```

## 체크리스트
- [ ] 모든 라우트에 `meta.title`, `afterEach`에서 `document.title` 갱신
- [ ] 라우팅 후 `#main-content`(또는 `h1`)로 초점 이동
- [ ] `LiveAnnouncer` 전역 마운트 + 라우팅/에러 시 `announce()` 호출
- [ ] 스킵 링크 + `<main id="main-content">` 랜드마크
- [ ] `<html lang>` 진입·전환 동기화
