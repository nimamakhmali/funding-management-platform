"use client";

import {
  createContext,
  useState,
  ReactNode,
} from "react";

import {
  Message,
  MessageFilterType,
} from "@/lib/types/admin/messages/message.types";

import { MOCK_MESSAGES } from "@/lib/constants/admin/messages/messages.constants";

interface MessagesContextType {
  messages: Message[];

  filter: MessageFilterType;

  searchQuery: string;

  setFilter: (
    filter: MessageFilterType
  ) => void;

  setSearchQuery: (
    query: string
  ) => void;

  archiveMessage: (
    id: string
  ) => void;

  deleteMessage: (
    id: string
  ) => void;

  sendReply: (
    messageId: string,
    content: string
  ) => Promise<void>;
}

export const MessagesContext =
  createContext<
    MessagesContextType | undefined
  >(undefined);

interface Props {
  children: ReactNode;
}

export function MessagesProvider({
  children,
}: Props) {
  const [messages, setMessages] =
    useState<Message[]>(
      MOCK_MESSAGES
    );

  const [filter, setFilter] =
    useState<MessageFilterType>(
      "all"
    );

  const [searchQuery, setSearchQuery] =
    useState("");

  const archiveMessage = (
    id: string
  ) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === id
          ? {
              ...message,
              status: "archived",
            }
          : message
      )
    );
  };

  const deleteMessage = (
    id: string
  ) => {
    setMessages((prev) =>
      prev.filter(
        (message) =>
          message.id !== id
      )
    );
  };

  const sendReply = async (
    messageId: string,
    content: string
  ) => {
    console.log(
      "Reply:",
      messageId,
      content
    );

    // بعداً اینجا API Call انجام میشه
    // await messagesService.sendReply(...)
  };

  return (
    <MessagesContext.Provider
      value={{
        messages,

        filter,

        searchQuery,

        setFilter,

        setSearchQuery,

        archiveMessage,

        deleteMessage,

        sendReply,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
}