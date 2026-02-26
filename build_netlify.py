"""
Netlify 构建脚本：从 templates + static 生成 public/，并注入 API 地址供 Netlify Functions 使用。
运行：python build_netlify.py
"""
import os
import re
import shutil

PUBLIC = "public"
TEMPLATE = "templates/index.html"
STATIC = "static"
API_SCRIPT = '''  <script>window.API_PREDICT='/.netlify/functions/predict';window.API_REPORT='/.netlify/functions/report';window.API_CHAT='/.netlify/functions/chat';</script>
'''

def main():
    os.makedirs(PUBLIC, exist_ok=True)
    with open(TEMPLATE, "r", encoding="utf-8") as f:
        html = f.read()
    # 将 Flask url_for 替换为静态路径
    html = re.sub(
        r"\{\{\s*url_for\('static',\s*filename='([^']+)'\)\s*\}\}",
        r"/static/\1",
        html,
    )
    # 在 </body> 前注入 Netlify Functions 的 API 地址
    if "window.API_PREDICT" not in html:
        html = html.replace("</body>", API_SCRIPT + "</body>")
    with open(os.path.join(PUBLIC, "index.html"), "w", encoding="utf-8") as f:
        f.write(html)
    dest_static = os.path.join(PUBLIC, "static")
    if os.path.isdir(dest_static):
        shutil.rmtree(dest_static)
    shutil.copytree(STATIC, dest_static)
    print("Netlify public/ 已生成：index.html + static/")

if __name__ == "__main__":
    main()
