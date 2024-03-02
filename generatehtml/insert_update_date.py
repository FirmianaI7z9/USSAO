import os
import datetime
import re

dir_path = r"C:\Users\ftech\Documents\Github\USSAO(作業フォルダ)"

cnt = 0

for current_dir, sub_dirs, files_list in os.walk(dir_path):
  for file_name in files_list:
    root, ext = os.path.splitext(file_name)
    if ext == '.html':
      date = datetime.datetime.fromtimestamp(os.path.getmtime(os.path.join(current_dir, file_name)))
      now = datetime.datetime.now()
      if date.year != now.year or date.month != now.month or date.day != now.day:
        continue

      cnt += 1

      rep = '<p class="ud">'+str(date.year)+'年'+str(date.month)+'月'+str(date.day)+'日</p>'

      with open(os.path.join(current_dir, file_name), 'r', encoding="utf-8") as f:
        content = f.read()
        content = re.sub('<p class="ud">.*</p>', rep, content)
        with open(os.path.join(current_dir, file_name), 'w', encoding="utf-8") as w:
          w.write(content)

print("Updated update dates in " + str(cnt) + " files.")