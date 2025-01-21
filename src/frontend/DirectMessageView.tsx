import React, {useEffect, useState} from "react";
import { Helmet } from "react-helmet-async";
import { GoPlus } from "react-icons/go";
import {useNavigate, useParams} from "react-router-dom";
import { RxCaretDown } from "react-icons/rx";
import { ToastContainer } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

import { users } from "../backend/data";
import {useServerContext, Server, Channel} from "../backend/context/ServerContext.tsx";
import {MessageDM, useMessageStore} from "../backend/store/messageStore.tsx";
import {CiSearch} from "react-icons/ci";

const DirectMessages: React.FC = () => {
    // declarations
    const navigate = useNavigate();
    const { addDMMessage } = useMessageStore();
    const { userId } = useParams<{ userId: string }>(); // userId is a string by default
    const userIdAsNumber = Number(userId); // Convert to number using `Number()`

    // server controls
    const { servers, setCurrentServer, addServer, joinServer } = useServerContext(); // Access context
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // For hover effect
    const [isHovered, setIsHovered] = useState(false);
    const [isAddHovered, setIsAddHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [modalAction, setModalAction] = useState<"add" | "join" | null>(null); // Track which action (Add/Join) is selected
    const [newServerName, setNewServerName] = useState(""); // For the new server name input
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]); // Selected members for the server
    const [serverNameToJoin, setServerNameToJoin] = useState(""); // Server name to join
    const [defaultChannel, setDefChannel] = useState<Channel | null>(null);

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
        setCurrentServer(serverId); // Set the current server
        if (serverId && servers[serverId]) {
            const server = servers[serverId]; // Fetch the server using the serverId string
            if (server && server.channels?.length > 0) {
                const firstChannel = server.channels[0]; // Get the first channel
                setDefChannel(firstChannel);

                // Navigate to the default channel
                navigate(`/server/${serverId}/channel/${firstChannel.name}`, { replace: true });
            }
        }
    };

    // dm list area
    const [activeDM, setActiveDM] = useState<number>(userIdAsNumber); // To track the active DirectMessages user
    const handleDMClick = (userId: number) => {
        setActiveDM(userId); // Set the active DirectMessages recipient
    };

    // main area
    const [newMessage, setNewMessage] = useState<string>("");
    const [isProfileShown, setIsProfileShown] = useState<boolean>(true); // default
    const calculateMutualServers = (activeDM: number, servers: { [key: string]: Server }) => {
        let mutualServerCount = 0;

        // Loop through each server to check if both users are members
        Object.values(servers).forEach((server) => {
            if (server.members.includes(1000) && server.members.includes(activeDM)) {
                mutualServerCount++; // Increment count if both are members of the server
            }
        });

        return mutualServerCount;
    };
    const mutualServerCount = calculateMutualServers(activeDM, servers);
    const toggleProfileShown = () => {
        setIsProfileShown(!isProfileShown);
    }
    const handleSendDM = () => {
        if (newMessage?.trim() && activeDM) {
            const recipient = users.find((user) => user.id === activeDM);
            if (recipient) {
                // Add DM to store
                addDMMessage(activeDM, newMessage, users[0]);

                // Clear the input field
                setNewMessage("");
            }
        }
    };

    // go back to default view
    const displayDefault = () => {
        navigate("/channels/@me");
    };

    useEffect(() => {
        if (activeDM) {
            navigate(`/channels/${activeDM}`, { replace: true });
        }
    }, [activeDM, navigate]);

    const activeDMMessages: MessageDM[] = JSON.parse(sessionStorage.getItem("directMessages") || "[]")
        .map((msg: MessageDM) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
        }))
        .filter((msg: MessageDM) =>
            (msg.recipient === activeDM && msg.sender.id === users[0].id) ||
            (msg.recipient === users[0].id && msg.sender.id === activeDM)
        );

    return (
        <div className="flex h-screen bg-dark text-white text-sans w-full">
            <ToastContainer/>

            {/* Helmet */}
            <Helmet>
                <title>
                    {activeDM !== null
                        ? `Discord | @${users.find(user => user.id === activeDM)?.displayName}`
                        : "Discord | Friends"}
                </title>
            </Helmet>

            {/* ************* HEADER ************* */}
            <header className="absolute top-0 w-screen z-10 bg-transparent">
                <div className="flex flex-row border-b-2 border-darkest items-center  space-x-4 ml-[73px] justify-between">
                    <div className=" flex flex-row px-2 py-3">
                        {/* Left side - Search */}
                        <input
                            type="text"
                            placeholder="Find or start a conversation"
                            className="input input-bordered input-sm bg-darkest placeholder-gray-400 text-gray-200 w-[220px] ml-1"
                        />

                        {/* activeDM user */}
                        <div className="flex space-x-3 text-sm font-medium ml-6 items-center">
                            {/* User */}
                            <div className="relative w-8 h-8 overflow-hidden">
                                {/* Profile Picture */}
                                <img
                                    src={activeDM !== null ? users.find(user => user.id === activeDM)?.picture : "/logo/dc-circle.svg"}
                                    alt={activeDM !== null ? users.find(user => user.id === activeDM)?.displayName : "Picture"}
                                    className="w-full h-full object-cover rounded-full"
                                />

                                {/* Status Icon with Space */}
                                <div
                                    className="absolute bottom-[-2px] right-[-2px] w-4 h-4 rounded-full bg-darker flex items-center justify-center p-1">
                                    <img
                                        src={`/status/${activeDM !== null ? users.find(user => user.id === activeDM)?.status : "offline"}.svg`}
                                        alt={activeDM !== null ? users.find(user => user.id === activeDM)?.status : "Status"}
                                        className="w-full h-full"
                                    />
                                </div>
                            </div>
                            <span className="text-lg text-lighter">
                                {activeDM !== null
                                    ? users.find(user => user.id === activeDM)?.displayName
                                    : "Name"}
                            </span>

                        </div>
                    </div>

                    {/* Push right-side icons to the far right */}
                    <div className="flex flex-row items-center space-x-5 px-5 cursor-pointer">
                        <img src={"/icons/voice-call.svg"} className="h-5 w-5"/>
                        <img src={"/icons/video-call.svg"} className="h-5 w-5"/>
                        <img src={"/icons/pin.svg"} className="h-5 w-5"/>
                        <img src={"/icons/add-friends-to-dm.svg"} className="h-5 w-5"/>
                        <img src={"/icons/user-profile.svg"} className="h-5 w-5"
                             onClick={toggleProfileShown}
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

            {/* ************* DIRECT MESSAGES LIST ************* */}
            <aside className="flex flex-col bg-darker text-gray-200 h-screen p-3 space-y-2 w-[15%]">

                {/* 3 items above */}
                <div className="text-gray-400 text-sm mt-14">
                    <div
                        className={`flex items-center space-x-3 p-2 cursor-pointer rounded-md mb-1  hover:bg-dark`}
                    >
                        <img src={"/icons/friends.svg"} className="h-6 w-6"/>
                        <span className="font-semibold">Friends</span>
                    </div>

                    <div className="flex items-center space-x-3 p-2 cursor-pointer hover:bg-dark rounded-md mb-1">
                        <img
                            src={"/icons/nitro.svg"}
                            className="h-6 w-6"
                        />
                        <span>Nitro</span>
                    </div>

                    <div className="flex items-center space-x-3 p-2 cursor-pointer hover:bg-dark rounded-md">
                        <img
                            src={"/icons/shop.svg"}
                            className="h-6 w-6"
                        />
                        <span>Shop</span>
                    </div>
                </div>

                {/* friends list / direct messages */}
                <div className="overflow-y-auto">
                    {/* header */}
                    <div className="flex justify-between space-x-2 p-2 text-[10px]">
                        <h3 className="uppercase text-gray-400 font-semibold">Direct Messages</h3>
                        <h3><GoPlus/></h3>
                    </div>

                    {/* list */}
                    <div className="text-gray-400 cursor-pointer">
                        {users.filter((_user, index) => index !== 0).map((user) => (
                            <div
                                key={user.id}
                                className={`w-full p-2 text-left mb-2 rounded-md ${
                                    activeDM === user.id
                                        ? "bg-dark" // Active DirectMessages recipient highlighted
                                        : "bg-transparent hover:bg-dark"
                                }`}
                                onClick={() => handleDMClick(user.id)} // Set active DirectMessages recipient
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="relative w-10 h-10 overflow-hidden">
                                        {/* Profile Picture */}
                                        <img
                                            src={user.picture}
                                            alt={user.displayName}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                    <span className="font-medium">{user.displayName}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* ************* MAIN / CHAT ************* */}
            <main className="mt-14 flex bg-dark w-[80.5%] flex-row">
                {/* main */}
                <div className="flex flex-col border-r border-light w-full p-4 justify-end">
                    {activeDMMessages.map((msg: MessageDM, index: number) => (
                        <div key={index} className="mb-4 flex items-start">
                            {/* Sender's Picture */}
                            <img
                                src={msg.sender?.picture || "/default-profile.png"} // Default image if no picture
                                alt={msg.sender?.displayName || "User"}
                                className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                                {/* Sender's Name */}
                                <div className="text-sm text-white">
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
                                        handleSendDM();
                                    }
                                }}
                                placeholder={`Message @${activeDM ? users.find(user => user.id === activeDM)?.displayName : "Person"}`}
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
                                />
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
                {isProfileShown && (
                    <aside className="w-[40%] bg-darker justify-between h-full flex flex-col">
                        {/*on top items*/}
                        <div>
                            {/* Header */}
                            <div
                                className={`relative h-28`}
                                style={{
                                    background: activeDM !== null
                                        ? users.find(user => user.id === activeDM)?.banner || "#fff"
                                        : "#fff"
                                }}
                            >
                                {/* top right buttons */}
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <button className="p-2 rounded-full bg-dark bg-opacity-50">
                                        <img src={"/icons/friends-status.svg"} alt="Friends"
                                             className="h-5 w-5 object-cover"/>
                                    </button>
                                    <button className="p-2 rounded-full bg-dark bg-opacity-50">
                                        <img src={"/icons/three-buttons-horizontal.svg"} alt="More"
                                             className="h-5 w-5 object-cover"/>
                                    </button>
                                </div>
                                <div className="absolute bottom-[-40px] left-4">
                                    {/* user */}
                                    <div
                                        className="relative w-20 h-20 overflow-hidden bg-darker p-1 rounded-l-full rounded-r-full rounded-br-none">
                                        {/* Profile Picture */}
                                        <img
                                            src={activeDM !== null ? users.find(user => user.id === activeDM)?.picture : "/logo/dc-circle.svg"}
                                            alt={activeDM !== null ? users.find(user => user.id === activeDM)?.displayName : "Picture"}
                                            className="w-full h-full object-cover rounded-full"
                                        />

                                        {/* Status Icon with Space */}
                                        <div
                                            className="absolute bottom-[-2px] right-[-2px] w-8 h-8 rounded-full bg-darker flex items-center justify-center p-1">
                                            <img
                                                src={`/status/${activeDM !== null ? users.find(user => user.id === activeDM)?.status : "offline"}.svg`}
                                                alt={activeDM !== null ? users.find(user => user.id === activeDM)?.status : "Status"}
                                                className="w-full h-full"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* User Details */}
                            <div className="mt-12 px-4">
                                <h2 className="text-xl font-bold">
                                    {activeDM !== null
                                        ? users.find(user => user.id === activeDM)?.displayName
                                        : "Unknown"}
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    {activeDM !== null
                                        ? users.find(user => user.id === activeDM)?.username
                                        : "Unknown"}
                                </p>
                                {/* About Section */}
                                <div className="bg-dark p-4 mt-4 rounded-md">
                                    {/* bio */}
                                    {activeDM !== null && users.find(user => user.id === activeDM)?.bio && (
                                        <div>
                                            <p className="text-sm text-gray-400 font-semibold">About Me</p>
                                            <p className="mt-1 text-gray-300">
                                                {users.find(user => user.id === activeDM)?.bio}
                                            </p>
                                        </div>
                                    )}

                                    <p className="mt-2 text-sm text-gray-400 font-semibold">Member Since</p>
                                    <p className="mt-1 text-gray-300">
                                        {activeDM !== null
                                            ? users.find(user => user.id === activeDM)?.memberSince
                                            : "Unknown"}
                                    </p>
                                </div>
                            </div>

                            {/* Mutual Servers */}
                            <div className="mt-4 space-y-2 px-4 text-gray-400">
                                <div className="bg-dark mt-4 rounded-md">
                                    <div
                                        className="flex items-center justify-between p-3 bg-dark rounded-md cursor-pointer hover:bg-gray-700">
                                        <span>Mutual Servers — {mutualServerCount}</span>
                                        <span><RxCaretDown/></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="relative bottom-0 py-3 bg-darker text-center text-gray-300 text-sm cursor-pointer hover:text-white border-t border-lighter">
                            View Full Profile
                        </div>
                    </aside>
                )}
            </main>
        </div>
    );
};

export default DirectMessages;