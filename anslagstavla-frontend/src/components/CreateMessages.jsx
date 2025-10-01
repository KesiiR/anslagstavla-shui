import React, { useState } from "react";
import Button from "./Button.jsx";
import { messageAPI } from "../utils/apiCalls.js";

const CreateMessage = () => {
  const [username, setUsername] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await messageAPI.create({ username, text });
      setMessage("Meddelande skapat!");
      setUsername("");
      setText("");
    } catch (error) {
      setMessage("Fel: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 p-4 pt-16">
      <div className="max-w-lg mx-auto">
        <h1 className="text-white text-2xl font-bold mb-6">
          Skapa ett meddelande
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 rounded-lg p-6 space-y-4"
        >
          <input
            type="text"
            placeholder="Användarnamn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 bg-slate-700 text-white rounded-lg"
            required
          />

          <textarea
            placeholder="Meddelande"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full p-3 bg-slate-700 text-white rounded-lg"
            required
          />

          <Button type="submit" loading={loading}>
            Skapa
          </Button>

          {message && <div className="text-white text-sm">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default CreateMessage;
