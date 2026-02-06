import { useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AnimatedBorder from "../components/AnimatedBorder";
import { MessageCircleMore, UserRound, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { LoaderIcon } from "react-hot-toast";
import SignUpcoverPhoto from "../image/SignUp.png";

const SignUpPage = () => {
  const fullNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const { isSigningUp, signup } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      fullName: fullNameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    signup(formData);
  };

  const navigate = useNavigate();

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
                  Create Account
                </h2>
                <p className="text-fuchsia-400">Sign up for new account</p>
              </div>

              {/* signup form */}
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Full Name */}
                <div>
                  <label htmlFor="fullname" className="auth-input-label">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserRound className="auth-input-icon" />
                    <input
                      type="text"
                      name="fullName"
                      id="fullname"
                      className="input"
                      ref={fullNameRef}
                      placeholder="Your Name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="auth-input-label">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="auth-input-icon" />
                    <input
                      type="text"
                      name="email"
                      id="email"
                      className="input"
                      ref={emailRef}
                      placeholder="Email"
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
                      ref={passwordRef}
                      placeholder="Password"
                      autoComplete="never"
                    />
                  </div>
                </div>

                {/* Button */}
                <button
                  className="auth-btn"
                  type="submit"
                  disabled={isSigningUp}
                >
                  {isSigningUp ? (
                    <LoaderIcon className="text-center animate-spin w-full h-5" />
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>

              <p className="text-center mt-4 text-fuchsia-400 text-sm">
                Already have an account?
                <span
                  className="text-fuchsia-900 cursor-pointer hover:text-fuchsia-500 ml-0.5"
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="responsive-layout md:w-1/2 md:p-8 pt-0 pb-8  items-center justify-center">
            <div>
              <p className="mt-5 text-2xl text-fuchsia-900 font-bold text-center">
                "Where conversations feel alive"
              </p>

              <img
                src={SignUpcoverPhoto}
                className="object-contain"
                alt="Sign Up"
              />

              <p className="text-fuchsia-400 text-sm italic px-5 text-center">
                Share thoughts, memories, and emotions in a safe place made just
                for you. Create an account and start sending messages that truly
                matter.
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

export default SignUpPage;
