import bs4
import os
import math
import copy

print("Select type [All : '*' / Point : #File_Name#]")

arg=input()

dir_path=r"C:\Users\ftech\Documents\Github\USSAO(作業フォルダ)"

cnt = 0
for current_dir, sub_dirs, files_list in os.walk(dir_path):
  for file_name in files_list:
    root, ext = os.path.splitext(file_name)
    if file_name == "googlef8598da6df3833b2.html":
      continue
    if ext == '.html' and (arg == '*' or arg == current_dir.replace(dir_path, '') + '\\' + file_name):
      with open(os.path.join(current_dir, file_name), 'r', encoding="utf-8") as f:
        content = f.read()
        soup = bs4.BeautifulSoup(content, 'html.parser')
        #soup = bs4.BeautifulSoup(f, 'html.parser')
        ret = soup.find_all(class_='si')
        if len(ret) == 0:
          continue
        for item in ret:
          s = item.find_all(class_='nr')[0]
          t = copy.deepcopy(s)
          cntc = 0 #半角文字(ASCII)
          cnto = 0 #全角文字(非ASCII)
          for c in s.string:
            if str(c).isascii() == True:
              cntc += 1
            else:
              cnto += 1
          wmax = 260
          if current_dir + '\\' + file_name == r"C:\Users\ftech\Documents\Github\USSAO(作業フォルダ)\index.html":
            wmax = 240
          val = max((cntc * 10 + cnto * 19 + 9) / wmax - 1, 0) * 20
          res = math.ceil(val) * 5
          if res > 105:
            print(str(t) + 'in' + file_name + 'is too long.')
            res = 105
          
          if res != 0:
            s['class'] = ['nr', 'n' + str(res)]
          else:
            s['class'] = ['nr']
          content = content.replace(str(t),str(s))
        with open(os.path.join(current_dir, file_name), 'w', encoding="utf-8") as w:
          w.write(content)
          cnt += 1

print("Resized schedule items in " + str(cnt) + " files.")