#!/bin/bash

###############################################
#  AI CODE REPAIR SYSTEM v3 — FULL UPGRADE   #
#  Author: Moksh AI Dev Toolkit               #
###############################################

# Priority order:
# 1. Cohere (command-r)
# 2. Groq (llama-3-70b)
# 3. Emergency local fallback (echo)

FILE="$1"
MODE="${2:-fix}"   # fix | rewrite | audit
MODEL_COHERE="command-r"
MODEL_GROQ="llama3-70b-8192"
OUT_DIR=".ai-fixes"

mkdir -p "$OUT_DIR"

### Helper Functions ###
red(){ echo -e "\033[31m$1\033[0m"; }
green(){ echo -e "\033[32m$1\033[0m"; }
yellow(){ echo -e "\033[33m$1\033[0m"; }
blue(){ echo -e "\033[34m$1\033[0m"; }

###############################################
### PRE-CHECKS
###############################################
if [ -z "$FILE" ]; then
  red "❌ ERROR: No file given."
  echo "Usage: ./repair-ai.sh path/to/file.tsx"
  exit 1
fi

if [ ! -f "$FILE" ]; then
  red "❌ ERROR: File not found: $FILE"
  exit 1
fi

if [ -z "$COHERE_API_KEY" ] && [ -z "$GROQ_API_KEY" ]; then
  red "❌ ERROR: No API keys found."
  echo "Add them to .env.local then run: source .env.local"
  exit 1
fi

###############################################
### BUILD DYNAMIC PROMPT
###############################################
CONTENT=$(cat "$FILE")

read -r -d '' PROMPT <<EOF2
You are an elite senior engineer AI.

TASK MODE: $MODE

PROJECT TYPE:
- Next.js 16 (App Router)
- Server Components + Client Components
- Supabase SSR Auth
- TypeScript strict mode

RULES:
- FIX ALL errors.
- Convert invalid imports to correct ones.
- Respect client/server boundaries.
- Never output markdown.
- Never output explanation.
- Only output final fixed code.

FILE TO REPAIR:
$CONTENT

EOF2

###############################################
### AI CALL: COHERE FIRST
###############################################
call_cohere() {
  curl -s "https://api.cohere.com/v1/chat" \
    -H "Authorization: Bearer $COHERE_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"model\": \"$MODEL_COHERE\",
      \"message\": \"$PROMPT\"
    }" | jq -r '.message'
}

###############################################
### AI CALL: GROQ FALLBACK
###############################################
call_groq() {
  curl -s "https://api.groq.com/openai/v1/chat/completions" \
    -H "Authorization: Bearer $GROQ_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{
      \"model\": \"$MODEL_GROQ\",
      \"messages\": [{\"role\": \"user\", \"content\": \"$PROMPT\"}]
    }" | jq -r '.choices[0].message.content'
}

###############################################
### EXECUTION FLOW
###############################################

OUTPUT="$OUT_DIR/$(basename "$FILE").fixed"

blue "🔧 Repairing: $FILE"

if [ ! -z "$COHERE_API_KEY" ]; then
  yellow "→ Using Cohere (command-r)"
  RESPONSE=$(call_cohere)
fi

if [ -z "$RESPONSE" ] && [ ! -z "$GROQ_API_KEY" ]; then
  yellow "→ Cohere unavailable, using Groq fallback"
  RESPONSE=$(call_groq)
fi

if [ -z "$RESPONSE" ]; then
  yellow "⚠ AI offline, local fallback mode"
  RESPONSE="$CONTENT"
fi

echo "$RESPONSE" > "$OUTPUT"

###############################################
### DIFF REPORT
###############################################
echo ""
blue "📘 DIFF PREVIEW:"
echo "---------------------------------------"
diff --color=always -u "$FILE" "$OUTPUT" || true
echo "---------------------------------------"

###############################################
### NEXT STEPS
###############################################
green "✅ FIXED FILE SAVED → $OUTPUT"

echo ""
yellow "To apply patch:"
echo "cp $OUTPUT $FILE"
