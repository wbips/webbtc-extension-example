console.info("chrome-ext template-react-ts background script");

// Connect to content script (triggered by connect() method in content script)
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== "CONTENT_PORT") return;

  port.onMessage.addListener((message: any, port) => {
    console.log("background message", message);
    const originUrl = port.sender?.origin ?? port.sender?.url;
    if (!port.sender?.tab?.id || !originUrl) {
      return console.error("Missing data from sender tab.");
    }

    // void rpcMessageHandler(message, port);
    // todo: rpc switch in rpc.ts here
    openPopup({ port, message });
  });
});

async function openPopup({
  port,
  message,
}: {
  port: chrome.runtime.Port;
  message: any;
}) {
  return new Promise((resolve) => {
    chrome.windows.getCurrent(async (win) => {
      const POPUP_W = 400;
      const POPUP_H = 600;

      const params = new URLSearchParams({
        tabId: String(port.sender?.tab?.id ?? 0),
        message: encodeURIComponent(JSON.stringify(message)),
      });

      const popup = await chrome.windows.create({
        url: `/src/popup.html?${params.toString()}`,
        type: "popup",
        focused: true,
        width: POPUP_W,
        height: POPUP_H,
        top: (win.top ?? 0) + POPUP_H / 4,
        left: (win.left ?? 0) + (win.width ?? 0) / 2 - POPUP_W / 2,
      });

      resolve(popup);
    });
  });
}
