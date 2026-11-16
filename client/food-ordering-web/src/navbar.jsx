import { Link } from "react-router-dom";
export default function Navbar() {
    return(
        <>
            <header className="py-4 bg-zinc-900/80 border-b border-zinc-800/80 text-sky-400 bg-gradient-to-br from-zinc-900/80 via-sky-400/50 to-zinc-900/80 sticky">
                <div className="flex justify-between px-4 ">
                    <div className="relative w-full">
                        <i 
                        className="fa-solid fa-magnifying-glass absolute left-3 top-4 -translate-y-1/2"
                        ></i>
                        <input 
                        type="text"
                        className="py-1 pl-8 rounded-full focus:outline-none w-[300px] border border-sky-400"
                         />
                    </div>
                    <div className="text-xl">
                        <i 
                        className="fa-solid fa-bars text-2xl"
                        ></i>
                    </div>
                </div>
            </header>
        </>
    )
}