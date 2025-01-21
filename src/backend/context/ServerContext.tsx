import React, { createContext, useContext, useState } from 'react';
import {users} from "../data.ts";

export interface Role {
    name: string;
    color: string;
    members: number[];
}

export interface Channel {
    name: string;
    type: 'text' | 'voice'; // Channel type can be 'text' or 'voice'
    category?: string;
}

export interface Server {
    picture: string;
    channels: Channel[];
    members: number[]; // Array of user IDs
    roles?: Role[]; // Make roles optional
}

interface ServerContextType {
    currentServer: string | null;
    setCurrentServer: (server: string) => void;
    servers: { [server: string]: Server }; // { serverName: { channels, members } }
    addServer: (server: string, channels?: Channel[], memberIds?: number[]) => void;
    joinServer: (serverName: string) => void; // Join server method
}

const ServerContext = createContext<ServerContextType | null>(null);

export const ServerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentServer, setCurrentServer] = useState<string | null>(null);
    const [servers, setServers] = useState<{ [server: string]: Server }>({
        ascent: {
            picture: "/servers/ascent.jpg?v=1",
            channels: [
                { name: "general", type: "text"},
                { name: "bookmarks", type: "text"},
                { name: "files", type: "text"},
                { name: "to-do", type: "text"},
                { name: "92.1 fm", type: "voice"},
            ],
            members: [1000, 1001],
            roles: [
                { name: "pookies", color: "#3498db", members: [1000, 1001]},
            ],
        },
        vitamins: {
            picture: "/servers/vitamins.jpg?v=1",
            channels: [
                { name: "chat", type: "text", category: "general"},
                { name: "call", type: "voice", category: "general"},
                { name: "general", type: "text", category: "tambayan"},
                { name: "lobby", type: "voice", category: "tambayan"},
                { name: "comms", type: "text", category: "gaming"},
                { name: "walang-sisigaw", type: "voice", category: "gaming"},
                { name: "matinong-usapan", type: "text", category: "acads"},
                { name: "study-room-1", type: "voice", category: "acads"},
            ],
            members: [1000, 1001, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 10010],
            roles: [
                { name: "leader", color: "#e91e63", members: [10010]},
                { name: "rahim stan acct", color: "#ad1457", members: [1000]},
                { name: "gamerists", color: "#e74c3c", members: [1001, 1003, 1004, 1005, 1006, 1007, 1008, 1009]},
            ],
        },
        "big ror": {
            picture: "/servers/bigror.jpg",
            channels: [
                { name: "chikahan", type: "text"},
                { name: "ktv-bar", type: "voice"},
            ],
            members: [1000, 1003, 1006, 1008],
            roles: [
                { name: "sean paul stan", color: "#2ecc71", members: [1003]},
                { name: "ur basic emo", color: "#9b59b6", members: [1000]},
                { name: "sobrang bilis napakabilis", color: "#e74c3c", members: [1008]},
                { name: "most decorated", color: "#3498db", members: [1006]},
            ],
        },
        "Jazzam's Server": {
            picture: "/servers/jazzam.jpg",
            channels: [
                { name: "vip", type: "text"},
                { name: "24/7", type: "voice"},
            ],
            members: [1000, 1002, 10011],
            roles: [
                { name: "Monkey #3", color: "#71368a", members: [1002]},
                { name: "Friends", color: "#e91e63", members: [1000, 10011]},
            ],
        },
        "wdawda": {
            picture: "/servers/sample.jpg",
            channels: [
                { name: "general", type: "text"},
                { name: "General", type: "voice"},
            ],
            members: [1001, 1002],
        },
    });

    // Add a new server with optional initial channels, members, and a default picture
    const addServer = (server: string, channels: Channel[] = [{ name: "general", type: "text" }, { name: "General", type: "voice" }], selectedMembers: number[] = [], picture: string = "/logo/dc-circle.svg") => {
        // Include user with ID 1000 as default member
        const memberIds = [1000, ...selectedMembers]; // Add 1000 as the first member, followed by selected members

        setServers((prev) => ({
            ...prev,
            [server]: {
                picture, // Use provided picture or default
                channels,
                members: memberIds, // Set members list with default (1000) and selected members
            },
        }));
    };

    // Join a server by name and add user 1000 to the member list
    const joinServer = (serverName: string) => {
        if (servers[serverName]) {
            const server = servers[serverName];
            if (!server.members.includes(users[0].id)) {
                // Only add user 1000 to the server's members if they are not already a member
                setServers((prev) => ({
                    ...prev,
                    [serverName]: {
                        ...server,
                        members: [...server.members, users[0].id], // Add currentUser (id = 1000) to members
                    },
                }));
            }
        } else {
            console.log(`Server ${serverName} does not exist.`);
        }
    };

    return (
        <ServerContext.Provider
            value={{ joinServer, currentServer, setCurrentServer, servers, addServer }}
        >
            {children}
        </ServerContext.Provider>
    );
};

export const useServerContext = () => {
    const context = useContext(ServerContext);
    if (!context) throw new Error("useServerContext must be used within a ServerProvider");
    return context;
};
