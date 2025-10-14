declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    StringeeClient?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    StringeeCall?: any;
  }
}

interface StringeeClient {
  connect(token: string): void;
  disconnect(): void;
  on(event: string, callback: (...args: unknown[]) => void): void;
}

export const loadStringeeSdk = (): Promise<StringeeClient> => {
  return new Promise((resolve, reject) => {
    if (window.StringeeClient) {
      resolve(window.StringeeClient);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.stringee.com/sdk/web/latest/stringee-web-sdk.min.js";
    script.async = true;
    script.onload = () => resolve(window.StringeeClient);
    script.onerror = () => reject("❌ Không thể tải Stringee SDK");
    document.head.appendChild(script);
  });
};
