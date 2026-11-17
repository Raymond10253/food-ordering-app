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
            className="flex items-center justify-center my-10"
            >
                <div
                className="w-full"
                >
                    <form
                    className="space-y-3 shadow shadow-2xl rounded-2xl p-3 bg-slate-100 max-w-[300px] mx-auto z-50 backdrop-blur-sm"
                    onSubmit={handleSubmit}
                    >
                        <div>
                            <h4
                            className="font-bold text-xl uppercase font-bold text-orange-500"
                            >
                                Sign up
                            </h4>
                        </div>
                        <div>
                            <label
                            className="block font-semibold text-orange-500"
                            >
                                First Name
                            </label>
                            <input 
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                            className="border py-1 rounded-xl border-sky-400 w-full px-2 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label
                            className="block font-semibold text-orange-500"
                            >
                                Last Name
                            </label>
                            <input 
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                            className="border rounded-xl py-1 border-sky-400 w-full px-2 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor=""
                            className="block font-semibold text-orange-500"
                            >
                                Email
                            </label>
                            <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="border rounded-xl py-1 border-sky-400 w-full px-2 focus:outline-none"
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
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="border rounded-xl py-1 border-sky-400 w-full px-2 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label 
                            htmlFor=""
                            className="block font-semibold text-orange-500"
                            >
                                Confirm password
                            </label>
                            <input 
                            type="password"
                            name="confirmpassword"
                            value={formData.confirmpassword}
                            onChange={handleChange}
                            required
                            className="border rounded-xl py-1 border-sky-400 w-full px-2 focus:outline-none"
                            />
                        </div>
                        <div
                        className="space-x-2"
                        >
                            <input type="checkbox" />
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
                        className="w-full py-1 rounded-xl bg-orange-500 hover:bg-orange-600 hover:scale-105"
                        >
                            SIGN IN
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}