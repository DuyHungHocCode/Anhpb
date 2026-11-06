#!/bin/bash

set -euo pipefail

PAGE="$(cd "$(dirname "$0")/.." && pwd)/src/app/page.tsx"

test "$(grep -c 'className={`envelope' "$PAGE")" -eq 2
grep -Fq 'Gửi Phương Anh' "$PAGE"
grep -Fq 'Một lời cảm ơn' "$PAGE"

echo "letter envelope markup tests passed"
