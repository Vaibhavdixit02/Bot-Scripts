var CONSUMER_KEY = '---';
var CONSUMER_SECRET = '---';

/**
 * Authorizes and makes a request to the Twitter API.
 */
function doGet(){
  var firstrun = run();
  return firstrun;
}


function run() {
  var d = new Date();
  var timeStamp = d.getTime();
  var service = getService();
  if (service.hasAccess()) {
    var url = "https://api.twitter.com/1.1/account/verify_credentials.json";
    var response = service.fetch(url);
    var result = JSON.parse(response.getContentText());
    Logger.log(JSON.stringify(result, null, 2));
    //return ContentService.createTextOutput(JSON.stringify(result, null, 2));
    return HtmlService.createHtmlOutput(result);
  } else {
    var authorizationUrl = service.authorize();
    Logger.log('Open the following URL and re-run the script: %s',
        authorizationUrl);
    return HtmlService.createHtmlOutput('<a href="'+authorizationUrl+'" target="_blank">Authorise</a>');
  }
}

function tweetforme(e) {
  var d = new Date();
  var timeStamp = d.getTime();
  var service1 = getService();
  if (service1.hasAccess()) {
    var url = 'https://api.twitter.com/1.1/statuses/update.json';
    var payload = {
      status: 'It\'s a tweet!' + timeStamp
    };
    var response = service1.fetch(url, {
      method: 'post',
      payload: payload
    });
    
    var result = JSON.parse(response.getContentText());
    Logger.log(JSON.stringify(result, null, 2));
}
}
/**
 * Reset the authorization state, so that it can be re-tested.
 */
function reset() {
  var service = getService();
  service.reset();
}

/**
 * Configures the service.
 */
function getService() {
  return OAuth1.createService('Twitter')
      // Set the endpoint URLs.
      .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
      .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
      .setAuthorizationUrl('https://api.twitter.com/oauth/authorize')

      // Set the consumer key and secret.
      .setConsumerKey(CONSUMER_KEY)
      .setConsumerSecret(CONSUMER_SECRET)

      // Set the name of the callback function in the script referenced
      // above that should be invoked to complete the OAuth flow.
      .setCallbackFunction('authCallback')

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties());
}

/**
 * Handles the OAuth callback.
 */
function authCallback(request) {
  var service = getService();
  var authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('<a href="'+ScriptApp.getService().getUrl()+'" target="_blank">Success</a>');
  } else {
    return HtmlService.createHtmlOutput('Denied');
  }
}
