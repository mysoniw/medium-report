#!/bin/bash
# Medium 블로그 아카이브 검색
# 사용법: ./search.sh [옵션] <검색어>
#   ./search.sh 컨텍스트           # 전문 검색 (본문 내용)
#   ./search.sh -t agentic         # 태그 검색
#   ./search.sh -c AI              # 카테고리 검색
#   ./search.sh -l                 # 전체 목록 보기

MEDIUM_DIR="$(cd "$(dirname "$0")" && pwd)"
INDEX="$MEDIUM_DIR/index.md"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

show_help() {
    echo -e "${BOLD}Medium 블로그 아카이브 검색${NC}"
    echo ""
    echo -e "사용법: ${CYAN}./search.sh [옵션] <검색어>${NC}"
    echo ""
    echo "옵션:"
    echo "  (없음)     전문 검색 (보고서 본문에서 키워드 검색)"
    echo "  -t TAG     태그로 검색"
    echo "  -c CAT     카테고리로 검색"
    echo "  -l         전체 문서 목록"
    echo "  -h         도움말"
    echo ""
    echo "예시:"
    echo "  ./search.sh GSD"
    echo "  ./search.sh -t framework-comparison"
    echo "  ./search.sh -c AI"
}

list_all() {
    echo -e "${BOLD}📚 전체 문서 목록${NC}"
    echo ""
    grep -E '^\| [0-9]' "$INDEX" | while IFS='|' read -r _ num title category tags author date path _; do
        num=$(echo "$num" | xargs)
        title=$(echo "$title" | sed 's/\[//;s/\](.*)//')
        category=$(echo "$category" | xargs)
        tags=$(echo "$tags" | xargs)
        path=$(echo "$path" | sed 's/`//g' | xargs)
        echo -e "${GREEN}[$num]${NC} ${BOLD}$title${NC}"
        echo -e "    카테고리: ${CYAN}$category${NC}"
        echo -e "    태그: ${YELLOW}$tags${NC}"
        echo -e "    경로: $path"
        echo ""
    done
}

search_content() {
    local query="$1"
    echo -e "${BOLD}🔍 전문 검색: \"$query\"${NC}"
    echo ""
    local found=0
    for report in "$MEDIUM_DIR"/*/report.md; do
        [ -f "$report" ] || continue
        local dir=$(basename "$(dirname "$report")")
        local matches=$(grep -ic "$query" "$report" 2>/dev/null)
        if [ "$matches" -gt 0 ]; then
            found=1
            local title=$(head -1 "$report" | sed 's/^# //')
            echo -e "${GREEN}📄 $title${NC}"
            echo -e "   경로: ${dir}/report.md (${matches}건 일치)"
            echo ""
            grep -in --color=never "$query" "$report" | head -5 | while read -r line; do
                echo -e "   ${YELLOW}$line${NC}"
            done
            echo ""
        fi
    done
    if [ "$found" -eq 0 ]; then
        echo -e "${RED}검색 결과 없음${NC}"
    fi
}

search_tag() {
    local query="$1"
    echo -e "${BOLD}🏷️  태그 검색: \"$query\"${NC}"
    echo ""
    grep -i "$query" "$INDEX" | grep '^\|.*#' | while read -r line; do
        echo -e "  ${CYAN}$line${NC}"
    done
}

search_category() {
    local query="$1"
    echo -e "${BOLD}📂 카테고리 검색: \"$query\"${NC}"
    echo ""
    grep -i -A1 "^### .*$query" "$INDEX" | while read -r line; do
        echo -e "  ${CYAN}$line${NC}"
    done
}

# Main
case "${1:-}" in
    -h|--help) show_help ;;
    -l|--list) list_all ;;
    -t) search_tag "${2:?태그를 입력하세요}" ;;
    -c) search_category "${2:?카테고리를 입력하세요}" ;;
    "") show_help ;;
    *) search_content "$1" ;;
esac
