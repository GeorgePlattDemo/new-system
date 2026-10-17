"""Validate maintained navigation and approved README bytes across the tested owners.
Immutable source links retain their revisions; current main links resolve against
these exact checkouts. This checks destinations, not the truth of every claim.
"""
from pathlib import Path
from urllib.parse import unquote, urlsplit
from html import unescape
import hashlib
import os
import re
import subprocess

SYSTEM = Path(__file__).resolve().parents[1]
ROOTS = {
    'new-system': SYSTEM,
    'store-zero': Path(os.environ.get('STORE_ZERO_ROOT', '/tmp/store-zero-main')).resolve(),
    '3d-solutions-program': Path(os.environ.get('PROGRAM_ROOT', SYSTEM / '.program')).resolve(),
}
FROZEN = {
    'new-system': '1c2926ab094ca3a9a6d1396b749a36c92f819a55',
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

def check(repo, path, target, *, resource=False):
    global checked
    url = urlsplit(unescape(unquote(target)))
    dest = None
    if not url.scheme and not url.netloc:
        if resource and re.search(r'[$<>+{}\\]', url.path):
            return # A computed URL is checked after actual browser navigation.
        if resource and url.path.startswith('/api/'):
            return # Server endpoints are exercised over HTTP by browser acceptance.
        dest = (SYSTEM / 'public' / url.path.lstrip('/')) if resource and url.path.startswith('/') else (path.parent / url.path).resolve() if url.path else path
    elif url.netloc == 'github.com':
        parts = url.path.strip('/').split('/')
        if len(parts) >= 2 and parts[0] == 'GeorgePlattDemo' and parts[1] in ROOTS:
            if len(parts) == 2:
                dest = ROOTS[parts[1]] / 'README.md'
            elif len(parts) >= 5 and parts[2] in {'blob', 'tree'} and parts[3] == 'main':
                dest = ROOTS[parts[1]] / '/'.join(parts[4:])
    if dest is None:
        return # External and immutable sources retain their own identities.
    checked += 1
    if not dest.exists():
        errors.append(f'{repo}/{path.relative_to(ROOTS[repo])}: missing {target}')
    elif url.fragment and dest.suffix in {'.md', '.html'}:
        text = dest.read_text()
        ids = anchors(text) if dest.suffix == '.md' else set(re.findall(r'\bid=["\x27]([^"\x27]+)', text))
        if dest.name == 'README.md':
            ids.add('readme') # GitHub's repository README container.
        if url.fragment not in ids:
            errors.append(f'{repo}/{path.relative_to(ROOTS[repo])}: missing heading {target}')

for repo, root in ROOTS.items():
    readme = (root / 'README.md').read_bytes() # Missing owner checkout is a failure.
    assert hashlib.sha1(f'blob {len(readme)}\0'.encode() + readme).hexdigest() == FROZEN[repo], f'{repo}: root README freeze violated'
    # Tracked paths include current and sealed evidence without walking generated dependencies.
    for name in subprocess.check_output(['git', 'ls-files'], cwd=root, text=True).splitlines():
        path = root / name
        if path.suffix == '.md':
            text = path.read_text()
            for target in re.findall(r'\]\(([^)\s]+)\)', text):
                check(repo, path, target)
        elif repo != 'new-system' or not name.startswith('public/live/') or path.suffix not in {'.html', '.js', '.mjs', '.css'}:
            continue
        else:
            text = path.read_text()
        # Include JavaScript-inserted guide links, raw citations and HTML navigation.
        for target in re.findall(r'https?://[^\s<>"\x27`\\)\]}]+', text):
            check(repo, path, target.rstrip('.,;:'))
        if repo == 'new-system' and name.startswith('public/live/'):
            for target in re.findall(r'\b(?:src|href|data-[\w-]*artifact)\s*=\s*["\x27]([^"\x27]+)', text):
                check(repo, path, target, resource=True)
            for target in re.findall(r'(?:\bfrom\s*|\bimport\s*\(?)["\x27](\.[^"\x27]+)', text):
                check(repo, path, target, resource=True)
if errors:
    raise SystemExit('\n'.join(errors))
print(f'PASS: {checked} current local/cross-repository destinations; all three root READMEs frozen')
