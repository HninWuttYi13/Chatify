import { useNavigate } from "react-router";
import LoginCoverPhoto from "../image/Login.png";
import { MessageCircleMore, Mail, Lock, Loader } from "lucide-react";
import AnimatedBorder from "../components/AnimatedBorder";
import { useAuthStore } from "../store/useAuthStore";
import { useRef } from "react";
import { LoaderIcon } from "react-hot-toast";
const LoginPage = () => {
  const navigate = useNavigate();
  const {isLogin, login} = useAuthStore();
  const emailRef = useRef();
  const passwordRef = useRef();
  const handleSubmit = (e)=> {
    e.preventDefault();
    const formData = {
      email: emailRef.current.value,
      password: passwordRef.current.value
    }
    login(formData)
  }
  return (
    <div className="relative w-full sm:max-w-lg md:max-w-3xl lg:max-w-6xl h-auto p-4">
      <AnimatedBorder>
        <div className="w-full flex flex-col md:flex-row bg-fuchsia-100 rounded-2xl">
          {/* LEFT COLUMN */}
          <div className=" md:w-1/2 p-8 md:border-r border-fuchsia-300 flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Heading text */}
              <div className="text-center mb-8">
                <MessageCircleMore
                  size={60}
                  color="#721377"
                  className="mx-auto mb-4"
                />
                <h2 className="text-[#721377] text-2xl font-bold mb-2">
                  Welcome Back
                </h2>
                <p className="text-fuchsia-400">Login to access your account</p>
              </div>

              {/* login form */}
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="auth-input-label">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="auth-input-icon" />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="input"
                      placeholder="Email"
                      ref={emailRef}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="auth-input-label">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="auth-input-icon" />
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="input"
                      placeholder="Password"
                      ref={passwordRef}
                      autoComplete="never"
                    />
                  </div>
                </div>

                {/* Button */}
                <button className="auth-btn" type="submit">
                  {isLogin ? <LoaderIcon className="text-center animate-spin w-full h-5"/>: "Sign Up"}
                </button>
              </form>
              <p className="text-center mt-4 text-fuchsia-400 text-sm">
                Don't have an account?
                <span
                  className="text-fuchsia-900 cursor-pointer hover:text-fuchsia-500 ml-0.5"
                  onClick={() => navigate("/signup")}
                >
                  SignUp
                </span>
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="md:w-1/2 md:p-8 pt-0 pb-8  items-center justify-center">
            <div>
              <p className="mt-5 text-2xl text-fuchsia-900 font-bold text-center">
                "Where conversations feel alive"
              </p>

              <img
                src={LoginCoverPhoto}
                className="object-contain h-[350px] w-full"
                alt="Sign Up"
              />

              <p className="text-fuchsia-400 text-sm italic px-5 text-center">
                Welcome back! Log in to continue your conversations and stay
                connected with the people who matter most.
              </p>

              <ul className="flex items-center justify-center gap-3 mt-5">
                <li className="auth-badge">Real-time</li>
                <li className="auth-badge">Private</li>
                <li className="auth-badge">Simple & Beautiful</li>
              </ul>
            </div>
          </div>
        </div>
      </AnimatedBorder>
    </div>
  );
};

export default LoginPage;
