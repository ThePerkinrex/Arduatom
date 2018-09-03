'use babel';

import ArduatomView from './arduatom-view';
import { CompositeDisposable } from 'atom';

export default {

  arduatomView: null,
  modalPanel: null,
  subscriptions: null,
  arduino_executable: null,
  arduino_version: '0.2.1-alpha.preview',

  activate(state) {
    this.arduatomView = new ArduatomView(state.arduatomViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.arduatomView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'arduatom:verify': () => this.verify(),
      'arduatom:upload': () => this.upload()
    }));



    switch (process.platform) {
      case 'darwin':
        this.arduino_executable = `~/.atom/packages/arduatom/executables/arduino-cli-${this.arduino_version}-osx`
        break;
      case 'linux':
        if (process.arch == 'x32'){
          this.arduino_executable = `~/.atom/packages/arduatom/executables/arduino-cli-${this.arduino_version}-linux32`
        }else if (process.arch == 'x64'){
          this.arduino_executable = `~/.atom/packages/arduatom/executables/arduino-cli-${this.arduino_version}-linux64`
        }else if (process.arch == 'arm' | process.arch == 'arm64'){
          this.arduino_executable = `~/.atom/packages/arduatom/executables/arduino-cli-${this.arduino_version}-linuxarm`
        }
        break;
      case 'win32':
        this.arduino_executable = `%userprofile%/.atom/packages/arduatom/executables/arduino-cli-${this.arduino_version}-windows.exe`
        break;
    }
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.arduatomView.destroy();
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
    const { execSync } = require('child_process');
    let stdout = new TextDecoder("utf-8").decode(execSync(this.arduino_executable));
    console.log(stdout);
    console.log(`Current directory: ${process.cwd()}`);
    console.log(`This platform is ${process.platform} ${process.arch}`);
  },

  upload() {
    this.verifyArd();
    console.log('Uploading');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
