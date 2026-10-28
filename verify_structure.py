from pathlib import Path
from urllib.parse import urlsplit
import re

errors = []
checked = 0
for page in Path('.').rglob('*'):
    if page.suffix not in ('.html', '.css'): continue
    content = page.read_text(encoding='utf-8-sig')
    refs = re.findall(r'''(?:href|src)=["']([^"']+)''', content) if page.suffix == '.html' else [m[1] for m in re.findall(r'''url\(\s*(["']?)([^)"']+)\1\s*\)''', content)]
    for ref in refs:
        if ref.startswith(('#', 'http:', 'https:', '//', 'data:', 'mailto:', 'tel:')): continue
        checked += 1
        target = page.parent / urlsplit(ref).path
        if not target.exists(): errors.append(f'{page}: {ref}')
print(f'References checked: {checked}')
print('\n'.join(errors))
print(f'Missing: {len(errors)}')
