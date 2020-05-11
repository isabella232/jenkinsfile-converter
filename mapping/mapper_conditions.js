const { CircleBranchFilter } = require('../model/CircleBranchFilter.js');
const { assignedFields } = require('./mapper_utils.js');

// This is where we'll fill out the CircleWorkflowJobCondition object
const mapConditions = (stage, conditions) => {
  if (stage.when) {
    let branchFilter = new CircleBranchFilter();

    const branchCheck = (conditionEntry, ignore) => {
      if (conditionEntry.name === 'branch') {
        branchFilter[ignore ? 'ignore' : 'only'] = conditionEntry.arguments.value;
      }
    };

    const conditionTypes = {
      not: (conditionEntry) => {
        Object.values(conditionEntry.children).forEach((childEntry) =>
          branchCheck(childEntry, true)
        );
      },
      branch: (conditionEntry) => {
        branchCheck(conditionEntry, false);
      }
      // allOf
      // anyOf
    };

    stage.when.conditions.forEach((conditionEntry) => {
      let conditionFunc = conditionTypes[conditionEntry.name];

      if (conditionFunc) {
        conditionFunc(conditionEntry);
      }
    });

    if (assignedFields(branchFilter)) {
      conditions.filters = { branches: branchFilter };
    }
  }
};

module.exports = { mapConditions };
