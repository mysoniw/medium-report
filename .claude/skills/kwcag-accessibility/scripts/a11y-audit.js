/*
 * KWCAG 2.2 / WCAG 2.2 — 브라우저 주입형 접근성 점검 스크립트
 * ---------------------------------------------------------------
 * 용도: cmux 브라우저(또는 Playwright page.evaluate)에 통째로 eval 하여
 *       현재 DOM의 정적 위반을 JSON으로 수집하고, MutationObserver로
 *       동적 변화(모달/라우팅/비동기)를 실시간 감시한다.
 *
 * 사용 (SKILL.md §3 참고):
 *   # 1) 초기 스캔 (이 파일을 통째로 eval → 위반 JSON 반환)
 *   cmux browser --surface <ID> eval "$(cat .claude/skills/kwcag-accessibility/scripts/a11y-audit.js)"
 *
 *   # 2) 이후 상호작용 후 재스캔
 *   cmux browser --surface <ID> eval "JSON.stringify(window.runA11yAudit(), null, 2)"
 *
 *   # 3) 실시간 감시 시작 → 상호작용 → 새 위반 확인
 *   cmux browser --surface <ID> eval "startA11yMonitor()"
 *   cmux browser --surface <ID> eval "document.querySelector('#open-modal').click()"
 *   cmux browser --surface <ID> eval "JSON.stringify(window.__a11yViolations, null, 2)"
 *
 * 주의: 자동 검출은 위반의 30~40%만 잡는다. manual 항목은 cmux 초점/aria-live
 *       점검(SKILL.md §3) + 스크린리더 실청취로 보완할 것.
 */
(function () {
  'use strict';

  var SELECTOR_FOCUSABLE =
    'a[href],button,input,select,textarea,[tabindex]';

  function isVisible(el) {
    if (!el || !(el instanceof Element)) return false;
    var s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return false;
    return el.offsetParent !== null || s.position === 'fixed';
  }

  // 요소의 "접근 가능한 이름" 근사 계산 (aria-label > aria-labelledby > 텍스트 > alt > title)
  function accName(el) {
    var n = el.getAttribute('aria-label');
    if (n && n.trim()) return n.trim();
    var lb = el.getAttribute('aria-labelledby');
    if (lb) {
      var t = lb.split(/\s+/).map(function (id) {
        var r = document.getElementById(id);
        return r ? r.innerText : '';
      }).join(' ').trim();
      if (t) return t;
    }
    if (el.innerText && el.innerText.trim()) return el.innerText.trim();
    var img = el.querySelector && el.querySelector('img[alt]');
    if (img && img.getAttribute('alt').trim()) return img.getAttribute('alt').trim();
    var title = el.getAttribute('title');
    if (title && title.trim()) return title.trim();
    return '';
  }

  function cssPath(el) {
    if (!el || el.nodeType !== 1) return '';
    if (el.id) return '#' + el.id;
    var name = el.tagName.toLowerCase();
    if (el.className && typeof el.className === 'string') {
      name += '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.');
    }
    var p = el.parentElement;
    if (p && p !== document.body) return cssPath(p) + ' > ' + name;
    return name;
  }

  function v(list, kwcag, wcag, severity, el, msg) {
    list.push({
      kwcag: kwcag, wcag: wcag, severity: severity,
      element: el ? cssPath(el) : '(document)',
      snippet: el ? (el.outerHTML || '').slice(0, 120) : '',
      message: msg
    });
  }

  // --- 명도 대비 근사 계산 -------------------------------------------------
  function relLum(rgb) {
    var c = rgb.map(function (x) {
      x /= 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function parseRGB(str) {
    var m = str && str.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    var p = m[1].split(',').map(function (s) { return parseFloat(s); });
    if (p.length >= 4 && p[3] === 0) return null; // 투명 → 배경 상속 위해 null
    return [p[0], p[1], p[2]];
  }
  function effectiveBg(el) {
    var node = el;
    while (node && node !== document.documentElement) {
      var bg = parseRGB(getComputedStyle(node).backgroundColor);
      if (bg) return bg;
      node = node.parentElement;
    }
    return [255, 255, 255];
  }
  function contrastRatio(fg, bg) {
    var l1 = relLum(fg), l2 = relLum(bg);
    var hi = Math.max(l1, l2), lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }

  // --- 메인 감사 -----------------------------------------------------------
  function runA11yAudit() {
    var out = [];

    // 5.1.1 대체 텍스트 — alt 누락
    document.querySelectorAll('img:not([alt])').forEach(function (el) {
      v(out, '5.1.1 적절한 대체 텍스트', '1.1.1', 'critical', el, 'img에 alt 속성이 없습니다. 정보성이면 의미 기술, 장식이면 alt="".');
    });
    // 의미 없는 alt
    document.querySelectorAll('img[alt]').forEach(function (el) {
      var a = el.getAttribute('alt').trim().toLowerCase();
      if (['image', 'img', 'photo', 'picture', '이미지', '사진'].indexOf(a) >= 0) {
        v(out, '5.1.1 적절한 대체 텍스트', '1.1.1', 'serious', el, '대체텍스트가 의미를 전달하지 못합니다: alt="' + a + '"');
      }
    });

    // 레이블 제공 — 폼 입력 라벨 누락
    document.querySelectorAll('input,select,textarea').forEach(function (el) {
      var type = (el.getAttribute('type') || '').toLowerCase();
      if (type === 'hidden' || type === 'submit' || type === 'button') return;
      var labelled = false;
      if (el.id && document.querySelector('label[for="' + CSS.escape(el.id) + '"]')) labelled = true;
      if (el.closest('label')) labelled = true;
      if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) labelled = true;
      if (el.getAttribute('title')) labelled = true;
      if (!labelled) {
        v(out, '레이블 제공', '3.3.2/4.1.2', 'critical', el, '입력 요소에 연결된 레이블이 없습니다(label for / aria-label).');
      }
    });

    // 접근 가능한 이름 — 버튼/링크 빈 이름
    document.querySelectorAll('button,a[href],[role="button"]').forEach(function (el) {
      if (!isVisible(el)) return;
      if (!accName(el)) {
        v(out, '접근 가능한 이름', '4.1.2', 'critical', el, '버튼/링크에 접근 가능한 이름이 없습니다(텍스트 또는 aria-label).');
      }
    });

    // 기본 언어 표시
    if (!document.documentElement.getAttribute('lang')) {
      v(out, '5.x 기본 언어 표시', '3.1.1', 'serious', document.documentElement, '<html>에 lang 속성이 없습니다. lang="ko" 등을 지정하세요.');
    }

    // 제목 제공 — 페이지 title
    if (!document.title || !document.title.trim()) {
      v(out, '제목 제공', '2.4.2', 'serious', null, '문서 <title>이 비어 있습니다. SPA는 라우팅 시 document.title 갱신 필요.');
    }

    // 제목 제공 — h1 존재 / heading 레벨 도약
    if (!document.querySelector('h1')) {
      v(out, '제목 제공', '2.4.6', 'moderate', null, '페이지에 <h1>이 없습니다.');
    }
    var prev = 0;
    document.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(function (h) {
      var lvl = parseInt(h.tagName[1], 10);
      if (prev && lvl > prev + 1) {
        v(out, '콘텐츠의 선형 구조', '1.3.1', 'moderate', h, '제목 레벨이 h' + prev + '에서 h' + lvl + '로 건너뜁니다.');
      }
      prev = lvl;
    });

    // 적절한 링크 텍스트 — 모호한 문구
    document.querySelectorAll('a[href]').forEach(function (el) {
      var t = (accName(el) || '').trim();
      if (['여기', '클릭', '바로가기', '더보기', 'click', 'here', 'more', 'read more'].indexOf(t.toLowerCase()) >= 0) {
        v(out, '적절한 링크 텍스트', '2.4.4', 'moderate', el, '링크 텍스트만으로 목적을 알 수 없습니다: "' + t + '"');
      }
    });

    // 초점/키보드 — 양수 tabindex 안티패턴
    document.querySelectorAll('[tabindex]').forEach(function (el) {
      var ti = parseInt(el.getAttribute('tabindex'), 10);
      if (ti > 0) {
        v(out, '초점 이동과 표시', '2.4.3', 'moderate', el, 'tabindex=' + ti + ' (양수)는 초점 순서를 왜곡합니다. 0 또는 -1 사용.');
      }
    });

    // 키보드 — div/span에 click 핸들러지만 키보드 접근 불가 추정
    document.querySelectorAll('[onclick],[role="button"]').forEach(function (el) {
      var tag = el.tagName.toLowerCase();
      if (tag === 'div' || tag === 'span') {
        var focusable = el.matches(SELECTOR_FOCUSABLE) || el.getAttribute('tabindex') === '0';
        if (!focusable) {
          v(out, '키보드 사용 보장', '2.1.1', 'serious', el, tag + '를 버튼처럼 사용하지만 키보드 초점/조작이 불가합니다. <button> 사용 권장.');
        }
      }
    });

    // 랜드마크 — main 부재
    if (!document.querySelector('main,[role="main"]')) {
      v(out, '콘텐츠의 선형 구조', '1.3.1', 'moderate', null, '<main> 랜드마크가 없습니다.');
    }
    // 스킵 링크 추정
    var first = document.querySelector('a[href^="#"]');
    if (!first || !/본문|바로가기|skip|content/i.test(first.innerText)) {
      v(out, '반복 영역 건너뛰기', '2.4.1', 'minor', null, '"본문 바로가기" 스킵 링크가 없어 보입니다.');
    }

    // 견고성 — 중복 id
    var ids = {};
    document.querySelectorAll('[id]').forEach(function (el) {
      var id = el.id;
      ids[id] = (ids[id] || 0) + 1;
      if (ids[id] === 2) v(out, '마크업 오류 방지', '4.1.1', 'moderate', el, 'id가 중복됩니다: "' + id + '"');
    });

    // 명도 대비 (근사) — 보이는 텍스트 요소 샘플 검사
    var textEls = Array.prototype.slice.call(
      document.querySelectorAll('p,span,a,button,li,td,th,h1,h2,h3,h4,h5,h6,label')
    ).filter(function (el) {
      return isVisible(el) && el.childNodes.length && el.innerText && el.innerText.trim().length > 1;
    }).slice(0, 400); // 과도한 연산 방지
    textEls.forEach(function (el) {
      var st = getComputedStyle(el);
      var fg = parseRGB(st.color);
      if (!fg) return;
      var bg = effectiveBg(el);
      var ratio = contrastRatio(fg, bg);
      var size = parseFloat(st.fontSize);
      var bold = (parseInt(st.fontWeight, 10) || 400) >= 700;
      var large = size >= 24 || (size >= 18.66 && bold); // 큰 텍스트 기준
      var min = large ? 3 : 4.5;
      if (ratio < min) {
        v(out, '텍스트 콘텐츠의 명도 대비', '1.4.3', 'serious', el,
          '명도 대비 ' + ratio.toFixed(2) + ':1 (기준 ' + min + ':1 미달)');
      }
    });

    return {
      url: location.href,
      title: document.title,
      scannedAt: new Date().toISOString(),
      total: out.length,
      bySeverity: out.reduce(function (acc, x) { acc[x.severity] = (acc[x.severity] || 0) + 1; return acc; }, {}),
      violations: out
    };
  }

  // --- 실시간 감시 ---------------------------------------------------------
  function startA11yMonitor() {
    window.__a11yViolations = [];
    if (window.__a11yObserver) window.__a11yObserver.disconnect();
    var seen = {};
    function scanAndAppend() {
      var res = runA11yAudit();
      res.violations.forEach(function (x) {
        var key = x.kwcag + '|' + x.element + '|' + x.message;
        if (!seen[key]) { seen[key] = true; window.__a11yViolations.push(x); }
      });
    }
    scanAndAppend(); // 초기 1회
    var obs = new MutationObserver(function () {
      // DOM 변동 시 디바운스 재스캔 (모달/라우팅/비동기 콘텐츠 검증)
      clearTimeout(window.__a11yTimer);
      window.__a11yTimer = setTimeout(scanAndAppend, 300);
    });
    obs.observe(document.body, { childList: true, subtree: true, attributes: true,
      attributeFilter: ['alt', 'aria-label', 'aria-labelledby', 'role', 'tabindex', 'lang'] });
    window.__a11yObserver = obs;
    return 'a11y monitor started — 상호작용 후 window.__a11yViolations 확인';
  }

  // 전역 노출 + 초기 감사 결과 반환 (cmux eval 시 즉시 JSON 출력)
  window.runA11yAudit = runA11yAudit;
  window.startA11yMonitor = startA11yMonitor;
  return JSON.stringify(runA11yAudit(), null, 2);
})();
