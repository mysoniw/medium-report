# Spring Boot 백엔드 접근성 가이드

접근성은 90%가 프론트지만, **백엔드가 데이터 구조·오류·언어·시간을 어떻게 내려주느냐**가
프론트의 접근성 구현 가능 여부를 좌우한다. Vue SPA + Spring Boot REST 기준.

---

## 1. 응답 데이터 모델에 접근성 필드 내장

이미지/미디어는 **alt·캡션을 데이터의 일부로** 내려준다. 프론트는 없는 정보를 만들 수 없다
(→ KWCAG #1 적절한 대체 텍스트, WCAG 1.1.1).

```java
// 잘못: 프론트가 alt를 지어내야 함 → 위반 양산
public record BadImageDto(String url) {}

// 올바름: 대체텍스트/캡션을 데이터로 보장
public record ImageDto(
    String url,
    String alt,        // 필수: 정보성 이미지의 의미 (장식이면 "")
    boolean decorative, // 장식 여부 → 프론트 alt="" 처리
    String caption     // 선택: figure 캡션
) {}

// 미디어
public record MediaDto(
    String src,
    String captionsVttUrl,  // 자막 트랙(WebVTT) → KWCAG #2 자막 제공
    String transcriptUrl    // 대본
) {}
```

> 업로드 API에서 **alt 입력을 필수 검증**으로 강제하면 콘텐츠 단계에서 누락을 차단할 수 있다.
> ```java
> public record ImageUploadReq(@NotNull MultipartFile file,
>     @NotBlank(message = "대체텍스트(alt)는 필수입니다") String alt,
>     boolean decorative) {}
> ```
> (`decorative=true`면 alt 공백 허용하도록 그룹 검증/커스텀 validator 적용)

---

## 2. 구조화된 검증 오류 응답 (폼 접근성의 핵심)

프론트가 **필드별로 `aria-describedby`·`role=alert`로 연결**하려면, 오류를 **필드 식별자 +
사람이 읽는 메시지** 구조로 내려야 한다 (→ KWCAG #28 오류 정정, WCAG 3.3.1/3.3.3).

```java
@RestControllerAdvice
public class ValidationAdvice {

  public record FieldErrorDto(String field, String message) {}
  public record ErrorResponse(String code, String message, List<FieldErrorDto> errors) {}

  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ErrorResponse onValidation(MethodArgumentNotValidException e, Locale locale) {
    var errors = e.getBindingResult().getFieldErrors().stream()
        .map(fe -> new FieldErrorDto(fe.getField(), fe.getDefaultMessage())) // i18n 메시지
        .toList();
    return new ErrorResponse("VALIDATION_FAILED", "입력값을 확인해주세요.", errors);
  }
}
```
프론트는 `errors[].field`로 해당 input에 매핑 → 첫 오류 필드로 초점 이동 + `role=alert` 발화
(→ `vue-patterns.md` 폼 예제).

```jsonc
// 응답 예
{
  "code": "VALIDATION_FAILED",
  "message": "입력값을 확인해주세요.",
  "errors": [
    { "field": "email", "message": "올바른 이메일 형식을 입력하세요." },
    { "field": "password", "message": "비밀번호는 8자 이상이어야 합니다." }
  ]
}
```

---

## 3. 정확한 HTTP 상태코드

스크린리더 사용자에게 상황을 정확히 안내하려면 상태코드가 정직해야 한다(프론트가 분기).
- `400` 검증 실패, `401` 미인증, `403` 권한없음, `404` 없음, `409` 충돌, `422` 처리불가, `500` 서버오류
- 200에 에러를 담는 안티패턴 금지 → 프론트가 성공으로 오인해 안내 누락.

---

## 4. 언어 / 국제화 (KWCAG #25, WCAG 3.1.1)

```java
@Configuration
public class I18nConfig implements WebMvcConfigurer {
  @Bean
  public LocaleResolver localeResolver() {
    var r = new AcceptHeaderLocaleResolver();
    r.setDefaultLocale(Locale.KOREAN);
    r.setSupportedLocales(List.of(Locale.KOREAN, Locale.ENGLISH));
    return r;
  }
  @Bean
  public MessageSource messageSource() {
    var ms = new ReloadableResourceBundleMessageSource();
    ms.setBasename("classpath:messages");
    ms.setDefaultEncoding("UTF-8");
    return ms;
  }
}
```
- 응답에 `Content-Language` 헤더 설정 → 프론트가 `<html lang>` 동기화.
- 검증 메시지(`messages_ko.properties`)도 i18n으로 → 오류 안내 언어 일관성.

---

## 5. 세션 타임아웃 — 응답시간 조절 (KWCAG #14, WCAG 2.2.1)

시간 제한이 있으면 **연장/경고 수단**을 API로 제공해야 한다. 스크린리더 사용자는 입력이 느려
무경고 만료는 차별이 된다.
```java
@RestController
@RequestMapping("/api/session")
public class SessionController {
  @GetMapping("/remaining")              // 남은 시간 조회 → 프론트가 경고 모달
  public Map<String, Long> remaining(HttpSession s) {
    long elapsed = System.currentTimeMillis() - s.getLastAccessedTime();
    long left = (s.getMaxInactiveInterval() * 1000L) - elapsed;
    return Map.of("remainingMs", Math.max(0, left));
  }
  @PostMapping("/extend")                // 연장
  public void extend(HttpSession s) { s.setMaxInactiveInterval(30 * 60); }
}
```
프론트: 만료 N분 전 `aria-live`/모달로 경고 + "세션 연장" 버튼.

---

## 6. 접근 가능한 인증 (KWCAG #30, WCAG 3.3.8)

- 로그인에서 **인지기능 검사(암기·퍼즐형 CAPTCHA) 강요 금지**. 대안 제공:
  - 비밀번호 **붙여넣기 허용**(자동완성/패스워드 매니저), `autocomplete` 차단 금지.
  - CAPTCHA가 필요하면 reCAPTCHA v3(무마찰) 또는 오디오/대체 수단 동반.
  - 가능하면 **패스키(WebAuthn)·소셜 로그인** 등 인지부하 낮은 수단.
- 백엔드는 자동완성을 막는 `autocomplete=off` 강제나 붙여넣기 차단 스크립트를 내려보내지 말 것.

---

## 7. SSR/SEO가 필요하면 (선택)

순수 Vue SPA는 초기 HTML이 비어 일부 크롤러·구형 보조기술에 불리할 수 있다. 필요 시:
- **Nuxt(Vue SSR)** 또는 Spring + Thymeleaf 하이브리드.
- 최소한 `<title>`·`lang`·랜드마크는 초기 HTML에 포함되게(meta 관리).
- Thymeleaf 사용 시: `th:alt`, `th:lang`, `<th scope>`, 폼 `<label th:for>` 누락 점검.

---

## 8. 보안 헤더와 접근성 충돌 주의
- CSP로 인라인 스크립트를 막을 때 **포커스/aria 동적 처리가 깨지지 않도록** nonce 허용.
- `X-Frame-Options`/iframe 정책이 보조기술 호환 위젯을 차단하지 않는지 확인.

## 백엔드 체크리스트
- [ ] 이미지/미디어 DTO에 `alt`·`decorative`·`captions` 필드, 업로드 시 alt 필수 검증
- [ ] 검증 오류 = `{field, message}` 구조 + i18n 메시지
- [ ] 정직한 HTTP 상태코드(200에 에러 금지)
- [ ] `Content-Language` 헤더 + 메시지 i18n
- [ ] 세션 남은시간/연장 API
- [ ] 인증에서 붙여넣기·자동완성 허용, 인지검사 강요 금지
