"""Validate maintained navigation and approved README bytes across the tested owners.
Immutable source links retain their revisions; current main links resolve against
these exact checkouts. This checks destinations, not the truth of every claim.
"""
from pathlib import Path
from urllib.parse import unquote, urlsplit
import hashlib
import os
import re

SYSTEM = Path(__file__).resolve().parents[1]
ROOTS = {
    'new-system': SYSTEM,
    'store-zero': Path(os.environ.get('STORE_ZERO_ROOT', '/tmp/store-zero-main')).resolve(),
    '3d-solutions-program': Path(os.environ.get('PROGRAM_ROOT', SYSTEM / '.program')).resolve(),
}
FROZEN = {
    'new-system': '637ec58ed278ccb201c894a8c7c3715b9d84d075',
    'store-zero': 'f4d4abdf01a78d4cdb180e97b8d04765647ccc02',
    '3d-solutions-program': 'de9a5437c5cb453633eff87b737017aa9ea884de',
}

def anchors(text):
    text = re.sub(r'^```[^\n]*\n.*?^```[^\n]*$', '', text, flags=re.M | re.S)
    counts, result = {}, set()
    for title in re.findall(r'^#{1,6} (.+)$', text, re.M):
        base = re.sub(r'[^\w -]', '', title.lower()).replace(' ', '-')
        n = counts.get(base, 0)
        result.add(base + (f'-{n}' if n else ''))
        counts[base] = n + 1
    return result

errors, checked = [], 0
for repo, root in ROOTS.items():
    readme = (root / 'README.md').read_bytes() # Missing owner checkout is a failure.
    assert hashlib.sha1(f'blob {len(readme)}\0'.encode() + readme).hexdigest() == FROZEN[repo], f'{repo}: root README freeze violated'
    for path in root.rglob('*.md'):
        if any(part in {'.git', 'node_modules', '.output', '.store-zero', '.program'} for part in path.relative_to(root).parts):
            continue
        if 'docs/patents' in str(path) or path.name == 'D001_Project1_Review.md':
            continue # Issued/historical sources have their own immutable custody checks.
        for target in re.findall(r'\]\(([^)\s]+)\)', path.read_text()):
            url = urlsplit(unquote(target))
            dest = None
            if not url.scheme:
                dest = (path.parent / url.path).resolve() if url.path else path
            elif url.netloc == 'github.com':
                parts = url.path.strip('/').split('/')
                if len(parts) >= 5 and parts[0] == 'GeorgePlattDemo' and parts[1] in ROOTS and parts[2:4] == ['blob', 'main']:
                    dest = ROOTS[parts[1]] / '/'.join(parts[4:])
            if dest is None:
                continue
            checked += 1
            if not dest.exists():
                errors.append(f'{repo}/{path.relative_to(root)}: missing {target}')
            elif url.fragment and dest.suffix == '.md' and url.fragment not in anchors(dest.read_text()):
                errors.append(f'{repo}/{path.relative_to(root)}: missing heading {target}')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'PASS: {checked} current local/cross-repository destinations; all three root READMEs frozen')
