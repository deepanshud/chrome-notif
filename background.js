var registrationId = "";

//Return a new notification ID, which is to be used in the notification.
function getNotificationId()
{
	var id = Math.floor(Math.random() * 9007199254740992) + 1;
	return id.toString();
}

function messageReceived(message)
{
	var messageString = "";
 	 for (var key in message.data) 
 		{
    		if (messageString != "")
      			messageString += ", "
    		messageString += key + ":" + message.data[key];
  	 	}
  console.log("Message received: " + messageString);

  chrome.notifications.create(getNotificationId(), {
  	title: 'Hike Message',
  	iconUrl: 'ic_launcher.png',
  	type: 'basic',
  	message: messageString
  }, function() {});
}

function firstTimeRegistration() {
  
  chrome.storage.local.get("registered", function(result) {
    // If already registered, bail out.

    if (result["registered"])

      {
        console.log("Inside registered");
        return;
      }
  	
  	else
  	{   
        console.log("Not registered yet");
        register();
  	}
  });
}

// Set up a listener for GCM message event.
chrome.gcm.onMessage.addListener(messageReceived);
// Set up listeners to trigger the first time registration.
chrome.runtime.onInstalled.addListener(firstTimeRegistration);
chrome.runtime.onStartup.addListener(firstTimeRegistration);



// Code for registering with GCM begins here

function register()
{
  var sender_id = "940463892411";
  chrome.gcm.register([sender_id], registerResult);
  console.log("Registering with " + sender_id);
}

function registerResult(regId)
{
  registrationId = regId;
  console.log("GCM Registration Id " + registrationId);
  if(chrome.runtime.lastError)
  {
    //If the registration fails, retry : 
    console.log("Retrying registration");
    register();
    return;
  }

  chrome.storage.local.set({'registered': true});
  chrome.storage.local.set({'registrationId': registrationId});
}
