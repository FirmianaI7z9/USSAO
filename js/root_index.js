window.addEventListener('DOMContentLoaded', function() {
  var date = new Date();
  var d = {year:date.getFullYear(), month:date.getMonth() + 1, date:date.getDate()};

  // 本日の予定 //
  // カウントダウン //
  // 申込受付中の大会 //

  const home_todays_schedule_container = document.getElementById('htsc');
  const home_todays_schedule_item = document.getElementById('sc_sample');
  const home_countdown_container = document.getElementById('htcd');
  const home_application_container = document.getElementById('htac');
  var svalue = `<h3><a href="schedule.html">本日 (${d.month}月${d.date}日) の予定</a></h3>`;
  var avalue = `<h3>申込受付中の大会</h3>`;

  function load_file(file_name) {
    const promise = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', file_name);
      xhr.addEventListener('load', (f) => resolve(xhr));
      xhr.send();
    });
    return promise;
  }

  var sdata;
  var scnt = 0;
  var dw = (home_todays_schedule_item.clientWidth) - 20;
  var now = new Date();
  load_file('json/schedule.json').then((xhr) => {
    var data = JSON.parse(xhr.response);
    data['item'] = data['item'].sort(function(a, b){
      return (a.start_time < b.start_time) ? -1 : 1;
    });
    sdata = data;

    data['item'].forEach((item) => {
      if (item.type == 'x') return;
      var a = d.year * 10000 + d.month * 100 + d.date;
      var ds = new Date(item.start_time);
      var df = new Date(item.finish_time);
      var b = ds.getFullYear() * 10000 + (ds.getMonth() + 1) * 100 + ds.getDate();
      var c = df.getFullYear() * 10000 + (df.getMonth() + 1) * 100 + df.getDate();
      if (b <= a && a <= c) {
        scnt++;
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.font = '19px sans-serif';
        var w = ctx.measureText(item.text).width;
        svalue += `<div class="si ${item.subject}${(now.getTime() > df.getTime() && item.tdis) ? ' cs' : ''}"><p class="sd">${ds.getFullYear() != now.getFullYear() ? `${ds.getFullYear()}年<br>` : ''}${ds.getMonth() + 1}月${ds.getDate()}日${(ds.getTime() != df.getTime() && !item.tdis) ? '-' : ''}${item.tdis ? `<br>${ds.getHours()}:${('00' + ds.getMinutes()).slice(-2)}${ds.getTime() == df.getTime() ? '' : '-'}` : ''}</p><p class="st"><span class="sl">${item.contest.join(' ')} | ${item.type == 'c' ? '大会情報' : '申し込み情報'}</span><br><span class="nr" style="width:${Math.ceil(Math.max(100, 100 * w / dw)) + 5}%;transform:scalex(${Math.floor(Math.min(100, 100 * dw / w)) * 0.01});">${item.text}</span></p></div>`;
      }
    });

    if (scnt == 0) svalue += '<p>本日の予定はありません。</p>';
    home_todays_schedule_container.innerHTML = svalue;
  });

  // カウントダウン //

  this.setInterval(() => {
    var cvalue = `<h3>カウントダウン</h3>`;
    var ccnt = 0;
    var nowc = new Date();
    sdata['item'].forEach((item) => {
      if (item.type == 'x') return;
      var ds = new Date(item.start_time);
      if (ds - nowc <= 28 * 86400000 && nowc <= ds) {
        ccnt++;
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.font = '19px sans-serif';
        var w = ctx.measureText(item.text).width;
        var span = new Date(ds - nowc);
        cvalue += `<div class="si ${item.subject}"><p class="sd">あと${span >= 86400000 ? `<br>${Math.floor(span / 86400000)}日` : ''}${true ? `<br>${Math.floor(span % 86400000 / 3600000)}:${('00' + Math.floor(span % 3600000 / 60000)).slice(-2)}:${('00' + Math.floor(span % 60000 / 1000)).slice(-2)}` : ''}</p><p class="st"><span class="sl">${item.contest.join(' ')} | ${item.type == 'c' ? '大会情報' : '申し込み情報'}</span><br><span class="nr" style="width:${Math.ceil(Math.max(100, 100 * w / dw)) + 5}%;transform:scalex(${Math.floor(Math.min(100, 100 * dw / w)) * 0.01});">${item.text}</span></p></div>`;
      }
    });
    if (ccnt == 0) cvalue += '<p>2</p>';
    home_countdown_container.innerHTML = cvalue;
  }, 1000);

  // 申込受付中の大会 //

  var adata = [
  ];

  adata.forEach((item) => {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = '19px sans-serif';
    var w = ctx.measureText(item[3]).width;
    avalue += `<div class="si ${item[0]}"><p class="sd">${item[1]}</p><p class="st"><span class="sl">${item[2]}</span><br><span class="nr" style="width:${Math.ceil(Math.max(100, 100 * w / dw)) + 5}%;transform:scalex(${Math.floor(Math.min(100, 100 * dw / w)) * 0.01});">${item[3]}</span></p></div>`;
  });
  home_application_container.innerHTML = avalue;

  // 最新情報 //

  const home_info_container = document.getElementById('htic');
  var ivalue = '<h3><a href="info.html">新着情報</a></h3>';

  var icnt = 0;
  load_file('json/info.json').then((xhr) => {
    var data = JSON.parse(xhr.response);
    data['item'] = data['item'].sort(function(a, b){
      return (a.time < b.time) ? 1 : -1;
    });
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