"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/typed";

interface UserStatusContextType {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  updateUserStatus: (userId: string, isOnline: boolean) => void;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
}

const UserStatusContext = createContext<UserStatusContextType>({
  users: [],
  setUsers: () => {},
  updateUserStatus: () => {},
  selectedUser: null,
  setSelectedUser: () => {},
});

export const UserStatusProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const updateUserStatus = (userId: string, isOnline: boolean) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, isOnline } : user))
    );
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
      }}
    >
      {children}
    </UserStatusContext.Provider>
  );
};

export const useUserStatus = () => useContext(UserStatusContext);
