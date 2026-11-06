#!/bin/bash

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PAGE="$ROOT/src/app/page.tsx"
CSS="$ROOT/src/app/vintage.css"

grep -Fq 'useState<"one" | "two" | null>(null)' "$PAGE"
grep -Fq 'onClick={() => setOpenEnvelope("one")}' "$PAGE"
grep -Fq 'onClick={() => setOpenEnvelope("two")}' "$PAGE"
grep -Fq 'className="back-to-envelopes"' "$PAGE"
grep -Fq 'Một lời cảm ơn' "$PAGE"
grep -Fq 'aria-hidden={openEnvelope !== "one"}' "$PAGE"
grep -Fq 'aria-hidden={openEnvelope !== "two"}' "$PAGE"
grep -Fq '.letter-stage[data-open="one"] .letter-content .card-one,' "$CSS"
grep -Fq '.letter-stage[data-open="one"] .letter-content .card-two,' "$CSS"
grep -Fq '.letter-stage[data-open="two"] .letter-content .card-thank-you {' "$CSS"
grep -A 3 '^\.letter-card {$' "$CSS" | grep -Fq 'display: none;'
grep -A 5 '^\.letter-stage\[data-open="one"\] .letter-content .card-one,' "$CSS" | grep -Fq 'display: block;'

echo "letter navigation tests passed"
