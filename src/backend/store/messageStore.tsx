import {create} from 'zustand';
import {toast} from 'react-hot-toast';
import {serverMsgs, dmMsgs} from "../data.ts";

export interface Message {
    server: string;
    channel: string;
    content: string;
    timestamp: Date;
    sender: {
        id: number;
        displayName: string;
        picture: string;
    };
}

export interface MessageDM {
    recipient: number,
    content: string;
    timestamp: Date;
    sender: {
        id: number;
        displayName: string;
        picture: string;
    };
}

interface MessageStore {
    isRunning: boolean;
    isRunning1: boolean;
    messages: Message[]; // Store messages
    directMessages: MessageDM[];
    addMessage: (server: string, channel: string, content: string, sender:  Message["sender"], timestamp?: Date ) => void;
    addDMMessage: (recipient: number, content: string, sender:  Message["sender"], timestamp?: Date ) => void;
    getMessages: (server: string, channel: string) => Message[];
    getDMMessages: (senderId: number, recipientId: number) => MessageDM[];
    simulateAndLoadMessages: () => void; // Combined function for pre-made messages
    simulateAndLoadDMMessages: () => void; // Combined function for pre-made messages
}

// convert timeSent to timestamp
const updatedServerMsgs: Message[] = serverMsgs.map(msg => ({
    ...msg,
    timestamp: new Date(msg.timeSent) // Convert `timeSent` to `Date`
}));

const updatedDmMsgs: MessageDM[] = dmMsgs.map(msg => ({
    ...msg,
    timestamp: new Date(msg.timeSent) // Convert `timeSent` to `Date`
}));

export const useMessageStore = create<MessageStore>((set, get) => ({

    messages: (() => {
        const storedMessages = sessionStorage.getItem("messages");
        if (storedMessages) {
            // Parse and return session storage data, converting timestamps
            return JSON.parse(storedMessages).map((msg: Message) => ({
                ...msg,
                timestamp: new Date(msg.timestamp), // Convert to Date object
            }));
        } else {
            // No data in sessionStorage: use pre-made messages and persist them
            sessionStorage.setItem("messages", JSON.stringify(updatedServerMsgs));
            return updatedServerMsgs;
        }
    })(),

    directMessages: (() => {
        const storedDirectMessages = sessionStorage.getItem("directMessages");
        if (storedDirectMessages) {
            // Parse and return session storage data, converting timestamps
            return JSON.parse(storedDirectMessages).map((msg: MessageDM) => ({
                ...msg,
                timestamp: new Date(msg.timestamp), // Convert to Date object
            }));
        } else {
            // No data in sessionStorage: use pre-made messages and persist them
            sessionStorage.setItem("directMessages", JSON.stringify(updatedDmMsgs));
            return updatedDmMsgs;
        }
    })(),

    isRunning: false, // Flag to prevent multiple executions
    isRunning1: false, // Flag to prevent multiple executions

    // addMsg function for no dupes
    addMessage: (server: string, channel: string, content: string, sender:  Message["sender"], timestamp = new Date()) => {
        set((state) => {
            const existingMessages = state.messages.filter(
                (msg) =>
                    msg.server === server &&
                    msg.channel === channel &&
                    msg.content === content &&
                    msg.timestamp.getTime() === timestamp.getTime() // Compare timestamp correctly
            );

            if (existingMessages.length === 0) {
                const newMessage: Message = {
                    server,
                    channel,
                    content,
                    sender: sender || { displayName: "wubba >:[", picture: "/user.jpg" },
                    timestamp,
                };

                const updatedMessages = [...state.messages, newMessage];

                // Save updated messages to sessionStorage
                sessionStorage.setItem("messages", JSON.stringify(updatedMessages));

                return {
                    messages: updatedMessages,
                };
            }

            return state;
        });
    },

    addDMMessage: (recipient: number, content: string, sender:  Message["sender"], timestamp = new Date()) => {
        set((state) => {
            const newDMMessage: MessageDM = {
                recipient,
                content,
                sender: sender || { displayName: "wubba >:[", picture: "/user.jpg" },
                timestamp,
            };

            const updatedDirectMessages = [...state.directMessages, newDMMessage];

            // Save updated direct messages to sessionStorage
            sessionStorage.setItem("directMessages", JSON.stringify(updatedDirectMessages));

            return {
                directMessages: updatedDirectMessages,
            };
        });
    },

    // Retrieve messages for a specific server and channel
    getMessages: (server: string, channel: string): Message[] => {
        return get().messages.filter((msg): msg is Message => {
            // Narrow down the type to 'Message' before accessing 'server' and 'channel'
            return (msg as Message).server !== undefined && (msg as Message).channel !== undefined
                && (msg as Message).server === server && (msg as Message).channel === channel;
        });
    },

    // Retrieve DirectMessages messages for a specific sender and recipient
    getDMMessages: (senderId: number, recipientId: number): MessageDM[] => {
        return get().directMessages.filter((msg): msg is MessageDM => {
            return (msg as MessageDM).recipient !== undefined
                && ((msg as MessageDM).recipient === recipientId && (msg as MessageDM).sender.id === senderId)
                || ((msg as MessageDM).recipient === senderId && (msg as MessageDM).sender.id === recipientId);
        });
    },

    simulateAndLoadMessages: () => {
        if (get().isRunning) return; // Skip execution if already running
        set({ isRunning: true });

        const storedMessages = JSON.parse(sessionStorage.getItem("messages") || "[]").map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
        })) || updatedServerMsgs;

        storedMessages.forEach((msg: Message, index: number) => {
            setTimeout(() => {
                set((state) => {
                    const existing = state.messages.find(
                        (m) => m.content === msg.content && m.timestamp.getTime() === msg.timestamp.getTime()
                    );
                    if (!existing) {
                        const updatedMessages = [...state.messages, msg];
                        sessionStorage.setItem("messages", JSON.stringify(updatedMessages));
                        return { messages: updatedMessages };
                    }
                    return state;
                });

                // Notify only if the message is not from users[0]
                if (msg.sender.id !== 1000) {
                    toast.success(`New message in ${msg.server} - ${msg.channel}: "${msg.content}"`, {
                        position: "bottom-right",
                        style: { background: "#313338", color: "#fff", fontSize: "14px" },
                    });

                    const audio = new Audio("/notif.mp3"); // Replace with your audio file URL
                    audio.play().catch((error) => {
                        console.error("Audio playback error:", error);
                    });
                }
            }, index * 1000); // Delay each message
        });

        setTimeout(() => set({ isRunning: false }), storedMessages.length * 1000); // Reset after all messages
    },

    simulateAndLoadDMMessages: () => {
        if (get().isRunning1) return;
        set({ isRunning1: true });

        const storedDMs = JSON.parse(sessionStorage.getItem("directMessages") || "[]").map((msg: MessageDM) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
        })) || updatedDmMsgs;

        storedDMs.forEach((msg: MessageDM, index: number) => {
            setTimeout(() => {
                set((state) => {
                    const existing = state.directMessages.find(
                        (m) => m.content === msg.content && m.timestamp.getTime() === msg.timestamp.getTime()
                    );
                    if (!existing) {
                        const updatedDirectMessages = [...state.directMessages, msg];
                        sessionStorage.setItem("directMessages", JSON.stringify(updatedDirectMessages));
                        return { directMessages: updatedDirectMessages };
                    }
                    return state;
                });

                // Notify only if the message is not from users[0]
                if (msg.sender.id !== 1000) {
                    toast.success(`New DM from ${msg.sender.displayName}: "${msg.content}"`, {
                        position: "bottom-right",
                        style: { background: "#313338", color: "#fff", fontSize: "14px" },
                    });

                    const audio = new Audio("/notif.mp3"); // Replace with your audio file URL
                    audio.play().catch((error) => {
                        console.error("Audio playback error:", error);
                    });
                }
            }, index * 1000);
        });

        setTimeout(() => set({ isRunning1: false }), storedDMs.length * 1000);
    },

}));
