var USBconnected = false;

if (!("serial" in navigator)) { alert("serial not supported in this browser!") }

navigator.serial.addEventListener('connect', (e) => {
  console.log(e);
});

navigator.serial.addEventListener('disconnect', (e) => {
  console.log(e);
  USBconnected = false;
});




window.setInterval(function () {

  displayConnection();
  UpdateOutputText();


}, 500);

startupShowWelcomeOnStartop();



function usergcodeinput() {

  var GcodeInput = document.getElementById('InputGcodeField').value + '<br>';
  console.log(GcodeInput);
  UpdateOutputText(GcodeInput);

  document.getElementById('InputGcodeField').value = "";
  serialwrite(GcodeInput);
}



async function UpdateOutputText() {
  if (this.USBconnected) {
    text = await serialread();
    var OutputText = document.getElementById('OutputText');
    OutputText.innerHTML = OutputText.innerHTML + text;
    OutputText.scrollTop = OutputText.scrollHeight;
  }
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    let fr = new FileReader();
    fr.onload = x => resolve(fr.result);
    fr.readAsText(file);
  })
}

async function startJob() {
  input = document.getElementById('gcodefile');
  try {
    erText = await readFile(input.files[0]);
  } catch {
    alert("Please input a file for CNC cutting");
  }
  serialwrite(erText + "\n");
  serialwrite("G91 \n");
}


async function calculatejob1() {
  input = document.getElementById('gcodefile');
  text = " "
  try {
    text = await readFile(input.files[0]);
  } catch {
    alert("Please input a file for CNC cutting");
  }


  if (text != " ") {
    lines = text.split(/\r?\n/);
    var x0 = "";
    var y0 = "";
    var xr = "";
    var yr = "";
    console.log(lines.length)
    filelength = lines.length-10
    for (let i = 0; i < filelength; i++) {
      lines[i + 1] = lines[i + 1] + " ";
      lines[i + 2] = lines[i + 2] + " ";
      //console.log(lines[i]);
      if (lines[i].toLowerCase().includes("ranges table")) {
        console.log("found table");
        for (let a = 0; a < lines[i + 1].length; a++) {
          //console.log(lines[i + 1].toLowerCase()[a]);
          if (lines[i + 1].toLowerCase()[a] == "m" && lines[i + 1].toLowerCase()[a + 1] == "i" && lines[i + 1].toLowerCase()[a + 2] == "n" && lines[i + 1].toLowerCase()[a + 3] == "=") {
            console.log("found x min");
            for (let b = 0; b < lines[i + 1].length; b++) {
              if (lines[i + 1].toLowerCase()[a + 4 + b] !== " ") {
                x0 = x0 + lines[i + 1].toLowerCase()[a + 4 + b];
                //console.log("x0= " + x0)

              } else {
                console.log("x0= " + x0)
                break;
              }
            }
          }

          if (lines[i + 1].toLowerCase()[a] == "i" && lines[i + 1].toLowerCase()[a + 1] == "z" && lines[i + 1].toLowerCase()[a + 2] == "e" && lines[i + 1].toLowerCase()[a + 3] == "=") {
            console.log("found x size");
            for (let b = 0; b < lines[i + 1].length; b++) {
              if (lines[i + 1].toLowerCase()[a + 4 + b] !== ' ') {
                xr = xr + lines[i + 1].toLowerCase()[a + 4 + b];
                //console.log("xr= " + xr)

              } else {
                console.log("xr= " + xr)
                break;
              }
            }
          }

          if (lines[i + 2].toLowerCase()[a] == "m" && lines[i + 2].toLowerCase()[a + 1] == "i" && lines[i + 2].toLowerCase()[a + 2] == "n" && lines[i + 2].toLowerCase()[a + 3] == "=") {
            console.log("found y min");
            for (let b = 0; b < lines[i + 2].length; b++) {
              if (lines[i + 2].toLowerCase()[a + 4 + b] !== " ") {
                y0 = y0 + lines[i + 2].toLowerCase()[a + 4 + b];
                //console.log("y0= " + y0)

              } else {
                console.log("y0= " + y0)
                break;
              }
            }
          }

          if (lines[i + 2].toLowerCase()[a] == "i" && lines[i + 2].toLowerCase()[a + 1] == "z" && lines[i + 2].toLowerCase()[a + 2] == "e" && lines[i + 2].toLowerCase()[a + 3] == "=") {
            console.log("found y size");
            for (let b = 0; b < lines[i + 2].length; b++) {
              if (lines[i + 2].toLowerCase()[a + 4 + b] !== ' ') {
                yr = yr + lines[i + 2].toLowerCase()[a + 4 + b];
                //console.log("yr= " + yr)

              } else {
                console.log("yr= " + yr)
                break;
              }
            }
          }


        }
        break;
      }
    }


    serialwrite("M114 \n");
    console.log("x0 = " + x0);
    console.log("y0 = " + y0);
    console.log("xr = " + xr);
    console.log("yr = " + yr);





    for (let i = 0; i < text.length; i++) {
      console.log(text[i]);
      if (text[i].toLowerCase() == "x") {
        for (let l = 1; l < text.length; l++) {
          xnow = xnow + text[i + l];
          if (text[i + l + 1] == ' ') {
            break;
          }
        }
      }

      if (text[i].toLowerCase() == "y") {
        for (let l = 1; l < text.length; l++) {
          ynow = ynow + text[i + l];
          if (text[i + l + 1] == ' ') {
            break;
          }
        }
      }

      if (text[i].toLowerCase() == "z") {
        for (let l = 1; l < text.length; l++) {
          znow = znow + text[i + l];
          if (text[i + l + 1] == ' ') {
            break;
          }
        }
      }


    }

    console.log("x " + xnow);
    console.log("y " + ynow);
    console.log("z " + znow);
    serialwrite("G91 \n");
    serialwrite("G0 X " + x0 + " Y " + y0 + "\n");
    serialwrite("G0 Y " + yr + "\n");
    serialwrite("G0 X " + xr + "\n");
    serialwrite("G0 Y " + -yr + "\n");
    serialwrite("G0 X " + -xr + "\n");
    serialwrite("G0 X " + -x0 + " Y " + -y0 + "\n");
  } else {
    serialconnect()
  }
}


async function showJob() {
  //alert("make check if reaches end");
  calculatejob1();
}

function displayConnection() {
  var connectedstatuscolor = document.getElementById('connectedstatuscolor');
  var connectedstatustext = document.getElementById('connectedstatustext');
  if (typeof this.port !== 'undefined') {
    if (this.port.readable) {
      window.USBconnected = true;
    } else {
      window.USBconnected = false;
    }
  }

  if (window.USBconnected) {
    var green = "#19a317";
    connectedstatuscolor.style.borderColor = green;
    connectedstatustext.innerHTML = "CONNECTED";
    connectedstatustext.style.color = green;
  } else {
    var red = "#db0f0f"
    connectedstatuscolor.style.borderColor = red;
    connectedstatustext.innerHTML = "NOT CONNECTED";
    connectedstatustext.style.color = red;
  }
}



function ShowAbout(a) {
  var AboutSection = document.getElementById('AboutSection');
  AboutSection.hidden = !AboutSection.hidden
  if (a == true) {
    AboutSection.hidden = false;
  }
  if (a == false) {
    AboutSection.hidden = true;
  }

}


function ShowSettings(a) {
  var Settings = document.getElementById('Settings');
  Settings.hidden = !Settings.hidden
  if (a == true) {
    Settings.hidden = false;
  }
  if (a == false) {
    Settings.hidden = true;
  }

}




function startupShowWelcomeOnStartop() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const showwelcome = urlParams.get('showwelcome');


  var AboutSection = document.getElementById('AboutSection');

  if (showwelcome !== "0") {
    window.setTimeout(function () { ShowAbout(true); }, 300);
    window.setTimeout(function () { document.getElementById('settingshowstartuptext').checked = true; }, 300);
  }
}


function onchangeShowWelcomeOnStartop() {

  var url = new URL(document.location);

  var showstartuptext = document.getElementById('settingshowstartuptext');
  if (showstartuptext.checked == false) {
    url.searchParams.set('showwelcome', '0');
  } else {
    url.searchParams.set('showwelcome', '1');
  }
  document.location = url;

}

function jitter(data1, data2) {
  if (!window.USBconnected) {
    serialconnect();
  } else {
    if (data1 == "home") {
      serialwrite("G28 " + data2);
    } else {
      serialwrite("G91 \n G0 " + data1 + " " + data2);
    }
  }

}


async function serialconnect() {

  if ('serial' in navigator) {
    try {
      const port = await navigator.serial.requestPort();
      serialbaudrate = document.getElementById('baudratesetting').value;

      await port.open({ baudRate: serialbaudrate });
      console.log("opening port with" + serialbaudrate);
      this.reader = port.readable.getReader();
      this.writer = port.writable.getWriter();
      this.encoder = new TextEncoder();
      this.decoder = new TextDecoder();
      this.USBconnected = true;

      //setTimeout(function () { serialwrite("G28 \n G91"); }, 2000);

    }
    catch (err) {
      console.error('There was an error opening the serial port:', err);
    }
  }
  else {
    console.error('The Web serial API doesn\'t seem to be enabled in your browser.');
  }
}




async function serialwrite(data) {
  console.log("serial writing ", data);
  if (USBconnected) {
    const dataArrayBuffer = this.encoder.encode(data + "\n");
    return await this.writer.write(dataArrayBuffer);
  }
  else {
    serialconnect()
  }
}


async function serialread() {
  if (USBconnected) {
    try {
      const readerData = await this.reader.read();
      return this.decoder.decode(readerData.value);
    }
    catch (err) {
      const errorMessage = `error reading data: ${err}`;
      console.error(errorMessage);
    }
  }
}







