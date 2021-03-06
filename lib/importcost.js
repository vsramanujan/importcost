'use babel';

import labelize from './labelize';
import codewalk from './walk';

export default {

  subscriptions: null,
  decoraters: [],

  activate() {
    this.clear();
    this.tail();
    atom.workspace.onDidChangeActivePaneItem(() => this.tail());
    atom.workspace.observeTextEditors(editor => {
      editor.onDidSave(() => this.tail())
    })
  },

  tail() {
    this.clear();
    const editor = atom.workspace.getActiveTextEditor();
    if(!editor) return ;
    const path = editor.getPath();
    if(!path || (!path.endsWith(".ts") && !path.endsWith(".js"))) return ;
    const source = editor.getText();
    codewalk(source, path).then(modules => {
      modules.forEach(module => this.decoraters.push(labelize(editor, module)));
    });
  },

  clear() {
    this.decoraters.forEach(decorater => {
      if(decorater) decorater.destroy();
    });
  },

  deactivate() {
    this.subscriptions.dispose()
  }
};
