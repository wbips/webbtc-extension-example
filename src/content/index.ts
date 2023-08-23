import providerScript from "./provider?script&module";

/**
 * Content script:
 * 1. proxys messages between the browser page and the background script
 * 2. injects the provider script into the browser page
 */

console.info("chrome-ext template-react-ts content script");

let backgroundPort: any;

function connect() {
  backgroundPort = chrome.runtime.connect({ name: "CONTENT_PORT" });
  // backgroundPort.onDisconnect.addListener(connect);
}

connect();

// Event (from provider / browser page) triggers message to background script
document.addEventListener("webbtc_request", (event: any) => {
  console.log("webbtc event", event.detail, backgroundPort);
  console.log("backgroundPort", backgroundPort);

  backgroundPort.postMessage({ ...event.detail, source: "CONTENT_SOURCE" }); // todo: need source?
});

// Message (from popup / user action) triggers message to browser page / provider
chrome.runtime.onMessage.addListener((message: any) => {
  console.log("message", message);
  if (message?.jsonrpc === "2.0") {
    window.postMessage(message, window.location.origin);
  }
});

// Inject provider script into browser page
const script = document.createElement("script");
script.src = chrome.runtime.getURL(providerScript);
script.type = "module";
document.head.prepend(script);
