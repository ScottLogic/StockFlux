# Contributing

We welcome contributions, both in terms of feedback and issues as well as changes.
If you're looking for ways to get involved please see the open issues in the current milestone.


## Submitting an issue

Please search for existing issues, before opening a new issue. The guidelines for issue labelling can be found in the [Issue Labels](#labels) section.

If the issues appears to be a new bug, then please raise an issue with the following details:
* Overview of the issue including any error message or stack trace
* Expected behaviour
* Version
* Steps to reproduce
* Screenshots if useful

Suggestions for a fix or a related pull requests are also gratefully received.


### <a name="labels"></a>Issue Labels

This section describes the labels we use to track and manage issues.

| Label name | Description
| --- | --- |
| BitFlux | An issue requiring [BitFlux](http://scottlogic.github.io/BitFlux/) changes |
| bug | A bug in an existing feature |
| epic | An issue that captures a large amount of work. May be broken down into sub issues  |
| infrastructure | A change that isn't a new feature or bug fix. For example improving the build process or refactoring some code |
| OpenFin | An issue that relates to the OpenFin integration. |
| question | An issue that is pending further clarification. |
| UX |  An issue requiring UX input |


## Making changes

Please assign issues once you start looking at them to prevent any duplication.
Before starting any significant changes it is worth checking on the proposed
solution to make sure it fits in with the project direction and prevent
wasted effort.

Development environment setup can be found in the [README.md](README.md).
Please make sure the grunt build passes and commits are in logical units and focused on the issue.


### Branching Workflow and deployment

This project uses the [GitFlow]([https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) approach to branching. Please create a local fork of the project to base pull requests off. Development work should occur on feature branches off the `dev` or the related release branch. The main branches are described below and these are deployed to gh-pages as part of the travis build.

| Branch | Notes | Deployed on gh-pages |
|---|---|---|
|master| This is the current live version | Deployed as master and ​_version_​ |
| dev | The current development branch | Deployed as dev
| release-* |  A release branch for a pending release. This should be created from dev and merged in to master and dev once at the point of the release. | ​_version_​-rc |

​_\*version_​ is from package.json

* Feature branches should be deleted as soon as the Pull Request is merged.
* Release branches should be deleted once merged to master and dev.



#### Git Commit Messages

Please follow the [AngularJS commit message convention](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#-git-commit-guidelines) for the commit message format.
This simplifies the generation of the change log for a release.
