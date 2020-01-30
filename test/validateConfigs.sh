#! /bin/bash

set -eu

validate_configs() {
  configs=($(find ./artifacts -name "*.yml"))
  failed=0
  passed=0
  if [[ $configs ]]; then
    for i in "${!configs[@]}"; do
      if ! circleci config validate "${configs[i]}"
      then
        ((failed++)) 
        echo "Failed to validate ${configs[i]}"
        continue
      else
        ((passed++))
      fi
    done
  else
    echo "No configs!"
    exit 1
  fi
  
  echo "$passed tests passed out of $(( failed+passed ))"
  
  if [ "$failed" > 0 ]
  then
    exit 1
  else
    exit 0
  fi
}

validate_configs