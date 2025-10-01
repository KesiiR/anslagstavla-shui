import React from "react";
import Button from "./Button.jsx";
import { ClipboardList, MessageSquare, Search, Plus } from "lucide-react";

const Navigation = ({ onViewChange }) => {
  const buttons = [
    {
      id: "all-messages",
      title: "Alla Meddelanden",
      variant: "blue",
      icon: MessageSquare,
    },
    {
      id: "messages-by-user",
      title: "Sök Användare",
      variant: "blue",
      icon: Search,
    },
    {
      id: "create-message",
      title: "Skapa Meddelande",
      variant: "primary",
      icon: Plus,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-slate-900 p-4 flex items-center justify-center">
      <div className="text-center">
        <ClipboardList className="w-20 h-20 text-blue-400 mx-auto mb-4" />
        <h1 className="text-white text-4xl font-bold mb-8">Anslagstavla</h1>

        <div className="flex flex-col space-y-4">
          {buttons.map((btn) => {
            const IconComponent = btn.icon;
            return (
              <Button
                key={btn.id}
                variant={btn.variant}
                size="large"
                onClick={() => onViewChange(btn.id)}
                className="w-full"
              >
                <span className="inline-flex items-center justify-center gap-4">
                  {" "}
                  {btn.title}
                  <IconComponent className="w-4 h-4" />
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
