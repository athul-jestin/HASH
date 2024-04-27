import React, { useState } from "react";
import Layout from "./../Layout/Layout";

function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() !== "") {
      const backendUrl = "http://localhost:5000/api/chatbot/"; 

      try {
        const response = await fetch(backendUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userInput }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const chatbotReply = data.replies;

        setChatHistory([...chatHistory, { user: userInput }, { chatbot: chatbotReply }]);
        setUserInput("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-between px-4 py-5 bg-dry border border-gray-800">
        <img
          src="/images/chatbot_title_icon.png"
          className="h-8"
          alt="title-icon"
        />
      </div>
      <div className="flex flex-col flex-grow overflow-y-auto px-4 py-2 h-[450px]">
        {chatHistory.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl my-2 ${
              index % 2 === 0 ? "bg-green-200 text-black self-end" : "bg-cyan-100 text-black self-start"
            }`}
            style={{ maxWidth: "60%", wordWrap: "break-word" }} // Limit width and allow word wrap
          >
            {message.user && <div className="text-right">{message.user}</div>}
            {message.chatbot && <div className="text-left">{message.chatbot}</div>}
          </div>
        ))}
      </div>
      <div className="flex items-center px-4 py-7 bg-dry border border-gray-800">
        <input
          type="text"
          className="flex-grow px-4 py-2 mr-2 border border-gray-300 rounded-xl outline-none text-black"
          placeholder="Type your prompt."
          value={userInput}
          onChange={handleUserInput}
        />
        <button
          className="flex items-center justify-center w-12 h-12 rounded-full bg-green-300"
          onClick={sendMessage}
        >
          <img
            src="/images/send_symbol_icon.png"
            className="w-6 h-6"
            alt="send-button-icon"
          />
        </button>
      </div>
    </Layout>
  );
}

export default Chatbot;
