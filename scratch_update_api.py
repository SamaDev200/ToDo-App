import os
import glob
import re

base_dir = r"c:\Users\user\Documents\AI kurs\ToDo App\frontend\src"
files = glob.glob(os.path.join(base_dir, "**", "*.jsx"), recursive=True)

for file in files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "http://127.0.0.1:8000" in content:
        content = re.sub(r"'http://127\.0\.0\.1:8000([^']*)'", r"`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}\1`", content)
        
        with open(file, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated {file}")
