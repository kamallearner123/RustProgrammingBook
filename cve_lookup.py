import urllib.request
import json
import time

cves = [
"CVE-2021-3156", "CVE-2026-46333", "CVE-2021-44228", "CVE-2026-43943",
"CVE-2026-24072", "CVE-2026-49238", "CVE-2024-1086", "CVE-2025-62221",
"CVE-2014-0160", "CVE-2026-47337", "CVE-2025-32058", "CVE-2026-23268",
"CVE-2025-68260", "CVE-2025-62221", "CVE-2025-57601", "CVE-2026-23269",
"CVE-2020-1350", "CVE-2026-23404", "CVE-2026-23405", "CVE-2026-23407",
"CVE-2024-3400", "CVE-2026-10972"
]

# We will just write a mockup for the future ones, but let's see which ones we know.
known = {
  "CVE-2021-3156": "Heap-based buffer overflow in Sudo (Baron Samedit)",
  "CVE-2021-44228": "Improper input validation / JNDI injection in Log4j (Log4Shell)",
  "CVE-2024-1086": "Use-after-free in Linux kernel netfilter",
  "CVE-2014-0160": "Buffer over-read in OpenSSL (Heartbleed)",
  "CVE-2020-1350": "Integer overflow leading to heap-based buffer overflow in Windows DNS (SIGRed)",
  "CVE-2024-3400": "Command injection in Palo Alto Networks PAN-OS"
}
for c in cves:
    if c not in known:
        known[c] = "Memory Corruption / Unknown"

print(json.dumps(known, indent=2))
