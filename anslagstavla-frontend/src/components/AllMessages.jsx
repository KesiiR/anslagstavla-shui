import React, { useState, useEffect } from "react";
import Card from "./Card.jsx";
import Button from "./Button.jsx";
import { MessageSquare } from "lucide-react";
import { messageAPI } from "../utils/apiCalls.js";
import MessageEditor from "./MessageEditor.jsx";

const AllMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("");
  const [editingMessage, setEditingMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await messageAPI.getAll();
      setMessages(data.data || []);
      setSortOrder(data.sortedBy || "");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnChange = async (e) => {
    try {
      const sortOrder = e.target.value;
      setSortOrder(sortOrder);

      const data = await messageAPI.getAll(sortOrder);
      setMessages(data.data || []);
    } catch (error) {
      console.error("Error:", error);
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

  if (loading)
    return <div className="p-8 text-white text-center">Loading...</div>;

  if (!messages || messages.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 p-4 pt-16">
        <div className="max-w-lg mx-auto">
          <h1 className="text-white text-2xl font-bold mb-6">
            Alla Meddelanden
          </h1>

          <div className="mb-6">
            <select
              value={sortOrder}
              id="sort-input"
              onChange={handleOnChange}
              className="w-full p-3 bg-slate-800 text-white rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer shadow-lg"
              aria-label="Sortera meddelanden"
            >
              <option value="">Sortering på datum</option>
              <option value="newest">Nyaste först</option>
              <option value="oldest">Äldsta först</option>
            </select>
          </div>

          <div className="flex items-center justify-center min-h-64">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <div className="text-white text-xl font-medium">
                Du har inga meddelanden att visa.
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={fetchMessages}>Uppdatera</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 p-4 pt-16">
      <div className="max-w-lg mx-auto">
        <h1 className="text-white text-2xl font-bold mb-6">Alla Meddelanden</h1>

        <div className="mb-6">
          <select
            value={sortOrder}
            id="sort-input"
            onChange={handleOnChange}
            className="w-full p-3 bg-slate-800 text-white rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer shadow-lg"
            aria-label="Sortera meddelanden"
          >
            <option value="">Sortering på datum</option>
            <option value="newest">Nyaste först</option>
            <option value="oldest">Äldsta först</option>
          </select>
        </div>

        <div className="space-y-4">
          {messages.map((msg, index) => (
            <Card
              key={msg.id || index}
              message={msg}
              onEdit={setEditingMessage}
            />
          ))}
        </div>

        <div className="mt-6">
          <Button onClick={fetchMessages}>Uppdatera</Button>
        </div>

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

export default AllMessages;
