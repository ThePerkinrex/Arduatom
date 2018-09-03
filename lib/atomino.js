'use babel';

import AtominoView from './atomino-view';
import { CompositeDisposable } from 'atom';

export default {

  atominoView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atominoView = new AtominoView(state.atominoViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atominoView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atomino:verify': () => this.verifyCommand(),
      'atomino:upload': () => this.uploadCommand()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atominoView.destroy();
  },

  serialize() {
    return {
      atominoViewState: this.atominoView.serialize()
    };
  },

  toggle() {
    console.log('Atomino was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

  verifyCommand() {
    this.verify();
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

  verify() {
    console.log('Verifying');
  }

  uploadCommand() {
    this.upload();
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

  upload() {
    this.verify();
    console.log('Uploading');
  }

};
