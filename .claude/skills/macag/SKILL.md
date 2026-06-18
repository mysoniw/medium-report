---
name: macag-mobile-app
description: >-
  네이티브/하이브리드 모바일 앱(Android·iOS)의 접근성을 설계·구현·점검·인증(MA 인증)할 때 사용한다.
  모바일 애플리케이션 콘텐츠 접근성 지침 MACAG 2.0(4원칙·18검사항목, KS 국가표준)을 다룬다.
  대체텍스트=Label(contentDescription/accessibilityLabel), 네이티브 초점 API, 누르기 동작 대체,
  컨트롤 9mm, OS 폰트(Dynamic Type), TalkBack/VoiceOver 제스처·심사기준, WebView 하이브리드
  분담, MA 인증 절차를 포함한다. 웹/PWA 접근성은 자매 스킬 kwcag를 쓴다.
when_to_use: >-
  네이티브 앱·하이브리드 앱·MACAG·MAAG·MA 인증·TalkBack·VoiceOver·Android/iOS 접근성·
  contentDescription·accessibilityLabel·앱 스토어 접근성을 다루거나 모바일 앱 접근성 인증을
  준비할 때. 웹·모바일웹·PWA면 kwcag 스킬을 쓴다.
argument-hint: "[개요|18항목|대체텍스트|초점|제스처|크기|폰트|인증|<화면/이슈>]"
---

# MACAG 2.0 — 모바일 애플리케이션 콘텐츠 접근성 (네이티브 앱 / MA 인증)

웹(KWCAG)과 **별개 표준**. 스토어에 배포하는 **네이티브/하이브리드 모바일 앱**은 이 기준으로
**MA(Mobile Application) 인증**을 받는다. (출처: 웹와치 모바일 앱 접근성 교육자료, 2025)

> **이 스킬 vs `kwcag` 스킬**
> - **웹 / 모바일 웹 / PWA** → 자매 스킬 **`kwcag`**(KWCAG 2.2, 웹 컴포넌트·초점·스크린리더 심화).
> - **네이티브 앱(Android/iOS) / WebView 하이브리드 앱** → **이 스킬(MACAG 2.0 + MA 인증)**.
> - 하이브리드는 둘 다: WebView 내부=`kwcag`, 네이티브 셸=이 스킬(§9).

요청: **$ARGUMENTS** — 위 요청을 아래 섹션에서 매칭해 적용한다. 빈 요청이면 §0~1 개요를 안내한다.

---

## 0. 표준 개요

| 항목 | 내용 |
|------|------|
| 명칭 | **MACAG 2.0** (Mobile Application Content Accessibility Guidelines 2.0) |
| 이력 | 2015.12 MAAG 1.0 → MACAG 2.0 개정, **2016.10 TTAK 표준 → KS 국가표준 상향** |
| 구성 | **4원칙 · 18개 검사항목** |
| 적용 대상 | 모바일 전화기·태블릿에서 실행되는 **모든 애플리케이션 및 콘텐츠** |
| 인증 | **MA 인증**(웹 WA와 별개). 인증기관: 웹와치·KWACC·wa.or.kr 등(인증기관 일반은 `kwcag` 스킬 `standards.md`) |
| 법적 근거 | 지능정보화기본법 §46(접근 보장)·§47(품질인증), 장애인차별금지법 및 시행령(정당한 편의 제공) |

---

## 1. MACAG 2.0 — 4원칙 18검사항목

### 인식의 용이성 (Perceivable)
| # | 검사항목 | 요구사항 |
|---|----------|----------|
| 1 | **대체텍스트** | 텍스트 아닌 콘텐츠는 대체 가능한 텍스트와 함께 제공(§2) |
| 2 | **자막, 수화 등의 제공** | 영상/음성에 동등한 자막·원고·수화(**Closed Caption 권장**) |
| 3 | **색에 무관한 인식** | 모든 정보는 색과 무관하게 인식 가능 |
| 4 | **명도 대비** | UI 컴포넌트·텍스트의 전경/배경색 구분 |
| 5 | **명확한 지시사항** | 모양·크기·위치·방향·색·소리에 무관하게 인식 |
| 6 | **알림 기능** `모바일특화` | 알림 정보는 **화면표시·소리·진동** 등 다양한 방법으로 제공 |

### 운용의 용이성 (Operable)
| # | 검사항목 | 요구사항 |
|---|----------|----------|
| 7 | **초점** | 의미·기능 컴포넌트에 초점 적용 + 논리적 순서 이동(§3) |
| 8 | **누르기 동작 지원** `모바일특화` | 복잡한 제스처·멀티터치 기능은 **단순 누르기(탭)로도** 조작 가능(§4) |
| 9 | **응답 시간 조절** | 시간 제한 콘텐츠는 응답시간 조절 가능 |
| 10 | **정지 기능 제공** | 자동 변경 콘텐츠는 움직임 제어 가능 |
| 11 | **컨트롤의 크기와 간격** `모바일특화` | 충분한 크기·간격 — **가로·세로 각 9mm 이상 권장**(§5) |

### 이해의 용이성 (Understandable)
| # | 검사항목 | 요구사항 |
|---|----------|----------|
| 12 | **입력 도움** | 입력 오류 방지·정정 방법 제공 |
| 13 | **사용자 인터페이스의 일관성** | UI 컴포넌트 일관 배치 |
| 14 | **깜박거림의 사용 제한** | 깜빡이거나 번쩍이는 콘텐츠 금지 |
| 15 | **자동재생 금지** | 자동 재생 배경음 금지 |
| 16 | **예측 가능성** | 의도하지 않은 화면전환·이벤트를 이해 가능한 방법으로 |

### 견고성 (Robust)
| # | 검사항목 | 요구사항 |
|---|----------|----------|
| 17 | **폰트 관련 기능의 활용** `모바일특화` | 텍스트는 **OS 폰트 기능(크기·굵게)**을 활용 가능하게(동적 글꼴)(§6) |
| 18 | **보조기술과의 호환성** | UI 컴포넌트는 보조기술로 사용 가능 |

> KWCAG(웹 33항목)과 원칙은 같지만 **#6 알림(진동)·#8 누르기·#11 9mm·#17 OS 폰트**가
> 모바일 고유 강조점이다.

---

## 2. 대체텍스트 = Label (네이티브 핵심, 지침1)

모바일에서 대체텍스트는 **필수적으로 Label 값으로 제공**한다.

| 플랫폼 | 속성 |
|--------|------|
| Android (Native) | `contentDescription` |
| iOS (Native) | `accessibilityLabel` |
| WebView(웹) | `alt` / `aria-label` |

- 의미 있는 이미지/아이콘/컨트롤에 용도를 인식할 수 있는 Label 부여, 장식 요소는 초점 제외(§3).
- **IR(Image Replacement) 기법 주의**: `text-indent`, `font-size:0`, `position`, `z-index` 등으로
  텍스트를 숨기면 **초점 위치 부적절·터치 불가** → 웹뷰에서 지양.
- `display:none` / `visibility:hidden`은 초점·낭독에서 제외됨(의도와 일치해야).

---

## 3. 초점 (지침7) — 네이티브 API

초점은 **화면에 보이는 콘텐츠에만** 접근, **논리적 순서**로 이동, 초점 하이라이트는
**콘텐츠 위치·크기에 맞게** 표시. (웹 초점 일반론은 `kwcag` 스킬 `focus-management.md`)

### Android (Native)
| 속성/메소드 | 설명 |
|-------------|------|
| `importantForAccessibility` | `yes`(기본·활성) / `no`(비활성) / `noHideDescendants`(하위까지 제외) |
| `sendAccessibilityEvent` | 특정 영역으로 초점 이동 |
| `accessibilityTraversalBefore` / `accessibilityTraversalAfter` | 초점 이동 순서 제어 |

### iOS (Native)
| 속성/메소드 | 설명 |
|-------------|------|
| `isAccessibilityElement` | 초점 접근 여부(true/false) |
| `accessibilityElementsHidden` | 하위 뷰까지 초점 제외(true=비활성) |
| `UIAccessibilityPostNotification` | 특정 뷰로 초점 보내기(화면전환·팝업 시) |
| `shouldGroupAccessibilityChildren` | 그룹화된 하위 뷰 우선 이동 |
| `accessibilityFrame` | 초점 영역(크기) 변경 |
| `accessibilityElements` | 배열 순서로 초점 이동 순서 변경 |

### WebView(웹) 초점 함정
- **iOS 링크 초점 분리**: `<a>` 안에 `block` 요소가 섞이면 태그별로 초점이 나뉘어 각각 링크로
  읽힘 → `role="button"`(또는 `<button>`)으로 **하나의 컨트롤로 묶기**.
  ```html
  <!-- 나쁨: "웹와치, 링크"→"연구원, 링크"→"홍길동, 링크" 3번 읽힘 -->
  <a href="#"><span>웹와치</span><div>연구원</div><span>홍길동</span></a>
  <!-- 좋음: "웹와치 연구원 홍길동, 버튼" 한 번 -->
  <a href="#" role="button"><span>웹와치</span><div>연구원</div><span>홍길동</span></a>
  ```
- **레이어 팝업 초점**: ① 딤드(배경) 영역 `aria-hidden="true"` ② 팝업 첫 자식에 `tabindex`
  ③ 팝업 처음으로 초점 자동 이동(웹 초점 관리는 `kwcag` 스킬 `focus-management.md`).

---

## 4. 누르기 동작 지원 (지침8) — 제스처 대체
복잡한 제스처(멀티터치·경로기반)로만 되는 기능은 **한 손가락 단순 누르기(탭)** 대체를 제공.
스크린리더 켜면 제스처가 탐색에 쓰여 원래 동작이 막힌다(웹 KWCAG #21 단일 포인터와 동일 취지).
- 다중 누르기(multi-touch) → 단일 탭으로 값 선택 가능.
- 스와이프/드래그 전용 슬라이더·캐러셀 → 버튼/탭 대체.

## 5. 컨트롤 크기·간격 (지침11)
- 터치 컨트롤은 **가로·세로 각 9mm 이상 권장**, 충분한 간격으로 오조작 방지.
- (참고: 웹 WCAG 2.5.8=24px, iOS HIG=44pt, Android=48dp. **MA 인증은 9mm 기준**.)

## 6. 폰트 기능 활용 (지침17)
- OS 글꼴 크기·굵게 설정을 콘텐츠가 따르도록(동적 글꼴).
  - Android: `sp` 단위(고정 `dp`/`px` 금지).
  - iOS: **Dynamic Type**(`UIFontMetrics`, `adjustsFontForContentSizeCategory`).
- 글자 확대 시 잘림·겹침 없게(레이아웃 유연성).

---

## 7. 모바일 스크린리더 — 설정·제스처 (심사 기준)

> **심사 기준 스크린리더 = Android TalkBack**(삼성 구버전 Voice Assistant 아님 → TalkBack 별도 설치),
> iOS는 VoiceOver. (스크린리더 일반 심화는 `kwcag` 스킬 `screen-readers.md`)

| 동작 | Android TalkBack | iOS VoiceOver |
|------|------------------|---------------|
| 켜기 | 설정 ▸ 접근성 ▸ TalkBack | 설정 ▸ 손쉬운 사용 ▸ VoiceOver |
| 순차 탐색(이전/다음) | 한 손가락 좌/우 쓸기 | 한 손가락 좌/우 쓸기 |
| 임의 탐색 | 한 손가락 떼지 말고 이동 | 한 손가락 떼지 말고 이동 |
| 실행 | 한 손가락 더블탭 | 한 손가락 더블탭 |
| 스크롤 | 두 손가락 쓸기(움직인 만큼) | 세 손가락 쓸기(페이지 단위) |

---

## 8. 자주 묻는 질문(인증 실무)
- **심사 기준 OS 버전?** → 접근성이 확보된 **가장 최신 메이저 OS 버전** 기준.
- **OS별 오류 차이?** → OS별 심사 환경(기본 WebView 엔진·스크린리더 종류) 차이로 일부 오류가
  다를 수 있음. **보조기술·주요 접근성 기능이 정상 지원·호환**되는 상태가 목표.

## 9. 하이브리드 앱(WebView) 분담
| 레이어 | 적용 기준 |
|--------|-----------|
| WebView 내부(웹 콘텐츠) | 웹 접근성 → **`kwcag` 스킬**(+ 본 문서 §3 WebView 초점 함정) |
| 네이티브 셸(상태바·탭바·다이얼로그) | MACAG 2.0 + §2~3 네이티브 API(`contentDescription`/`accessibilityLabel`) |
| 전환 지점 | 화면전환 시 초점 이동(`UIAccessibilityPostNotification`/`sendAccessibilityEvent`) |

## 10. MA 인증 준비 체크리스트
- [ ] 18개 검사항목을 화면별 평가표에 매핑(웹 33항목과 별개)
- [ ] 모든 의미 컴포넌트에 Label(`contentDescription`/`accessibilityLabel`)
- [ ] 초점: 보이는 콘텐츠만·논리 순서·하이라이트 크기, 화면전환 시 초점 이동
- [ ] 복잡 제스처 → 단일 탭 대체(#8)
- [ ] 컨트롤 9mm 이상·충분한 간격(#11)
- [ ] OS 폰트 크기/굵게 반영(sp·Dynamic Type)(#17)
- [ ] 알림은 화면+소리+진동 다중 제공(#6)
- [ ] **TalkBack/VoiceOver 실기기 청취**(심사 기준 TalkBack), 최신 메이저 OS
- [ ] (하이브리드면) WebView 웹 접근성(`kwcag`) + 네이티브 셸 둘 다
