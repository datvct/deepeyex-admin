import "./App.css";
import React from "react";
import { Navigator } from "./navigator/navigator";
import { WebSocketProvider } from "./shares/contexts/WebSocketContext";

function App() {
  return (
    <WebSocketProvider>
      <Navigator />
    </WebSocketProvider>
  );
}

export default App;
