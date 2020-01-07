// Check that our parser will actually be able to interact with the Jenkinsfile
//TODO: Using the Jenkins linter would be really nice here. This requires a standing Jenkins install unfortunately
// For now we will just verify this is a declarative pipeline by looking for the `pipeline` block
function verifyValid(j) {
  for (let l of j.split("\n")) {
    // running removeComments on j causes everything after the first comment to be removed so this is my workaround
    // TODO: fix removeComments to work on the entire config
    l = removeComments(l)
    if (l.trim()) {
      // TODO: fix this logic, very naive implementation
      if (l.includes("pipeline")) break
    }
  }

  return [isBalanced(j), null]
}

// isBalanced verifies that brackets are balanaced throughout the config
function isBalanced([...str]) {return str.reduce((uptoPrevChar, thisChar) => {
    ((thisChar === '(' && uptoPrevChar++ || thisChar === ')' && uptoPrevChar--)) &&
    ((thisChar === '{' && uptoPrevChar++ || thisChar === '}' && uptoPrevChar--)) &&
    ((thisChar === '[' && uptoPrevChar++ || thisChar === ']' && uptoPrevChar--));

    return uptoPrevChar;
}, 0) === 0 }


// Removes any comments for easier parsing
const removeComments = (s) => s.replace(/(\/\*[^*]*\*\/)|(\/\/[^*]*)/g, '')

module.exports = {verifyValid}
