# Jenkinsfile Convertor
A tool to help Jenkins users get a head start on building on CircleCI by converting a `Jenkinsfile` to CircleCI `config.yml`. 

While this tool should output a valid `config.yml`, this tool is not yet feature complete. `config.yml` should be reviewed and edited as necessary before running the initial CircleCI build.

For more about CircleCI, see https://circleci.com

## Overview
`node index.js [path/to/Jenkinsfile] [path/to/output]` will convert a Jenkinsfile to the desired location. `path/to/output` is an optional argument and will create `config.yml` in the base directory if not specified.

## Supported Syntax
Only declarative `Jenkinsfile`s are currently supported.

|   Jenkinsfile Syntax  |   Approx. CircleCI Syntax |   Status  |
| --- | --- | --- |
 | agent | [executor](https://circleci.com/docs/2.0/configuration-reference/#executors-requires-version-21) | Placeholder with static executor information |
| post | [when attribute](https://circleci.com/docs/2.0/configuration-reference/#the-when-attribute) | Marked for commenting with link to CCI docs |
| stages | [workflows](https://circleci.com/docs/2.0/workflows/) | Sequential (naive) completed, parallel not yet supported. |
| steps | [step](https://circleci.com/docs/2.0/jobs-steps/#steps-overview) | Completed |
| environment | [environment](https://circleci.com/docs/2.0/env-vars/) | Stage-level env vars populate on executor level |
| options | N/A | Marked for commenting with link to CCI docs |
| parameters | [parameters](https://circleci.com/docs/2.0/reusing-config/#using-the-parameters-declaration) | Not started |
| triggers | [cron](https://circleci.com/docs/2.0/workflows/#scheduling-a-workflow) | Marked for commenting with link to CCI docs |
| stage | [job](https://circleci.com/docs/2.0/configuration-reference/#jobs) | Completed |
