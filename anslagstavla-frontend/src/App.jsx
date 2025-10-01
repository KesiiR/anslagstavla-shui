import { useState } from "react";
import "./index.css";
import Navigation from "./components/Navigation.jsx";
import AllMessages from "./components/AllMessages.jsx";
import MessagesByUser from "./components/MessagesByUser.jsx";
import CreateMessage from "./components/CreateMessages.jsx";

function App() {
  const [currentView, setCurrentView] = useState("navigation");

  const components = {
    navigation: <Navigation onViewChange={setCurrentView} />,
    "all-messages": <AllMessages />,
    "messages-by-user": <MessagesByUser />,
    "create-message": <CreateMessage />,
  };

  return (
    <div className="App">
      {currentView !== "navigation" && (
        <button
          onClick={() => setCurrentView("navigation")}
          className="fixed top-4 left-4 bg-slate-800 text-white px-3 py-1 rounded-lg text-sm z-50"
        >
          ← Meny
        </button>
      )}
      {components[currentView]}
    </div>
  );
}

export default App;
