#!/usr/bin/env groovy

node {
    //Clone example project from GitHub repository
    git url: 'https://github.com/jainishshah17/IoT.git', branch: 'master'
    def rtServer = Artifactory.server SERVER_ID
    def rtDocker = Artifactory.docker server: rtServer
    def buildInfo = Artifactory.newBuildInfo()
    def tagDockerApp

    buildInfo.env.capture = true

    //Build docker image named docker-app
    stage ('Build & Deploy') {
            tagDockerApp = "${ARTDOCKER_REGISTRY}/node-version-pi:${env.BUILD_NUMBER}"
            println "Docker App Build"
            docker.build(tagDockerApp)
            println "Docker push" + tagDockerApp + " : " + REPO
            buildInfo = rtDocker.push(tagDockerApp, REPO, buildInfo)
            println "Docker Buildinfo"
            rtServer.publishBuildInfo buildInfo
            sh 'docker rmi '+tagDockerApp+' || true'
     }

    //Test docker image
     stage ('Test') {
//           withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: UPGRADE_CREDENTIALS, usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
//               def curlString = "curl -u " + env.USERNAME + ":" + env.PASSWORD + " " + "-X POST " + UPGRADE_SERVER_URL
//               def updatePropStr = curlString +  "/test?version=${env.BUILD_NUMBER}"
//               println "Curl String is " + updatePropStr
//               def stdout = sh(script: updatePropStr, returnStdout: true)
//               if (stdout.contains("OK")) {
//                  println "*** Passed Test" + stdout
//               }else {
//                  println "*** Failed Test" + stdout
//                  return
//               }
//           }
     }

    //Scan Build Artifacts in Xray
    stage('Xray Scan') {
         if (XRAY_SCAN == "YES") {
             def xrayConfig = [
                'buildName'     : env.JOB_NAME,
                'buildNumber'   : env.BUILD_NUMBER,
                'failBuild'     : false
              ]
              def xrayResults = rtServer.xrayScan xrayConfig
              echo xrayResults as String
         } else {
              println "No Xray scan performed. To enable set XRAY_SCAN = YES"
         }
         sleep 60
     }

    //Promote docker image from staging local repo to production repo in Artifactory
     stage ('Promote') {
            def promotionConfig = [
              'buildName'          : env.JOB_NAME,
              'buildNumber'        : env.BUILD_NUMBER,
              'targetRepo'         : PROMOTE_REPO,
              'comment'            : 'App works with latest released version of gradle swampup app, tomcat and jdk',
              'sourceRepo'         : SOURCE_REPO,
              'status'             : 'Released',
              'includeDependencies': false,
              'copy'               : true
            ]
            rtServer.promote promotionConfig
            reTagLatest (SOURCE_REPO)
            reTagLatest (PROMOTE_REPO)
        }

      //Publish docker image to Bintray
      stage ('Distribute') {
            distributeDocker()
       }
}

//Tag docker image
def reTagLatest (targetRepo) {
    def BUILD_NUMBER = env.BUILD_NUMBER
    sh 'sed -E "s/@/$BUILD_NUMBER/" retag.json > retag_out.json'
     switch (targetRepo) {
          case PROMOTE_REPO :
              sh 'sed -E "s/TARGETREPO/${PROMOTE_REPO}/" retag_out.json > retaga_out.json'
              break
          case SOURCE_REPO :
               sh 'sed -E "s/TARGETREPO/${SOURCE_REPO}/" retag_out.json > retaga_out.json'
               break
      }
    sh 'cat retaga_out.json'
    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: CREDENTIALS, usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
        def curlString = "curl -u " + env.USERNAME + ":" + env.PASSWORD + " " + SERVER_URL
        def regTagStr = curlString +  "/api/docker/$targetRepo/v2/promote -X POST -H 'Content-Type: application/json' -T retaga_out.json"
        println "Curl String is " + regTagStr
        sh regTagStr
    }
}

def updateProperty (property) {
    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: CREDENTIALS, usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
            def curlString = "curl -u " + env.USERNAME + ":" + env.PASSWORD + " " + "-X PUT " + SERVER_URL
            def updatePropStr = curlString +  "/api/storage/${SOURCE_REPO}/docker-app/${env.BUILD_NUMBER}?properties=${property}"
            println "Curl String is " + updatePropStr
            sh updatePropStr
     }
}

def distributeDocker () {
    sh "sed -E 's/DIST_REPO/${DIST_REPO}/' distribute.json > distribute_a.json"
    sh "sed -E 's/PROMOTE_REPO/${PROMOTE_REPO}/' distribute_a.json > distribute_b.json"
    sh "sed -E 's/BUILD_NUMBER/${env.BUILD_NUMBER}/' distribute_b.json > distribute_out.json"
    sh 'cat distribute_out.json'
    withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: CREDENTIALS, usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {
            def curlString = "curl -u " + env.USERNAME + ":" + env.PASSWORD + " " + "-X POST " + SERVER_URL
            def updatePropStr = curlString +  "/api/distribute -H 'Content-Type: application/json' -T distribute_out.json"
            println "Curl String is " + updatePropStr
            sh updatePropStr
     }
}