const $=id=>document.getElementById(id),D='\u0001',esc=s=>s.replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])),dc=c=>c===D?'$':c===' '?'␣':c;

// ---------- dataset generators (start) ----------
const DS_DEF={
 dna:{name:'DNA sequence',pat:'GATTACAGATTACA'},
 eng:{name:'English-like text',pat:'pattern matching'},
 bin:{name:'Binary string',pat:'1011010'},
 worst:{name:'Worst-case repetitive',pat:'A'.repeat(49)+'B'},
 file:{name:'Uploaded file',pat:''}};
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const WORDS='the of a algorithm string text pattern search linear time prefix suffix array index window match compare character position data structure efficient fast naive complexity input output length value step loop table result memory sequence cost bound proof example worst case average best shift slide reuse skip read write build scan'.split(' ');
function gen(kind,n,pat){const r=rng(2026);pat=pat||DS_DEF[kind].pat;let text='';
 if(kind==='dna'){const a='ACGT',ch=new Array(n);for(let i=0;i<n;i++)ch[i]=a[Math.floor(r()*4)];
  if(pat.length&&n>=pat.length*8)for(let k=1;k<=5;k++){const at=Math.floor(n*k/6);for(let q=0;q<pat.length;q++)ch[at+q]=pat[q]}
  text=ch.join('')}
 else if(kind==='eng'){const out=[];let len=0,c=0;while(len<n){const w=(++c%40===0)?'pattern matching':WORDS[Math.floor(r()*WORDS.length)];out.push(w);len+=w.length+1}text=out.join(' ').slice(0,n)}
 else if(kind==='bin'){const ch=new Array(n);for(let i=0;i<n;i++)ch[i]=r()<.5?'0':'1';text=ch.join('')}
 else if(kind==='worst'){text='A'.repeat(n)}
 return{text,pat}}
// ---------- dataset generators (end) ----------
let last={z:null,n:null},zS=[],zI=0,nS=[],nI=0,zT=null,nT=null,VT='';
'Z-ALGO'.split('').forEach((c,i)=>{const e=document.createElement('i');e.textContent=c;e.style.animationDelay=i*.25+'s';if(i%2)e.className='z';$('tiles').append(e)});

function zSearch(t,p,rec){const s=p+D+t,n=s.length,m=p.length,z=new Array(n).fill(0),M=[];let L=0,R=0,cmp=0;
 if(rec)rec.push({i:0,L,R,z:z.slice(),cmp,m:`Start: S = pattern + "$" + text, length ${n}. Z[0] is left as 0. Press Next Step to process index 1.`,s});
 for(let i=1;i<n;i++){let k0=0,msg='';if(i<R){z[i]=Math.min(R-i,z[i-L]);k0=z[i]}
  const c0=cmp;while(i+z[i]<n){cmp++;if(s[z[i]]===s[i+z[i]])z[i]++;else break}
  if(i+z[i]>R){L=i;R=i+z[i]}
  if(z[i]===m&&i>m)M.push(i-m-1);
  if(rec){msg=`i = ${i}: `+(k0>0?`inside window, copy Z[${i}] = min(R−i, Z[i−L]) = ${k0}, then extend by comparing. `:`no reusable value, compare from scratch. `)+`${cmp-c0} comparison(s) → Z[${i}] = ${z[i]}.`+(z[i]===m?` Z equals pattern length ${m}: match at text index ${i-m-1}!`:'')+` Window is now [${L}, ${R}).`;rec.push({i,L,R,z:z.slice(),cmp,m:msg,s})}}
 return{z,s,M,cmp}}
function naive(t,p,rec){const n=t.length,m=p.length,M=[];let cmp=0;
 for(let i=0;i+m<=n;i++){let j=0;while(j<m){cmp++;const ok=t[i+j]===p[j];if(rec&&rec.length<4000)rec.push({i,j,ok,cmp,M:M.slice(),m:`Shift ${i}: compare T[${i+j}] = '${dc(t[i+j])}' with P[${j}] = '${dc(p[j])}' → ${ok?'equal':'mismatch, slide pattern right by one'}.`});if(!ok)break;j++}
  if(j===m){M.push(i);if(rec&&rec.length){rec[rec.length-1].m+=' Full match at index '+i+'!';rec[rec.length-1].M=M.slice()}}}
 return{M,cmp}}
function timeIt(fn,size){const reps=Math.max(1,Math.min(20000,Math.floor(2e5/(size+1))));fn();const a=performance.now();for(let r=0;r<reps;r++)fn();return{ms:(performance.now()-a)/reps,reps}}
function inputs(){const t=$('text').value.replace(/\r/g,''),p=$('pat').value;$('msg').textContent='';
 if(!t){$('msg').textContent='Enter some text first.';return null}if(!p){$('msg').textContent='Enter a pattern first.';return null}
 if(p.length>t.length)$('msg').textContent='The pattern is longer than the text, so no match is possible.';return{t,p}}
const card=(v,l)=>`<div><b>${v}</b><span>${l}</span></div>`,f=x=>x<0.001?x.toFixed(5):x.toFixed(4);
function doZ(t,p){const r=zSearch(t,p),tm=timeIt(()=>zSearch(t,p),t.length+p.length);last.z={...r,ms:tm.ms,reps:tm.reps,n:t.length,m:p.length};return last.z}
function doN(t,p){const r=naive(t,p),tm=timeIt(()=>naive(t,p),t.length*p.length);last.n={...r,ms:tm.ms,reps:tm.reps,n:t.length,m:p.length};return last.n}
function show(name,r,t,p){const cov=new Array(t.length).fill(0);r.M.forEach(i=>{for(let k=0;k<p.length;k++)cov[i+k]=1});
 let h='',o=0;const LIM=5000,lim=Math.min(t.length,LIM);for(let i=0;i<lim;i++){if(cov[i]&&!o){h+='<mark>';o=1}if(!cov[i]&&o){h+='</mark>';o=0}h+=esc(t[i])}if(o)h+='</mark>';if(t.length>LIM)h+=esc('\n... showing the first '+LIM+' of '+t.length+' characters; all matches are still counted below.');$('hl').innerHTML=h;
 $('simst').innerHTML=card(name,'Algorithm used')+card(r.M.length,'Matches')+card(r.M.length?(r.M.slice(0,20).join(', ')+(r.M.length>20?' ... (+'+(r.M.length-20)+' more)':'')):'none','Match positions (0-indexed)')+card(f(r.ms)+' ms','Avg time over '+r.reps+' runs')+card(r.cmp,'Character comparisons')}
function ztab(){const r=last.z;if(!r)return;const s=r.s,m=r.m;let a='',b='',c='';const cap=Math.min(s.length,300);
 for(let i=0;i<cap;i++){const hit=r.z[i]===m&&i>m;a+=`<span class="c s">${i}</span>`;b+=`<span class="c ${s[i]===D?'dl':''}">${esc(dc(s[i]))}</span>`;c+=`<span class="c ${hit?'hit':''}">${r.z[i]}</span>`}
 $('ztab').innerHTML=`<div class="ln"><em>Index</em>${a}</div><div class="ln"><em>Char</em>${b}</div><div class="ln"><em>Z-value</em>${c}</div>`+(s.length>cap?`<p class="note">Showing first ${cap} of ${s.length} positions.</p>`:'')}
function dash(){const z=last.z,n=last.n;const r=z||n;if(!r)return;
 let h=card(r.n,'Text length (n)')+card(r.m,'Pattern length (m)')+card(r.M.length,'Matches')+card(r.M.length?r.M.slice(0,12).join(', ')+(r.M.length>12?'…':''):'none','Match positions');
 h+=card(z?f(z.ms)+' ms':'not run','Z time')+card(n?f(n.ms)+' ms':'not run','Naïve time')+card(z?z.cmp:'—','Z comparisons')+card(n?n.cmp:'—','Naïve comparisons');
 if(z&&n){const cd=n.cmp-z.cmp;h+=card(cd>=0?Math.round(cd/Math.max(n.cmp,1)*100)+'% fewer':Math.round(-cd/Math.max(n.cmp,1)*100)+'% more','Z comparisons vs Naïve')+card(z.ms>0&&n.ms>0?(n.ms/z.ms).toFixed(2)+'×':'—','Naïve time ÷ Z time')}
 h+=card('O(n + m)','Z complexity')+card('O(nm) worst','Naïve complexity');$('dash').innerHTML=h;
 if(z&&n){bars('c1',[['Z',z.ms,'#8b5cf6'],['Naïve',n.ms,'#3b82f6']],f);bars('c2',[['Z',z.cmp,'#8b5cf6'],['Naïve',n.cmp,'#3b82f6']],x=>x);growth();
  $('explain').textContent=`On this input the Z-Algorithm used ${z.cmp} comparisons and the Naïve algorithm used ${n.cmp}. Both found ${z.M.length} match(es). Naïve's cost only approaches n×m when the text and pattern share long repeated prefixes; on ordinary text it often behaves close to linear, and Z's extra work of building an array for a short input can make it slower in time. The guarantee of O(n + m) matters most on repetitive input.`}}
function bars(id,d,fm){const mx=Math.max(...d.map(x=>x[1]),1e-9);let h='<line x1="20" y1="140" x2="290" y2="140" stroke="#556" />';
 d.forEach((x,i)=>{const bh=Math.max(2,x[1]/mx*105),bx=50+i*115;h+=`<rect x="${bx}" y="${140-bh}" width="70" height="${bh}" rx="8" fill="${x[2]}"><animate attributeName="height" from="0" to="${bh}" dur=".6s"/><animate attributeName="y" from="140" to="${140-bh}" dur=".6s"/></rect><text x="${bx+35}" y="${132-bh}" text-anchor="middle">${fm(x[1])}</text><text x="${bx+35}" y="158" text-anchor="middle">${x[0]}</text>`});$(id).innerHTML=h}
function growth(){const t=$('text').value.replace(/\r/g,''),p=$('pat').value,N=t.length,pts=[];
 for(let k=1;k<=8;k++){const n=Math.max(p.length,Math.round(N*k/8)),s=t.slice(0,n);pts.push([n,zSearch(s,p).cmp,naive(s,p).cmp])}
 const mx=Math.max(...pts.map(x=>Math.max(x[1],x[2])),1),mn=pts[0][0],mxn=pts[7][0],X=n=>50+(mxn===mn?0:(n-mn)/(mxn-mn))*560,Y=v=>180-v/mx*150;
 let h='<line x1="50" y1="180" x2="620" y2="180" stroke="#556"/><line x1="50" y1="20" x2="50" y2="180" stroke="#556"/>';
 [[1,'#8b5cf6','Z'],[2,'#3b82f6','Naïve']].forEach(([k,c,nm])=>{h+=`<polyline fill="none" stroke="${c}" stroke-width="3" points="${pts.map(x=>X(x[0])+','+Y(x[k])).join(' ')}"/>`+pts.map(x=>`<circle cx="${X(x[0])}" cy="${Y(x[k])}" r="3.5" fill="${c}"/>`).join('')+`<text x="${X(mxn)-4}" y="${Y(pts[7][k])-8}" text-anchor="end" style="fill:${c}">${nm} ${pts[7][k]}</text>`});
 h+=`<text x="50" y="200">n = ${mn}</text><text x="620" y="200" text-anchor="end">n = ${mxn}</text><text x="6" y="16">${mx}</text>`;$('c3').innerHTML=h}

$('bz').onclick=()=>{const i=inputs();if(!i)return;show('Z-Algorithm',doZ(i.t,i.p),i.t,i.p);ztab();dash();build()};
$('bn').onclick=()=>{const i=inputs();if(!i)return;show('Naïve',doN(i.t,i.p),i.t,i.p);dash();build()};
$('bc').onclick=()=>{const i=inputs();if(!i)return;const a=doZ(i.t,i.p);doN(i.t,i.p);show('Z-Algorithm + Naïve',{...a,cmp:a.cmp+' (Z) / '+last.n.cmp+' (Naïve)',ms:a.ms},i.t,i.p);$('simst').children[3].innerHTML=`<b>${f(a.ms)} / ${f(last.n.ms)} ms</b><span>Z / Naïve avg time</span>`;ztab();dash();build();$('comparison').scrollIntoView()};
$('bx').onclick=()=>{$('text').value='';$('pat').value='';$('hl').textContent='Run an algorithm to see highlighted matches.';$('simst').innerHTML='';$('msg').textContent='';};

function cells(str,cls){return[...str].map((c,i)=>`<span class="c ${cls(i,c)}">${esc(dc(c))}</span>`).join('')}
function zRender(){const st=zS[zI];if(!st)return;const s=st.s,m=$('pat').value.length,cur=st.i;
 let a='',b='',c='';for(let i=0;i<s.length;i++){const hit=i<=cur&&st.z[i]===m&&i>m,k=hit?'zm':i===cur&&zI>0?'cur':i>=st.L&&i<st.R&&zI>0?'win':s[i]===D?'dl':'';
  a+=`<span class="c s">${i}</span>`;b+=`<span class="c ${k}">${esc(dc(s[i]))}</span>`;c+=`<span class="c ${hit?'hit':''}">${i===0?0:i<=cur&&zI>0?st.z[i]:'·'}</span>`}
 $('zv').innerHTML=`<div class="ln"><em>Index</em>${a}</div><div class="ln"><em>Combined</em>${b}</div><div class="ln"><em>Z-array</em>${c}</div>`;
 const mt=[];for(let i=m+1;i<=cur;i++)if(st.z[i]===m)mt.push(i-m-1);
 $('zst').innerHTML=card(zI>0?cur:'—','Current index i')+card(`[${st.L}, ${st.R})`,'Window [L, R)')+card(st.cmp,'Comparisons so far')+card(mt.length?mt.join(', '):'none yet','Detected positions');
 $('zex').textContent=st.m;$('zcap').textContent=`Step ${zI} of ${zS.length-1}`+VT}
function nRender(){const st=nS[nI];if(!st){$('nv').innerHTML='';$('nst').innerHTML='';$('nex').textContent=$('pat').value.length>$('text').value.length?'The pattern is longer than the text, so there is nothing to slide.':'';return}
 const t=$('text').value.replace(/\r/g,'').slice(0,60),p=$('pat').value,cov=new Array(t.length).fill(0);st.M.forEach(i=>{for(let k=0;k<p.length;k++)cov[i+k]=1});
 const tc=cells(t,(i)=>i===st.i+st.j?(st.ok?'ok':'bad'):cov[i]?'hit':''),pc=cells(p,(j)=>j<st.j?'ok':j===st.j?(st.ok?'ok':'bad'):'');
 $('nv').innerHTML=`<div class="ln"><em>Text</em>${tc}</div><div class="ln"><em>Pattern</em><span style="display:inline-block;width:${st.i*32}px;flex:none"></span>${pc}</div>`;
 $('nst').innerHTML=card(st.i,'Shift')+card(`T[${st.i+st.j}] vs P[${st.j}]`,'Comparing')+card(st.cmp,'Comparisons so far')+card(st.M.length?st.M.join(', '):'none yet','Matches found');$('nex').textContent=st.m}
function build(){pauseAll();const t=$('text').value.replace(/\r/g,''),p=$('pat').value;zS=[];nS=[];zI=nI=0;VT=t.length>60?' (visualizers use the first 60 characters of the text)':'';
 if(t&&p){const tv=t.slice(0,60);zSearch(tv,p,zS);naive(tv,p,nS)}zRender();nRender()}
function pauseAll(){clearInterval(zT);clearInterval(nT)}
$('zn').onclick=()=>{if(zI<zS.length-1){zI++;zRender()}};$('zp').onclick=()=>{if(zI>0){zI--;zRender()}};$('zr').onclick=()=>{clearInterval(zT);zI=0;zRender()};$('zpa').onclick=()=>clearInterval(zT);
$('zpl').onclick=()=>{clearInterval(zT);if(zI>=zS.length-1)zI=0;zT=setInterval(()=>{if(zI<zS.length-1){zI++;zRender()}else clearInterval(zT)},800)};
$('nn').onclick=()=>{if(nI<nS.length-1){nI++;nRender()}};$('np').onclick=()=>{if(nI>0){nI--;nRender()}};$('nr').onclick=()=>{clearInterval(nT);nI=0;nRender()};$('npa').onclick=()=>clearInterval(nT);
$('npl').onclick=()=>{clearInterval(nT);if(nI>=nS.length-1)nI=0;nT=setInterval(()=>{if(nI<nS.length-1){nI++;nRender()}else clearInterval(nT)},450)};
$('text').oninput=$('pat').oninput=()=>{clearTimeout(window.dbt);window.dbt=setTimeout(build,300)};
document.querySelectorAll('[data-copy]').forEach(b=>b.onclick=()=>{const tx=$(b.dataset.copy).textContent,ok=()=>{b.textContent='Copied';setTimeout(()=>b.textContent='Copy Code',1500)};
 const fb=()=>{const a=document.createElement('textarea');a.value=tx;document.body.append(a);a.select();try{document.execCommand('copy');ok()}catch(e){b.textContent='Select and copy manually'}a.remove()};
 navigator.clipboard?navigator.clipboard.writeText(tx).then(ok,fb):fb()});

// ---------- Dataset benchmark UI ----------
let dsCur=null;
const dsMsg=t=>{$('dsMsg').textContent=t};
const kfmt=x=>Number(x).toLocaleString('en-US');
function dsGet(){dsMsg('');const kind=$('dsSel').value,pat=$('dsPat').value;
 if(!pat){dsMsg('Enter a pattern first.');return null}
 if(kind==='file'){if(!dsCur||!dsCur.text.length){dsMsg('Choose a non-empty file first.');return null}return{kind,name:dsCur.name,text:dsCur.text,pat}}
 const g=gen(kind,+$('dsSize').value,pat);return{kind,name:DS_DEF[kind].name,text:g.text,pat}}
function dsShow(ds){const t=ds.text;
 $('dsInfo').innerHTML=card(ds.name,'Dataset')+card(kfmt(t.length),'Text length (n)')+card(new Set(t).size,'Alphabet size')+card(ds.pat.length,'Pattern length (m)')+card(esc(ds.pat.length>24?ds.pat.slice(0,24)+'...':ds.pat),'Pattern');
 $('dsPrev').textContent=t.slice(0,300)+(t.length>300?' ...':'');
 if(ds.pat.length>t.length)dsMsg('The pattern is longer than the dataset, so no match is possible.')}
function table(head,rows){return'<div class="tw"><table class="tbl"><thead><tr>'+head.map(x=>`<th>${x}</th>`).join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+r.map(x=>`<td>${x}</td>`).join('')+'</tr>').join('')+'</tbody></table></div>'}
function benchRow(s,p){const zr=zSearch(s,p),nr=naive(s,p),zt=timeIt(()=>zSearch(s,p),s.length+p.length),nt=timeIt(()=>naive(s,p),s.length*p.length);
 return{n:s.length,m:p.length,k:zr.M.length,zc:zr.cmp,nc:nr.cmp,zm:zt.ms,nm:nt.ms,ok:zr.M.join()===nr.M.join()}}
const agree=ok=>ok?'<span class="yes">yes</span>':'<span class="no">NO</span>';
function lineChart(id,xs,series,fm){const mx=Math.max(...series.flatMap(s=>s.v),1e-9),x0=xs[0],x1=xs[xs.length-1],X=v=>55+(x1===x0?0:(v-x0)/(x1-x0))*555,Y=v=>180-v/mx*150;
 let h='<line x1="55" y1="180" x2="620" y2="180" stroke="#556"/><line x1="55" y1="20" x2="55" y2="180" stroke="#556"/>';
 series.forEach((s,k)=>{h+=`<polyline fill="none" stroke="${s.c}" stroke-width="3" points="${s.v.map((v,i)=>X(xs[i])+','+Y(v)).join(' ')}"/>`+s.v.map((v,i)=>`<circle cx="${X(xs[i])}" cy="${Y(v)}" r="3.5" fill="${s.c}"/>`).join('')+`<text x="${X(x1)-4}" y="${Y(s.v[s.v.length-1])+(k?16:-8)}" text-anchor="end" style="fill:${s.c}">${s.n} ${fm(s.v[s.v.length-1])}</text>`});
 h+=`<text x="55" y="200">n = ${kfmt(x0)}</text><text x="620" y="200" text-anchor="end">n = ${kfmt(x1)}</text><text x="4" y="14">${fm(mx)}</text>`;$(id).innerHTML=h}
function later(fn){dsMsg('Running... large datasets can take a moment.');setTimeout(()=>{try{fn()}catch(e){dsMsg('Something went wrong: '+e.message)}},40)}

$('dsSel').onchange=()=>{const k=$('dsSel').value;$('dsFileRow').hidden=k!=='file';if(k!=='file')$('dsPat').value=DS_DEF[k].pat;$('dsSize').disabled=k==='file';dsMsg('');$('dsOut').innerHTML=''};
$('dsFile').onchange=e=>{const fl=e.target.files[0];if(!fl)return;if(fl.size>2e6){dsMsg('That file is larger than 2 MB. Please choose a smaller one.');return}
 const rd=new FileReader();rd.onload=()=>{dsCur={kind:'file',name:fl.name,text:String(rd.result).replace(/\r/g,'')};dsMsg(`Loaded ${fl.name}: ${kfmt(dsCur.text.length)} characters. Enter a pattern, then generate or run.`);dsShow({...dsCur,pat:$('dsPat').value})};
 rd.onerror=()=>dsMsg('Could not read that file.');rd.readAsText(fl)};
$('dsGen').onclick=()=>{const ds=dsGet();if(ds)dsShow(ds)};
$('dsLoad').onclick=()=>{const ds=dsGet();if(!ds)return;dsShow(ds);$('text').value=ds.text;$('pat').value=ds.pat;build();dsMsg(`Loaded ${kfmt(ds.text.length)} characters into the simulator and ran both algorithms. Results are in the Comparison section.`);$('bc').click()};
$('dsBench').onclick=()=>{const ds=dsGet();if(!ds)return;dsShow(ds);if(ds.pat.length>ds.text.length)return;
 later(()=>{const fr=[1/16,1/8,1/4,1/2,1],rows=fr.map(f=>benchRow(ds.text.slice(0,Math.max(ds.pat.length,Math.round(ds.text.length*f))),ds.pat)),xs=rows.map(r=>r.n);
  $('dsOut').innerHTML='<h3>Benchmark on growing prefixes of '+esc(ds.name)+'</h3>'+table(['n','Matches','Z comparisons','Naïve comparisons','Z time (ms)','Naïve time (ms)','Same matches?'],rows.map(r=>[kfmt(r.n),kfmt(r.k),kfmt(r.zc),kfmt(r.nc),f(r.zm),f(r.nm),agree(r.ok)]))+
   '<div class="grid"><div><h3>Comparisons vs n</h3><svg id="dsc1" viewBox="0 0 640 220" width="100%"></svg></div><div><h3>Time (ms) vs n</h3><svg id="dsc2" viewBox="0 0 640 220" width="100%"></svg></div></div>'+
   `<p class="note">The Z-Algorithm's comparisons grow in proportion to n + m. The Naïve algorithm's cost depends on how often the pattern's first characters match, so it stays close to n on random text and approaches n × m on repetitive text. Times are averages over repeated runs of your browser's JavaScript, so they vary a little between runs.</p>`;
  lineChart('dsc1',xs,[{n:'Z',c:'#8b5cf6',v:rows.map(r=>r.zc)},{n:'Naïve',c:'#3b82f6',v:rows.map(r=>r.nc)}],kfmt);
  lineChart('dsc2',xs,[{n:'Z',c:'#8b5cf6',v:rows.map(r=>r.zm)},{n:'Naïve',c:'#3b82f6',v:rows.map(r=>r.nm)}],f);dsMsg('')})};
$('dsAll').onclick=()=>{const n=+$('dsSize').value;
 later(()=>{const rows=['dna','eng','bin','worst'].map(k=>({k,name:DS_DEF[k].name,...benchRow(...(g=>[g.text,g.pat])(gen(k,n)))}));
  const best=rows.reduce((a,b)=>b.nc/Math.max(b.zc,1)>a.nc/Math.max(a.zc,1)?b:a);
  $('dsOut').innerHTML=`<h3>All built-in datasets at n = ${kfmt(n)}</h3>`+table(['Dataset','m','Matches','Z comparisons','Naïve comparisons','Naïve ÷ Z comparisons','Z time (ms)','Naïve time (ms)','Same matches?'],rows.map(r=>[r.name,r.m,kfmt(r.k),kfmt(r.zc),kfmt(r.nc),(r.nc/Math.max(r.zc,1)).toFixed(2)+'×',f(r.zm),f(r.nm),agree(r.ok)]))+
   `<p class="note">Largest gap on this run: <b>${esc(best.name)}</b>, where the Naïve algorithm used ${(best.nc/Math.max(best.zc,1)).toFixed(2)}× as many comparisons as the Z-Algorithm. Both algorithms must report identical match positions on every dataset; the last column checks that.</p>`;dsMsg('')})};

build();
