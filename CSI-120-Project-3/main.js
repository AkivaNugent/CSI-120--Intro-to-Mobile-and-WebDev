let feedContent = document.getElementById("feed_content")
let feedLength = 20;
let start = 0;

/**
 * Represents a response object with a list of messages.
 * @typedef {Object} MessageResponse
 * @property {number} count - The total count of messages.
 * @property {string} date - The date of the response in GMT format.
 * @property {Array<Message>} messages - An array containing individual message objects.
 */

/**
 * Represents an individual message object.
 * @typedef {Object} Message
 * @property {string} _id - The unique identifier for the message.
 * @property {string} client - The client associated with the message.
 * @property {string} date - The date of the message in GMT format.
 * @property {number} dislikes - The number of dislikes for the message.
 * @property {string} ip - The IP address associated with the message.
 * @property {number} likes - The number of likes for the message.
 * @property {Array<number | null>} loc - The location coordinates associated with the message.
 * @property {string} message - The content of the message.
 */

/**
 * Represents an individual object to create a message.
 * @typedef {Object} CreateMessage
 * @property {string} key - The API key associated with the client
 * @property {string} client - The client associated with the message.
 * @property {number} lat - The latitude coordinate associated with the message.
 * @property {number} lon - The longitude coordinate associated with the message.
 * @property {string} message - The content of the message.
 */

let CHIT_CHAT_URL = "https://www.stepoutnyc.com/chitchat";
let API_KEY = "e36ab73a-998c-4902-970f-33d08c3dee47";
let CLIENT_ID = "matthew-akiva.nugent@mymail.champlain.edu";

/**
 * Makes a GET request to Chit Chat Server 
 * that responds with a MessageResponse
 * @param {number} [skip=0] skips X number of messages
 * @param {number} [limit=feedLength] determines batch size
 * @returns {MessageResponse}
 */
async function getMessages(skip = start, limit = feedLength) {
    let query = new URLSearchParams({
        key: API_KEY,
        client: CLIENT_ID,
        skip: skip,
        limit: limit,
    });
    let response = await fetch(`${CHIT_CHAT_URL}?${query}`);
    let json = await response.json();
    return json;
}

/**
 * Makes a POST Request to Chit Chat Server
 * @param {string} message the message to be sent
 * @returns {{ code: number; message: string }}
 */
async function postMessage(message) {
    let query = new URLSearchParams({
        key: API_KEY,
        client: CLIENT_ID,
        lat: 0,
        lon: 0,
        message: message
    });
    let response = await fetch(`${CHIT_CHAT_URL}?${query}`, {
       method: "POST" 
    });
    let json = await response.json();
    return json;
}

/**
 * Makes GET Request to Like Endpoint
 * @param {string} messageId 
 * @returns {{ code: number; message: string }}
 */
async function likeMessage(messageId) {
    let query = new URLSearchParams({
        key: API_KEY,
        client: CLIENT_ID
    });
    let response = await fetch(`${CHIT_CHAT_URL}/like/${messageId}?${query}`, {
       method: "GET" 
    });
    let json = await response.json();
    return json;
}

/**
 * Makes GET Request to Dislike Endpoint
 * @param {string} messageId 
 * @returns {{ code: number; message: string }}
 */
async function dislikeMessage(messageId) {
    let query = new URLSearchParams({
        key: API_KEY,
        client: CLIENT_ID
    });
    let response = await fetch(`${CHIT_CHAT_URL}/dislike/${messageId}?${query}`, {
       method: "GET" 
    });
    let json = await response.json();
    return json;
}

//I learned cookie stuff with this youtube video: https://www.youtube.com/watch?v=i7oL_K_FmM8
//Create a cookie for liked posts
function setLikedCookie(messageId) {
    document.cookie = `likedMessage_${messageId}=true; expires=Sun, 1 January 2030 12:00:00 UTC; path=/`;
    //console.log(document.cookie);
    //console.log(messageId)
}
//get our list of liked posts from our cookies
function getLikedCookie(messageId) {
    let cookieName = `likedMessage_${messageId}`;
    let cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        let [name, trash] = cookie.trim().split('=');
        if (name === cookieName) return true;
    }
    return false;
}
//function to like messages
function likeMessageOperation(messageId, likeButton, likes) {
    if (!getLikedCookie(messageId)) {
        likeMessage(messageId)
            .then(() => {
                likeButton.innerHTML = `👍 ${likes + 1}`;
                setLikedCookie(messageId);
            });
    }
}
//Create a cookie for liked posts
function setDislikedCookie(messageId) {
    document.cookie = `dislikedMessage_${messageId}=true;`;
    //console.log(document.cookie);
    //console.log(messageId)
}
//get our list of liked posts from our cookies
function getDislikedCookie(messageId) {
    let cookieName = `dislikedMessage_${messageId}`;
    let cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        let [name, value] = cookie.trim().split('=');
        if (name === cookieName) {
            return value === 'true';
        }
    }
    return false;
}

//function to like messages
function dislikeMessageOperation(messageId, dislikeButton, dislikes) {
    if (!getDislikedCookie(messageId)) {
        dislikeMessage(messageId)
            .then(() => {
                dislikeButton.innerHTML = `👎 ${dislikes + 1}`;
                setDislikedCookie(messageId);
            });
    }
}

//function to letruct messages
function addMessages(_id, client, message, date, likes, dislikes){
    //Create Message Box
    let container = document.createElement("article");
    //create Header
    let postHeader = document.createElement("div");
    postHeader.classList.add("post_header")
    //creat footer
    let postFooter = document.createElement("div");
    postFooter.classList.add("post_footer")
    //create message 
    let msgElement = document.createElement("p");
    msgElement.classList.add('msg');
    msgElement.innerHTML = `message: ${message}`;
    //create author
    let authorElement = document.createElement("p");
    authorElement.classList.add('author');
    authorElement.innerHTML = `Author: ${client}`;

    //create like button
    let likeButton = document.createElement("div");
    likeButton.classList.add("likebutton")
    likeButton.innerHTML = `👍 ${likes}`
    likeButton.setAttribute("data-message-id", _id);
    likeButton.addEventListener("click", () => likeMessageOperation(_id, likeButton, likes));
    
    //create dislike button
    let dislikeButton = document.createElement("div");
    dislikeButton.classList.add("dislikebutton")
    dislikeButton.innerHTML = `👎 ${dislikes}`
    dislikeButton.setAttribute("data-message-id", _id);
    dislikeButton.addEventListener("click", () => dislikeMessageOperation(_id, dislikeButton, dislikes))

    //create time elenment
    let timeElement = document.createElement("p");
    timeElement.classList.add('time');
    timeElement.innerHTML = `Time: ${date}`;
    //create location
    let locationElement = document.createElement("p");
    locationElement.classList.add('location');
    //organize them into headers, content and footers
    //I was going to do the geolocation thing, but ive chanaged my mind, but still like this
    locationElement.innerHTML = `${Math.floor((Math.random())*100)} Miles`;
    postHeader.append(authorElement, locationElement)
    postFooter.append(likeButton, dislikeButton)
    container.append(postHeader, msgElement, timeElement, postFooter);
    return container;
}

//function to print the feed
async function printFeed() {
    //console.log("start");
    let messageOutput = await getMessages();
    console.log(messageOutput);
        for(let i = 0; i < (feedLength); i++){
            let content = messageOutput.messages[i]
            //console.log("message", content)
            feedContent.append(addMessages(content._id, content.client, content.message, content.date, content.likes, content.dislikes));
        }
    start += feedLength;
    //console.log("end");
    
};

//function to submit a message and check that it has a message
function submitMessage() {
    let messageInput = document.getElementById("messageInput").value;
    let postTitle = document.getElementById("post_title");
  
    // Check if the message is not empty before posting
    if (messageInput.trim() !== "") {
      // Call the postMessage function to post the message
      start = 0;
      feedContent.innerHTML = "";
      postMessage(messageInput)
        .then(() => {
            //then we reload the feed with our message at the top.
            printFeed();
            console.log("success");
            postTitle.innerHTML = "Post Something";
        })
    } else {
      // If message is empty, instruct.
      postTitle.innerHTML = "Please Input Some Text Then Post";
    }
    // my brain is made out of paper mache so I had to look this up
    // Found here: https://www.tutorialspoint.com/how-to-clear-the-form-after-submitting-in-javascript-without-using-reset
    let messageFeild = document.getElementById('messageInput');
    // clear the input field.
    messageFeild.value = "";
  }
//Adds an event watcher for loading more content
let seeMoreButton = document.getElementById("see_more_button");
seeMoreButton.onclick = function () {
    printFeed ();
}
//Adds an event watcher for posting
let postingButton = document.getElementById("posting_button");
postingButton.onclick = function() {
    submitMessage(); 
}
//Adds an event watcher for reloading the page
let reloadButton = document.getElementById("reload_page_container");
reloadButton.onclick = function() {
    start = 0;
    feedContent.innerHTML = "";
    printFeed();
}


printFeed();

