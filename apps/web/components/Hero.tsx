"use client";
import { Button } from "./ui/button"
import Image from "next/image"
import { useRouter } from "next/navigation"
export default function Hero() {
    const router=useRouter()
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 px-4 ">
            {/* Hero Content */}
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left Column */}
                <div className="text-center lg:text-left space-y-8">
                    <div className="flex flex-col items-center lg:items-start gap-6">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl  tracking-tight text-white font-serif">
                        Journal everything.{" "}<br></br>
                        <span className="text-white">Find anything.</span>{" "}<br></br>
                        <span className="text-white">Change something.</span>
                        </h1>
                        <p className="text-sm md:text-lg  lg:text-xl leading-tight text-[hsl(223,17%,51%)] max-w-2xl mx-auto lg:mx-0 px-4">
                            Write freely and let AI organize your notes, surface patterns, and answer questions.
                        </p>
                        <Button onClick={() => router.push('/sign-in')} variant="outline" size="xl" className="p-4 shadow-lg shadow-indigo-600/40">
                            Get Started
                        </Button>
                    </div>
                  
                        
                </div>
                {/* Right Col */}
                <div className="relative h-[500px] lg:h-[600px] hidden lg:block">
                    <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
                    <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
                    
                    <div className="absolute top-0 left-0 w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                        <Image src="/hero1.png" alt="Person journaling on bus" className="w-full h-full object-cover" width={300} height={300} />

                    </div>
                    <div className="absolute bottom-0 right-0 w-72 h-72 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                        <Image 
                        src="/hero2.png" 
                        alt="Person journaling in park" 
                        className="w-full h-full object-cover" width={300} height={300}
                        />
                    </div>
                    <div className="absolute top-6 right-12 w-80 h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-slate-800 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                        <Image 
                            src="/hero3.png" 
                            alt="Journaling setup" 
                            className="w-full h-full object-cover" 
                            width={300} 
                            height={300}
                        />
                    </div>
                   
                </div>
                 {/* Mobile Images */}
        <div className="lg:hidden grid grid-cols-2 gap-4">
          <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-slate-800 transform -rotate-3">
            <Image 
              src="/hero1.png" 
              alt="Person journaling on bus" 
              className="w-full h-64 object-cover"
              width={288}
              height={288}
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-slate-800 transform rotate-3 mt-8">
            <Image 
              src="/hero2.png" 
              alt="Person journaling in park" 
              className="w-full h-64 object-cover"
              width={288}
              height={288}
            />
          </div>
        </div>
            </div>
        </div>
    )
}


