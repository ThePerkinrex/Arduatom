module.exports = {
  arduino_executable: null,
  arduino_version: '0.2.1-alpha.preview',
  arduino_board: null,
  arduino_sketch_dir: null,

  activate() {
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

    if(!this.arduino_executable){
      console.log(`Arduino executable not found for ${process.platform} ${process.arch}`);
      return 1;
    }

    return 0;
  },

  checkProject() {
    let projectDirs = atom.project.getDirectories();


    for(let i=0;i<projectDirs.length;i++){
      let dir = projectDirs[i];

      if(dir.getFile(dir.getBaseName()+".ino").exists()){
        this.arduino_sketch_dir = dir.getPath();
        return true;
      }
    }
    return false;
  }

  
}
