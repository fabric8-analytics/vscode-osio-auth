# vscode-osio Auth
This is an sample extension that illustrates the authorization of OSIO services from VSCode.

The purpose of the extension is to show stack analysis report. To play with the extension:
- Open a manifest file i.e (`requirements.txt`, `pom.xml`, `package.json`)
- Use command `Show fabric8-analytics stack report` to view stack analysis report on one manifest file
- Use command `Show fabric8-analytics stack report on Workspace` to view stack analysis report on entire workspace/project


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
