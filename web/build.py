import glob,os
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
js='\n'.join(open(f,encoding='utf-8').read() for f in sorted(glob.glob(R+'/src/*.js')) if not f.endswith('_test.js'))
t=open(R+'/web/template.html',encoding='utf-8').read().replace('/*CSS*/',open(R+'/web/game.css',encoding='utf-8').read()).replace('/*JS*/',js.replace('</script>','<\\/script>'))
open(R+'/web/index.html','w',encoding='utf-8').write(t);print(len(t))
