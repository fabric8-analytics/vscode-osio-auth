#!/usr/bin/env groovy

def installBuildRequirements(){
	def nodeHome = tool 'nodejs-7.7.4'
	env.PATH="${env.PATH}:${nodeHome}/bin"
	sh "npm install -g typescript"
	sh "npm install -g vsce"
    sh "npm install -g rimraf"
}

def buildVscodeExtension(){
	sh "npm install"
	sh "npm run vscode:prepublish"
}

node('rhel7'){

	stage 'Checkout vscode-osio-auth code'
	deleteDir()
	git url: 'https://github.com/fabric8-analytics/vscode-osio-auth.git'

	stage 'install vscode-yaml build requirements'
	installBuildRequirements()

	stage 'Build vscode-osio-auth'
	sh "npm install"
	sh "npm run vscode:prepublish"

	stage 'Test vscode-osio-auth for staging'
	wrap([$class: 'Xvnc']) {
		sh "npm test --silent"
	}

	stage "Package vscode-osio-auth"
	def packageJson = readJSON file: 'package.json'
	sh "vsce package -o yaml-${packageJson.version}-${env.BUILD_NUMBER}.vsix"

	stage 'Upload vscode-osio-auth to staging'
	def vsix = findFiles(glob: '**.vsix')
	sh "rsync -Pzrlt --rsh=ssh --protocol=28 ${vsix[0].path} ${UPLOAD_LOCATION}"
	stash name:'vsix', includes:vsix[0].path
}

node('rhel7'){
	timeout(time:5, unit:'DAYS') {
		input message:'Approve deployment?', submitter: 'bercan'
	}

	stage "Publish to Marketplace"
	unstash 'vsix';
	withCredentials([[$class: 'StringBinding', credentialsId: 'vscode_java_marketplace', variable: 'TOKEN']]) {
		def vsix = findFiles(glob: '**.vsix')
		sh 'vsce publish -p ${TOKEN} --packagePath' + " ${vsix[0].path}"
	}
	archive includes:"**.vsix"
}