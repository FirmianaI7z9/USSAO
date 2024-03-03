window.addEventListener('DOMContentLoaded', function() {
  var date = new Date();
  var d = {year:date.getFullYear(), month:date.getMonth() + 1, date:date.getDate()};

  const root_schedule_container = document.getElementById('rnc');
  var value = '';

  function load_file() {
    const promise = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `json/info.json`);
      xhr.addEventListener('load', (f) => resolve(xhr));
      xhr.send();
    });
    return promise;
  }

  load_file().then((xhr) => {
    var data = JSON.parse(xhr.response);
    data['item'] = data['item'].sort(function(a, b){
      return (a.time > b.time) ? -1 : 1;
    });
    data['item'].forEach((item) => {
      var a = d.year * 10000 + d.month * 100 + d.date;
      var ds = new Date(item.time);
      var b = ds.getFullYear() * 10000 + (ds.getMonth() + 1) * 100 + ds.getDate();
      var contest = '';
      item.contest.forEach((con) => {
        contest += `<span class="tg ${con.subject}">${con.contest}</span>`;
      });
      value += `<div class="ni1">${item.link ? `<a href="${item.link_text}"${!item.domestic_link ? ' target="_blank" rel="noopener noreferrer"' : ''}></a>` : ''}<div>${item.important ? '<span class="nni"></span>' : ''}${a - b <= 5 ? '<span class="nnw"></span>' : ''}<p class="nt1">${contest}${item.text}<span class="nd1">${ds.getFullYear()}年${ds.getMonth() + 1}月${ds.getDate()}日</span></p></div></div>`;
    });
    root_schedule_container.innerHTML = value;
  });
});