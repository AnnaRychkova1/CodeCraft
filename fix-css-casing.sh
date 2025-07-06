#!/bin/bash

echo "⏳ Fixing file casing on Git for Vercel build..."

files=(
  "src/components/AdminDashboard/AdminDashboard.module.css"
  "src/components/AdminTasksList/AdminTasksList.module.css"
  "src/components/CodeEditor/CodeEditor.module.css"
  "src/components/Filtering/Filtering.module.css"
  "src/components/Tasks/Tasks.module.css"
  "src/components/Footer/Footer.module.css"
)

for filepath in "${files[@]}"; do
  dir=$(dirname "$filepath")
  filename=$(basename "$filepath")

  # Отримуємо base ім'я без розширення
  base="${filename%.module.css}"

  # Робимо CamelCase (припускаємо, що base вже у правильному форматі)
  # Але на всяк випадок — зробимо першу літеру великою:
  camelcase="$(tr '[:lower:]' '[:upper:]' <<< ${base:0:1})${base:1}.module.css"

  newfilepath="$dir/$camelcase"

  # Якщо шлях уже правильний — пропускаємо
  if [ "$filepath" != "$newfilepath" ]; then
    echo "Перейменовую $filepath -> $newfilepath"

    # git mv не завжди спрацьовує при зміні лише регістру, тому робимо через тимчасове ім'я
    git mv "$filepath" "$dir/temp.module.css"
    git mv "$dir/temp.module.css" "$newfilepath"
  else
    echo "$filepath уже в правильному форматі."
  fi
done

echo "Готово. Тепер виконай:"
echo "git commit -m 'Fix file casing for CSS modules for Vercel build'"
echo "git push"

