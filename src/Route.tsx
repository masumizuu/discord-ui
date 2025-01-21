import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import Account from "./frontend/Account.tsx";
import DefaultHome from "./frontend/DefaultHome.tsx";
import DirectMessages from "./frontend/DirectMessageView.tsx";
import ServerView from "./frontend/ServerView.tsx";

const AppRouter: React.FC = () => {
    return (
        <div className="w-screen h-screen">
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<App />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/channels/@me" element={<DefaultHome />} />
                    <Route path="/channels/:userId" element={<DirectMessages />} />
                    <Route path="/server/:serverId/channel/:channelId" element={<ServerView />} />
                </Routes>
            </Router>
        </div>
    );
};

export default AppRouter;
