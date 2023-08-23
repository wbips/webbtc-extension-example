// WebBTC provider

declare global {
  interface Window {
    webbtc: typeof webbtc;
  }
}

const webbtc = {
  request<T extends string>(
    method: T,
    params?: Record<string, any>,
  ): Promise<object> {
    const id = crypto.randomUUID();
    const rpcRequest: object = {
      jsonrpc: "2.0",
      id,
      method,
      params,
    };
    // todo: this could also be a postmessage
    document.dispatchEvent(
      new CustomEvent("webbtc_request", { detail: rpcRequest }), // todo: better type name?
    );
    return new Promise((resolve, reject) => {
      function handleMessage(event: MessageEvent<any>) {
        const response = event.data;
        if (response.id !== id) return;
        console.log("provider response", response);
        window.removeEventListener("message", handleMessage);
        if ("error" in response) return reject(response); // todo: reject here? or always resolve?
        return resolve(response);
      }
      window.addEventListener("message", handleMessage);
    });
  },
};

window.webbtc = webbtc;

export {};
