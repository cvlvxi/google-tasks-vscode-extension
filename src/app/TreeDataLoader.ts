'use strict'

import * as vscode from 'vscode'
import * as fs from 'fs'
import {OAuth2Client} from 'googleapis-common'

import GTaskTreeProvider from './TreeDataProviders/GTask'
import {AuthorizeGoogleTreeDataProvider} from './TreeDataProviders/AuthorizeGoogle'
import getOAuthClient from './OAuthClient'
import initiateUserAuthorization from './userAuthorization'
import {getStoredToken} from './Token'

export default function loadTreeData() {
  try {
    const oAuth2Client = getOAuthClient()
    const token = getStoredToken()
    oAuth2Client.setCredentials(token)
    attachTreeProvider(oAuth2Client)
  } catch (err) {
    if (err.message === 'Token not found') {
      vscode.commands.registerCommand('extension.initUserGAuth', initiateUserAuthorization)
      vscode.window.registerTreeDataProvider('googleTasks', new AuthorizeGoogleTreeDataProvider())
      vscode.window.showInformationMessage('Please authorize with Google to continue')
    } else if (err.message === 'Credentials not found') {
      vscode.window.showErrorMessage('Error getting credentials. Please report to the developers.')
    } else {
      console.error(err)
      vscode.window.showErrorMessage(err.message || 'Unknown Error. Please report to the developers.')
    }
  }
}

async function attachTreeProvider(oAuth2Client: OAuth2Client) {
  const gTaskTreeProvider = new GTaskTreeProvider(oAuth2Client)
  vscode.window.registerTreeDataProvider('googleTasks', gTaskTreeProvider)
}