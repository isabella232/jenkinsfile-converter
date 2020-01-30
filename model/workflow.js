const Workflow = function() {
  this.comments = [];
  this.jobs = [];
  this.newComment = (kw, content) => {
    this.comments.push(new Comment(kw, content));
  }
  this.newJob = (name) => {
    this.jobs.push(new Job(name));
  }
}

const Job = function(name) {
  this.name = name;
  this.env = {};
  this.steps = [];
}

const Comment = function(kw, content) {
  this.keyword = kw;
  this.content = content;
}

const Step = function(cmd, supported) {
  // boolean, used to write comments
  this.supported = supported;
  // expect this to be a string
  this.cmd = cmd
}

module.exports = { Workflow, Job, Step }