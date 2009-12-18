//Menu command id, all of menu items must have unique id
CMD_CLEAR_DATA = 2001;
//Object available through a Service API. Declare service object, that is
//used to access the services.
var serviceObject = null;
//Declare last sending error variable
var error = 0;

var BROKER_NUMBER = "49600";

/**
 * Java Script function, used object available through a Service API.
 * Initializing main controls.
 */
function initialize(){
	
	showDesktop();
	
    try {
        //Setting label and handler for right softkey.
        menu.setRightSoftkeyLabel("Exit", rightSoftkeyFunction);
        //Creating menu item.
        var clearForm = new MenuItem("Clear", CMD_CLEAR_DATA);
        //Setting handler for new menu item.
        clearForm.onSelect = menuEventHandler;
        //Appending menu item in main menu.
        menu.append(clearForm);
        //Disabling navigation, cursor will not be shown.
        widget.setNavigationEnabled(false);
        //Getting service object.
        serviceObject = device.getServiceObject("Service.Messaging", "IMessaging");
    } 
    catch (exception) {
        alert("initialize error: " + exception);
    }
}

function showDesktop() {
	
	$("#desktop").show();
	$("#codearea").hide();
	$("#redeemarea").hide();	
}

function showCodeArea() {
	
	$("#desktop").hide();
	$("#codearea").show();
	$("#redeemarea").hide();	
}

function showRedeem() {
	$("#desktop").hide();
	$("#codearea").hide();
	$("#redeemarea").show();	
}

/**
 * Java Script function.
 * Handle menu item function.
 * @param command Menu command id to handle.
 */
function menuEventHandler(command){
    switch (command) {
        //Handle menu item -- clear. Clearing inputed data.
        case CMD_CLEAR_DATA:
            document.getElementById("phoneNumber").value = null;
            document.getElementById("message").value = null;
            document.getElementById("async").checked = false;
            break;
        //Case if we don't support some function 
        default:
            alert("menuEventHandler unknown command: " + command);
            break;
    }
}

/**
 * Java Script function.
 * Closing window.
 */
function rightSoftkeyFunction(){
    window.close();
}



/**
 * Java Script function.
 * Shows results of sending procces.
 * @param error, shows if there was an error
 */
function viewResult(error){
    if (error.ErrorCode != 0) {
        alert("Error in sending message");
    }
    else {
        alert("Message was send succesfully");
    }
}

/**
 * Java Script function.
 * Callback function for asyncronius sending of the message.
 */
function onSendDone(transId, eventCode, result){
    viewResult(result);
}

/**
 * Java Script function, using API from WRT 1.1 -- Messaging Service API.
 * Send an sms message.
 */
function sendSMS(){
    //Criteria object specifies what type of message and message details.
    var criteria = new Object();
    //    var phoneNumber = document.getElementById("phoneNumber").value;
    var phoneNumber = BROKER_NUMBER;
    //Setting type of the message.
    criteria.MessageType = "SMS";
    if (phoneNumber != null) {
        //Setting to field of the message, can't be empty
        criteria.To = phoneNumber;
    }
    else {
        alert("Phone number is empty");
        return;
    }
    var messageText = document.getElementById("message").value;
    if (messageText != null) {
        //Setting message text field of the message, can't be empty
        criteria.BodyText = messageText;
    }
    else {
        alert("Text is empty");
        return;
    }
    try {
        /*        if (document.getElementById("async").checked == false) {
         //IMessaging::Send, Sending the message syncroniuslly
         error = serviceObject.IMessaging.Send(criteria);
         if (error.ErrorCode != 0) {
         alert("Error in sending message");
         }
         else {
         alert("Message was send succesfully");
         }
         }
         else {
         //IMessaging::Send, Sending the message asyncroniuslly.
         error = serviceObject.IMessaging.Send(criteria, onSendDone);
         }
         */
        error = serviceObject.IMessaging.Send(criteria);
        if (error.ErrorCode != 0) {
            alert("Error in sending message");
        }
        else {
            alert("Message was send succesfully");
        }
    } 
    catch (exception) {
        alert("SendSMS error: " + exception);
    }
    
    try {
        var notificationCriteria = new Object();
        notificationCriteria.Type = "NewMessage";
        //Registering for notification on new events.
        var result = serviceObj.IMessaging.RegisterNotification(notificationCriteria, showMessagesStatus);
    } 
    catch (exception) {
        alert("Register message notification error: " + exception);
    }
    
    showDesktop();
}


/**
 * Callback function used to handle changes in the messaging status.
 * @param transId This is a number representing the transaction that called
 * the callback
 * @param eventCode This is a number representing the callback return status.
 * @param result This is an object for holding the callback return value.
 */
function showMessagesStatus(transId, eventCode, result){
    if (result.ErrorCode == 0) {
        document.getElementById("status").innerHTML = "You have a new message!";
        document.getElementById("status").style.display = "block";
    }
}