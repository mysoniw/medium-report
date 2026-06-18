# 모바일 · 반응형 · 모션 접근성

사용자가 "모바일/PC" 모두를 목표로 했으므로 별도 정리. 시각장애 + 저시력 + 운동장애를
함께 고려한다. (KWCAG 운용/인식 다수, WCAG 1.3.4 / 1.4.4 / 1.4.10 / 1.4.12 / 2.5.x)

---

## 1. 터치 타깃 크기 & 간격 (KWCAG #12 조작 가능, WCAG 2.5.8)

- 클릭/터치 대상 최소 **24×24 CSS px**(WCAG 2.2 AA), 모바일 권장 **44×44**(iOS) / 48×48dp(Android).
- 인접 타깃 간 충분한 간격으로 오조작 방지.
```css
.btn, a.tap, [role="button"] { min-width: 44px; min-height: 44px; }
/* 작은 아이콘은 패딩으로 히트영역 확장 */
.icon-btn { padding: 12px; }
```

## 2. 줌 / 확대 / 리플로우 (저시력 핵심)

- **확대 차단 금지** — 가장 흔한 모바일 접근성 위반.
```html
<!-- 올바름: 확대 허용 -->
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- 금지: user-scalable=no / maximum-scale=1 → 확대 차단 -->
```
- **200% 확대**에도 콘텐츠/기능 손실 없어야(WCAG 1.4.4).
- **리플로우**(WCAG 1.4.10): 폭 320px(400% 확대 상당)에서 **가로 스크롤 없이** 1열로 흐르게.
```css
/* 고정 px 폭 대신 상대 단위 + 반응형 */
.container { max-width: 100%; }
@media (max-width: 480px) { .grid { grid-template-columns: 1fr; } }
```
- 폰트 크기는 `rem`/`em`(사용자 기본 글꼴 크기 존중), 고정 `px` 본문 지양.

## 3. 텍스트 간격 (WCAG 1.4.12)

사용자가 줄간격·자간을 늘려도 콘텐츠가 잘리지 않아야. 고정 높이 컨테이너 + `overflow:hidden`
조합을 피한다.
```css
/* 글자/줄 간격 확대에도 깨지지 않도록 고정 높이 대신 min-height */
.card { min-height: 80px; /* height 고정 금지 */ }
```

## 4. 화면 방향 (WCAG 1.3.4)

세로/가로 한 방향으로 **고정 금지**(휠체어 거치 등). 둘 다 동작하게.

## 5. 모션 / 애니메이션 — prefers-reduced-motion (WCAG 2.3.3)

전정기관 장애·멀미 사용자를 위해 모션 축소 설정을 존중.
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
```js
// Vue: 자동재생 캐러셀 등은 설정 감지해 비활성
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
```

## 6. 대비 / 색 선호 — prefers-contrast, forced-colors

```css
/* 고대비 선호 */
@media (prefers-contrast: more) {
  :root { --text: #000; --bg: #fff; --border: #000; }
}
/* Windows 고대비 모드(강제 색) — 시스템 색 토큰 존중, 윤곽 유지 */
@media (forced-colors: active) {
  .btn { border: 1px solid ButtonText; }
  :focus-visible { outline: 2px solid Highlight; }
  /* 배경 이미지로만 의미 전달 시 forced-colors-adjust 주의 */
}
```
> `forced-colors: active`에서 아이콘이 사라지지 않게, 의미 있는 그래픽은 `<img>`/텍스트 병행.

## 7. 다크 모드 (선택, 대비 유지)

```css
@media (prefers-color-scheme: dark) {
  :root { --text: #e8e8e8; --bg: #121212; }
}
```
- 다크/라이트 **양쪽 모두 명도대비 4.5:1** 충족하는지 검증(테마별 axe 실행).

## 8. PWA / 모바일 웹 추가 고려

- 설치형 PWA도 `<html lang>`, 랜드마크, 초점 관리(→ `focus-management.md`) 동일 적용.
- 시스템 글꼴 크기(동적 타입) 반영: `rem` 기반 + `meta viewport` 확대 허용.
- 하단 고정 바/노치 안전영역: `env(safe-area-inset-*)` 사용하되 터치타깃 확보.
- **모바일 스크린리더**(VoiceOver/TalkBack)의 제스처 탐색·스와이프 순서·제스처 충돌은
  `screen-readers.md` §6에서 상세히 다룬다 — 실기기 청취 필수.

---

## 9. 모바일 앱(네이티브) — 별도 표준·인증 → `macag` 스킬

Vue로 **모바일 웹/PWA**를 만들면 본 스킬(웹/KWCAG)이 그대로 적용된다. 그러나
**네이티브 앱**(또는 WebView 래핑 하이브리드 앱)으로 스토어 배포하면, 웹(WA)과 별개인
**MACAG 2.0(4원칙·18검사항목, KS 국가표준) + MA 인증** 대상이다.

| 구분 | 표준/지침 | 인증 | 다룰 스킬 |
|------|-----------|------|-----------|
| 웹 / 모바일 웹 / PWA | KWCAG 2.x | **WA** 품질마크 | **이 스킬(kwcag)** |
| 네이티브 모바일 앱 | **MACAG 2.0** | **MA** 인증 | **`macag` 스킬** |
| 하이브리드(WebView) | 둘 다 | WA+MA | WebView=kwcag, 셸=macag |

> 👉 **네이티브 앱 접근성의 18항목·네이티브 초점 API(`importantForAccessibility`/`isAccessibilityElement`),
> 대체텍스트 Label(`contentDescription`/`accessibilityLabel`), 컨트롤 9mm, OS 폰트(Dynamic Type),
> TalkBack 심사 기준, MA 인증 절차는 자매 스킬 `macag`(`/macag`)에 전부 정리되어 있다.**

## 모바일/반응형 체크리스트
- [ ] 터치타깃 ≥ 44×44, 충분한 간격
- [ ] `user-scalable=no` 없음(확대 허용), 200% 확대·320px 리플로우 OK
- [ ] 본문 상대 단위(rem), 고정 높이+overflow로 텍스트 잘림 없음
- [ ] 세로/가로 양방향 동작
- [ ] `prefers-reduced-motion` / `prefers-contrast` / `forced-colors` 대응
- [ ] 다크모드 시에도 대비 4.5:1
- [ ] (네이티브 앱이면) MA 인증 + OS 접근성 API 별도 검토
