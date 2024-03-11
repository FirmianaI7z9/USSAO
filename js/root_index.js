window.addEventListener('DOMContentLoaded', function() {
  var date = new Date();
  var d = {year:date.getFullYear(), month:date.getMonth() + 1, date:date.getDate()};

  // 本日の予定

  const home_todays_schedule_container = document.getElementById('htsc');
  var value = `<h3>本日 (${d.month}月${d.date}日) の予定</h3>`;

  function load_file(file_name) {
    const promise = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', file_name);
      xhr.addEventListener('load', (f) => resolve(xhr));
      xhr.send();
    });
    return promise;
  }

  var cnt = 0;
  var dw = (home_todays_schedule_container.clientWidth) * 0.8 - 30;
  load_file('json/schedule.json').then((xhr) => {
    var data = JSON.parse(xhr.response);
    data['item'].forEach((item) => {
      if (item.type == 'x') return;
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
        value += `<div class="si ${item.subject}"><p class="sd">${ds.getFullYear()}年<br>${ds.getMonth() + 1}月${ds.getDate()}日</p><p class="st"><span class="sl">${item.contest.join(' ')} | ${item.type == 'c' ? '大会情報' : '申し込み情報'}</span><br><span class="nr" style="width:${Math.ceil(Math.max(100, 100 * w / dw)) + 5}%;transform:scalex(${Math.floor(Math.min(100, 100 * dw / w)) * 0.01});">${item.text}</span></p></div>`;
      }
    });
    if (cnt == 0) value += '<p>本日の予定はありません。</p>';
    home_todays_schedule_container.innerHTML = value;
  });

  // 最新情報

  const home_info_container = document.getElementById('htic');
  var ivalue = '<h3>新着情報</h3>';

  var icnt = 0;
  load_file('json/info.json').then((xhr) => {
    var data = JSON.parse(xhr.response);
    data['item'].forEach((item) => {
      var a = d.year * 10000 + d.month * 100 + d.date;
      var ds = new Date(item.time);
      var b = ds.getFullYear() * 10000 + (ds.getMonth() + 1) * 100 + ds.getDate();
      if (Math.abs(a - b) > 5) return;
      else {
        icnt++;
        var contest = '';
        item.contest.forEach((con) => {
          contest += `<span class="tg ${con.subject}">${con.contest}</span>`;
        });
        ivalue += `<div class="ni1">${item.link ? `<a href="${item.link_text}"${!item.domestic_link ? ' target="_blank" rel="noopener noreferrer"' : ''}></a>` : ''}<div>${item.important ? '<span class="nni"></span>' : ''}${a - b <= 5 ? '<span class="nnw"></span>' : ''}<p class="nt1">${contest}${item.text}<span class="nd1">${ds.getFullYear()}年${ds.getMonth() + 1}月${ds.getDate()}日</span></p></div></div>`;
      }
    });
    if (icnt == 0) ivalue += '<p>5日以内のお知らせはありません。</p>';
    home_info_container.innerHTML = ivalue;
  });
});