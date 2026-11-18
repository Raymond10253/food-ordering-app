export default function Navbar() {
    return(
        <>
            <header className="py-4 border-b border-zinc-800/80 from-zinc-900/80 via-sky-400/50 to-zinc-900/80 sticky bg-zinc-950/50 backdrop-blur-md top-0 z-50">
                <div className="flex justify-between px-4 ">
                    <div className="relative w-full">
                        <i 
                        className="fa-solid fa-magnifying-glass absolute left-3 top-4 -translate-y-1/2 text-sky-400"
                        ></i>
                        <input 
                        type="text"
                        className="py-1 pl-8 rounded-full focus:outline-none w-[300px] border border-sky-400"
                         />
                    </div>
                    <div className="text-xl">
                        <button
                        className="hover:scale-105 transition duration-300"
                        >
                            <i 
                        className="fa-solid fa-bars text-2xl text-sky-500"
                        ></i>
                        </button>
                        
                    </div>
                </div>
            </header>
        </>
    )
}