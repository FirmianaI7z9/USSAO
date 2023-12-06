const c={ma:['JMO','JJMO','IMO','EGMO','APMO'],ph:['JPhO','IPhO','APhO'],ch:['JChO','IChO'],bi:['JBO','IBO'],ea:['JESO','IESO'],in:['JOI','JOIG','IOI','EGOI','APIO'],ka:['科甲','科甲Jr','SO'],la:['JOL','IOL','APLO'],as:['JAO','IOAA'],ge:['JGeO','iGeO'],ps:['JPO','IPO'],ec:['JEO','IEO'],ba:['JBB','IBB']};

function gen(g){
  var a=c[g.value];
  var i=document.getElementsByName('st2');
  i.forEach(j=>{if(a.indexOf(j.value)!=-1){j.checked = g.checked;}});
}

function cha(){
  var p=document.title;
  var k='',h1='',h2='_',b='';
  switch(p){
    case '学術オリンピック非公式まとめサイト | 検索機能テストページ':
    case '学術オリンピック非公式まとめサイト | カレンダー(簡易)':
      k='a';h1='\">';b='</th>';break;
    case '学術オリンピック非公式まとめサイト | カレンダー':
      k='i';h1='.html\">';b=' ';break;
    case '学術オリンピック非公式まとめサイト | スケジュール':
      k='si';h1='<span class=\"sl\">';h2=' ';b=' ';break;
  }
  var c=document.getElementsByName('st2');
  var l=[];
  c.forEach(d=>{if(d.checked){l.push(d.value);}});
  var i=document.getElementsByName(k);
  i.forEach(j=>{for(let m=0;m<l.length;m++){if(j.innerHTML.indexOf(h1+l[m]+b)!=-1 || j.innerHTML.indexOf(h2+l[m]+b)!=-1){j.style='';break;}if(m+1==l.length){j.style='display:none;';}}if(l.length==0){j.style='display:none;';}});
}