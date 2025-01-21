import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Helmet} from "react-helmet-async";

const Account: React.FC = () => {
    const navigate = useNavigate();

    // display
    const [isLogin, setIsLogin] = useState(true); //default
    const [isSignUp, setIsSignUp] = useState(false);
    const handleLogin = () => {
        const account = accounts.find(
            (acc) =>
                (acc.username === usernameOrEmail) &&
                acc.password === password
        );

        if (account) {
            alert(`Login successful! Welcome, ${account.username}.`);
            navigate("/channels/@me");
        } else {
            alert("Invalid username, email, or password. Please try again.");
        }
    };

    const handleSignup = () => {
        setIsLogin(false);
        setIsSignUp(true);
    };
    const handleSignin = () => {
        setIsLogin(true);
        setIsSignUp(false);
    }

    // login
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");

    // signup
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [username, setUsername] = useState("");

    const accounts = [
        { username: "kusoyaroucnn", password: "password123" },
        { username: "breezus24", password: "password456"},
    ];

    return (
        <div className="flex flex-col justify-center items-center min-h-screen text-white">
            {/* Helmet */}
            <Helmet>
                <title>Discord</title>
            </Helmet>

            {/* div bg */}
            <div className="absolute inset-0 -z-10 bg-cover bg-center"
                 style={{
                     backgroundImage: `url('/bg/4.png')`,
                     WebkitFilter: 'blur(5px)', // blur epek
                 }}
            ></div>

            {/* Login Container */}
            { isLogin && (<div className="w-screen h-full flex flex-col items-center justify-center">

                <div className="flex flex-row items-center justify-center bg-dark px-10 py-8 w-[50%] rounded shadow-lg">

                    {/* text div */}
                    <div className="w-full">
                        <h1 className="text-2xl font-bold text-center mb-2">Welcome back!</h1>
                        <p className="text-sm text-center mb-2">We're so excited to see you again!</p>

                        {/* Email or Username Input */}
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                                Email or phone number
                                <span className="inline-flex text-sm font-bold text-red-400 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                value={usernameOrEmail}
                                onChange={(e) => setUsernameOrEmail(e.target.value)}
                                className="bg-darkest input w-full text-white"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="mb-6 relative">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                                Password
                                <span className="inline-flex text-sm font-bold text-red-400 ml-1">*</span>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input w-full bg-darkest text-white"
                            />

                            {/* Forgot Password */}
                            <div>
                                <a className="text-xs hover:underline">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        {/* Log In Button */}
                        <button
                            onClick={handleLogin}
                            className={`w-full py-2 rounded ${
                                usernameOrEmail && password
                                    ? "bg-dc hover:bg-dc text-white"
                                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                            }`}
                            disabled={!usernameOrEmail || !password}
                        >
                            Log In
                        </button>

                        {/* Sign Up */}
                        <div className="mt-1">
                            <p className="text-xs text-gray-400">
                                Don't have an account?{" "}
                                <a onClick={handleSignup}>
                                    Register
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* qr code */}
                    <div className="flex flex-col items-center justify-center pl-14 h-full text-center">
                        <img src={'/qr.svg'} alt="QR Code" className="w-44 mb-6"/>
                        <h1 className="text-xl font-bold mb-4">Log in with QR code</h1>
                        <p className="text-gray-500"> Scan this with the <b>Discord mobile app</b> to log in instantly.</p>
                        <a className="mt-1">Or sign in with passkey.</a>
                    </div>

                </div>
            </div>)}

            {/* Signup Container */}
            { isSignUp && (<div className="w-screen h-screen flex flex-col items-center justify-center">

                <div className="flex flex-col items-center justify-center bg-dark px-10 py-8 w-[30%] h-[75%] rounded shadow-lg">

                    {/* text div */}
                    <div className="w-full">
                        <h1 className="text-2xl font-bold text-center mb-2">Create an account</h1>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                                Email
                                <span className="inline-flex text-sm font-bold text-red-400 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-darkest input w-full text-white"
                            />
                        </div>

                        {/* Display name */}
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                                Display Name
                            </label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="bg-darkest input w-full text-white"
                            />
                        </div>

                        {/* Username */}
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                                Username
                                <span className="inline-flex text-sm font-bold text-red-400 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-darkest input w-full text-white"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="mb-6 relative">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                                Password
                                <span className="inline-flex text-sm font-bold text-red-400 ml-1">*</span>
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input w-full bg-darkest text-white"
                            />
                        </div>

                        {/* birthday */}
                        <div className="flex flex-col mb-4">
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                                Date of Birth
                                <span className="inline-flex text-sm font-bold text-red-400 ml-1">*</span>
                            </label>

                            <div className="flex flex-row justify-center w-full gap-6">
                                {/*day*/}
                                <div className="w-1/3">
                                    <select id="day" name="day" className="w-full">
                                        <option value="" disabled selected className="text-gray-400">Day
                                        </option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                        <option value="11">11</option>
                                        <option value="12">12</option>
                                        <option value="13">13</option>
                                        <option value="14">14</option>
                                        <option value="15">15</option>
                                        <option value="16">16</option>
                                        <option value="17">17</option>
                                        <option value="18">18</option>
                                        <option value="19">19</option>
                                        <option value="20">20</option>
                                        <option value="21">21</option>
                                        <option value="22">22</option>
                                        <option value="23">23</option>
                                        <option value="24">24</option>
                                        <option value="25">25</option>
                                        <option value="26">26</option>
                                        <option value="27">27</option>
                                        <option value="28">28</option>
                                        <option value="29">29</option>
                                        <option value="30">30</option>
                                        <option value="31">31</option>
                                    </select>
                                </div>
                                {/*month*/}
                                <div className="w-1/3">
                                    <select id="month" name="month" className="w-full">
                                        <option value="" disabled selected className="text-gray-400">Month
                                        </option>
                                        <option value="1">January</option>
                                        <option value="2">February</option>
                                        <option value="3">March</option>
                                        <option value="4">April</option>
                                        <option value="5">May</option>
                                        <option value="6">June</option>
                                        <option value="7">July</option>
                                        <option value="8">August</option>
                                        <option value="9">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                    </select>
                                </div>
                                {/*year*/}
                                <div className="w-1/3">
                                    <select id="year" name="year" className="w-full">
                                        <option value="" disabled selected className="text-gray-400">Year
                                        </option>
                                        <option value="1990">1990</option>
                                        <option value="1991">1991</option>
                                        <option value="1992">1992</option>
                                        <option value="1993">1993</option>
                                        <option value="1994">1994</option>
                                        <option value="1995">1995</option>
                                        <option value="1996">1996</option>
                                        <option value="1997">1997</option>
                                        <option value="1998">1998</option>
                                        <option value="1999">1999</option>
                                        <option value="2000">2000</option>
                                        <option value="2001">2001</option>
                                        <option value="2002">2002</option>
                                        <option value="2003">2003</option>
                                        <option value="2004">2004</option>
                                        <option value="2005">2005</option>
                                        <option value="2006">2006</option>
                                        <option value="2007">2007</option>
                                        <option value="2008">2008</option>
                                        <option value="2009">2009</option>
                                        <option value="2010">2010</option>
                                        <option value="2011">2011</option>
                                        <option value="2012">2012</option>
                                        <option value="2013">2013</option>
                                        <option value="2014">2014</option>
                                        <option value="2015">2015</option>
                                        <option value="2016">2016</option>
                                        <option value="2017">2017</option>
                                        <option value="2018">2018</option>
                                        <option value="2019">2019</option>
                                        <option value="2020">2020</option>
                                        <option value="2021">2021</option>
                                        <option value="2022">2022</option>
                                        <option value="2023">2023</option>
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/*checkbox*/}
                        <div className="text-xs text-gray-400 items-center mb-4">
                            <input
                                type="checkbox"
                            /> <span>  (Optional) It's okay to send me emails with Discord updates, tips and special offers. You can opt out at any time.</span>
                        </div>

                        {/* Continue */}
                        <button
                            onClick={handleLogin}
                            className={`w-full py-2 rounded ${
                                usernameOrEmail && password
                                    ? "bg-dc hover:bg-dc text-white"
                                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                            }`}
                            disabled={!usernameOrEmail || !password}
                        >
                            Continue
                        </button>
                        <p className="text-xs text-gray-500 mb-6">By registering, you agree to Discord's <a>Terms
                            of Service</a> and <a>Privacy Policy</a>.</p>

                        <a className="text-sm" onClick={handleSignin}>Already have an account?</a>
                    </div>

                </div>
            </div>)}

        </div>
    );
};

export default Account;