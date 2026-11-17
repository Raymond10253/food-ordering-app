import { useState } from "react"

export default function Signup() {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmpassword: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    return(
        <>
            <div
            className="flex items-center justify-center text-slate-100 text-sm"
            >
                <div
                className="w-full"
                >
                    <form
                    className="space-y-3 shadow shadow-2xl rounded-2xl max-w-[300px] mx-auto bg-zinc-950 py-5 px-3"
                    onSubmit={handleSubmit}
                    >
                        <div
                        className="px-2"
                        >
                            <h4
                            className="font-bold text-xl uppercase font-bold text-sky-400"
                            >
                                Sign up
                            </h4>
                        </div>
                        <div>
                            <label
                            className="block font-semibold text-sky-500 mb-2"
                            >
                                First Name
                            </label>
                            <input 
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                            className="border rounded-xl w-full py-2.5 bg-sky-400/20 border-sky-400/50 focus:outline-none px-2"
                            />
                        </div>
                        <div>
                            <label
                            className="block font-semibold text-sky-500 mb-2"
                            >
                                Last Name
                            </label>
                            <input 
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                            className="border rounded-xl w-full py-2.5 bg-sky-400/20 border-sky-400/50"
                            />
                        </div>
                        <div>
                            <label htmlFor=""
                            className="block font-semibold text-sky-500 mb-2"
                            >
                                Email
                            </label>
                            <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="border rounded-xl w-full py-2.5 bg-sky-400/20 border-sky-400/50"
                            />
                        </div>
                        <div>
                            <label
                            className="block font-semibold text-sky-500 mb-2"
                            >
                                Password
                            </label>
                            <input 
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="border rounded-xl w-full py-2.5 bg-sky-400/20 border-sky-400/50 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label
                            className="block font-semibold text-sky-500 mb-2"
                            >
                                Confirm password
                            </label>
                            <input 
                            type="password"
                            name="confirmpassword"
                            value={formData.confirmpassword}
                            onChange={handleChange}
                            required
                            className="border rounded-xl w-full py-2.5 bg-sky-400/20 border-sky-400/50"
                            />
                        </div>
                        <div
                        className="space-x-2 flex items-center"
                        >
                            <input 
                            type="checkbox"
                            className="w-4 h-4"
                            />
                            <span>
                                Do you agree <a href=""
                                className="text-sm text-blue-500"
                                >
                                    Terms and conditions
                                </a>
                            </span>
                        </div>
                        <button
                        type='submit'
                        className="w-full rounded-xl bg-sky-400 hover:bg-sky-500 hover:scale-105 py-2 font-bold"
                        >
                            SIGN IN
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}