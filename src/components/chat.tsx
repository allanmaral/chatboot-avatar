"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { Message, sendMessage } from "@/lib/chat";

export interface Chat {
  currentMessage?: Message;
  loading: boolean;
  send: (message: string) => void;
  messagePlayed: () => void;
}

const ChatContext = createContext<Chat | undefined>(undefined);

export interface ChatProviderProps {
  children: React.ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentMessage(messages[0]);
  }, [messages]);

  const send = useCallback((message: string) => {
    setLoading(true);
    sendMessage(message).then((resp) => {
      setMessages((messages) => [...messages, ...resp]);
      setLoading(false);
    });
  }, []);

  const messagePlayed = useCallback(() => {
    setMessages((messages) => messages.slice(1));
  }, []);

  return (
    <ChatContext.Provider
      value={{
        currentMessage,
        loading,
        send,
        messagePlayed,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
