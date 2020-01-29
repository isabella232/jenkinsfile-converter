const { Workflow, Job, Step } = require('../model/workflow.js');
const { pullDirective, checkDirective, 
  removeComments, jenkinsfileToArray, 
  getBalancedIndex, getSection } = require('./jfParse.js');


const getStageName = (str) => {
  let begin = str.indexOf('(') + 2;
  let len = str.lastIndexOf(')') - str.indexOf('(') - 3;
  return str.substr(begin, len);
}

const getSteps = (arr) => {
  let stepsArr = [];
  let endIndex = getBalancedIndex(arr);
  for (let i = 1; i < endIndex; i++) {
    if (!pullDirective(arr[i])) {
      stepsArr.push(new Step(arr[i], true))
    } else if (pullDirective(arr[i]).startsWith('script')) {
      let endScriptIndex = getBalancedIndex(arr.slice(i));
      let cmd = getSection(arr.slice(i)).join('\\\n');
      let step = new Step(cmd, false);
      stepsArr.push(step);
      i += endScriptIndex;
    }
  }
  return stepsArr
}

// returns Workflow obj with Jobs
const processStanzas = (arr) => {
  let workflow = new Workflow
  for (let i = 0; i < arr.length; i++) {
    if (checkDirective(arr[i], 'stages')) {
      // TODO: Sanity check how we want to handle 'stages'
    } else if (checkDirective(arr[i], 'stage')) {
      workflow.newJob(getStageName(arr[i]));
    } else if (checkDirective(arr[i], 'agent')) {
      // TODO: Add logic to assign correct Docker executor based on JF
    } else if (checkDirective(arr[i], 'steps')) {
      workflow.jobs[workflow.jobs.length - 1].steps = getSteps(arr.slice([i]));
    } else if (checkDirective(arr[i], 'post')) {
      workflow.newComment('post', getSection(arr.slice([i])));;
    } else if (checkDirective(arr[i], 'options')) {
      workflow.newComment('options', getSection(arr.slice([i])));;
    } else if (checkDirective(arr[i], 'triggers')) {
      workflow.newComment('triggers', getSection(arr.slice([i])));;
    }
  }
  
  // Remove empty jobs
  for (var i = workflow.jobs.length - 1; i >= 0; i--) {
    if (workflow.jobs[i].steps.length == 0) {
      workflow.jobs.splice(i, 1);
    }
  }

  // For debugging inside workflows object
  // for (var i = 0; i < workflow.jobs.length; i++) {
  //   console.log(workflow.jobs[i])
  // }

  return workflow;
}

const parseJenkinsfile = (jenkinsfile) => {
  return processStanzas(jenkinsfileToArray(removeComments(jenkinsfile)));
}


module.exports = { parseJenkinsfile };
