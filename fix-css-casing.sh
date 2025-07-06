#!/bin/bash

echo "⏳ Force renaming all .module.css files to CamelCase..."

find ./src/components -type f -name "*.module.css" | while read filepath; do
  dir=$(dirname "$filepath")
  filename=$(basename "$filepath")

  base="${filename%.module.css}"


  camelcase=$(echo "$base" | sed -E 's/(^|[^a-zA-Z0-9])([a-z])/\U\2/g')


  if [[ "$camelcase" == "$base" ]]; then
    camelcase="$(echo ${base:0:1} | tr '[:lower:]' '[:upper:]')${base:1}"
  fi

  newfilename="${camelcase}.module.css"

 
  if [ "$filename" != "$newfilename" ]; then
    echo "🔁 $filepath → $dir/$newfilename"

    git mv "$filepath" "$dir/temp.module.css" || mv "$filepath" "$dir/temp.module.css"
    git mv "$dir/temp.module.css" "$dir/$newfilename" || mv "$dir/temp.module.css" "$dir/$newfilename"
  else
    
    echo "🔄 Refreshing $filepath"
    git mv "$filepath" "$dir/temp.module.css" || mv "$filepath" "$dir/temp.module.css"
    git mv "$dir/temp.module.css" "$filepath" || mv "$dir/temp.module.css" "$filepath"
  fi
done

echo "✅ Done. Don't forget to commit and push:"
echo "git commit -m 'Force fix casing in module.css filenames to CamelCase'"
echo "git push"
