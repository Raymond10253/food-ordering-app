import { useState } from "react"

export default function Login(){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    }


    const [isLoading, setIsLoading] = useState(false);

    return(
        <>
        <div className="w-full flex justify-center items-center text-white fixed inset-0 z-50 bg-black/75 backdrop-blur-sm p-4">
        <div
        className="w-full"
        >
            <form
                className="space-y-3 p-3 shadow shadow-2xl rounded-2xl max-w-[300px] mx-auto bg-zinc-950"
                onSubmit={handleSubmit}
                >
                    <div>
                        <h4
                        className="uppercase font-bold text-sky-400 text-xl"
                        >
                            log in
                        </h4>
                    </div>
                    <div>
                        <label 
                        htmlFor=""
                        className="block font-semibold text-sky-400 mb-2"
                        >
                            Username
                        </label>
                        <input 
                        type="text"
                        name="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border rounded-xl w-full py-2.5 bg-sky-400/20 border-sky-400/50"
                        />
                    </div>
                    <div>
                        <label 
                        htmlFor=""
                        className="block font-semibold text-sky-400 mb-2"
                        >
                            Email
                        </label>
                        <input 
                        type="email"
                        name="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded-xl w-full py-2.5 bg-sky-400/20 border-sky-400/50"
                        />
                    </div>
                    <div>
                        <label 
                        htmlFor=""
                        className="block font-semibold text-sky-400 mb-2"
                        >
                            Password
                        </label>
                        <input 
                        type="password"
                        name="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded-xl w-full py-2.5 bg-sky-400/20 border-sky-400/50"
                        />
                    </div>
                    <div
                    className="space-x-2"
                    >
                        <input 
                        type="checkbox"
                        className="w-4 h-4"
                        />
                        <span
                        >
                            Remember me
                        </span>
                    </div>
                    <button
                    type='submit'
                    onClick={() => setIsLoading(true)}
                    className="uppercase font-bold py-2 rounded-md my-1 transition duration-500 hover:scale-105 w-full bg-orange-500 hover:bg-orange-600"
                    >
                       {isLoading ? 'Submiting...' : 'LOG IN'}
                    </button>
                </form>
        </div>
        </div>
            
        </>
    )
}