import React, {useEffect, useState} from "react";
import { Helmet } from "react-helmet-async";
import { GoPlus } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS

import { users } from "../backend/data";
import {Channel, useServerContext} from "../backend/context/ServerContext.tsx";
import {useMessageStore} from "../backend/store/messageStore.tsx";

const Home: React.FC = () => {
    // declarations
    const navigate = useNavigate();

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
        setCurrentServer(serverId);
        if (serverId) {
            const server = servers[serverId];
            if (server && server.channels?.length > 0) {
                const firstChannel = server.channels[0]; // Get the first channel
                setDefChannel(firstChannel);

                // Navigate to the default channel
                navigate(`/server/${serverId}/channel/${firstChannel.name}`, { replace: true });
            }
        }
    };

    // friend list area
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [activeDM, setActiveDM] = useState<number | null>(null); // To track the active DirectMessages user
    const [isDMIndex, setIsDMIndex] = useState<number | null>(null); // For highlighting the selected user
    const handleDMClick = (userId: number) => {
        setActiveDM(userId); // Set the active DirectMessages recipient
        setIsDMIndex(userId); // Highlight the clicked user
        console.log("Active DirectMessages:", userId); // Log the user id to the console

        // Navigate to the DirectMessages channel URL
        navigate(`/channels/${userId}`);  // Pass the user.id in the URL
    };

    // main area
    const onlineUsers = users.filter((user, index) => user.status !== "offline" && index !== 0);
    const allUsers = users.filter((user) => user.id !== 1000); // Example for filtering by ID
    const pendingUsers = users.filter((user, index) => user.friends !== "friends" && index !== 0);
    const [hoveredUserIndex, setHoveredUserIndex] = useState<number | null>(null);
    const [isFriends, setIsFriends] = useState(true); //default
    const [isPending, setIsPending] = useState(false);
    const [isAll, setIsAll] = useState(false);
    const showFriends = () => {
        setIsFriends(true);
        setIsPending(false);
        setIsAll(false);
    }
    const showPending = () => {
        setIsFriends(false);
        setIsPending(true);
        setIsAll(false);
    }
    const showAll = () => {
        setIsFriends(false);
        setIsPending(false);
        setIsAll(true);
    }

    // refreshing this page
    const displayDefault = () => {
        navigate("/channels/@me");
    };

    // use effect for notifications simulation
    const simulateMessages = useMessageStore((state) => state.simulateAndLoadMessages);
    const simulateDMMessages = useMessageStore((state) => state.simulateAndLoadDMMessages);
    useEffect(() => {
        const isEffectRun = sessionStorage.getItem("effectRun"); // Check if simulation has already run

        if (!isEffectRun) {
            simulateMessages(); // Simulate server messages
            console.log("Simulate server messages");

            const timer = setTimeout(() => {
                simulateDMMessages(); // Simulate DM messages after 1-second delay
                console.log("Simulate DM messages");
            }, 4000);

            const timer1 = setTimeout(() => {
                // Mark the effect as run in session storage
                sessionStorage.setItem("effectRun", "true");
                console.log("Effect run set to true");
            }, 20000); // mark as true after 20-second delay to make sure the dm msgs are fired

            return () => {
                clearTimeout(timer); // Cleanup timeout to avoid memory leaks
                clearTimeout(timer1); // Cleanup timeout to avoid memory leaks
            };
        }
    }, [simulateMessages, simulateDMMessages]);

    return (
        <div className="flex h-screen bg-dark text-white text-sans w-full">
            <ToastContainer />

            {/* Helmet */}
            <Helmet>
                <title>
                    Discord | Friends
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

                        {/* Middle part - Right next to search */}
                        <div className="flex space-x-3 text-sm font-medium ml-2">
                            {/* Friends */}
                            <div
                                className="flex items-center space-x-1 text-gray-400 hover:text-gray-200 border-r-2 border-gray-700 px-4">
                                <img src={"/icons/friends.svg"} alt={"Friends"} className="h-6 w-6"/>
                                <span>Friends</span>
                            </div>

                            {/* Other Buttons */}
                            <div className="flex space-x-3 text-sm">
                                <button
                                    className={`btn btn-sm font-medium ${
                                        isFriends
                                            ? "btn-active bg-light text-lighter rounded-lg hover:bg-lighter"
                                            : "bg-transparent hover:bg-light"
                                    } border-0`}
                                    onClick={showFriends}
                                >
                                    Online
                                </button>
                                <button
                                    className={`btn btn-sm font-medium ${
                                        isAll
                                            ? "btn-active bg-light text-lighter rounded-lg hover:bg-lighter"
                                            : "bg-transparent hover:bg-light"
                                    } border-0`}
                                    onClick={showAll}
                                >
                                    All
                                </button>
                                <button
                                    className={`btn btn-sm font-medium ${
                                        isPending
                                            ? "btn-active bg-light text-lighter rounded-lg hover:bg-lighter"
                                            : "bg-transparent hover:bg-light"
                                    } border-0`}
                                    onClick={showPending}
                                >
                                    Pending
                                </button>
                                <button
                                    className="btn btn-sm bg-transparent hover:bg-light font-medium border-0">Blocked
                                </button>
                                <button className="btn btn-sm btn-success font-medium text-white">
                                    Add Friend
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Push right-side icons to the far right */}
                    <div className="flex items-center space-x-5 px-5 cursor-pointer">
                        <img src={"/icons/new-group-dm.svg"} className="h-6 w-6" alt="New group dm"/>
                        <img src={"/icons/inbox.svg"} className="h-6 w-6" alt="Inbox"/>
                        <img src={"/icons/help.svg"} className="h-6 w-6" alt="Help"/>
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

            {/* ************* FRIENDS ************* */}
            <aside className="flex flex-col bg-darker text-gray-200 h-screen p-3 space-y-2 w-[15%]">

                {/* 3 items above */}
                <div className="text-gray-400 text-sm mt-14">
                    <div
                        className={`flex items-center space-x-3 p-2 rounded-md mb-1 bg-dark hover:bg-dark`}
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
                                className={`w-full p-2 text-left mb-2 ${
                                        isDMIndex === user.id
                                            ? "bg-dark text-white" // Active DirectMessages recipient highlighted
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
            <main className="mt-14 flex bg-dark w-[80.5%] p-4 flex-row">
                {/* main */}
                <div className="flex flex-col border-r border-light w-full pr-4">
                    {/* search bar */}
                    <div className="mb-4 relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className="input input-bordered bg-darkest placeholder-gray-400 text-gray-200 w-full pr-10"/>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <CiSearch className="w-6 h-6"/>
                        </div>
                    </div>

                    {/* friends */}
                    {isFriends && (
                        <div>
                            {/* header */}
                            <h3 className="text-xs uppercase text-gray-400 font-semibold mb-4">
                                Online — {onlineUsers.length}
                            </h3>

                            {/* list */}
                            {onlineUsers.map((user, index) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-2 rounded-lg mb-2 hover:bg-light"
                                    onMouseEnter={() => setHoveredUserIndex(index)}
                                    onMouseLeave={() => setHoveredUserIndex(null)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="relative w-10 h-10 overflow-hidden">
                                            <img
                                                src={user.picture}
                                                alt={user.displayName}
                                                className="w-full h-full object-cover rounded-full"/>
                                            <div
                                                className="absolute bottom-[-2px] right-[-2px] w-5 h-5 rounded-full bg-darker flex items-center justify-center p-1">
                                                <img
                                                    src={`/status/${user.status}.svg`}
                                                    alt={`${user.status} status`}
                                                    className="w-3 h-3"/>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="font-medium">
                                                {user.displayName}
                                                {hoveredUserIndex === index && (
                                                    <span className="text-gray-500 ml-2">{`${user.username}`}</span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {user.status === "online"
                                                    ? "Online"
                                                    : user.status === "away"
                                                        ? "Away"
                                                        : user.status === "do-not-disturb"
                                                            ? "Do Not Disturb"
                                                            : "Unknown"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <div className="rounded-full bg-darker bg-opacity-50 p-2">
                                            <img src={"/icons/message.svg"} className="h-5 w-5"/>
                                        </div>
                                        <div className="rounded-full bg-darker bg-opacity-50 p-2">
                                            <img src={"/icons/three-dots.svg"} className="h-5 w-5"/>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* all */}
                    {isAll && (
                        <div>
                            {/* header */}
                            <h3 className="text-xs uppercase text-gray-400 font-semibold mb-4">
                                All — {allUsers.length}
                            </h3>

                            {/* list */}
                            {allUsers.map((user, index) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-2 rounded-lg mb-2 hover:bg-light"
                                    onMouseEnter={() => setHoveredUserIndex(index)}
                                    onMouseLeave={() => setHoveredUserIndex(null)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="relative w-10 h-10 overflow-hidden">
                                            <img
                                                src={user.picture}
                                                alt={user.displayName}
                                                className="w-full h-full object-cover rounded-full"/>
                                            <div
                                                className="absolute bottom-[-2px] right-[-2px] w-5 h-5 rounded-full bg-darker flex items-center justify-center p-1">
                                                <img
                                                    src={`/status/${user.status}.svg`}
                                                    alt={`${user.status} status`}
                                                    className="w-3 h-3"/>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="font-medium">
                                                {user.displayName}
                                                {hoveredUserIndex === index && (
                                                    <span className="text-gray-500 ml-2">{`${user.username}`}</span>
                                                )}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {user.status === "online"
                                                    ? "Online"
                                                    : user.status === "away"
                                                        ? "Away"
                                                        : user.status === "do-not-disturb"
                                                            ? "Do Not Disturb"
                                                            : "Offline"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <div className="rounded-full bg-darker bg-opacity-50 p-2">
                                            <img src={"/icons/message.svg"} className="h-5 w-5"/>
                                        </div>
                                        <div className="rounded-full bg-darker bg-opacity-50 p-2">
                                            <img src={"/icons/three-dots.svg"} className="h-5 w-5"/>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* pending */}
                    {isPending && (
                        <div>
                            {/* header */}
                            <h3 className="text-xs uppercase text-gray-400 font-semibold mb-4">
                                Pending — {pendingUsers.length}
                            </h3>

                            {/* list */}
                            {pendingUsers.map((user, index) => (
                                <div
                                    key={user.id}
                                    className="flex items-center justify-between p-2 rounded-lg mb-2 hover:bg-light"
                                    onMouseEnter={() => setHoveredUserIndex(index)}
                                    onMouseLeave={() => setHoveredUserIndex(null)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="relative w-10 h-10 overflow-hidden">
                                            <img
                                                src={user.picture}
                                                alt={user.displayName}
                                                className="w-full h-full object-cover rounded-full"/>
                                        </div>

                                        <div>
                                            <p className="font-medium">
                                                {user.displayName}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                {user.friends === "pending"
                                                    ? "Outgoing Friend Request"
                                                    : "Unknown"
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <div className="rounded-full bg-darker bg-opacity-50 p-2">
                                            <IoMdClose className="h-5 w-5 text-gray-400"/>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/*right side*/}
                <aside className="w-[40%] bg-dark p-4">
                    <h2 className="text-lg font-semibold">Active Now</h2>
                    <p className="text-sm text-gray-400 mt-2 text-center">
                        <b>It’s quiet for now…</b> <br/>When a friend starts an activity — like playing a game
                        or hanging out on voice — we’ll show it here!
                    </p>
                </aside>
            </main>
        </div>
    );
};

export default Home;