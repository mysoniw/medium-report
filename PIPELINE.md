# Medium Article Pipeline

Medium 아티클을 자동 수집하여 리포트, 오디오 스크립트, TTS 음성으로 변환하고 텔레그램으로 전송하는 팀 기반 파이프라인.

## 스킬 커맨드

```bash
/medium-pipeline                          # Medium.com 메인 페이지 상위 5개
/medium-pipeline 3                        # 상위 3개
/medium-pipeline 5 --topic ai-agents      # Medium 검색 결과에서 5개
/medium-pipeline --url https://medium.com/@user/article  # 특정 URL 1개
/medium-pipeline --narration dialogue     # 대화형 스크립트 (기본: 설명형)
/medium-pipeline --no-audio               # 오디오 생성 생략 (리포트만)
/medium-pipeline --team                   # CMUX 팀 모드 (패널 시각화)
```

## 파이프라인 구조

```
Phase 1: 수집 (리드)
  CMUX Browser → Medium.com → 아티클 목록 추출
  출력: [{title, url}, ...]
       │
Phase 2: 리포트 (reporter × N, 병렬)
  WebFetch/CMUX → 본문 추출 → /report 형식 리포트 작성
  출력: {slug}/report.md
       │
Phase 3: 오디오 스크립트 (scripter, 리포트 완료 후)
  report.md → 설명형 내레이션 스크립트 변환
  출력: {slug}/audio-script.md
       │
Phase 4: TTS + 텔레그램 (tts-sender, 스크립트 완료 후)
  essay-tts → MP3 → telegram 스킬
  출력: {slug}/audio-script.mp3 + 텔레그램 전송
       │
Phase 5: 마무리 (리드)
  index.md/html 업데이트 → git commit + push → GitHub 이슈
```

## 조합하는 스킬

| 스킬 | 위치 | 용도 |
|------|------|------|
| CMUX browser | `~/.claude/skills/cmux/` | 웹 수집 + 본문 추출 |
| `/report` | `./claude/commands/report.md` | 아티클 분석 리포트 형식 |
| essay-tts | `~/.claude/skills/dangsang-essay/scripts/essay_tts.py` | TTS 변환 |
| telegram | `~/.claude/skills/telegram/scripts/send.py` | 텔레그램 전송 |
| TeamCreate/Agent | Claude Code 내장 | 에이전트 팀 구성 |

## 에이전트 역할

| 에이전트 | 입력 | 작업 | 출력 |
|---------|------|------|------|
| **리드** | Medium.com | 수집, 조율, 인덱스 업데이트, git | URL 목록 |
| **reporter** | 아티클 URL | 본문 추출 + /report 리포트 작성 | `report.md` |
| **scripter** | report.md | 설명형 내레이션 스크립트 생성 | `audio-script.md` |
| **tts-sender** | audio-script.md | TTS 변환 + 텔레그램 전송 | MP3 + 전송 |

## 오디오 스크립트 형식

### 설명형 (기본)
1인칭 내레이터가 차분하게 설명하는 해요체. 화자 태그/효과음 태그 없음.

### 대화형 (`--narration dialogue`)
호스트+전문가 2인 대화. `[호스트] (밝게) ...` 형식.

## 출력 구조

```
/Users/minholee/projects/medium/
├── PIPELINE.md              ← 이 문서
├── index.md                 ← 문서 목록 인덱스
├── index.html               ← 검색 UI
├── {article-slug}/
│   ├── report.md            ← 분석 리포트
│   ├── audio-script.md      ← 오디오 스크립트
│   └── audio-script.mp3     ← TTS 음성 파일 (gitignore)
└── ...
```
