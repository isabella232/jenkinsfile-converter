#! /bin/bash

set -eu

create_configs() {
  jf_tests=($(find ~/project/test/configs/declarative-examples -name "*.groovy"))
  config_names=($(find ~/project/test/configs/declarative-examples -name "*.groovy" | sed 's/.*\///' | sed 's/.groovy/.yml/'))
  if [[ $jf_tests ]]; then
    for i in "${!jf_tests[@]}"; do
      echo "${jf_tests[i]}"
      node index.js "${jf_tests[i]}" "./artifacts/${config_names[i]}"
    done
  else
    echo "No tests!"
    exit 1
  fi
}

create_configs