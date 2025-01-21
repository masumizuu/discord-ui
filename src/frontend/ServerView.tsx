import React, {useEffect, useRef, useState} from "react";
import { Helmet } from "react-helmet-async";
import { GoPlus } from "react-icons/go";
import {useNavigate, useParams} from "react-router-dom";
import { ToastContainer } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

import { users } from "../backend/data";
import {useServerContext, Channel} from "../backend/context/ServerContext.tsx";
import {useMessageStore, Message} from "../backend/store/messageStore.tsx";
import {CiSearch} from "react-icons/ci";
import {RxCaretDown} from "react-icons/rx";

const ServerView: React.FC = () => {
    // declarations
    const navigate = useNavigate();
    const { addMessage } = useMessageStore();
    const { serverId } = useParams<{ serverId: string }>();

    //emoji hehe katuwaan lang ni dev
    const [isEmojiMenuOpen, setEmojiMenuOpen] = useState(false);
    const emojiMenuRef = useRef<HTMLDivElement | null>(null); // Correct typing
    const emojis = ["😀", "🎉", "❤️", "😂", "🥳", "👍", "🙏"]; // Add more emojis as needed
    const addEmoji = (emoji: string) => {
        setNewMessage((prev) => prev + emoji); // Append emoji to the input value
        setEmojiMenuOpen(false); // Close emoji menu
    };
    const toggleEmojiMenu = () => {
        setEmojiMenuOpen((prev) => !prev);
    };

    // server controls
    const { servers, currentServer, setCurrentServer, addServer, joinServer } = useServerContext(); // Access context
    const [activeChannel, setActiveChannel] = useState<string | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // For hover effect
    const [isHovered, setIsHovered] = useState(false);
    const [isAddHovered, setIsAddHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [modalAction, setModalAction] = useState<"add" | "join" | null>(null); // Track which action (Add/Join) is selected
    const [newServerName, setNewServerName] = useState(""); // For the new server name input
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]); // Selected members for the server
    const [serverNameToJoin, setServerNameToJoin] = useState(""); // Server name to join

    const handleMemberToggle = (userId: number) => {
        setSelectedMembers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };
    const handleModalActionChange = (action: "add" | "join") => {
        setModalAction(action); // Set the current action (either Add or Join)
        setServerNameToJoin(""); // Clear server name when switching actions
        setSelectedMembers([]); // Reset selected members when switching actions
    };
    const handleAddServer = () => {
        addServer(newServerName, [{ name: "general", type: "text" }, { name: "General", type: "voice" }], selectedMembers);
        setNewServerName(""); // Reset server name input
        setSelectedMembers([]); // Reset selected members
        setIsModalOpen(false);
    };
    const handleJoinServer = () => {
        joinServer(serverNameToJoin); // Call joinServer method from context
        setIsModalOpen(false); // Close the modal after joining
    };
    const handleServerClick = (serverId: string) => {
        setCurrentServer(serverId);
    };

    // main area
    const [newMessage, setNewMessage] = useState<string>("");
    const [isMemberShown, setIsMemberShown] = useState<boolean>(true); // default
    const toggleMemberShown = () => {
        setIsMemberShown(!isMemberShown);
    }
    const handleSendMessage = () => {
        if (currentServer && activeChannel && newMessage.trim()) {
            addMessage(currentServer, activeChannel, newMessage, users[0]);
            setNewMessage("");
        }
    };

    // go back to default view
    const displayDefault = () => {
        navigate("/channels/@me");
    };

    useEffect(() => {
        if (serverId) {
            setCurrentServer(serverId); // Set the current server
            const server = servers[serverId];
            setActiveChannel(server.channels[0].name)
        }
    }, [serverId, servers, setCurrentServer]);

    // use effect for dynamic url
    useEffect(() => {
        if (currentServer && activeChannel) {
            navigate(`/server/${currentServer}/channel/${activeChannel}`, { replace: true });
        }
    }, [currentServer, activeChannel, navigate]);

    const activeChannelMessages: Message[] = JSON.parse(sessionStorage.getItem("messages") || "[]")
        .map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
        }))
        .filter((msg: Message) => msg.server === currentServer && msg.channel === activeChannel);

    return (
        <div className="flex h-screen bg-dark text-white text-sans w-full">
            <ToastContainer/>

            {/* Helmet */}
            <Helmet>
                <title>
                    {currentServer && activeChannel
                        ? `Discord | @${activeChannel} | ${currentServer}`
                        : "Discord | Friends"}
                </title>
            </Helmet>

            {/* ************* HEADER ************* */}
            <header className="absolute top-0 w-screen z-10 bg-transparent">
                <div
                    className="flex flex-row border-b-2 border-darkest items-center  space-x-4 ml-[73px] justify-between">
                    <div className=" flex flex-row px-2 py-3 text-gray-400">
                        {/* Left side - active server name */}
                        <div className="w-[230px] px-2 py-0.5 justify-between flex items-center">
                            {currentServer ? (
                                <h1 className="text-lg ml-2">{currentServer}</h1>
                            ) : (
                                <p className="text-sm">No server selected</p>
                            )}

                            <RxCaretDown className="h-6 w-6"/>
                        </div>
                        {/* Left side */}
                        <div className="flex space-x-3 font-medium ml-6">
                            <img src={"/icons/hash.svg"} className="h-7 w-7" alt="hash"/>
                            <span className="ml-2">
                                {activeChannel !== null && `${activeChannel}` || "No Active Channel"}
                            </span>
                        </div>
                    </div>

                    {/* Push right-side icons to the far right */}
                    <div className="flex flex-row items-center space-x-5 px-5 cursor-pointer">
                        <img src={"/icons/threads.svg"} className="h-5 w-5"/>
                        <img src={"/icons/notifications.svg"} className="h-5 w-5"/>
                        <img src={"/icons/pin.svg"} className="h-5 w-5"/>
                        <img src={"/icons/members.svg"} className="h-5 w-5"
                             onClick={toggleMemberShown}
                        />

                        {/* search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search"
                                className="input input-bordered input-sm bg-darkest placeholder-gray-400 text-gray-200 w-[220px] ml-1"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <CiSearch className="h-5 w-5"/>
                            </div>
                        </div>

                        <img src={"/icons/inbox.svg"} className="h-5 w-5"/>
                        <img src={"/icons/help.svg"} className="h-5 w-5"/>
                    </div>
                </div>
            </header>

            {/* servers - always visible */}
            <aside className="flex flex-col items-center bg-darkest z-10 py-3 w-[4.5%]">
                {/*for the dc logo on top*/}
                <div className="w-12 h-12 overflow-hidden mb-4 cursor-pointer"
                     onMouseEnter={() => setIsHovered(true)}
                     onMouseLeave={() => setIsHovered(false)}
                     onClick={displayDefault} // goes back to default
                >
                    <img
                        src={isHovered ? "/logo/dc-hover.svg" : "/logo/dc-circle.svg"}
                        alt="logo"
                        className="w-full h-full"
                    />
                </div>

                {/*divider*/}
                <div className="border-b-2 border-gray-700 w-1/3 mb-4"></div>

                {/* server list */}
                {Object.keys(servers).map((server, index) => (
                    // Check if users[0] or user with id 1000 is a member of the server
                    servers[server].members.includes(1000) || servers[server].members.includes(users[0].id) ? (
                        <div
                            key={server}
                            className={`w-12 h-12 overflow-hidden mb-4 cursor-pointer ${
                                hoveredIndex === index ? "rounded-2xl" : "rounded-full"
                            }`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => handleServerClick(server)}
                        >
                            <img
                                src={servers[server].picture || "/logo/dc-circle.svg"} // Display server picture
                                alt={server} // Use server name for alt text
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : null // If user is not a member, don't display the server
                ))}

                {/* add server */}
                <div
                    className={`flex flex-col w-12 h-12 overflow-hidden cursor-pointer items-center justify-center text-3xl ${
                        isAddHovered ? "rounded-2xl bg-grn text-white" : "rounded-full bg-dark text-grn"
                    }`}
                    onMouseEnter={() => setIsAddHovered(true)}
                    onMouseLeave={() => setIsAddHovered(false)}
                    onClick={() => setIsModalOpen(true)} // Open the modal when clicked
                ><GoPlus/></div>

                {/* Modal for joining or adding a server */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-darkest bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-dark p-6 rounded-lg shadow-lg w-96">

                            {/* default - selection of add or join */}
                            {modalAction === null && (
                                <div className="flex flex-row justify-between items-center">
                                    <button
                                        onClick={() => handleModalActionChange("add")}>
                                        Add Server
                                    </button>

                                    <button
                                        onClick={() => handleModalActionChange("join")}>
                                        Join Server
                                    </button>

                                    <button
                                        onClick={() => setIsModalOpen(false)}>
                                        Cancel
                                    </button>
                                </div>
                            )}

                            {/* add server - conditional display */}
                            {modalAction === "add" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Server Name</label>
                                    <input
                                        type="text"
                                        value={newServerName} // Use newServerName for adding a server
                                        onChange={(e) => setNewServerName(e.target.value)} // Update the newServerName value
                                        placeholder="Enter server name"
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500 mb-4"
                                    />
                                    <div>
                                        <h3 className="block text-sm font-medium text-gray-400 mb-4">Select Members</h3>
                                        {users.filter((_user, index) => index !== 0).map((user) => (
                                            <div key={user.id} className="mb-2">
                                                <label>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedMembers.includes(user.id)}
                                                        onChange={() => handleMemberToggle(user.id)}
                                                    />
                                                    <span className="ml-2">{user.displayName}</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={handleAddServer}
                                            className="btn btn-sm btn-success font-medium text-white">
                                            Add Server
                                        </button>

                                        <button
                                            onClick={() => setModalAction(null)}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {modalAction === "join" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-400">Server Name</label>
                                    <input
                                        type="text"
                                        value={serverNameToJoin} // Use serverNameToJoin for joining a server
                                        onChange={(e) => setServerNameToJoin(e.target.value)} // Update the serverNameToJoin value
                                        placeholder="Enter server name"
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                                    />
                                    {/* Check if the server exists in the list when "Join" is selected */}
                                    <div>
                                        {Object.keys(servers).includes(serverNameToJoin) ? (
                                            <p className="text-sm text-gray-400">This server exists. You can join
                                                it.</p>
                                        ) : (
                                            <p className="text-sm text-red-500">Server does not exist.</p>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <button
                                            onClick={handleJoinServer}
                                            className="btn btn-sm btn-success font-medium text-white">
                                            Add Server
                                        </button>

                                        <button
                                            onClick={() => setModalAction(null)}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </aside>

            {/* ************* CHANNEL LIST ************* */}
            <aside className="flex flex-col bg-darker text-gray-400 h-screen p-3 space-y-2 w-[15%] pt-20">
                <div className="flex flex-row items-center space-x-2 text-sm border-b border-light pb-2 mb-4">
                    <img src={"/icons/calendar.svg"} className="h-5 w-5"/>
                    <span className="font-semibold">Events</span>
                </div>

                {currentServer && servers[currentServer]?.channels.length > 0 ? (
                    // Group channels by category or type
                    Object.entries(groupChannels(servers[currentServer].channels)).map(([group, channels]) => (
                        <div key={group} className="mb-4">
                            {/* header */}
                            <div className="flex justify-between space-x-2 p-2 text-[10px]">
                                <h3 className="uppercase text-gray-400 font-semibold">{group}</h3>
                                <h3><GoPlus/></h3>
                            </div>
                            {channels.map((channel) => (
                                <div key={channel.name}
                                     className={`mb-2 w-full flex flex-row items-center cursor-pointer p-2 rounded-lg ${
                                         activeChannel === channel.name ? 'bg-light' : 'bg:transparent hover:bg-light'
                                     }`}
                                     onClick={() => setActiveChannel(channel.name)}
                                >
                                    <img
                                        src={channel.type === 'text' ? '/icons/hash.svg' : '/icons/speaker.svg'} // Determine image based on channel type
                                        alt={channel.type === 'text' ? 'Text Channel' : 'Voice Channel'}
                                        className="h-5 w-5 mr-2" // Adjust size and spacing
                                    />
                                    {channel.name}
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <div>No channels available.</div>
                )}
            </aside>

            {/* ************* MAIN / CHAT ************* */}
            <main className="mt-14 flex bg-dark w-[80.5%] flex-row">
                {/* main */}
                <div className="flex flex-col border-r border-light w-full p-4 justify-end">
                    {activeChannelMessages.map((msg: Message, index: number) => (
                        <div key={index} className="mb-4 flex items-start">
                            {/* Sender's Picture */}
                            <img
                                src={msg.sender?.picture || "/default-profile.png"} // Default image if no picture
                                alt={msg.sender?.displayName || "User"}
                                className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                                {/* Sender's Name */}
                                <div style={{
                                    color:
                                        currentServer &&
                                        servers[currentServer]?.roles?.find((role) =>
                                            role.members.some(
                                                (memberId) => {
                                                    const user = users.find((user) => user.id === memberId); // Find the user by ID
                                                    return user?.displayName === msg.sender.displayName; // Compare displayName
                                })
                                        )?.color || "white", // Find the role color or fallback to white
                                }}>
                                    {msg.sender?.displayName || "Unknown User"}
                                    <span className="text-xs text-gray-400 ml-2">
                                        {msg.timestamp.toLocaleString()}
                                    </span>
                                </div>
                                {/* Message Content */}
                                <p className="text-gray-200 text-sm">{msg.content}</p>
                            </div>
                        </div>
                    ))}

                    {/* bottom - message input */}
                    <div className="flex flex-row bg-transparent space-x-2 w-full z-10">
                        <div className="flex items-center bg-light px-3 rounded-md shadow-md space-x-3 py-2 w-full">
                            {/* Left Icon */}
                            <img
                                src={"/icons/add-to-message.svg"}
                                alt="Add to message"
                                className="h-5 w-5 rounded-full"
                            />

                            {/* Input Field */}
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && newMessage.trim()) {
                                        handleSendMessage();
                                    }
                                }}
                                placeholder={`Message #${
                                    currentServer !== null && activeChannel ? activeChannel : "Person"
                                }`}
                                className="flex-1 bg-light text-gray-300 placeholder-gray-400 rounded-md p-2 focus:outline-none"
                            />

                            {/* Right Icons */}
                            <div className="flex space-x-2">
                                {/* Gift Icon */}
                                <img
                                    src={"/icons/gift.svg"}
                                    alt="Gift"
                                    className="h-5 w-5"
                                />

                                <img
                                    src={"/icons/gif.svg"}
                                    alt="GIF"
                                    className="h-5 w-5"
                                />
                                <img
                                    src={"/icons/stickers.svg"}
                                    alt="Stickers"
                                    className="h-5 w-5"
                                />
                                <img
                                    src={"/icons/emoji.svg"}
                                    alt="Emoji"
                                    className="h-5 w-5"
                                    onClick={toggleEmojiMenu}
                                />

                                {/* Emoji Menu */}
                                {isEmojiMenuOpen && (
                                    <div
                                        ref={emojiMenuRef}
                                        className="absolute bottom-14 mt-2 bg-darker rounded-md p-2 shadow-md"
                                    >
                                        <div className="grid grid-cols-4 gap-2">
                                            {emojis.map((emoji, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => addEmoji(emoji)}
                                                    className="text-2xl hover:bg-gray-200 p-1 rounded"
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* nakahiwalay na yes */}
                        <div className="flex items-center bg-light px-3 rounded-md shadow-md py-2">
                            {/* Left Icon */}
                            <img
                                src={"/icons/activity.svg"}
                                alt="Activity"
                                className="h-5 w-5"
                            />
                        </div>
                    </div>
                </div>

                {/*right side*/}
                {isMemberShown && (
                    <aside className="w-[30%] bg-darker text-gray-300 p-4">
                        {/* Roles and Members */}
                        {currentServer !== null && servers[currentServer]!.roles?.length > 0 ? (
                            servers[currentServer].roles!.map((role) => (
                                <div key={role.name} className="mb-6">
                                    <h3 className="text-sm uppercase font-semibold text-gray-400">
                                        {role.name} - {role.members.length}
                                    </h3>
                                    <ul className="ml-4 mt-2 space-y-4">
                                        {role.members.map((memberId) => {
                                            const member = users.find(user => user.id === memberId);
                                            return member ? (
                                                <li key={member.id} className="flex items-center space-x-2 mt-1">
                                                    <img
                                                        src={member.picture || '/default-avatar.png'}
                                                        alt={`${member.displayName}'s avatar`}
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                    <span style={{color: role.color || '#FFFFFF'}}>
                                                        {member.displayName}
                                                    </span>
                                                </li>
                                            ) : null;
                                        })}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <div>
                                <h3 className="text-md font-semibold text-gray-400">Members</h3>
                                <ul className="ml-4 mt-2">
                                    {currentServer !== null && servers[currentServer]!.members.map((member) => (
                                        <li key={member} className="flex items-center space-x-2 mt-1">
                                            {(() => {
                                                const user = users.find(user => user.id === member); // Find the user by ID
                                                return user ? (
                                                    <>
                                                        <img
                                                            src={user.picture || '/default-avatar.png'} // Fallback image
                                                            alt={`${user.displayName}'s avatar`}
                                                            className="w-6 h-6 rounded-full"
                                                        />
                                                        <span>{user.displayName}</span>
                                                    </>
                                                ) : (
                                                    <span>Unknown User</span> // Fallback for missing user
                                                );
                                            })()}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </aside>
                )}
            </main>
        </div>
    );
};

function groupChannels(channels: Channel[]) {
    const grouped: { [key: string]: Channel[] } = {};

    channels.forEach((channel) => {
        const groupKey = channel.category || channel.type;
        if (!grouped[groupKey]) {
            grouped[groupKey] = [];
        }
        grouped[groupKey].push(channel);
    });

    return grouped;
}

export default ServerView;