#!/usr/bin/env python3
"""Copy the canonical rails.py into every skill folder.

rails.py is identical across the kit so each skill bundle stays self-contained
and publishable on its own. This is the single source of truth; run after any
edit to it. Verify-only with --check (exit 1 if any copy is stale) for CI.
"""

import filecmp
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "rails.py"
SKILLS = [
    "stripe-stand-up", "stripe-product-to-price", "stripe-tax-ready",
    "stripe-deliver", "stripe-revenue-read",
]


def main():
    check = "--check" in sys.argv
    stale = []
    for name in SKILLS:
        dst = ROOT / name / "rails.py"
        if check:
            if not dst.exists() or not filecmp.cmp(SRC, dst, shallow=False):
                stale.append(name)
        else:
            shutil.copyfile(SRC, dst)
            print(f"synced -> {name}/rails.py")
    if check:
        if stale:
            print("STALE rails.py in: " + ", ".join(stale))
            return 1
        print("all rails.py copies are in sync")
    return 0


if __name__ == "__main__":
    sys.exit(main())
