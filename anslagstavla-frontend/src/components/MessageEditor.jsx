import React, { useState, useEffect } from "react";
import Button from "../components/Button.jsx";

const MessageEditor = ({ message, isOpen, onClose, onSave }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (message) {
      setText(message.text || message.message || "");
    }
  }, [message]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(message.id, text);
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-white text-lg mb-4">Redigera meddelande</h3>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 bg-slate-700 text-white rounded-lg mb-4"
          rows={4}
        />

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>
            Avbryt
          </Button>
          <Button onClick={handleSave} loading={loading}>
            Spara
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageEditor;
