import * as vscode from 'vscode'
import {tasks_v1} from 'googleapis'

import {GTask} from './GTask.treeItem'

export class GTaskList extends vscode.TreeItem {
  contextValue = 'GTaskList'

  constructor(public taskList: tasks_v1.Schema$TaskList, public childTaskList?: GTask[]) {
    super(taskList.title || 'No Title', vscode.TreeItemCollapsibleState.Collapsed)
  }

  // Overrides
  // You can't override a parent accessor if it has default assigned a value
  // override get tooltip(): string {
  //   return this.taskList.title || 'No Title'
  // }

  // Overrides
  // get description(): string {
  //   return (this.childTaskList || []).length.toString()
  // }
}
