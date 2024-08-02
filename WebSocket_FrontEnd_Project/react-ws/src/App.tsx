import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [latestMessage, setLatestMessage] = useState<string>("");

  useEffect(() => {
    // Create a Fresh Connection with WebSocket
    const socket = new WebSocket("ws://localhost:8888");

    socket.onopen = () => {
      console.log("Connected");
      setSocket(socket);
    };

    socket.onmessage = (event) => {
      console.log("Received Message:", event.data);
      setLatestMessage(event.data);
    };

    // Cleanup on component unmount
    return () => {
      socket.close();
    };
  }, []);

  // Loading for Socket Response
  if (!socket) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-semibold text-gray-700">
          Connecting to Socket Layer...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <input
          type="text"
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Type your message..."
        />
        <button
          onClick={() => {
            socket.send(message);
          }}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-500 transition-colors"
        >
          Send Now
        </button>
      </div>
      {latestMessage && (
        <div className="mt-6 p-4 bg-green-100 border border-green-200 rounded shadow-sm w-full max-w-md">
          <h2 className="text-lg font-semibold text-green-700">
            Latest Message:
          </h2>
          <p className="text-green-800">{latestMessage}</p>
        </div>
      )}
    </div>
  );
}

export default App;
