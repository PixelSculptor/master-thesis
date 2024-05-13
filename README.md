# Master Thesis - Performance Analysis of Serverless Design Patterns based on AWS Lambda

# Table of Contents

1. [Introduction](#introduction)
2. [Computing](#computing)
3. [Installation](#installation)
4. [Patterns](#patterns)
5. [Master Thesis Analysis](#master-thesis-analysis)
6. [CI/CD Workflow](#cicd-workflow)
7. [Sources](#sources)

## Introduction

This repo is master thesis project about serverless desgin patterns carried out at Poznan University of Technology in the speclialisation Distributed and Cloud Systems.

## Computing

Each serverless pattern will be solving same problem - compute some of metrics based on the huge dataset. In master thesis I've used Kaggle Movie Dataset, which includes around 26 million ratings from 270 000 users for 45 000 movies. Source [here](https://www.kaggle.com/datasets/rounakbanik/the-movies-dataset). Each record has some properties:

- movieId
- userId
- rating (scale 0-5)
- timestamp.

Huge dataset was divided by 10 subset files and parsed to JSON format. This files could represent variety of movie services like Filmweb, IMDb etc. Business logic is responsible for compute some movie metrics. This includes:

- Ranking of most famous movies (movies sorted by number of given ratings).
- Ranking of the least famous movies (movies sorted by number of given ratings).
- Ranking of most active users.
- Ranking of the least active users.
- Rankig of best rated movies.
- Ranking of the best rated movies but by most frequently rated.
- Ranking of the least rated movies but by most frequently rated.
- Movies with the highest amount of the best (greater than 4.0) rate.
- Movies with the worst rate (less than 3.0) rate.

## Installation

Project is written in SST framework (Serverless Stack) which is based on Cloud Development Kit ([docs](https://docs.sst.dev/)).
Requirements:

- Node v18+
- pnpm package manager

```
cd serverless-design-patterns
pnpm install
```

After installation you can run project locally using `pnpm sst dev`. Remeber to add you secret keys from AWS to AWS CLI in `~/.aws/credentials` file: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

### Folder structure:

In `./serverless-design-patterns` directory there are some important folders:

- `stacks` there are defined serverless stacks which declare cloud infrastructure using SST constructs. There is definition of API (using Amazon API Gateway) and resources to compute like DynamoDB table, S3 bucket, lambdas, SQS queues, SNS publishers, IAM roles and permissions.
- `scripts` includes bash script to run computing on AWS serverless platform
- `packages` directory which includes logic and handlers:
  - `core` includes business logic functions and some wrappers for Lambda handlers, there are also unit tests which checks regression of utility functions which compute movie metrics
  - `functions` - Lambda hanlders which are entry points passed to infrastructure declaration

## Patterns

### Monolith Computing

This pattern is the simplest approach to serverless computing. It only consists of one Lambda which is responsible for managing and computing metrics. After each computation result is saved in S3 bucket and metadata in DynamoDB table.

![Monolith Computing Pattern](./diagrams/Monolith_pattern.png)

### Messaging Pattern

This type of serverless pattern is focusing on passing messages to Lambda and improve system reliability rather than enhance computing performance. There is entry Lambda which focus on passing to SQS queue different messages which consist of information which file (movie service) to get as input data and which metric to compute. There is element which improves safeness - Dead Letter Queue (DLQ), which allows cloud administrator capture messages which had not served by computing Lambda. Right part of pattern is same as previous solution.

![Message passing pattern](./diagrams//Messaging_pattern%20.png)

### Fanout pattern(s)

This pattern is specific version of _messaging pattern_.
Fanout is a pattern which focus on decoupling computation into dedicated Lambdas (each metric has own Lambda) and in front there is entry Lambda (works as a trigger) which delegates computing to each Lambda separately. Every computing Lambda gets data from S3, compute and save result. There are multiple varieties of Fanout pattern. Each of them tries to improve most important architecture metrics: _scalability_, _fault tolerance_ and _performance_. Version with SQS is secured by dedicated DLQ for each queue.
Modifications of Fanout pattern:

- Fanout pattern (SNS trigger)
- Fanout pattern (SNS with dedicated SQS queues)
  Approach with SNS as trigger has one topic subscribed by every compute Lambda. Moreover, the last Fanout solution also has a pub-sub SNS service, but has as many topics defined as there are film metrics.

![Fanout Patterns](./diagrams/Fanout_patterns.png)

### Priority Queue Pattern

This is another variety of message passing pattern which allows cloud architect defines priority metric to compute for target customer. Rest of metrics are computed by second SQS and Lambda.

![Priority Queue Pattern](./diagrams/Priority_queue_pattern.png)

## Master Thesis Analysis

These patterns are included in practical part of master thesis **_Effectivenes Analysis of Serverless Design Patterns based on AWS Lambda_** under the guidance of the supervisor **PhD Michał Kalewski** on **Poznan University of Technology (PUT)**.
Some of these patterns were used to check performance effectiveness of serverless computing, comparing monolith processing with parallelized processing (fanout patterns). There were measured: **billing duration, init time and used memory and of course total costs** especially to check how processing time changes in relation to the Lambda functions memory configuration. It was also tested whether and how the performance of the patterns changes depending on the change of trigger (entry Lambda vs SNS event notification). Due to similar processing times for _Fanout_, _Messaging Pattern_ and _Priority Queue Pattern_, these models served to theoretical analysis how we can increase scalablity, availability and resilience of serverless systems in addition to performance using different approaches.

## CI/CD Workflow

This repo has also defined two workflows that are responsible for CI/CD process.

- `workflow_pull_request_test.yaml` defines workflow that is triggered on new pull request or changes to existing one. It checks if project is building correctly (including compiling TypeScript files) and run unit tests to prevent regression. It blocks merging if Action was not passed.
- `workflow_deploy_infrastructure.yaml` this workflow focuses on deploying infrastructure (it creates Cloud Formation template) and business code to AWS Lambda environment. Action works after Pull Request is merged to `main` branch.

## Sources

Here there is attached useful literature that helped to create implementation of serverless patterns. Highly recommend to check these out:

- [Amazon Web Services docs and compute blog](https://aws.amazon.com/serverless/)
- [Serverless Architecture on AWS: With examples using AWS Lambda](https://www.amazon.com/Serverless-Architectures-AWS-examples-Lambda/dp/1617293822)
- [Serverless Applications with Node.js: Using AWS Lambda and Claudia.js](https://www.amazon.com/Serverless-Applications-Node-js-Lambda-Claudia-js/dp/1617294721)
- [Serverless Design Patterns and Best Practices. Build, secure, and deploy enterprise ready serverless applications with AWS to improve developer productivity](https://helion.pl/ksiazki/serverless-design-patterns-and-best-practices-build-secure-and-deploy-enterprise-ready-serverless-brian-zambrano,e_154y.htm)
- [AWS Fundamentals](https://blog.awsfundamentals.com/)
- [Serverless Land](https://serverlessland.com/)
