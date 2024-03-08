var data;
var contest;
var arg = {x:0,y:0};

window.addEventListener('DOMContentLoaded', function() {
  var args = document.getElementById('arg').innerText.split(' ');
  contest = args[0];
  arg.x = parseInt(args[1]);
  arg.y = parseFloat(args[2]);

  function load_file() {
    const promise = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `${contest.toLowerCase()}.json`);
      xhr.addEventListener('load', (f) => resolve(xhr));
      xhr.send();
    });
    return promise;
  }

  load_file().then((xhr) => {
    data = JSON.parse(xhr.response);
    data['item'] = data['item'].sort(function(a, b){
      return (a.year > b.year) ? -1 : 1;
    });
    load(0);
  });
});

function load(index){
  const contest_item_container = document.getElementById('attc');
  var value = '';
    
  if (index == 0) {
    document.getElementById('atti').innerText = "大会ページ";
    value = `<table class="att"><thead><tr><th class="aw10">Contest</th><th class="aw10">Country/Online?</th><th class="aw20">URL</th><th class="aw20">備考</th></tr></thead><tbody>`;
    data['item'].forEach((item) => {
      value += `<tr><th><span class="ico"></span>${contest}${item.year} (#${item.no})</th><td>${item.country}/${item.online ? "オンライン開催" : "現地開催"}</td><td>${item.link != '' ? `<a href="${item.link}"${!item.domestic ? 'target="_blank" rel="noopener noreferrer"' : ''}></a>${item.link}</td>` : ''}<td>${item.info}</td></tr>`
    });
    value += `</tbody></table>`;
  }
  else{
    var pname = new Set();
    data['item'][0]['problemset'].sort((a,b) => {
      return (a.setid < b.setid) ? -1 : 1;
    });
    var set = data['item'][0]['problemset'][index - 1].setname;
    document.getElementById('atti').innerText = set;
    value = `<table class="att"><thead><tr><th class="aw10">Contest</th>`;
    
    data['item'].forEach((item) => {
      item['problemset'].forEach((problemset) => {
        if (problemset.setname == set) {
          problemset['problem'].forEach((problem) => {
            pname.add(problem.problemid);
          });
        }
      });
    });

    var parray = [];
    for (var i of pname) parray.push(i);
    parray.sort((a,b) => parseInt(a) - parseInt(b));

    for (var i of parray) {
      value += `<th class="aw10">${i}</th>`;
    }
    value += `</tr></thead><tbody>`;

    var color = ['808080','00f','00c0c0','008000','c0c000','ff8000','f00','ff80ff','a000a0'];
    var metal = [`border-color:#965c38;background:linear-gradient(to right,#965c38,#ffdac1,#965c38);`,`border-color:#808080;background:linear-gradient(to right,#808080,#fff,#808080);`,`border-color:#ffd700;background:linear-gradient(to right,#ffd700,#fff,#ffd700);`];

    data['item'].forEach((item) => {
      value += `<tr><th><span class="ico"></span>${contest}${item.year} (#${item.no})</th>`;
      item['problemset'].forEach((problemset) => {
        if (problemset.setname == set) {
          var cnt = 0;
          for (var i of parray) {
            var trig = false;
            for (var j = cnt; j < problemset['problem'].length; j++) {
              var problem = problemset['problem'][j];
              if (i == problem.problemid) {
                cnt = j + 1;
                trig = true;
                difficulty = diff(problem.answerrate);
                value += `<td>${difficulty > 0 ? `<span class="dif" style="` + (difficulty < 2700 ? `border-color:#${color[Math.floor(difficulty / 300)]};background:linear-gradient(to top,#${color[Math.floor(difficulty / 300)]} ${difficulty % 300 / 3}%,#0000 ${difficulty % 300 / 3}%) border-box border-box;` : metal[Math.floor((difficulty - 2700) / 300)]) + `"><span style="color:#${difficulty <= 0 ? '000' : color[Math.floor(Math.min(2699, difficulty) / 300)]};">${difficulty > 0 ? difficulty : ''}</span></span><span class="did">Difficulty : ${difficulty}<br>Mean : ${problem.answerrate}%</span>` : ''}<a href="${problem.link}"${problem.domestic ? '' : `target="_blank" rel="noopener noreferrer"`}></a><span class="atx" style="color:#${difficulty <= 0 ? '000;' : color[Math.floor(Math.min(2699, difficulty) / 300)] + ';padding-left:20px;'}">${problem.problemname}</span><span class="rat">${problem.genre}</span></td>`;
                break;
              }
            }
            if (trig == false) {
              value += `<td></td>`;
            }
          }
        }
      });
      value += `</tr>`;
    });
    value += `</tbody></table>`;
  }

  contest_item_container.innerHTML = value;
}

function search(){
  const contest_item_container = document.getElementById('attc');
  var value = '';
  var pset = [];

  data['item'].forEach((item) => {
    item['problemset'].forEach((problemset) => {
      problemset['problem'].forEach((problem) => {
        difficulty = diff(problem.answerrate);
        if (difficulty <= 0) return;
        pset.push({
          pname:problem.problemname,
          contest:`${contest}${item.year} (#${item.no})`,
          difficulty:difficulty,
          ansrate:problem.answerrate,
          setname:problemset.setname,
          link:problem.link,
          domestic:problem.domestic,
          genre:problem.genre
        });
      });
    });
  });

  pset.sort((a,b) => {
    return (a.difficulty < b.difficulty) ? -1 : 1;
  });

  document.getElementById('atti').innerText = "問題リスト";
  value = `<p>注：現状Diffの決まっていない問題は表示していません。</p><table class="att"><thead><tr><th class="aw20">問題</th><th class="aw20">大会</th><th class="aw10">問題種</th><th class="aw10">ジャンル</th><th class="aw10">Difficulty</th><th class="aw10">平均得点率</th></tr></thead><tbody>`;

  var color = ['808080','0000ff','00c0c0','008000','c0c000','ff8000','ff0000','ff80ff','a000a0'];
  var metal = [`border-color:#965c38;background:linear-gradient(to right,#965c38,#ffdac1,#965c38);`,`border-color:#808080;background:linear-gradient(to right,#808080,#fff,#808080);`,`border-color:#ffd700;background:linear-gradient(to right,#ffd700,#fff,#ffd700);`];
  var metal2 = [`,linear-gradient(to top,#965c3880,#ffdac180,#965c3880);border-color:#965c3880;`,`,linear-gradient(to top,#80808080,#ffffff80,#80808080);border-color:#80808080;`,`,linear-gradient(to top,#ffd70080,#ffffff80,#ffd70080);border-color:#ffd70080;`];

  pset.forEach((item) => {
    value += `<tr><td>${item.difficulty > 0 ? `<p class="dif" style="` + (item.difficulty < 2700 ? `border-color:#${color[Math.floor(item.difficulty / 300)]};background:linear-gradient(to top,#${color[Math.floor(item.difficulty / 300)]} ${item.difficulty % 300 / 3}%,#0000 ${item.difficulty % 300 / 3}%) border-box border-box;` : metal[Math.floor((item.difficulty - 2700) / 300)]) + `"><span style="color:#${item.difficulty == 0 ? '000' : color[Math.floor(Math.min(2699, item.difficulty) / 300)]};">${item.difficulty}</span></p><span class="did">Difficulty : ${item.difficulty}<br>Mean : ${item.ansrate}%</span>` : ''}<a href="${item.link}"${item.domestic ? '' : `target="_blank" rel="noopener noreferrer"`}></a><span class="atx" style="color:#${item.difficulty == 0 ? '000;' : color[Math.floor(Math.min(2699, item.difficulty) / 300)] + ';padding-left:20px;'}">${item.pname}</span></td><td>${item.contest}</td><td>${item.setname}</td><td>${item.genre}</td><td style="font-weight:600;` + (item.difficulty < 2700 ? `border-color:#${color[Math.floor(item.difficulty / 300)]};background:linear-gradient(to right,#${color[Math.floor(item.difficulty / 300)]}80 ${item.difficulty % 300 / 3}%,#0000 ${item.difficulty % 300 / 3}%) border-box border-box` : `background-image:linear-gradient(to right,#0000 ${Math.min(3599, item.difficulty) % 300 / 3}%,#ffff ${Math.min(3599, item.difficulty) % 300 / 3}%)` + metal2[Math.floor((item.difficulty - 2700) / 300)]) + `;">${item.difficulty}</td><td>${item.ansrate}%</td></tr>`;
  });
  value += `</tbody></table>`;

  contest_item_container.innerHTML = value;
}

function diff(rate){
  if (rate < 0 || rate > 100) return 0;
  else return Math.floor((arg.x - 1) * Math.pow(1 - rate * 0.01, arg.y) + 1);
}

async function movex(direction){
  var w = 500, t = 30;
  if (direction == 0) {
    let def = document.getElementById("attc").scrollLeft;
    let v = w / t / t;
    for (let i = t; i >= 0; --i) {
      document.getElementById("attc").scrollLeft = def - w + i * i * v;
      await wait(0.01);
    }
    document.getElementById("attc").scrollLeft = def - w;
  }
  else {
    let def = document.getElementById("attc").scrollLeft;
    let v = w / t / t;
    for (let i = t; i >= 0; --i) {
      document.getElementById("attc").scrollLeft = def + w - i * i * v;
      await wait(0.01);
    }
    document.getElementById("attc").scrollLeft = def + w;
  }
}

async function wait(second) {
  return new Promise(resolve => setTimeout(resolve, 1000 * second));
}