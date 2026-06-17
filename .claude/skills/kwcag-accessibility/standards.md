# 국내외 접근성 표준 · 인증 절차 (2026.06 기준)

> 모든 수치/제도는 변동되므로, 인증 제출 전 각 기관 공지로 **최신 확인** 필수.
> 출처는 문서 하단 참조.

---

## 1. 표준 지형 한눈에

| 구분 | 표준 | 버전/근거 | 비고 |
|------|------|-----------|------|
| 국내 지침 | **KWCAG** (한국형 웹 콘텐츠 접근성 지침) | 2.2 = KS X OT0003 / TTAK.OT-10.0003/R2 (4원칙·14지침·33항목) | 최신은 2.2, **법정 인증 심사는 아직 2.1(24항목)** |
| 국내 법 | 장애인차별금지법, 지능정보화기본법, 전자정부법 | 공공+일정규모 민간 의무 | 미준수 시 차별 진정 대상 |
| 국제 | **WCAG** (W3C) | 2.2 (2023.10 권고), Level A/AA/AAA | 전 세계 사실상 표준, **AA가 기준선** |
| 미국 | Section 508 / ADA | WCAG 2.0/2.1 AA 참조 | 연방·민간 |
| 유럽 | **EN 301 549 / EAA** | v3.2.1(WCAG 2.1 AA), EAA 2025.6.28 시행 | v4.1.1(2026, WCAG 2.2 반영) 예정 |

**전략적 결론**: **WCAG 2.2 Level AA**를 목표로 구현하면 KWCAG·EN 301 549·Section 508을
대부분 동시 충족한다. KWCAG는 WCAG 기반으로 만들어졌고 모바일 항목이 일부 더 구체적이다.

---

## 2. 국내 인증 — 웹 접근성 품질마크(WA) / 정보통신접근성 인증

### 2-1. 제도
- **명칭**: 과학기술정보통신부 지정 **웹 접근성 품질마크**(통칭 WA 인증마크).
- **법적 근거**: 지능정보화기본법(구 국가정보화기본법)에 따른 정보접근성 인증제.
- **유효기간**: 보통 **1년**, 만료 시 갱신 심사.
- **심사 기준**: 현행 **KWCAG 2.1**(향후 2.2 전환 가능 — 신청 시점 기준 확인).

### 2-2. 지정 인증기관 (3개소)
1. **(사)한국장애인단체총연합회 한국웹접근성인증평가원** — wa.or.kr
2. **㈜웹와치(WebWatch)** — webwatch.or.kr
3. **한국시각장애인연합회(한국디지털접근성진흥원, KWACC)** — kwacc.or.kr

> 대상별로 웹(WA)·모바일앱(MA)·SW·키오스크 인증이 분리 운영된다.

### 2-3. 심사 절차 (3단계)
1. **1차 서면(전문가) 심사** — 자동·수동 점검으로 지침 항목 평가.
2. **2차 전문가 심사** — 심층 수동 평가.
3. **3차 사용자 심사** — **실제 장애인 사용자**(시각장애인 등)가 직접 사용성 평가.

→ 자동 도구만으로는 절대 통과 불가. **실사용자 평가**가 결정적이므로 키보드/스크린리더
플로우를 미리 완성해 두어야 한다(→ 본 스킬 cmux 플레이북·`router-focus.md`).

### 2-4. 비용
- 인증기관·**사이트 규모(페이지 수)·유형**에 따라 차등 책정(견적 방식).
- **2025년 3월 1일 접수분부터 수수료가 개정**됨 → 반드시 해당 기관 공지/견적으로 확인.
- 신청 전 각 기관 "심사비용" 페이지에서 규모 구간별 표 확인(wa.or.kr/m1/sub4.asp 등).

---

## 3. 해외 인증/준수

### 3-1. WCAG (국제 기준선)
- **Level AA**가 법적·계약상 사실상 의무선. 시각장애 핵심: 1.1.1(대체텍스트),
  1.4.3(명도대비 4.5:1), 2.1.1(키보드), 2.4.x(내비), 4.1.2(name/role/value).
- 인증서 발급 기관이 따로 정해진 게 아니라 **적합성 선언(Conformance Claim)** + 제3자 감리
  형태가 일반적(VPAT 문서 등).

### 3-2. EU — EAA(European Accessibility Act) + EN 301 549
- **2025년 6월 28일 시행**: 신규 제품·신규 디지털 콘텐츠에 접근성 요건 적용(전자상거래,
  은행, 전자책, 운송, 통신 등 광범위). 위반 시 회원국별 제재.
- **EN 301 549 v3.2.1** = 현행 기술기준, **WCAG 2.1 AA** 정렬(웹 외 SW·문서·하드웨어 포함).
- **EN 301 549 v4.1.1**(2026 예정)에서 **WCAG 2.2 AA** 반영 전망 → 2.2까지 맞추면 선제 대응.

### 3-3. 미국 — Section 508 / ADA
- 연방기관·수급기업은 Section 508(WCAG 2.0/2.1 AA). 민간은 ADA Title III 소송 리스크.

---

## 4. 보조기술(스크린리더) 테스트 매트릭스

인증 전 **실제 보조기술로 청취 테스트**는 필수(자동도구 검출률 30~40%).

| 환경 | 스크린리더 | 비고 |
|------|-----------|------|
| Windows | **NVDA**(무료, 권장), JAWS(유료, 점유율↑) | + Chrome/Firefox 조합 |
| macOS/iOS | **VoiceOver**(내장) | iOS 모바일 검증 필수 |
| Android | **TalkBack**(내장) | 모바일 |
| 국내 | **센스리더**(엔비전스) | 국내 인증 3차 사용자 심사에서 흔히 사용 |

테스트 핵심: ① 마우스 없이 **키보드만**으로 전 기능 ② 스크린리더로 모든 콘텐츠가
의미 있게 읽히는가 ③ 모달·라우팅 후 초점 위치 ④ 폼 오류 안내 발화.

---

## 5. 권장 도구 체인
- **개발 중(정적)**: `eslint-plugin-vuejs-accessibility`, axe-core(`@axe-core/playwright`), Lighthouse.
- **수동/동적**: 본 스킬 `scripts/a11y-audit.js` + cmux 실시간 모니터링, axe DevTools, WAVE.
- **대비 검증**: axe, Colour Contrast Analyser, `@adobe/leonardo-contrast-colors`.
- **국내 특화**: KWCAG A11y Inspector(Chrome 확장), OpenWAX, K-WAH 등.

---

## 6. 인증 준비 로드맵 (요약)
1. 목표 = WCAG 2.2 AA + (제출 시점) KWCAG 기준 버전.
2. 설계 단계부터 접근성 내장(나중 수정은 비용 폭증).
3. CI에 axe + eslint-a11y 자동 게이트.
4. cmux/스크린리더로 동적·맥락 항목 수동 검증.
5. 자체 점검표(`checklist.md` 33항목) 100% 충족 후 인증기관 접수.
6. 1년 주기 갱신 + 신규 기능마다 회귀 점검.

---

## 출처 (Sources)
- [한국디지털접근성진흥원(KWACC) — 인증소개](http://www.kwacc.or.kr/Accessibility/Certification)
- [한국정보접근성인증평가원(wa.or.kr)](https://wa.or.kr/) · [WA 심사비용](https://www.wa.or.kr/m1/sub4.asp)
- [웹와치 인증심사비](https://www.webwatch.or.kr/WA/010401.html?MenuCD=140)
- [문화체육관광부 — 웹 접근성 품질마크 운영정책](https://www.mcst.go.kr/site/s_etc/webAccess/accessibility.jsp)
- [TTA 표준 TTAK.OT-10.0003/R2 (KWCAG 2.2)](https://www.tta.or.kr/data/ttas_view.jsp?pk_num=TTAK.OT-10.0003/R2&rn=1)
- [한국형 웹 콘텐츠 접근성 지침(KWCAG) 2.2](https://a11ykr.github.io/kwcag22/)
- [Web Soul Lab — 웹 접근성 지침 2.2](https://websoul.co.kr/accessibility/WA_guide22.asp)
- [Acquia — European Accessibility Act and EN 301 549](https://www.acquia.com/blog/european-accessibility-act-and-en-301-549-your-complete-compliance-guide)
- [Level Access — EAA Compliance Guide](https://www.levelaccess.com/compliance-overview/european-accessibility-act-eaa/)
- [W3C WCAG 2.2 (참고)](https://www.w3.org/TR/WCAG22/)

> KWCAG 2.2 33개 검사항목의 **공식 번호·문구**는 위 TTA/KWACC 원문(KS X OT0003)으로 최종 대조할 것.
