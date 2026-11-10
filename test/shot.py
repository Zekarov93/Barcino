import sys
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1120,'height':560})
    errs=[]
    pg.on('console',lambda m: errs.append(m.text) if m.type in('error','warning') else None)
    pg.on('pageerror',lambda e: errs.append(str(e)))
    pg.goto('file:///home/claude/rpg/test/'+sys.argv[1]);pg.wait_for_timeout(500)
    pg.screenshot(path='/home/claude/rpg/test/'+sys.argv[2]);print(errs[:10]);b.close()
