# OpenShift.io service authorization

Red Hat [OpenShift.io](https://openshift.io/) is a highly collaborative open-source, web-based application lifecycle management solution. It is a next-generation product for developers to seamlessly manage end-to-end application development.

Red Hat OpenShift.io service authorization extension enables authorization of [OpenShift.io services](https://github.com/fabric8-analytics/fabric8-analytics-vscode-extension) from VS Code.

![ screencast ](https://raw.githubusercontent.com/fabric8-analytics/vscode-osio-auth/master/images/authOsio.gif)

## Quick Start

1. Install the Extension.

 NOTE: OpenShift.io services extension includes the OpenShift.io service authorization. Therefore, when OpenShift.io services extension is installed it automatically enables authorization of OpenShift.io services from VS Code
 
2. Authorization is activated when you open a workspace.

## Available commands

The following commands are available:

|Keyboard Shortcuts|Command|Usage|
|-------|-----|-----------------|
|`Ctrl+Shift+K` on Linux and `Cmd+Shift+K` on Mac|`OSIO-AUTH: Authorize OSIO Services`|Authorize OpenShift.io services in VS Code|
|`Ctrl+Shift+J` on Linux and `Cmd+Shift+J` on Mac|`OSIO-AUTH: Unauthorize OSIO Services`|Unauthorize OpenShift.io services in VS Code|

## Contributing

This is an open source project, contributions and questions are welcome. If you have any feedback, suggestions, or ideas, reach us on:
* Chat: MattterMost channel
[#openshiftio  ](https://chat.openshift.io/developers/channels/town-square)
* Log issues:  [GitHub Repository](https://github.com/fabric8-analytics/vscode-osio-auth/issues)

### Develop this extension

1. Install the dependencies:
`npm install`.
2. Start the compiler in watch mode:
`npm run compile`.
3. Open this folder in VS Code and press `F5`.
