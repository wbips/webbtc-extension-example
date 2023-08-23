import { useState } from "react";

import "./Popup.css";

function App() {
  const [seed, setSeed] = useState("");

  const searchParams = new URLSearchParams(document.location.search);

  const tabId = searchParams.get("tabId");
  const message = JSON.parse(
    decodeURIComponent(searchParams.get("message") ?? "null"),
  );

  function respond() {
    if (!tabId) return;

    chrome.tabs.sendMessage(parseInt(tabId), {
      ...message,
      response: {
        hello: "world",
      },
    });
    window.close();
  }

  return (
    <main>
      <h3>webbtc wallet</h3>

      <pre>
        <code>{JSON.stringify(message)}</code>
      </pre>

      <hr />

      <label htmlFor="seed">Seed</label>
      <br />
      <input type="text" id="seed" onChange={(e) => setSeed(e.target.value)} />

      <br />
      <button onClick={respond}>Sign</button>
    </main>
  );
}

export default App;
