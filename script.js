const DEVICE = "<your device name>"
const SECRET = "<your secret>"
const SHEET_URL = "<your google spreadsheet url>"

var ss = SpreadsheetApp.openByUrl(SHEET_URL);
var sheet = selectOrCreateSheet();


// entry point for POST requests
function doPost(e){
  var action = e.parameter.action;
  var device = e.parameter.device;
  var secret = e.parameter.secret;

  // verify action, device and secret
  if (action==="addItem" && device===DEVICE && secret===SECRET){

    var category = e.parameter.category;
    var amount = e.parameter.amount;

    //verify category and amount as defined
    if (typeof category !== 'undefined' && typeof amount !== 'undefined'){
      return addItem(category, amount)
    } else {
    return ContentService.createTextOutput("Error: category or amount are not defined!").setMimeType(ContentService.MimeType.TEXT)
    }
  } else {
    return ContentService.createTextOutput("Error: action, device or secret not correct!").setMimeType(ContentService.MimeType.TEXT)
  }
}

function addItem(category, amount){
  
  try{

    // get current date
    var newDate = new Date();

    // evaluate amount string
    var amountTokens = String(amount).split(" ")
    var comment = amountTokens.slice(1).join(" ")

    // parse amount number
    var parsedAmount = parseFloat(amount.replace(",", ".")).toFixed(2)

    // add to spreadsheeet
    if (amountTokens.length > 1){
      sheet.appendRow([newDate, String(category), parsedAmount, comment])
      return ContentService.createTextOutput(`added expense: ${amount}€ (${category}-${comment})`).setMimeType(ContentService.MimeType.TEXT)
    } else {
      sheet.appendRow([newDate, String(category), parsedAmount])
      return ContentService.createTextOutput(`added expense: ${amount}€ (${category})`).setMimeType(ContentService.MimeType.TEXT)
    }
    
  } catch (error){
    Logger.log(error)
    return ContentService.createTextOutput("error: could not finish: " + error).setMimeType(ContentService.MimeType.TEXT)   	
  }
}

/**
 * Utility function to select a sheet or create a new for the current month
 * @returns the sheet object
 */
function selectOrCreateSheet(){
  var month = new Date().toLocaleString('default', { month: 'short' }) + new Date().getFullYear();
  var yourNewSheet = ss.getSheetByName(month);
  if (yourNewSheet === null) {
    yourNewSheet = ss.getSheetByName("_default").copyTo(ss).setName(month);
  }
  return yourNewSheet
}
