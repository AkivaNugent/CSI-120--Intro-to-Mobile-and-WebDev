/**
 * Represents a response object with a list of messages.
 * @typedef {Object} MessageResponse
 * @property {number} count - The total count of messages.
 * @property {string} date - The date of the response in GMT format.
 * @property {Array} messages - An array containing individual message objects.
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

const CHIT_CHAT_URL = "https://www.stepoutnyc.com/chitchat";
const API_KEY = "YOUR_API_KEY";
const CLIENT_ID = "YOUR_CHAMPLAIN_EMAIL";

/**
 * Makes a GET request to Chit Chat Server 
 * that responds with a MessageResponse
 * @param {number} [skip=0] skips X number of messages
 * @param {number} [limit=20] determines batch size
 * @returns {MessageResponse}
 */
async function getMessages(skip = 0, limit = 20) {
    const query = new URLSearchParams({
        key: API_KEY,
        client: CLIENT_ID,
        skip: skip,
        limit: limit,
    });
    const response = await fetch(`${CHIT_CHAT_URL}?${query}`);
    const json = await response.json();
    return json;
}

/**
 * Makes a POST Request to Chit Chat Server
 * @param {string} message the message to be sent
 * @returns {{ code: numbder; message: string }}
 */
async function postMessage(message) {
    const query = new URLSearchParams({
        key: API_KEY,
        client: CLIENT_ID,
        lat: 0,
        lon: 0,
        message: message
    });
    const response = await fetch(`${CHIT_CHAT_URL}?${query}`, {
       method: "POST" 
    });
    const json = await response.json();
    return json;
}

/**
 * Makes GET Request to Like Endpoint
 * @param {string} messageId 
 * @returns {{ code: numbder; message: string }}
 */
async function likeMessage(messageId) {
    const query = new URLSearchParams({
        key: API_KEY,
        client: CLIENT_ID
    });
    const response = await fetch(`${CHIT_CHAT_URL}/like/${messageId}?${query}`, {
       method: "GET" 
    });
    const json = await response.json();
    return json;
}

/**
 * Makes GET Request to Dislike Endpoint
 * @param {string} messageId 
 * @returns {{ code: numbder; message: string }}
 */
async function dislikeMesssage(messageId) {
    const query = new URLSearchParams({
        key: API_KEY,
        client: CLIENT_ID
    });
    const response = await fetch(`${CHIT_CHAT_URL}/dislike/${messageId}?${query}`, {
       method: "GET" 
    });
    const json = await response.json();
    return json;
}
