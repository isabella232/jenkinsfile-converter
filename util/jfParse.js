

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

// TODO: Handle block comments
// Regex from Python convertor, need to replicate DOTALL with something like https://stackoverflow.com/questions/23455614/how-to-use-dotall-flag-for-regex-exec
// string = re.sub(re.compile("/\*.*?\*/", re.DOTALL), "", string)
const removeComments = (s) => 
  s.replace(/\/\/.*?\n|#!.*?\n/g, '');

const jenkinsfileToArray = (s) => {
  return s.split('\n').filter(str => str.trim()).map(k => k.trim());
}

// helper fn; expects arr with idx 0 that includes {, returns index of related }
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

// getSection returns a JF stanza that has balanced brackets as an array
const getSection = (arr) => {
  return arr.slice(0, getBalancedIndex(arr) + 1);
}

module.exports = { 
  pullDirective, checkDirective, isBalanced, removeComments, jenkinsfileToArray, getBalancedIndex, getSection
}
