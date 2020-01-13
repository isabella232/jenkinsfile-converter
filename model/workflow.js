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

module.exports = { Workflow, Job }