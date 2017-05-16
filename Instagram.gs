var CLIENT_ID = '7f54a325826241b0ae14ffb674e71733';
var CLIENT_SECRET = '640d94a7145d4d339cc82d4ebedeac2f';

function doGet(){
  var firstRun = run();
  return firstRun;
}

function run() {
  var service = getService();
  if (service.hasAccess()) {
    var url = 'https://api.instagram.com/v1/users/self/?access_token='+service.getAccessToken();
    var response = UrlFetchApp.fetch(url);
    var result = JSON.parse(response.getContentText());
    Logger.log(JSON.stringify(result, null, 2));
    return HtmlService.createHtmlOutput(JSON.stringify(result, null, 2));
} else {
    var authorizationUrl = service.getAuthorizationUrl();
    Logger.log('Open the following URL and re-run the script: %s',
        authorizationUrl);
   return HtmlService.createHtmlOutput('<a href="'+authorizationUrl+'" target="_blank">Authorise</a>'); 
  }
}

function reset() {
  var service = getService();
  service.reset();
}

function getService() {
  return OAuth2.createService('Instagram')
  .setAuthorizationBaseUrl('https://www.instagram.com/oauth/authorize')
  .setTokenUrl('https://www.instagram.com/oauth/access_token')
  .setClientId(CLIENT_ID)
  .setClientSecret(CLIENT_SECRET)
  .setCallbackFunction('authCallback')
  .setPropertyStore(PropertiesService.getUserProperties())
}

function authCallback(request) {  
  var service = getService();
  var authorized = service.handleCallback(request);
  if (authorized) {    
     return HtmlService.createHtmlOutput('<a href="'+ScriptApp.getService().getUrl()+'" target="_blank">Success</a>');
  } else {
    return HtmlService.createHtmlOutput('Denied');
  }
}

