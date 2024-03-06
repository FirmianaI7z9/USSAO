var data;
var contest;

window.addEventListener('DOMContentLoaded', function() {
  contest = document.getElementById('arg').innerText;

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
    value = `<h3 style="margin:10px 0;">大会ページ</h3><table class="att"><thead><tr><th class="aw10">Contest</th><th class="aw10">Country/Online?</th><th class="aw20">URL</th><th class="aw20">備考</th></tr></thead><tbody>`;
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
    value = `<h3 style="display:absolute;top:0;left:0;">${set}</h3><table class="att"><thead><tr><th class="aw10">Contest</th>`;
    
    data['item'].forEach((item) => {
      item['problemset'].forEach((problemset) => {
        if (problemset.setname == set) {
          problemset['problem'].forEach((problem) => {
            pname.add(problem.problemid);
          });
        }
      });
    });

    for (var i of pname) {
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
          for (var i of pname) {
            var trig = false;
            for (var j = cnt; j < problemset['problem'].length; j++) {
              var problem = problemset['problem'][j];
              if (i == problem.problemid) {
                cnt = j + 1;
                trig = true;
                value += `<td>${problem.difficulty > 0 ? `<span class="dif" style="` + (problem.difficulty < 2700 ? `border-color:#${color[Math.floor(problem.difficulty / 300)]};background:linear-gradient(to top,#${color[Math.floor(problem.difficulty / 300)]} ${problem.difficulty % 300 / 3}%,#0000 ${problem.difficulty % 300 / 3}%) border-box border-box;` : metal[Math.floor((problem.difficulty - 2700) / 300)]) + `"></span><span class="did">Difficulty : ${problem.difficulty}<br>Mean : ${problem.answerrate}%</span>` : ''}<a href="${problem.link}"${problem.domestic ? '' : `target="_blank" rel="noopener noreferrer"`}></a><span class="atx" style="color:#${problem.difficulty == 0 ? '000;' : color[Math.floor(Math.min(2699, problem.difficulty) / 300)] + ';padding-left:20px;'}">${problem.problemname}</span><span class="rat">${problem.genre}</span></td>`;
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
        if (problem.difficulty <= 0) return;
        pset.push({
          pname:problem.problemname,
          contest:`${contest}${item.year} (#${item.no})`,
          difficulty:problem.difficulty,
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

  value = `<h3>問題リスト</h3><p>注：現状Diffの決まっていない問題は表示していません。</p><table class="att"><thead><tr><th class="aw20">問題</th><th class="aw20">大会</th><th class="aw10">問題種</th><th class="aw10">ジャンル</th><th class="aw10">Difficulty</th><th class="aw10">平均得点率</th></tr></thead><tbody>`;

  var color = ['808080','0000ff','00c0c0','008000','c0c000','ff8000','ff0000','ff80ff','a000a0'];
  var metal = [`border-color:#965c38;background:linear-gradient(to right,#965c38,#ffdac1,#965c38);`,`border-color:#808080;background:linear-gradient(to right,#808080,#fff,#808080);`,`border-color:#ffd700;background:linear-gradient(to right,#ffd700,#fff,#ffd700);`];
  var metal2 = [`,linear-gradient(to top,#965c3880,#ffdac180,#965c3880);border-color:#965c3880;`,`,linear-gradient(to top,#80808080,#ffffff80,#80808080);border-color:#80808080;`,`,linear-gradient(to top,#ffd70080,#ffffff80,#ffd70080);border-color:#ffd70080;`];

  pset.forEach((item) => {
    value += `<tr><td>${item.difficulty > 0 ? `<span class="dif" style="` + (item.difficulty < 2700 ? `border-color:#${color[Math.floor(item.difficulty / 300)]};background:linear-gradient(to top,#${color[Math.floor(item.difficulty / 300)]} ${item.difficulty % 300 / 3}%,#0000 ${item.difficulty % 300 / 3}%) border-box border-box;` : metal[Math.floor((item.difficulty - 2700) / 300)]) + `"></span><span class="did">Difficulty : ${item.difficulty}<br>Mean : ${item.ansrate}%</span>` : ''}<a href="${item.link}"${item.domestic ? '' : `target="_blank" rel="noopener noreferrer"`}></a><span class="atx" style="color:#${item.difficulty == 0 ? '000;' : color[Math.floor(Math.min(2699, item.difficulty) / 300)] + ';padding-left:20px;'}">${item.pname}</span></td><td>${item.contest}</td><td>${item.setname}</td><td>${item.genre}</td><td style="font-weight:600;` + (item.difficulty < 2700 ? `border-color:#${color[Math.floor(item.difficulty / 300)]};background:linear-gradient(to right,#${color[Math.floor(item.difficulty / 300)]}80 ${item.difficulty % 300 / 3}%,#0000 ${item.difficulty % 300 / 3}%) border-box border-box` : `background-image:linear-gradient(to right,#0000 ${item.difficulty % 300 / 3}%,#ffff ${item.difficulty % 300 / 3}%)` + metal2[Math.floor((item.difficulty - 2700) / 300)]) + `;">${item.difficulty}</td><td>${item.ansrate}%</td></tr>`;
  });
  value += `</tbody></table>`;

  contest_item_container.innerHTML = value;
}