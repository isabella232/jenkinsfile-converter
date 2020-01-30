#! /bin/bash

set -eu

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

create_configs() {
  jf_tests=($(find ${parent_path}/configs/declarative-examples -name "*.groovy"))
  config_names=($(find ${parent_path}/configs/declarative-examples -name "*.groovy" | sed 's/.*\///' | sed 's/.groovy/.yml/'))
  if [[ $jf_tests ]]; then
    for i in "${!jf_tests[@]}"; do
      echo "${jf_tests[i]}"
      node ${parent_path}/../index.js "${jf_tests[i]}" ./artifacts/"${config_names[i]}"
    done
  else
    echo "No tests!"
    exit 1
  fi
}

create_configs


parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )