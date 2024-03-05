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
    value = `<h3>大会ページ</h3><table class="att"><thead><tr><th class="aw10">Contest</th><th class="aw10">Country/Online?</th><th class="aw20">URL</th><th class="aw20">備考</th></tr></thead><tbody>`;
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

    var color = ['808080','804000','008000','00c0c0','00f','c0c000','ff8000','f00'];
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
                value += `<td>${problem.difficulty > 0 ? `<span class="dif" style="` + (problem.difficulty < 3200 ? `border-color:#${color[Math.floor(problem.difficulty / 400)]};background:linear-gradient(to top,#${color[Math.floor(problem.difficulty / 400)]} ${problem.difficulty % 400 * 0.25}%,#0000 ${problem.difficulty % 400 * 0.25}%) border-box border-box;` : metal[Math.floor((problem.difficulty - 3200) / 400)]) + `"></span><span class="did">Difficulty : ${problem.difficulty}<br>Mean : ${problem.answerrate}%</span>` : ''}<a href="${problem.link}"${problem.domestic ? '' : `target="_blank" rel="noopener noreferrer"`}></a><span class="atx" style="color:#${problem.difficulty == 0 ? '000;' : color[Math.floor(Math.min(2800, problem.difficulty) / 400)] + ';padding-left:20px;'}">${problem.problemname}</span><span class="rat">${problem.genre}</span></td>`;
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