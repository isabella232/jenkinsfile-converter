const Workflow = function() {
  this.jobs = [];
  this.newJob = (name) => {
    this.jobs.push(new Job(name));
  }
}

const Job = function(name) {
  this.name = name;
  this.steps = [];
}

const Step = function(cmd, supported) {
  // boolean, used to write comments
  this.supported = supported;
  // expect this to be a string
  this.cmd = cmd
}

module.exports = { Workflow, Job, Step }