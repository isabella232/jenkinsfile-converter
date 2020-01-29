const { tagLib } = require ('../static/unsupported.js');
const { comment, padding, multilineComment } = require('./configGen.js');


const handleComments = (commentArr) => {
  let output = '\n\n';
  for (let i = 0; i < commentArr.length; i++) {
    let kw = commentArr[i].keyword;
    let linesArr = commentArr[i].content;
    output += processComment(kw, linesArr);
  }
  return output;
}

const processComment = (kw, linesArr) => {
  let output = ''
  output += comment(kw + tagLib[kw].reason);
  output += comment('Please refer to ' + tagLib[kw].link + ' for more information.');
  output += multilineComment.apply(null, linesArr) + '\n';
  console.log(output);
  return output;
}

module.exports = { handleComments };