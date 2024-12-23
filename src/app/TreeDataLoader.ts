'use strict'

import * as vscode from 'vscode'
import {OAuth2Client} from 'googleapis-common'

import gTaskTreeProvider from './TreeDataProviders/GTask/GTask.TreeDataProvider'
import getOAuthClient from './OAuthClient'
import {getStoredToken} from './Token'

export default function loadTreeData() {
  try {
    const oAuth2Client = getOAuthClient()
    const token = getStoredToken()
    if (token) {
      oAuth2Client.setCredentials(token)
      attachTreeProvider(oAuth2Client)
      vscode.commands.executeCommand('setContext', 'GoogleUserTokenExists', true)
    }
  } catch (err) {
    if (typeof err === 'object') {
      if (err && 'code' in err && err.code == 'ENOENT') {
        throw new Error('Credentials not found')
      } else if (err && 'message' in err && err.message === 'Token not found') {
        vscode.window.showInformationMessage('Please authorize with Google to continue')
      } else if (err && 'message' in err && err.message === 'Credentials not found') {
        vscode.window.showErrorMessage('Error getting credentials. Please report to the developers.')
      } else {
        console.error(err)
        throw new Error('Unknown Error')
      }
    }
  }
}

async function attachTreeProvider(oAuth2Client: OAuth2Client) {
  gTaskTreeProvider.setOAuthClient(oAuth2Client)
  vscode.window.registerTreeDataProvider('googleTasks', gTaskTreeProvider)
  vscode.commands.executeCommand('setContext', 'HideCompleted', true)
}
