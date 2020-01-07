// This is a proof of concept of converting declarative Jenkinsfiles to CircleCI 2.0 config

const cfg = require("./util/configGen.js")

// TODO: Detect if file is declarative

// TODO: Groovy library to interact with Jenkinsfiles?
// TODO: YAML Library to handle output?

// TODO: How to handle agents? I would recommend creating a wizard like experience to create executors which can then be assigned



function main() {
  const config = [cfg.generateHeader(), "version: 2.1"]

  console.log(config.join(""))
}

main()
