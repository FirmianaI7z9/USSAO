window.addEventListener('DOMContentLoaded', function() {
  var date = new Date();
  var d = {year:date.getFullYear(), month:date.getMonth() + 1, date:date.getDate()};

  const root_schedule_container = document.getElementById('rsc');
  var value = '';
  const ti = this.document.title.split('|')[1].substring(1, 3);
  var dic = {'数学':'ma','物理':'ph','化学':'ch','生物':'bi','地学':'ea','情報':'in','科学':'ka','言語':'la','天文':'as','地理':'ge','哲学':'ps','経済':'ec','脳科':'ba'};

  function load_file() {
    const promise = new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      if (ti == 'スケ'){
        xhr.open('GET', `json/schedule.json`);
      }
      else{
        xhr.open('GET', `../../json/schedule.json`);
      }
      xhr.addEventListener('load', (f) => resolve(xhr));
      xhr.send();
    });
    return promise;
  }

  var dw = document.getElementById('sc_sample').clientWidth - 20;
  var cur_month = 0;
  var now = new Date();
  load_file().then((xhr) => {
    var data = JSON.parse(xhr.response);
    data['item'] = data['item'].sort(function(a, b){
      return (a.start_time < b.start_time) ? -1 : 1;
    });
    data['item'].forEach((item) => {
      if (ti != 'スケ' && item.subject != dic[ti]) return;
      var a = d.year * 10000 + d.month * 100 + d.date;
      var ds = new Date(item.start_time);
      var df = new Date(item.finish_time);
      var b = df.getFullYear() * 10000 + (df.getMonth() + 1) * 100 + df.getDate();
      if (b < a) return;
      else {
        if (cur_month < ds.getFullYear() * 100 + (ds.getMonth() + 1)) {
          value += `<h3 class="bh3">${ds.getFullYear()}年${ds.getMonth() + 1}月</h3>`;
          cur_month = ds.getFullYear() * 100 + (ds.getMonth() + 1);
        }
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.font = '19px sans-serif';
        var w = ctx.measureText(item.text).width;
        value += `<div class="si si1 ${item.subject}${(item.type == 'x' || (now.getTime() > df.getTime() && (df.getHours() != 0 || df.getMinutes() != 0) && ds != df)) ? ' cs' : ''}"><p class="sd">${ds.getFullYear() != now.getFullYear() ? `${ds.getFullYear()}年<br>` : ''}${ds.getMonth() + 1}月${item.type == 'x' ? '' : ds.getDate().toString() + `日${(ds.getTime() != df.getTime() && ((ds.getHours() == 0 && ds.getMinutes() == 0))) ? '-' : ''}`}${(ds.getHours() != 0 || ds.getMinutes() != 0) ? `<br>${ds.getHours()}:${('00' + ds.getMinutes()).slice(-2)}${ds.getTime() == df.getTime() ? '' : '-'}` : ''}</p><p class="st"><span class="sl">${item.contest.join(' ')} | ${item.type == 'c' ? '大会情報' : (item.type == 'a' ? '申し込み情報' : 'その他・未確定情報')}</span><br><span class="nr" style="width:${Math.ceil(Math.max(100, 100 * w / dw)) + 5}%;transform:scalex(${Math.floor(Math.min(100, 100 * dw / w)) * 0.01});">${item.text}</span></p></div>`;
      }
    });
    root_schedule_container.innerHTML = value;
  });
});