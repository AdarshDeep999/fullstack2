function MessageList({ messages }) {
  return (
    <div className="messages">
      {messages.map((msg, i) => (
        <div key={i} className="message">
          <b>{msg.sender}:</b> {msg.content}
        </div>
      ))}
    </div>
  );
}

export default MessageList;