# Medium 블로그 분석 프로젝트

## 프로젝트 목적

기술 블로그 URL을 받아 분석·구조화하여 한국어 보고서로 재구성하고, 지식 그래프를 구축한다.

## 디렉토리 구조

```
/Users/minholee/projects/medium/
├── CLAUDE.md              ← 이 파일 (프로젝트 규칙)
├── index.md               ← 문서 목록, 카테고리, 태그 인덱스
├── index.html             ← 태그 클라우드, 검색 UI
├── graph.html             ← 지식 그래프 시각화 (D3.js)
├── .claude/
│   └── commands/
│       └── report.md      ← /report 슬래시 커맨드 (리포트 생성 스킬)
├── {slug}/
│   └── report.md          ← 개별 보고서
└── ...
```

## 핵심 규칙

### 리포트 생성 시 반드시 따를 것

1. **`/report <URL>` 커맨드 사용**: `.claude/commands/report.md`에 정의된 프로세스를 따른다
2. **CMUX 브라우저로 수집**: `cmux browser open-split <URL>`로 아티클 전문 수집
3. **보고서 구조**: 요약 → 상세 내용 → 핵심 인사이트 → **원문 영어 표현 해설** (필수)
4. **메타데이터 필수**: 카테고리, 태그(`#kebab-case`), 키워드, 관련 문서
5. **index.md 3곳 업데이트**: 문서 목록 테이블 + 카테고리 섹션 + 태그 인덱스
6. **index.html articles 배열 업데이트**: `const articles = [...]`에 새 항목 추가 (id, title, description, category, tags, author, date, path, originalUrl, keywords)
6. **폴더 구조**: `{slug}/report.md` — slug는 URL에서 추출

### 영어 원문 뉘앙스 해설

단순 번역이 아니라 아래 4개 카테고리로 분석:
- **핵심 개념어**: 저자가 그 단어를 선택한 이유, 문화적 맥락
- **비유·수사 표현**: 비유의 원천, 한국어 유사 표현 대응
- **업계 전문 용어**: 어떤 분야에서 왜 쓰이는지
- **저자 어투 분석**: 글쓰기 스타일, 수사 패턴, 이전 보고서 저자와 비교

### 지식 그래프용 메타데이터

- 태그: 기존 태그 최대한 재사용 → 문서 간 연결 강화
- 관련 문서: 태그 2개 이상 겹치면 자동 링크
- 키워드: 한국어+영어 혼합, 쉼표 구분
