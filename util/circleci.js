const { comment, padding, multilineComment } = require('./configGen.js');
const { writeJobs } = require('./configJobs.js');
const { writeComments } = require('./configComments.js');
const { writeWorkflows } = require('./configWorkflows.js');

// TODO: How to handle agents? I would recommend creating a wizard like experience to create executors which can then be assigned

// Is config in strings really the best way to do this? I investigated yaml libraries, but didn't see anything I fell in love with.
const executors = () => `
version: 2.1

# You can replace your executor in any job with an executor defined here. A good start would be replacing the image in your Docker executor with one of our convience images.
# The Docker executor meets the needs of over 80% of our users.
# https://circleci.com/docs/2.0/executor-types
executors:
  default:
    docker:
  # List of convenience images: https://circleci.com/docs/2.0/circleci-images/#latest-image-tags-by-language
      - image: circleci/python:3.6
    working_directory: ~/proj
  macos:
    macos:
      xcode: "10.1.0"
    working_directory: ~/proj
    shell: /bin/bash --login
  windows:
    machine:
      resource_class: windows.medium
      image: "windows-server-2019:201908-06"
      shell: bash
  `;

const createConfig = (workflow) => {
  let config = ''
  config += executors();
  config += writeWorkflows(workflow);
  config += writeJobs(workflow);
  config += writeComments(workflow);
  return config;
}

module.exports = { createConfig };



















