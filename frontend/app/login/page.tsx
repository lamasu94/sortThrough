import { ArrowLeft, Sprout, CheckCircle2, Maximize2, Sparkles } from "lucide-react";
import Link from "next/link";
export default function LoginPage(){
    return(
        <div className="relative min-h-screen bg-[#CBDDE9] flex items-center justify-center p-6">
  {/* Back button */}
  <Link href="/">
  <button className="absolute top-6 left-6 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-[#CBDDE9]/40 transition">
    <ArrowLeft className="w-5 h-5 text-[#0F1923]" />
  </button>
</Link>
  {/* Card */}
  <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
    {/* Left illustration panel */}
    <div className="relative bg-[#CBDDE9]/40 flex items-center justify-center p-10">
      <div className="absolute inset-0 bg-gradient-to-br from-[#CBDDE9]/60 to-transparent" />
      <Sprout className="w-32 h-32 text-[#2872A1] relative z-10" strokeWidth={1} />
    </div>

    {/* Right form panel */}
    <div className="p-10 flex flex-col justify-center">
      <h1 className="text-4xl font-serif text-[#0F1923] mb-8">Login</h1>

      <div className="space-y-5">
        <div className="flex items-center border-b border-[#CBDDE9] pb-2">
          <input
            type="email"
            placeholder="yourmail@example.com"
            className="w-full text-sm text-[#0F1923] placeholder-[#7B8186] outline-none bg-transparent"
          />
          <CheckCircle2 className="w-4 h-4 text-[#2872A1]" />
        </div>

        <div className="border-b border-[#CBDDE9] pb-2">
          <input
            type="password"
            placeholder="••••••••••"
            className="w-full text-sm text-[#0F1923] placeholder-[#7B8186] outline-none bg-transparent"
          />
        </div>

        <button className="w-full bg-[#2872A1] hover:bg-[#0F1923] transition-colors text-white text-sm font-medium py-3 rounded-full">
          Sign in
        </button>

        <p className="text-center text-sm text-[#7B8186] italic pt-2">
          Forgot password?
        </p>
      </div>
    </div>
  </div>

  {/* Floating action buttons */}
  <button className="absolute bottom-6 right-16 w-11 h-11 rounded-full bg-[#CBDDE9]/50 shadow-md flex items-center justify-center hover:bg-[#CBDDE9] transition">
    <Maximize2 className="w-4 h-4 text-[#0F1923]" />
  </button>
  <button className="absolute bottom-6 right-6 w-11 h-11 rounded-full bg-[#0F1923] shadow-md flex items-center justify-center hover:bg-[#152533] transition">
    <Sparkles className="w-4 h-4 text-white" />
  </button>
</div>
    )
}