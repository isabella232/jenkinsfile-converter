const { padding } = require('./configGen.js');

const jobsPreamble = () => `
jobs:
`

const writeJobSteps = (job) => {
  let output = ''
  for (let i = 0; i < job.steps.length; i++) {
    if (!job.steps[i].supported) {
      // TODO: Write out as comment
    } else {
      output += padding('- run: ' + job.steps[i].cmd, 6) + '\n';
    }
  }
  return output
}

const writeJobs = (workflow) => {
  let output = jobsPreamble();
  for (let i = 0; i < workflow.jobs.length; i++) {
    output += padding(workflow.jobs[i].name + ':\n', 2);
    // TODO: Non-static executor entries
    output += padding('executor: default\n', 4);
    output += padding('steps:\n', 4);
    output += writeJobSteps(workflow.jobs[i]);
  }
  return output;
}

module.exports = { writeJobs }