#!/bin/bash

# Code Repair Automation Script
# For: Next.js 16 + Supabase + TypeScript projects
# Usage: ./repair.sh [FILE_PATH] [OUTPUT_DIR]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPAIR_PROMPT_FILE="repair-prompt.txt"
TEMP_DIR=".repair-temp"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_DIR="${2:-.repair-output}"

# Functions
print_header() {
    echo -e "${BLUE}======================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}======================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check dependencies
check_dependencies() {
    print_header "Checking Dependencies"
    
    if ! command -v git &> /dev/null; then
        print_error "Git not found. Please install Git."
        exit 1
    fi
    print_success "Git found"
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js not found. Please install Node.js."
        exit 1
    fi
    print_success "Node.js found"
    
    if [ ! -f "$REPAIR_PROMPT_FILE" ]; then
        print_error "Repair prompt file not found: $REPAIR_PROMPT_FILE"
        print_info "Create this file by copying content from prompt-template.md"
        exit 1
    fi
    print_success "Repair prompt file found"
}

# Scan for broken files
scan_for_violations() {
    print_header "Scanning for Violations"
    
    local violations_found=0
    local files_to_check=$(find app lib -name "*.ts" -o -name "*.tsx" 2>/dev/null | grep -v node_modules)
    
    echo "Checking files for common violations..."
    
    # Check for server client in client components
    while IFS= read -r file; do
        if grep -q '"use client"' "$file" && grep -q 'createServerClient' "$file"; then
            print_warning "Client component using createServerClient: $file"
            ((violations_found++))
        fi
        
        if grep -q '"use client"' "$file" && grep -q 'from.*next/headers' "$file"; then
            print_warning "Client component importing from next/headers: $file"
            ((violations_found++))
        fi
        
        if grep -q 'createBrowserClient' "$file" && [ ! -f "app/api"* ] && ! grep -q '"use client"' "$file"; then
            print_warning "Server component using createBrowserClient: $file"
            ((violations_found++))
        fi
    done <<< "$files_to_check"
    
    if [ $violations_found -gt 0 ]; then
        echo ""
        print_warning "Found $violations_found potential violations"
        echo "Run: ./repair.sh [FILE] to fix specific file"
    else
        print_success "No obvious violations detected"
    fi
}

# Extract file info
extract_file_info() {
    local file=$1
    
    if [ ! -f "$file" ]; then
        print_error "File not found: $file"
        exit 1
    fi
    
    local dirname=$(dirname "$file")
    local basename=$(basename "$file")
    
    echo "$file"
}

# Create repair request
create_repair_request() {
    local file=$1
    local output_file=$2
    
    print_header "Creating Repair Request"
    print_info "File: $file"
    print_info "Output: $output_file"
    
    # Create combined prompt + file content
    {
        cat "$REPAIR_PROMPT_FILE"
        echo ""
        echo "---CODE TO REPAIR START---"
        echo "File: $file"
        echo ""
        cat "$file"
        echo ""
        echo "---CODE TO REPAIR END---"
        echo ""
        echo "Please analyze and repair this file."
    } > "$output_file"
    
    print_success "Repair request created"
}

# Prepare batch analysis
batch_analysis() {
    print_header "Batch Analysis Mode"
    
    local pattern=$1
    local batch_file=".repair-batch-${TIMESTAMP}.txt"
    
    echo "Finding files matching: $pattern"
    
    {
        cat "$REPAIR_PROMPT_FILE"
        echo ""
        echo "---BATCH ANALYSIS---"
        
        find . -name "$pattern" -type f ! -path "./node_modules/*" ! -path "./.next/*" | while read file; do
            echo ""
            echo "---FILE: $file---"
            cat "$file"
        done
    } > "$batch_file"
    
    print_success "Batch analysis file created: $batch_file"
    print_info "Paste contents into Perplexity Labs or your LLM"
}

# Generate diff statistics
diff_stats() {
    local file=$1
    
    if [ ! -f "$file" ]; then
        print_error "File not found: $file"
        return
    fi
    
    print_header "Diff Statistics"
    
    local additions=$(grep -c "^+" "$file" || true)
    local deletions=$(grep -c "^-" "$file" || true)
    local total_changes=$((additions + deletions))
    
    echo "Additions: $additions"
    echo "Deletions: $deletions"
    echo "Total changes: $total_changes"
}

# Apply patch
apply_patch() {
    local patch_file=$1
    local target_file=$2
    
    print_header "Applying Patch"
    
    if [ ! -f "$patch_file" ]; then
        print_error "Patch file not found: $patch_file"
        exit 1
    fi
    
    if [ ! -f "$target_file" ]; then
        print_error "Target file not found: $target_file"
        exit 1
    fi
    
    # Backup original
    cp "$target_file" "${target_file}.backup"
    print_success "Backup created: ${target_file}.backup"
    
    # Apply patch
    if patch -p0 < "$patch_file"; then
        print_success "Patch applied successfully"
        
        # Show diff
        echo ""
        print_info "Changes:"
        diff -u "${target_file}.backup" "$target_file" || true
    else
        print_error "Patch application failed"
        print_warning "Restoring backup..."
        mv "${target_file}.backup" "$target_file"
        exit 1
    fi
}

# Verify build
verify_build() {
    print_header "Verifying Build"
    
    if ! command -v npm &> /dev/null; then
        print_warning "npm not found, skipping build verification"
        return
    fi
    
    print_info "Running npm run build..."
    
    if npm run build 2>&1 | tail -20; then
        print_success "Build successful"
    else
        print_error "Build failed - check output above"
        exit 1
    fi
}

# Check for common issues
health_check() {
    print_header "Project Health Check"
    
    local issues=0
    
    # Check for required files
    if [ ! -f "lib/supabaseClient.ts" ]; then
        print_error "Missing: lib/supabaseClient.ts"
        ((issues++))
    else
        print_success "Found: lib/supabaseClient.ts"
    fi
    
    if [ ! -f "lib/supabaseBrowser.ts" ]; then
        print_error "Missing: lib/supabaseBrowser.ts"
        ((issues++))
    else
        print_success "Found: lib/supabaseBrowser.ts"
    fi
    
    if [ ! -f "lib/types.ts" ]; then
        print_warning "Missing: lib/types.ts (generate with: npx supabase gen types)"
        ((issues++))
    else
        print_success "Found: lib/types.ts"
    fi
    
    if [ ! -f ".env.local" ]; then
        print_error "Missing: .env.local"
        ((issues++))
    else
        print_success "Found: .env.local"
    fi
    
    if [ ! -f "tsconfig.json" ]; then
        print_error "Missing: tsconfig.json"
        ((issues++))
    else
        print_success "Found: tsconfig.json"
    fi
    
    echo ""
    if [ $issues -eq 0 ]; then
        print_success "All checks passed"
    else
        print_warning "Found $issues issues - see above"
    fi
}

# Generate report
generate_report() {
    local report_file="${OUTPUT_DIR}/repair-report-${TIMESTAMP}.md"
    
    mkdir -p "$OUTPUT_DIR"
    
    {
        echo "# Code Repair Report"
        echo ""
        echo "Generated: $(date)"
        echo ""
        echo "## Project Info"
        echo "- Directory: $(pwd)"
        echo "- Node: $(node --version 2>/dev/null || echo 'not found')"
        echo "- npm: $(npm --version 2>/dev/null || echo 'not found')"
        echo ""
        echo "## Files Analyzed"
        find app lib -name "*.ts" -o -name "*.tsx" 2>/dev/null | grep -v node_modules | wc -l
        echo ""
        echo "## Violations Found"
        grep -r "createServerClient" app lib --include="*.tsx" | grep '"use client"' | wc -l || echo "0"
        echo ""
        echo "## Next Steps"
        echo "1. Review violations above"
        echo "2. Use repair system to fix violations"
        echo "3. Run: npm run build"
        echo "4. Test in browser"
    } > "$report_file"
    
    print_success "Report saved: $report_file"
}

# Show help
show_help() {
    cat << EOF
${BLUE}Code Repair Tool${NC}
For Next.js 16 + Supabase + TypeScript Projects

Usage:
    ./repair.sh [COMMAND] [OPTIONS]

Commands:
    scan              Scan project for violations
    health            Check project health
    repair FILE       Create repair request for FILE
    batch PATTERN     Create batch analysis for files matching PATTERN
    apply PATCH FILE  Apply patch file to target file
    verify            Run build verification
    report            Generate repair report
    help              Show this help message

Examples:
    ./repair.sh scan
    ./repair.sh health
    ./repair.sh repair app/components/StudentCard.tsx
    ./repair.sh batch "*.tsx"
    ./repair.sh apply fix.patch app/components/StudentCard.tsx
    ./repair.sh verify

Requirements:
    - Git installed
    - Node.js installed
    - repair-prompt.txt in project root
    - .env.local configured

Workflow:
    1. Run: ./repair.sh scan
    2. Run: ./repair.sh repair [FILE]
    3. Paste output to Perplexity Labs or LLM
    4. Get corrected file and patch
    5. Run: ./repair.sh apply [PATCH] [FILE]
    6. Run: ./repair.sh verify

For more info, see: prompt-template.md, implementation-guide.md
EOF
}

# Main script
main() {
    local command=${1:-help}
    
    case $command in
        scan)
            check_dependencies
            scan_for_violations
            ;;
        health)
            health_check
            ;;
        repair)
            check_dependencies
            if [ -z "$2" ]; then
                print_error "Please specify a file"
                show_help
                exit 1
            fi
            mkdir -p "$OUTPUT_DIR"
            create_repair_request "$2" "${OUTPUT_DIR}/repair-request-${TIMESTAMP}.txt"
            print_info "Repair request saved to: ${OUTPUT_DIR}/repair-request-${TIMESTAMP}.txt"
            print_info "Paste contents into Perplexity Labs or your LLM"
            ;;
        batch)
            check_dependencies
            if [ -z "$2" ]; then
                print_error "Please specify a file pattern (e.g., '*.tsx')"
                show_help
                exit 1
            fi
            mkdir -p "$OUTPUT_DIR"
            batch_analysis "$2"
            ;;
        apply)
            if [ -z "$2" ] || [ -z "$3" ]; then
                print_error "Usage: ./repair.sh apply [PATCH_FILE] [TARGET_FILE]"
                exit 1
            fi
            apply_patch "$2" "$3"
            print_info "Run 'npm run build' to verify"
            ;;
        verify)
            verify_build
            ;;
        report)
            mkdir -p "$OUTPUT_DIR"
            generate_report
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $command"
            show_help
            exit 1
            ;;
    esac
}

# Run main
main "$@"
