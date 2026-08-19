"use client";

import { useContext } from "react";

import {
  MessagesContext,
} from "@/lib/providers/MessagesProvider";

export function useMessages() {
  const context =
    useContext(MessagesContext);

  if (!context) {
    throw new Error(
      "useMessages must be used inside MessagesProvider"
    );
  }

  return context;
}