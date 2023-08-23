# webbtc-extension

`npm install`
`npm run dev`

### Chrome Extension Developer Mode

`1)` set your Chrome browser to `Developer mode`

`2)` click `Load unpacked`, and add the generated `./build` folder

### Sequence Diagram

```mermaid
sequenceDiagram
  participant w as provider (web page)
  participant c as content script
  participant b as background script
  participant p as popup
  w->>+c: webbtc.request<br/>(document.dispatchEvent)
  c->>b: document.addEventListener<br/>(port.postMessage)
  b->>+p: port.onMessage.addListener<br/>(chrome.windows.create)
  p->>-c: user action<br/>(chrome.tabs.sendMessage)
  c->>-w: chrome.runtime.onMessage.addListener<br/>(window.postMessage)
```

### Packing

`npm build` + [Official Chrome WebStore Guide](https://developer.chrome.com/webstore/publish)
