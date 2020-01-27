const { Workflow, Job, Step } = require('../model/workflow.js');

// Check that our parser will actually be able to interact with the Jenkinsfile
//TODO: Using the Jenkins linter would be really nice here. This requires a standing Jenkins install unfortunately
// For now we will just verify this is a declarative pipeline by looking for the `pipeline` block
const verifyValid = (j) => {
  for (let l of j.split('\n')) {
    // running removeComments on j causes everything after the first comment to be removed so this is my workaround
    // TODO: fix removeComments to work on the entire config
    l = removeComments(l);
    if (l.trim()) {
      // TODO: fix this logic, very naive implementation

      if (checkDirective(l, 'pipeline')) {
        return isBalanced(j);
      }
    }
  }

  // TODO: probably helpful to return why this step failed
  return false;
};

// TODO: needs testing and sanity check
// TODO: handle scripts
const pullDirective = (l) => {
  if (l.trim().endsWith('{')) {
    return l.substring(0, l.indexOf('{')).trim();
  }
  return false;
};

const checkDirective = (l, d) => l.trim().startsWith(d) && l.trim().endsWith('{');

// isBalanced verifies that brackets are balanaced throughout the config
const isBalanced = ([...str]) => {
  return (
    str.reduce((uptoPrevChar, thisChar) => {
      ((thisChar === '(' && uptoPrevChar++) || (thisChar === ')' && uptoPrevChar--)) &&
        ((thisChar === '{' && uptoPrevChar++) || (thisChar === '}' && uptoPrevChar--)) &&
        ((thisChar === '[' && uptoPrevChar++) || (thisChar === ']' && uptoPrevChar--));

      return uptoPrevChar;
    }, 0) === 0
  );
};

// Removes single-line comments and shebangs for easier parsing
// TODO: Handle block comments
const removeComments = (s) => 
  s.replace(/\/\/.*?\n|#!.*?\n/g, '');

// Regex from Python convertor, need to replicate DOTALL with something like https://stackoverflow.com/questions/23455614/how-to-use-dotall-flag-for-regex-exec
// string = re.sub(re.compile("/\*.*?\*/", re.DOTALL), "", string)

const jenkinsfileToArray = (s) => {
  return s.split('\n').filter(str => str.trim()).map(k => k.trim());
}

// expects arr with first idx that includes {, returns index of related }
const getBalancedIndex = (arr) => {
  let bracketCount = 0
  // check first line has open curly brace
  if (arr[0].substr(-1,1).trim() === '{') {
    bracketCount++;
  }
  // otherwise exit fn
  if (bracketCount === 0) {
    return false;
  }

  for (let i = 1; i < arr.length; i++) {
    bracketCount += (Math.max(arr[i].split('{').length - 1, 0));
    bracketCount -= (Math.max(arr[i].split('}').length - 1, 0));
    if (bracketCount === 0) {
      return i;
    }
  }
}

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
      // TODO: Refactor/make less verbose
      let endScriptIndex = getBalancedIndex(arr.slice(i));
      let script = arr.slice(i, endScriptIndex + i + 1);
      let cmd = script.join('\\\n');
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
    if (checkDirective(arr[i], "stages")) {
      // TODO: Sanity check how we want to handle "stages"
    } else if (checkDirective(arr[i], "stage")) {
      workflow.newJob(getStageName(arr[i]));
    } else if (checkDirective(arr[i], "agent")) {
      // TODO: Add logic to assign correct Docker executor based on JF
    } else if (checkDirective(arr[i], "steps")) {
      workflow.jobs[workflow.jobs.length - 1].steps = getSteps(arr.slice([i]));
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


module.exports = { verifyValid, parseJenkinsfile };
