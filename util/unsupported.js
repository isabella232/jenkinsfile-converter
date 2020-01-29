const { comment, padding, multilineComment } = require('./configGen.js');

const handleComments = (commentArr) => {
  let output = '\n\n';
  for (let i = 0; i < commentArr.length; i++) {
    if (commentArr[i].keyword == 'post') {
      let lines = commentArr[i].content;
      output += comment(commentArr[i].keyword + ' is not directly transferrable from Jenkinsfile to config.yml.');
      output += comment('Please refer to https://circleci.com/docs/2.0/configuration-reference/#the-when-attribute for more information.')
      output += multilineComment.apply(null, lines) + '\n';
    }
  }
  return output;
}

module.exports = { handleComments };