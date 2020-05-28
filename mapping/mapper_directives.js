const envVarLayers = {};

const mapEnvironment = (prop, propType) => {
  const envVars = prop['environment'];

  if (envVars) {
    let mappedEnvVars =
      propType !== 'pipeline' && envVarLayers['pipeline'] ? { ...envVarLayers['pipeline'] } : {};

    envVars.forEach((ev) => {
      let key = ev['key'];
      let value = ev['value'];

      // TODO: handle credentials() and nonliteral functions

      if (value.isLiteral) {
        mappedEnvVars[key] = value.value;
      } else {
        mappedEnvVars[key] = 'Unsupported Environment Variable Type!';
      }
    });

    envVarLayers[propType] = mappedEnvVars;

    return mappedEnvVars;
  }

  return undefined;
};

module.exports = { mapEnvironment };
