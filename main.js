//global
var lastMessageDiv;
var new_message_sound = new Audio('./sound/new_message.wav');
var get_all = document.getElementById('get_all');

//on load - check user interaction
var userInteract = sessionStorage.userInteract;

window.addEventListener('load', function() {
	if (userInteract !== 'true') {
		document.getElementById("overlay").style.display = "block";
		return;
	} else {startActivity()}
	
});

//reset userInteract flag on manual refresh
window.onbeforeunload = function () {
   sessionStorage.userInteract = false;
}


function startActivity(){

	//hide overlay
	document.getElementById("overlay").style.display = "none";
	sessionStorage.userInteract = true;
	
	if (localStorage.get_all === 'true') {
		console.log("get all");
		get_all.checked = true;
	}
	
	//query messages
	message_get();
	
	//schedule query message
	window.setInterval(function() {
		message_get();
	}, 20000);
	
	//prevent refresh after form submit
	if ( window.history.replaceState ) {
		window.history.replaceState( null, null, window.location.href );
	}
}


function eventListenerAdd() {
	
	//event listener to add button
	document.getElementById("messageAdd").addEventListener('click', openEditForm, false);
	
	//event listener get all checkbox
	document.getElementById("get_all").addEventListener('click', messages_type, false);
	
	//event listener to mark as read buttons
	let markAsReadButtons = document.getElementsByClassName("btnMarkAsRead");
	for (let i = 0; i < markAsReadButtons.length; i++) {
		markAsReadButtons[i].addEventListener('click', markAsReadMessage, false);
	}
	
	//event listener to edit buttons
	let editButtons = document.getElementsByClassName("btnEdit");
	for (let i = 0; i < editButtons.length; i++) {
		editButtons[i].addEventListener('click', openEditForm, false);
	}
	
	//event listener to save and close buttons
	document.getElementById("editSave").addEventListener('click', editFormSave, false);
	document.getElementById("editClose").addEventListener('click', editFormClose, false);
	
	//event listener to delete buttons
	let deleteButtons = document.getElementsByClassName("btnDelete");
	for (let i = 0; i < deleteButtons.length; i++) {
		deleteButtons[i].addEventListener('click', deleteMessage, false);
	}
	
	
}

function message_get() {
	
	var type = null;
	if (get_all.checked) {type = 'all'};
	
  fetch('/handlers/message_get.php', {
        method: 'post',
		header: {"Content-Type": "application/json"},
		body: JSON.stringify({
			"type": type
		}),
    }).then(function(response) {
            if (response.status >= 200 && response.status < 300) {
                return response.text()
            }
            throw new Error(response.statusText)
        })
        .then(function(response) {
			document.getElementById("messageArea").innerHTML = response;
			eventListenerAdd();
			soundAlert();
        })	
}

function markAsReadMessage() {

	let id = this.parentNode.parentNode.getAttribute("data-id");
	
	let readMessages = JSON.parse(localStorage.getItem("readMessages"));
	localStorage.removeItem("readMessages");
	
	//if empty, create array
	if (readMessages == null) {readMessages=[]}
	
	//if no exist yet
	if (!readMessages.includes(id)) {readMessages.push(id)}
	localStorage.setItem("readMessages", JSON.stringify(readMessages));
	markAsReadAll();
	
	console.log("mark as read: " + readMessages);
}

function markAsReadAll() {
	let readMessages = JSON.parse(localStorage.getItem("readMessages"));
	
	//if has messages to mark as read
	if (readMessages != null) {

		//get all messagess
		let messages = document.getElementsByName("messageContainer");
		
		//get rows id
		for (let i = 0;messageContainer = messages[i]; i++) {
			
			let messageID = messageContainer.dataset.id;
			
			//if row id includes in rows to mark as read
			if (readMessages.includes(messageID)) {
				let messageMarkAsReadIcon = messageContainer.querySelector('button[class="btnMarkAsRead"]');
				messageMarkAsReadIcon.style.backgroundImage = "url('/images/readIcon.png')";
				messageContainer.style.color = "grey";
				console.log("messages marked as read: " + messageID);
			}
		}
		
	}
}

function messages_type () {	
	localStorage.get_all = get_all.checked;
	message_get();
}

function openEditForm(event) {
	
	event.preventDefault();
  //get data from caller button
  let messageContainer = this.parentNode.parentNode;
  let id = messageContainer.getAttribute("data-id");

	//set date picker value and limits
	let expirationPicker = document.getElementById("editExpiration");
	let currentDate = new Date();
	let expirationPastLimit = currentDate.setDate(currentDate.getDate() - 1);
	let expiratiotFutureLimit = currentDate.setDate(currentDate.getDate() + 30);

	expirationPicker.min = formatDateYYYYMMDD(expirationPastLimit);
	expirationPicker.max = formatDateYYYYMMDD(expiratiotFutureLimit);
  
  //if edit from existing post, get data from it
  if (id != null) {
		console.log("edit existing record");
		document.getElementById("editAction").innerHTML = "Edit";
		
		let category = messageContainer.querySelectorAll('[name=category]')[0].innerHTML;
		let message = (messageContainer.querySelectorAll('[name=message]')[0].innerHTML).replace("<br>","");
		let author = messageContainer.querySelectorAll('[name=author]')[0].innerHTML;
		let expiration = messageContainer.querySelectorAll('[name=expiration]')[0].innerHTML + "/" + (new Date()).getFullYear(); //add current year for dd/mm/yyyy format
		
		
	  
		//set data to form
		document.getElementById("editID").value = id;
		document.getElementById("editCategory").value = category;
		document.getElementById("editMessage").value = message;  	  
		document.getElementById("editAuthor").value = author;
		document.getElementById("editExpiration").value = formatDateYYYYMMDD(stringToDate(expiration));
		
  } else {
	  console.log("add new record");
	  document.getElementById("editAction").innerHTML = "Create";
	  expirationPicker.valueAsDate = new Date();
	  
	
  }
  
	
  //show form
  document.getElementById("formEditDiv").style.display = "block";
}

function editFormSave() 
{
	let form = document.getElementById('formEdit')
	let id = document.getElementById("editID").value;
	let category = document.getElementById("editCategory").value;
	let message = document.getElementById("editMessage").value;
	let author = document.getElementById("editAuthor").value;
	if (author === "") {author = "unknown"};
	
	let expiration = document.getElementById("editExpiration").value;
		
	let xhr = new XMLHttpRequest();
	
	if (id) {
			//edit
			var url = "handlers/message_edit.php";
		} else {
			//add
			var url = "handlers/message_add.php";
		}			

	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		
		if (xhr.readyState === 4 && xhr.status === 200) {
			
			alert(xhr.responseText);
			editFormClose();
			message_get();
			
		}
	};
	
	let data = JSON.stringify({
							id: id,		
							category: category,
							message: message,
							author: author,
							expiration: expiration
							});
	
	console.log("sending " + data + " to " + url);
	xhr.send(data);
		
}

function editFormClose() {
	document.getElementById("formEdit").reset();
	document.getElementById("formEditDiv").style.display = "none";
}


function deleteMessage() {
	
	//get data from caller button
	let id = this.parentNode.parentNode.getAttribute("data-id");


	let userConfirm = confirm("Are you sure you want to delete?");
	if (userConfirm != true) {exit;}
	
	let xhr = new XMLHttpRequest();
	let url = "handlers/message_delete.php";
	
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/json");
	xhr.onreadystatechange = function () {
		
		if (xhr.readyState === 4 && xhr.status === 200) {
			
			console.log(xhr.responseText);
			message_get();
		}
	};
	
	let data = JSON.stringify({
							id: id
							});
	xhr.send(data);
	console.log("sending delete request for id " + data);
}

function formatDateYYYYMMDD(date) {
	
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function stringToDate(str) {
	let arr = str.split("/");
	return new Date(arr[2], arr[1]-1, arr[0]);
}


function soundAlert() {
	

	let lastMessageID = localStorage.getItem('lastMessageid') || 0;
	let messages = document.getElementsByName("messageContainer");
	lastMessageDiv = messages[0];
	let lastMessageID_new = lastMessageDiv.dataset.id;
	
	

	if (lastMessageID_new > lastMessageID) {	
	
		console.log("play sound");
		new_message_sound.play();
		localStorage.setItem("lastMessageid", lastMessageID_new);
		blink(lastMessageDiv);
		
	}
	
}

function blink(){
	
	let messageText = lastMessageDiv.querySelectorAll('.message')[0];	
	messageText.className += " blink_me";

}
