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
  s.replace(/\/.*?\n|#!.*?\n/g, '');

// Regex from Python convertor, need to replicate DOTALL with something like https://stackoverflow.com/questions/23455614/how-to-use-dotall-flag-for-regex-exec
// string = re.sub(re.compile("/\*.*?\*/", re.DOTALL), "", string)

const jenkinsfileToArray = (s) => {
  return s.split('\n').filter(str => str.trim()).map(k => k.trim());
}

// expects arr with first idx that includes {, returns index of related ]

const getBalancedIndex = (arr) => {
  let bracketCount = 0
  
  for (let i = 0; i < arr.length; i++) {
    let endChar = arr[i].substr(-1,1)
    if (endChar === '{') {
      bracketCount++;
    } else if (endChar === '}') {
      bracketCount--;
    }
    if (bracketCount == 0) {
      return i;
    }
  }
  // TODO: what's the best error to surface if the input is not balanced?
  return false;
}

// returns sliced array consisting of stage or stages, otherwise returns 0
const getSubstage = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    if (checkDirective(arr[i], "stage") || checkDirective(arr[i], "stages")) {
      let endIndex = getBalancedIndex(arr);
      return arr.slice(i, endIndex)
    }
  }
  return false;
}

// Identifies `stages` to convert into workflows
const processStages = (arr) => {
  
  let substage = getSubstage(arr);
  // iterate through arr and find `stages`
  if (!substage) {
    // handle steps
    // collectSteps(substage)
  } else {
    // thinking this will be recursive and will return arr/obj containing jobs/workflows
    processStages(arr)
  }
  
  // returns a single workflow key with jobs-array value
}


// if `steps`, call step creating fn (TODO)
const collectSteps = (arr) => {
  return "placeholder"
}


module.exports = { verifyValid, removeComments, jenkinsfileToArray, processStages, getBalancedIndex, getSubstage };
