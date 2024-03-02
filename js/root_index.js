window.addEventListener('DOMContentLoaded', function() {
  var date = new Date();
  var d = {year:date.getFullYear(), month:date.getMonth() + 1, date:date.getDate()};
  console.log(date);
  console.log(new Date(1709305200));

  const home_todays_schedule_container = document.getElementById('htsc');
  var value = `<h3>本日 (${d.month}月${d.date}日) の予定</h3>`;

  function load_file() {
    const promise = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `json/schedule.json`);
      xhr.addEventListener('load', (f) => resolve(xhr));
      xhr.send();
    });
    return promise;
  }

  var cnt = 0;
  var dw = (home_todays_schedule_container.clientWidth) * 0.8 - 30;
  load_file().then((xhr) => {
    var data = JSON.parse(xhr.response);
    data['item'].forEach((item) => {
      var a = d.year * 10000 + d.month * 100 + d.date;
      var ds = new Date(item.start_time);
      var df = new Date(item.finish_time);
      var b = ds.getFullYear() * 10000 + (ds.getMonth() + 1) * 100 + ds.getDate();
      var c = df.getFullYear() * 10000 + (df.getMonth() + 1) * 100 + df.getDate();
      if (b > a || a > c) return;
      else {
        cnt++;
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.font = '19px "Segoe UI"';
        var w = ctx.measureText(item.text).width;
        value += `<div class="si ${item.subject}"><p class="sd">${ds.getFullYear()}年<br>${ds.getMonth() + 1}月${ds.getDate()}日</p><p class="st"><span class="sl">${item.contest.join(' ')} | ${item.type == 'c' ? '大会情報' : '申し込み情報'}</span><br><span class="nr" style="width:${Math.max(100, 100 * w / dw)}%;transform:scalex(${Math.min(1,dw / w)});">${item.text}</span></p></div>`
      }
    });
    if (cnt == 0) value += '<p>本日の予定はありません。</p>';
    home_todays_schedule_container.innerHTML = value;
  });
});