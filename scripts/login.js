/*

Login handler that is based on POSTing the inputted username and password to a node.js server hosted with OnRender
POST methods should include a JSON body that only includes Username and Password, and the server with return a boolean that
determines the success of the inputs alongside with potential authentication procedures. 
(An auth token and a userid to be cross-referenced server side)

*/


// Discerning the elements in the document that the user will input data into
const usernameField = document.querySelector("#Username");
const passwordField = document.querySelector("#Password");

// The button that the user will click to submit their account data
const submitAccount = document.querySelector("#submitAccount");

// Server URL to contact for credential verification

const serverURL = ""

// Cookie Config

const authTokenName = "authToken"
const userIDName = "userID"
const sessionTokenName = "sessionToken"

// Token Server Config

const tokenServerURL = 'https://backendbank-w8al.onrender.com';
const URLOnboarding = '/account-onboarding';
const URLTest = '/test'

// An event listener that is watching a click from the accountSubmit button and will call the accountSubmit function
submitAccount.addEventListener("click", webRequestTest(tokenServerURL + URLOnboarding));

/*

Boilerplate cookie handling, probably not secure but whatever
findCookieValue: basically indexes the cookies for the value after cookieName as provided
changeCookieValue: uses the findCookieValue function to locate a value in the string and replace it
createCookie: self expanatory

*/

async function webRequestTest(url) {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        username:"test",
        password:"test1"
      }),
      mode: 'no-cors',
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    return json
  } catch (error) {
    console.error(error.message);
  }
}

function findCookieValue(cookieName) {

    const cookieValue = document.cookie.split("; ").find((row) => row.startsWith(`${cookieName}=`)).split("=")[1];
    return cookieValue;

}

function changeCookieValue(cookieName, newValue) {

    const toReplace = findCookieValue(cookieName);
    const newCookie = document.cookie.replace(toReplace, newValue);

    return newCookie;

}


function createCookie(cookieName, cookieValue) {

    document.cookie = `${cookieName}=${cookieValue}; Secure`

}

/*

    Primary function of the login page
    Uses fetch with a POST method sending a JSON encoded string of the submitted username and password from the user.
    Returns the response json within the try method, else returns false which will be parsed by the recieving function.

*/
async function fetchResponseTokenCredentials(url, usernameSubmitted, passwordSubmitted) {

    try {

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(
            {
                username: usernameSubmitted, 
                password: passwordSubmitted
            })

      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      return json
    } catch (error) {
      console.error(error.message);
    }

    return false
  }

/*
  fetchResponseTokenCredentials returns a json body that is expected to look like such

  {
    tokenSuccess: true/false,
    authToken: "String", <- only applicable if tokenSuccess = true
    UserID: "String", <- also only applicable if tokenSuccess = true
  }

  authToken is to be used as a cookie and with be stored in a database server side for bank information display. 
  The client will POST the auth code and expect
  data from the server if the authToken aligns with the UserID in the database. 
  No security measures currently but there will be some added in the future.

*/

function accountSubmit() {

    let username = usernameField.value;
    let password = passwordField.value;

    const responseObject = fetchResponseTokenCredentials(serverURL, username, password);

    
    if (responseObject.tokenSuccess) {

        var authToken = responseObject.authToken;
        var userID = responseObject.UserID;
        var sessionToken = "APPROVED";

        createCookie(authTokenName, authToken);
        createCookie(userIDName, userID);

        initiateBankOpen();

    } else {
        
        var sessionToken = "DENIED";

        createCookie(sessionTokenName, sessionToken);
        

    }

    
}


/*
    Function that verifies login information and 
*/

function initiateBankOpen() {

    console.log("Login Process Successful");

}

    

