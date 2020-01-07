// This is a proof of concept of converting declarative Jenkinsfiles to CircleCI 2.0 config

// The intention of this script in its current state is not to be the interface that a user will interact with, but just a POC of the conversion from Jenkinsfiles to CCI config.

const cfg = require('./util/configGen.js');
const cci = require('./util/circleci.js');
const { openFile } = require('./util/file.js');
const { verifyValid } = require('./util/jenkins.js');

// TODO: Groovy library to interact with Jenkinsfiles?
// TODO: YAML Library to handle output?

// TODO: Pair Jenkinsfiles syntax key with CCI syntax key

function main() {
  const config = [cfg.generateHeader(), 'version: 2.1', cci.executors()];
  const path = process.argv[2];

  if (!verifyValid(openFile(path))) {
    console.error(
      'Invalid configuration. This tool only supports Jenkinsfiles using declarative pipelines.'
    );
    exit(1);
  }

  //TODO: write to file
  console.log(config.join(''));
}

main();
