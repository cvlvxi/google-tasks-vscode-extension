'use strict'

import * as fs from 'fs'
import * as path from 'path'
import {Credentials} from 'google-auth-library'
import {RootPath} from '../RootPath'

function getTokenPath(): string {
  return path.join(RootPath.path, 'resources', 'token.json')
}

export function storeToken(token: Credentials) {
  try {
    fs.writeFileSync(getTokenPath(), JSON.stringify(token))
  } catch (err) {
    console.error(err)
    throw new Error('Error storing access token')
  }
}

export function getStoredToken(): Credentials | undefined {
  try {
    return JSON.parse(fs.readFileSync(getTokenPath()).toString())
  } catch (err) {
    if (typeof err === 'object') {
      if (err && 'code' in err && err.code == 'ENOENT') {
        throw new Error('Credentials not found')
      } else {
        console.error(err)
        throw new Error('Error in retrieving credentials')
      }
    }
  }
}

export function removeToken(): boolean {
  try {
    fs.unlinkSync(getTokenPath())
    return true
  } catch (err) {
    console.error(err)
    throw new Error('Error removing access token')
  }
}
