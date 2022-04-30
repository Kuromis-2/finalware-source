const { getComPorts, getNewlyPluggedInPorts, updateMouse } = require('./firmwareutil.js');
// Function that takes in a key and saves the com ports as json to local storage
// Called by onload to save the ports before and after plugging in the mouse
// Saving both lists to beforePorts and afterPorts
const os = require('os');
const storage = require('electron-json-storage');

storage.setDataPath(os.tmpdir());


function saveComPorts(key){
  const dataPath = storage.getDataPath();
  console.log(dataPath);
  const comPorts = getComPorts();
  //store comports to locals storage with electron-json-storage
  storage.set(key, comPorts, function(error) {
    if (error) throw error;
  });
  console.log(`Saved ${comPorts} to local storage under key ${key}`);
}

function updateMouseHelper(){
  console.log('Updating mouse');

  // Get before and after port list from local storage unjsonify
  const beforePorts = JSON.parse(localStorage.getItem('beforePorts'));
  const afterPorts = JSON.parse(localStorage.getItem('afterPorts'));

  // Get the ports that were plugged in
  const pluggedInPorts = getNewlyPluggedInPorts(beforePorts, afterPorts);

  console.log(`Plugged in ports: ${pluggedInPorts}`);

  // If there are no plugged in ports, return
  if (pluggedInPorts.length === 0) {
    console.error('No new com ports plugged in');
    return;
  }

  // If there is more than one plugged in port console error and return
  if (pluggedInPorts.length > 1) {
    console.error('More than one com port plugged in');
    return;
  }

  // If there is only one plugged in port, update the mouse
  if (pluggedInPorts.length === 1) {
    const port = pluggedInPorts[0];
    const firmwareVersion = localStorage.getItem('firmwareVersion');
    updateMouse(port, firmwareVersion); 
  }

  console.log('Updated mouse');
}