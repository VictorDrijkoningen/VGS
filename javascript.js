

var USBconnected = false;

window.setInterval(function() {
  navigator.usb.getDevices()
  //navigator.usb.requestDevice()
  var connectedstatusround = document.getElementById('connectedstatusround');
  var connectedstatustext = document.getElementById('connectedstatustext');
  
  if (USBconnected){
  	connectedstatusround.style.backgroundColor = "#04ff00" ;
	connectedstatustext.innerHTML = "Connected";
  } else {
  	connectedstatusround.style.backgroundColor = "#ff3300" ;
	connectedstatustext.innerHTML = "Not Connected";
  }
  
  
  

}, 1000);


if (!("serial" in navigator)) {
    alert("serial not supported in this browser!")
  }


navigator.serial.addEventListener('connect', (e) => {
  console.log(e);
});



function RefreshUSB(){
	
	//const ports = await navigator.serial.getPorts();
	console.log(ports)
	
	 navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
.then(device => {
  console.log(device.productName);      // "Arduino Micro"
  console.log(device.manufacturerName); // "Arduino LLC"
})
.catch(error => { console.error(error); });
}