# Medium Article Pipeline

Medium 아티클을 자동 수집하여 리포트, 오디오 스크립트, TTS 음성으로 변환하고 텔레그램으로 전송하는 팀 기반 파이프라인.

## 파이프라인 구조

```
┌─────────────────────────────────────────────────────────┐
│                    Phase 1: 수집                         │
│                                                         │
│  CMUX Browser → Medium.com → 아티클 목록 추출 (5개)      │
│  출력: [{title, url}, ...]                              │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌──────────────┐┌──────────────┐┌──────────────┐
│  Team #1     ││  Team #2     ││  Team #3~5   │
│  article-1   ││  article-2   ││  (동일 구조)  │
└──────┬───────┘└──────┬───────┘└──────────────┘
       │               │
       ▼               ▼
┌─────────────────────────────────────┐
│          Phase 2: 팀 내부 파이프라인   │
│                                     │
│  ┌─────────────┐                    │
│  │  reporter   │ CMUX 브라우저로     │
│  │             │ 아티클 본문 추출     │
│  │             │ /report 형식 작성   │
│  └──────┬──────┘                    │
│         │ report.md                 │
│         ▼                           │
│  ┌──────────────────┐               │
│  │  audio-scripter  │ 리포트 →      │
│  │                  │ 대화형 스크립트  │
│  │                  │ (호스트+전문가)  │
│  └──────┬───────────┘               │
│         │ audio-script.md           │
│         ▼                           │
│  ┌──────────────┐                   │
│  │  tts-sender  │ 스크립트 → MP3    │
│  │              │ MP3 → 텔레그램    │
│  └──────────────┘                   │
└─────────────────────────────────────┘
```

## 에이전트 역할

| 에이전트 | 입력 | 작업 | 출력 | 도구/스킬 |
|---------|------|------|------|----------|
| **리드** (나) | Medium.com | 아티클 목록 수집, 팀 생성/조율 | 아티클 URL 목록 | CMUX browser, TeamCreate |
| **reporter** | 아티클 URL | 본문 추출 + 리포트 작성 | `{slug}/report.md` | CMUX browser, `/report` 형식 |
| **audio-scripter** | report.md | 대화형 오디오 스크립트 생성 | `{slug}/audio-script.md` | 호스트+전문가 2인 대화 형식 |
| **tts-sender** | audio-script.md | TTS 변환 + 텔레그램 전송 | MP3 + 텔레그램 메시지 | essay-tts, telegram 스킬 |

## 출력 구조

```
/Users/minholee/projects/medium/
├── PIPELINE.md              ← 이 문서
├── index.md                 ← 문서 목록 인덱스
├── index.html               ← 검색 UI
├── {article-slug}/
│   ├── report.md            ← 분석 리포트
│   ├── audio-script.md      ← 대화형 오디오 스크립트
│   └── audio.mp3            ← TTS 음성 파일
└── ...
```

## 실행 방법

```bash
# CMUX에서 팀 모드로 실행 (각 에이전트가 독립 패널로 표시)
cmux claude-teams

# 또는 일반 Claude Code에서 실행
# "Medium 아티클 5개 팀으로 리포트 만들어줘"
```

## 사용 스킬

- **CMUX browser**: 웹 페이지 탐색 및 콘텐츠 추출
- **`/report`**: 아티클 분석 리포트 형식 (`/Users/minholee/projects/medium/.claude/commands/report.md`)
- **essay-tts**: 텍스트 → MP3 변환 (`~/.claude/skills/dangsang-essay/scripts/essay_tts.py`)
- **telegram**: 파일/메시지 텔레그램 전송 (`~/.claude/skills/telegram/scripts/send.py`)
