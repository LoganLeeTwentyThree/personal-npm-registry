"use client"

import { FormEvent, useState } from 'react';

type LoginProps = {
  id: string
}

export default function LoginPage(props : LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = async (e : FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    fetch(`/auth/${isSignUp ? "signup" : ""}`,
      {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', 
        },
        body : JSON.stringify(
          {
            Email : email,
            Password : password,
            UUID: props.id
          }
        )
      }
    ).then(async (r : Response) => {
      if(r.ok)
      {
        cookieStore.set("session", (await r.json()).token)
        location.href = "/"
      }
    })
  };

  return (
    <div className="relative min-h-screen font-['Outfit',sans-serif] overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #2d1b3d 100%)" }}>

      {/* Animated background orbs */}
      <div className="absolute -top-1/2 -right-1/5 w-[800px] h-[800px] rounded-full pointer-events-none animate-pulse"
        style={{ background: "radial-gradient(circle, rgba(147,51,234,0.15) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-1/3 -left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none animate-pulse"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)", animationDelay: "1s" }} />

      {/* Grid layout */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 min-h-screen">

        {/* Brand section - hidden on mobile */}
        <div className="hidden md:flex items-center justify-center p-16">
          <div className="max-w-[480px]">
            {/* Logo */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-12 h-12 rounded-xl animate-spin"
                style={{
                  background: "linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)",
                  animationDuration: "20s"
                }}>
                <div className="absolute inset-[3px] rounded-[10px]"
                  style={{ background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)" }} />
              </div>
              <span className="font-['Syne',sans-serif] text-4xl font-extrabold tracking-tight"
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #a855f7 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}>
                NPM Registry
              </span>
            </div>

            <p className="text-white/70 text-lg leading-relaxed font-light mb-12">
              The world's largest software registry. Discover, share, and reuse packages from hundreds of thousands of developers.
            </p>

            <div className="flex flex-col gap-5">
              {[
                { icon: "📦", text: "Access millions of open-source packages" },
                { icon: "🔒", text: "Secure, private package publishing" },
                { icon: "⚡", text: "Lightning-fast installs & dependency resolution" },
              ].map(({ icon, text }, i) => (
                <div key={i} className="flex items-center gap-4 text-white/90 text-[0.95rem]">
                  <span className="text-2xl" style={{ filter: "drop-shadow(0 0 8px rgba(168,85,247,0.4))" }}>
                    {icon}
                  </span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form section */}
        <div className="flex items-center justify-center p-8 backdrop-blur-xl border-l border-white/5"
          style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="w-full max-w-[440px]">

            {/* Header */}
            <div className="mb-10">
              <h2 className="font-['Syne',sans-serif] text-[2.25rem] font-bold text-white tracking-tight mb-2">
                Welcome to NPM Registry
              </h2>
              <p className="text-white/60 text-[0.95rem] font-light">
                {isSignUp
                  ? "Enter credentials for your new account"
                  : "Enter your credentials to access your account"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-white/90 text-sm font-medium">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3.5 rounded-[10px] text-white text-[0.95rem] font-['Outfit',sans-serif] outline-none transition-all duration-200 placeholder-white/30"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onFocus={e => {
                    e.target.style.background = "rgba(255,255,255,0.08)";
                    e.target.style.borderColor = "#a855f7";
                    e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.1)";
                  }}
                  onBlur={e => {
                    e.target.style.background = "rgba(255,255,255,0.05)";
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-white/90 text-sm font-medium">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => console.log("Forgot password")}
                    className="bg-transparent border-none text-[#a855f7] text-sm font-medium cursor-pointer hover:text-[#c084fc] transition-colors duration-200"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3.5 rounded-[10px] text-white text-[0.95rem] font-['Outfit',sans-serif] outline-none transition-all duration-200 placeholder-white/30 pr-12"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onFocus={e => {
                      e.target.style.background = "rgba(255,255,255,0.08)";
                      e.target.style.borderColor = "#a855f7";
                      e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.1)";
                    }}
                    onBlur={e => {
                      e.target.style.background = "rgba(255,255,255,0.05)";
                      e.target.style.borderColor = "rgba(255,255,255,0.1)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-white/50 hover:text-white/80 cursor-pointer text-xl transition-colors duration-200 p-1"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>

                {/* Confirm Password (Sign Up only) */}
                {isSignUp && (
                  <div className="relative flex flex-col gap-2 mt-2">
                    <label htmlFor="confirm-password" className="text-white/90 text-sm font-medium">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-3.5 pr-12 rounded-[10px] text-white text-[0.95rem] font-['Outfit',sans-serif] outline-none transition-all duration-200 placeholder-white/30"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                        onFocus={e => {
                          e.target.style.background = "rgba(255,255,255,0.08)";
                          e.target.style.borderColor = "#a855f7";
                          e.target.style.boxShadow = "0 0 0 3px rgba(168,85,247,0.1)";
                        }}
                        onBlur={e => {
                          e.target.style.background = "rgba(255,255,255,0.05)";
                          e.target.style.borderColor = "rgba(255,255,255,0.1)";
                          e.target.style.boxShadow = "none";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none text-white/50 hover:text-white/80 cursor-pointer text-xl transition-colors duration-200 p-1"
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="relative w-full py-4 rounded-[10px] text-white text-base font-semibold font-['Outfit',sans-serif] cursor-pointer overflow-hidden transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
                  boxShadow: isLoading ? "none" : undefined,
                }}
                onMouseEnter={e => {
                  if (!isLoading) e.currentTarget.style.boxShadow = "0 10px 30px rgba(168,85,247,0.3)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {isLoading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  isSignUp ? "Sign Up" : "Sign in"
                )}
              </button>
            </form>

            {/* Sign up prompt */}
            <p className="mt-8 text-center text-white/60 text-[0.9rem]">
              {isSignUp ? "H" : "Don't H"}ave an account?
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="bg-transparent border-none text-[#a855f7] font-semibold cursor-pointer font-['Outfit',sans-serif] text-[0.9rem] transition-colors duration-200 hover:text-[#c084fc] hover:underline"
              >
                {isSignUp ? " Sign up" : " Sign in instead"}
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Outfit:wght@300;400;500&display=swap');
      `}</style>
    </div>
  );
}
