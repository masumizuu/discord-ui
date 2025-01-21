import React from "react";
import { useNavigate } from "react-router-dom";
import { FiDownload } from "react-icons/fi";
import { Helmet } from "react-helmet-async";
import { FaDiscord } from "react-icons/fa";
import "./index.css";

const App: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen text-white overflow-x-hidden">
            {/* Helmet */}
            <Helmet>
                <title>Discord - Group Chat That's All Fun & Games</title>
            </Helmet>

            {/* Header */}
            <header className="bg-transparent absolute top-0 w-full z-10">
                <div className="flex flex-row gap-20 items-center justify-center p-3">

                    {/* Logo */}
                    <div>
                        <img src="/logo/name-white.svg" alt="Discord Logo" className="h-12"/>
                    </div>

                    {/* Navbar */}
                    <div className="flex justify-center w-1/2 gap-12 cursor-pointer font-bold text-center text-sm">
                        <span className="hover:text-dc">Download</span>
                        <span className="hover:text-dc">Nitro</span>
                        <span className="hover:text-dc">Discover</span>
                        <span className="hover:text-dc">Quests</span>
                        <span className="hover:text-dc">Safety</span>
                        <span className="hover:text-dc">Support</span>
                        <span className="hover:text-dc">Blog</span>
                        <span className="hover:text-dc">Careers</span>
                    </div>

                    {/* button */}
                    <div>
                        <button
                            className="btn btn-white !h-9 !min-h-9 rounded-full bg-white text-black border-white hover:text-dc hover:bg-white hover:border-white text-sm"
                            onClick={() => navigate('/account')}
                        >
                            Log In
                        </button>
                    </div>

                </div>
            </header>

            {/* Main Content */}
            <main className="absolute min-h-screen max-w-screen flex flex-col overflow-y-auto border-0 bg-burble">

                {/* page 1 */}
                <div className="relative h-screen w-screen">

                    {/*gif bg*/}
                    <div className="absolute inset-0 bg-cover bg-center"
                         style={{
                             backgroundImage: `url('/bg/1.gif')`,
                             WebkitFilter: 'blur(5px)', // blur epek
                         }}
                    ></div>

                    {/* content div */}
                    <div className="relative h-full flex flex-col items-center justify-center">

                        <div className="flex flex-row items-start justify-center">

                            {/* text div */}
                            <div className="w-1/4 ml-32">
                                <h1 className="text-5xl text-white font-rm whitespace-nowrap mt-44">
                                    <span className="block py-0.5">GROUP CHAT</span>
                                    <span className="block py-0.5">THAT'S ALL</span>
                                    <span className="block py-0.5">FUN & GAMES</span>
                                </h1>
                                <p className="text-xl text-white mt-4 whitespace-break-spaces">
                                    Discord is great for playing games and chilling with friends, or
                                    even building a worldwide community. Customize your own space to
                                    talk, play, and hang out.
                                </p>
                            </div>

                            <img src={'/app1.svg'}
                                 alt="App1"
                                 className="h-[700px]"/>
                        </div>

                        {/* button */}
                        <div className="flex flex-row space-x-2">

                            <button
                                className="btn btn-white rounded-full bg-white text-black border-white hover:text-dc hover:bg-white hover:border-white text-lg font-light items-center px-10 py-2"
                            >
                                <FiDownload className="mr-2"></FiDownload>
                                Download for Windows
                            </button>

                            <button className="btn bg-bl1 rounded-full border-0 text-white text-lg font-light items-center px-10 py-2 hover:shadow-lg hover:bg-bl1 hover:shadow-black/50 transition-shadow duration-300 ease-in-out">
                                Open Discord in your browser
                            </button>
                        </div>
                    </div>
                </div>

                {/*that heading thing*/}
                <div className="marquees grid gap-[5vw] h-full overflow-hidden">
                    <section
                        className="marquee relative overflow-hidden w-[110%] ml-[-5%] bg-[rgba(88,101,242,0.8)] text-white"
                        style={{"--char-count": 28,} as React.CSSProperties
                        }
                    >
                        <div
                            className="marquee--inner flex uppercase w-max space-x-10"
                        >
                            <FaDiscord className="text-[2rem] translate-y-[100%]"></FaDiscord>
                            <p className="font-bold leading-[1.1] m-0 text-[clamp(2.5rem,12vw,6.2rem)] transform translate-y-[0.07em] font-rm flex gap-[0.5em]">
                                PLAY
                            </p>
                            <FaDiscord className="text-[2rem] translate-y-[100%]"></FaDiscord>
                            <p
                                aria-hidden="true"
                                className="font-bold leading-[1.1] m-0 text-[clamp(2.5rem,12vw,6.2rem)] transform translate-y-[0.07em] font-rm flex gap-[0.5em]"
                            >
                                CHAT
                            </p>
                            <FaDiscord className="text-[2rem] translate-y-[100%]"></FaDiscord>
                            <p
                                aria-hidden="true"
                                className="font-bold leading-[1.1] m-0 text-[clamp(2.5rem,12vw,6.2rem)] transform translate-y-[0.07em] font-rm flex gap-[0.5em]"
                            >
                                HANG OUT
                            </p>
                            <FaDiscord className="text-[2rem] translate-y-[100%]"></FaDiscord>
                            <p
                                aria-hidden="true"
                                className="font-bold leading-[1.1] m-0 text-[clamp(2.5rem,12vw,6.2rem)] transform translate-y-[0.07em] font-rm flex gap-[0.5em]"
                            >
                                TALK
                            </p>
                            <FaDiscord className="text-[2rem] translate-y-[100%]"></FaDiscord>
                        </div>
                    </section>
                </div>

                {/* page 2 */}
                <div className="relative h-screen w-screen overflow-hidden">
                    {/*gif bg*/}
                    <div className="absolute inset-0 bg-cover bg-center"
                         style={{
                             backgroundImage: `url('/bg/2.gif')`, // Replace with the path to your GIF
                             filter: 'blur(3px)', // Apply custom blur
                             WebkitFilter: 'blur(3px)', // For Safari compatibility
                         }}
                    ></div>


                    {/* Content div */}
                    <div className="flex items-center justify-center h-screen">
                        <div className="relative z-10 flex flex-col items-center max-w-[70%]">
                            <div className="bg-white/20 backdrop-blur-lg border border-white/10 shadow-lg rounded-lg py-2 px-4 space-x-4 flex flex-row items-center justify-center">
                                {/* Video element */}
                                <video
                                    src="/app2.mp4"
                                    autoPlay
                                    loop
                                    muted
                                    className="w-[50%] rounded-3xl"
                                />

                                {/* Text content */}
                                <div className="flex flex-col text-left w-[50%] space-y-4">
                                    <h1 className="text-white text-5xl font-bold font-rm">MAKE YOUR GROUP CHATS MORE FUN</h1>
                                    <p className="text-white/80 text-xl">
                                        Use custom emoji, stickers, soundboard effects and more to add your personality to your voice, video, or text chat.
                                        Set your avatar and a custom status, and write your own profile to show up in chat your way.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


            </main>

            {/* Footer */}
            {/*<footer*/}
            {/*</footer>*/}

        </div>
    );
};

export default App;
