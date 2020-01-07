// This is a proof of concept of converting declarative Jenkinsfiles to CircleCI 2.0 config

// The intention of this script in its current state is not to be the interface that a user will interact with, but just a POC of the conversion from Jenkinsfiles to CCI config.

const cfg = require('./util/configGen.js');
const cci = require('./util/circleci.js');
const { openFile } = require('./util/file.js');
const { verifyValid } = require('./util/jenkins.js');

// TODO: Detect if file is declarative

// TODO: Groovy library to interact with Jenkinsfiles?
// TODO: YAML Library to handle output?

// TODO: Pair Jenkinsfiles syntax key with CCI syntax key

function main() {
  const config = [cfg.generateHeader(), 'version: 2.1', cci.executors()];
  const path = process.argv[2];

  const [valid, reason] = verifyValid(openFile(path));

  if (!valid) {
    console.exit('test');
  }
  console.log(config.join(''));
}

main();
