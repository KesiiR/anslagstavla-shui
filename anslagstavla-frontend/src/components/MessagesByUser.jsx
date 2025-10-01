import React, { useState } from "react";
import Card from "./Card.jsx";
import Button from "./Button.jsx";
import { messageAPI } from "../utils/apiCalls.js";
import MessageEditor from "./MessageEditor.jsx";

const MessagesByUser = () => {
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);

  const searchUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await messageAPI.getByUser(username);
      setMessages(data.data || []);
    } catch (error) {
      console.error("Error:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (id, text) => {
    await messageAPI.update(id, text);
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, text, message: text } : msg))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 p-4 pt-16">
      <div className="max-w-lg mx-auto">
        <h1 className="text-white text-2xl font-bold mb-6">
          Meddelanden för "{username}"
        </h1>
        <form
          onSubmit={searchUser}
          className="bg-slate-800 rounded-lg p-6 mb-6"
        >
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Användarnamn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="flex-1 p-3 bg-slate-700 text-white rounded-lg"
              required
            />
            <Button type="submit" variant="blue" loading={loading}>
              Sök
            </Button>
          </div>
        </form>
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <Card
              key={msg.id || index}
              message={msg}
              onEdit={setEditingMessage}
            />
          ))}
        </div>
        {messages.length === 0 && username && !loading && (
          <div className="text-gray-400 text-center">
            Inga meddelanden hittades
          </div>
        )}

        <MessageEditor
          message={editingMessage}
          isOpen={!!editingMessage}
          onClose={() => setEditingMessage(null)}
          onSave={handleSaveEdit}
        />
      </div>
    </div>
  );
};

export default MessagesByUser;
