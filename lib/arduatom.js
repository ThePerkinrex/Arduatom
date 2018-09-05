'use babel';

import ArduatomView from './arduatom-view';
import { CompositeDisposable } from 'atom';
import StatusBarStateView from './status-bar-state-view';

export default {

  arduatomView: null,
  statusView: null,
  modalPanel: null,
  subscriptions: null,
  arduino: require('./arduino'),

  activate(state) {
    console.log(state);
    this.arduatomView = new ArduatomView(state.arduatomViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.arduatomView.getElement(),
      visible: false
    });

    this.statusView = new StatusBarStateView();
    this.statusView.init();

    if(this.arduino.activate()!=0){
      return;
    }

    const { execSync } = require('child_process');
    let stdout = new TextDecoder("utf-8").decode(execSync(this.arduino.arduino_executable + " core update-index --format json"));
    console.log(stdout);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'arduatom:verify': () => this.verify(),
      'arduatom:upload': () => this.upload(),
      'arduatom:new': () => this.newSketch()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.arduatomView.destroy();
    this.statusView.destroy();
  },

  serialize() {
    return {
      arduatomViewState: this.arduatomView.serialize()
    };
  },

  verify() {
    this.verifyArd();
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  verifyArd() {
    console.log("Verifying");
  },

  upload() {
    this.verifyArd();
    console.log('Uploading');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  newSketch() {
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },
  consumeStatusBar(statusBar){
    if(this.arduino.checkProject()){
      console.log(this.statusView);
      statusBar.addRightTile({item: this.statusView,priority: 1000});
      this.subscriptions.add(atom.tooltips.add(this.statusView, {
        title: "<b>Hello<\b>",
        trigger: "click",
        html: true
      }));
    }
  }

};
