# vscode OSIO Auth

This extension enables authorization of OSIO services from VSCode.


Quick Start
============
1. Install the Extension
2. Extension is activated when you open a workspace

Features
=========
![ screencast ](https://raw.githubusercontent.com/fabric8-analytics/vscode-osio-auth/master/images/authOsio.png)

* This extension enables authorization of OSIO services from VSCode.


Available commands
==========================
The following commands are available:

- Use command (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) `OSIO-AUTH: Authorize OSIO Services` to authorize OSIO
- Use command (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac) `OSIO-AUTH: Unauthorize OSIO Services` to unauthorize OSIO


Contributing
===============
This is an open source project open to anyone. Contributions are extremely welcome!



# How to run locally

* `npm install`
* `npm run compile` to start the compiler in watch mode
* open this folder in VS Code and press `F5`


# Run tests
* open the debug viewlet (`Ctrl+Shift+D` or `Cmd+Shift+D` on Mac) and from the launch configuration dropdown pick `Launch Tests`
* press `F5` to run the tests in a new window with your extension loaded
* see the output of the test result in the debug console
* make changes to `test/extension.test.ts` or create new test files inside the `test` folder
    * by convention, the test runner will only consider files matching the name pattern `**.test.ts`
    * you can create folders inside the `test` folder to structure your tests any way you want



Feedback
===============
* File a bug in [GitHub Issues](https://github.com/fabric8-analytics/vscode-osio-auth/issues).
