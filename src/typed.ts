export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  profileImage: string;
  isOnline: boolean;
}

export interface UserConversation extends User {
  lastMessage: string;
  lastMessageTime: string;
}
export interface Conversation {
  id: string;
  isGroup: boolean;
}

export interface Message {
  id: string;
  text: string;
  createdAt: string;
  sender: User;
  receiver: User;
  conversation: Conversation;
  seen: boolean;
}
