//Menu command id, all of menu items must have unique id
CMD_CLEAR_DATA = 2001;
CMD_BACK_DATA = 2002;
//Object available through a Service API. Declare service object, that is
//used to access the services.
var serviceObj = null;
//Declare last sending error variable
var error = 0;
var balance = 0;

var BROKER_NUMBER = "49600";
var keyword = "air c ";

window.onload = initialize;
/**
 * Java Script function, used object available through a Service API.
 * Initializing main controls.
 */
function initialize(){
	
    try {

		serviceObj = device.getServiceObject("Service.Messaging", "IMessaging");

        //Setting label and handler for right softkey.
        menu.setRightSoftkeyLabel("Exit", rightSoftkeyFunction);
        
        //Creating menu item.    
        var clearForm = new MenuItem("Clear", CMD_CLEAR_DATA);
        var backForm = new MenuItem("Back", CMD_BACK_DATA);
        
        //Setting handler for new menu item.
        clearForm.onSelect = menuEventHandler;
        backForm.onSelect = menuEventHandler;
        
        //Setting handler for new menu item.
        clearForm.onSelect = menuEventHandler;
        backForm.onSelect = menuEventHandler;
        
        //Appending menu item in main menu.
        menu.append(clearForm);
        menu.append(backForm);
        
        //Disabling navigation, cursor will not be shown.
        widget.setNavigationEnabled(false);
        //Getting service object.
        
    } 
    catch (exception) {
        alert("initialize error: " + exception);
    }
    showDesktop();
}

function setBalanceText(){
    var doc = Document;
    var balanceText = doc.getElementById("balancetext");
    balanceText.innerHTML = "Your balance is " + balance + " points.";
}

function showDesktop(){

    $("#desktop").show();
    $("#codearea").hide();
    $("#redeemarea").hide();
    
    setBalanceText();
    
}

function showCodeArea(){

    $("#desktop").hide();
    $("#codearea").show();
    $("#redeemarea").hide();
    
}

function showRedeem(){
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
            document.getElementById("message").value = null;
            break;
        //Case if we don't support some function 
        case CMD_BACK_DATA:
            showDesktop();
            break;
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
    
    var phoneNumber = BROKER_NUMBER;
    //Setting type of the message.
    criteria.MessageType = "SMS";
    criteria.To = BROKER_NUMBER;
    
    var messageText = document.getElementById("message").value;
    if (messageText != null) {
        //Setting message text field of the message, can't be empty
        criteria.BodyText = keyword + messageText;
    }
    else {
        alert("Text is empty");
        return;
    }
    try {

        var result = serviceObj.IMessaging.Send(criteria);
        checkError(result);
    } catch (exception) {
        alert("SendSMS Exception: " + exception);
    }
   
    showDesktop();
}

function checkError(error) {
    if (error.ErrorCode != 0) {
        alert("Error in sending message");
    } else {
        alert("Message was sent succesfully");
    }
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
