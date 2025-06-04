"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { UserConversation } from "@/typed";

interface UserStatusContextType {
  users: UserConversation[];
  setUsers: React.Dispatch<React.SetStateAction<UserConversation[]>>;
  updateUserStatus: (userId: string, isOnline: boolean) => void;
  selectedUser: UserConversation | null;
  setSelectedUser: (user: UserConversation | null) => void;
  updateLastMessageForUser: (
    userId: string,
    message: string,
    time?: string
  ) => void;
}

const UserStatusContext = createContext<UserStatusContextType>({
  users: [],
  setUsers: () => {},
  updateUserStatus: () => {},
  selectedUser: null,
  setSelectedUser: () => {},
  updateLastMessageForUser: () => {},
});

export const UserStatusProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [users, setUsers] = useState<UserConversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserConversation | null>(
    null
  );

  const updateUserStatus = (userId: string, isOnline: boolean) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, isOnline } : user))
    );
  };

  const updateLastMessageForUser = (
    userId: string,
    message: string,
    time: string = new Date().toISOString()
  ) => {
    setUsers((prev) => {
      const updated = prev.map((user) =>
        user.id === userId
          ? { ...user, lastMessage: message, lastMessageTime: time }
          : user
      );
      return updated.sort(
        (a, b) =>
          new Date(b.lastMessageTime).getTime() -
          new Date(a.lastMessageTime).getTime()
      );
    });

    if (selectedUser?.id === userId) {
      setSelectedUser({
        ...selectedUser,
        lastMessage: message,
        lastMessageTime: time,
      });
    }
  };

  useEffect(() => {
    if (selectedUser) {
      const updated = users.find((u) => u.id === selectedUser.id);
      if (updated && updated.isOnline !== selectedUser.isOnline) {
        setSelectedUser(updated);
      }
    }
  }, [users, selectedUser]);

  return (
    <UserStatusContext.Provider
      value={{
        users,
        setUsers,
        updateUserStatus,
        selectedUser,
        setSelectedUser,
        updateLastMessageForUser,
      }}
    >
      {children}
    </UserStatusContext.Provider>
  );
};

export const useUserStatus = () => useContext(UserStatusContext);
