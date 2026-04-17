import { useState } from "react";

function MessageInput({ sendMessage }) {
  const [text, setText] = useState("");

  return (
    <div className="input-area">
      <input
        value={text}
        placeholder="Type message..."
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          sendMessage(text);
          setText("");
        }}
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;