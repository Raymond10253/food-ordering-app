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
        <div className="w-full flex justify-center items-center my-10">
            
           <div
            className="w-full"
            >
                <form
                className="space-y-3 p-3 shadow shadow-2xl rounded-2xl bg-slate-100 max-w-[300px] mx-auto"
                onSubmit={handleSubmit}
                >
                    <div>
                        <h4
                        className="uppercase font-bold text-orange-500 text-xl"
                        >
                            log in
                        </h4>
                    </div>
                    <div>
                        <label 
                        htmlFor=""
                        className="block font-semibold text-orange-500"
                        >
                            Username
                        </label>
                        <input 
                        type="text"
                        name="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border border-sky-400 p-1 rounded-xl w-full"
                        />
                    </div>
                    <div>
                        <label 
                        htmlFor=""
                        className="block font-semibold text-orange-500"
                        >
                            Email
                        </label>
                        <input 
                        type="email"
                        name="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-sky-400 p-1 rounded-xl w-full"
                        />
                    </div>
                    <div>
                        <label 
                        htmlFor=""
                        className="block font-semibold text-orange-500"
                        >
                            Password
                        </label>
                        <input 
                        type="password"
                        name="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-sky-500 p-1 rounded-xl w-full"
                        />
                    </div>
                    <div
                    className="space-x-2"
                    >
                        <input type="checkbox" />
                        <span>
                            Remember me
                        </span>
                    </div>
                    <button
                    type='submit'
                    onClick={() => setIsLoading(true)}
                    className="uppercase font-bold py-1 rounded-md my-1 transition duration-500 hover:scale-105 w-full bg-orange-500 hover:bg-orange-600"
                    >
                       {isLoading ? 'Submiting...' : 'LOG IN'}
                    </button>
                </form>
            </div> 
        </div>
            
        </>
    )
}