import { useState } from "react"
import { data } from "react-router-dom";

export default function Signup({
    onRegisterSuccess = () => {},
    onSwitchToLogin = () => {},
}) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmpassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
            setError('Please Enter the provided details');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be atleast 6 characters long');
            return;
        }

        if (formData.password !== formData.confirmpassword) {
            setError('Password do not match')
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim().toLowerCase(),
                    phone: formData.phone.trim(),
                    password: formData.password,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed. Please try again')
            }

            localStorage.setItem('cravedash_token', data.token);
            localStorage.setItem('cravedash_user', JSON.stringify(data.user));
            onRegisterSuccess({user: data.user, token: data.token});
        } catch (err) {
            if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
                const mockUser = {
                    id: 1,
                    name: formData.email.split('@')[0],
                    email: formData.email.trim().toLowerCase(),
                };
                const mockToken = 'demo-jwt-token-' + Date.now();
                localStorage.setItem('cravedash_token', mockToken);
                localStorage.setItem('cravedash_user', JSON.stringify(mockUser));
                onRegisterSuccess({user: mockUser, token: mockToken});
                return;
            };
            setError(err.message)
        } finally {
            setIsLoading(false);
        }

    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value}));
    }

    return(
        <>
            <div
            className="flex items-center justify-center text-slate-100 text-sm inset-0 z-50 fixed bg-black/75 backdrop-blur-sm"
            >
                <div
                className="w-full shadow shadow-2xl rounded-2xl max-w-[300px] mx-auto bg-zinc-950 py-5 px-3"
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

                    {error && (
                        <div className="text-xs text-red-500/80 space-x-2 my-2">
                            <i className="fa-solid fa-circle-exclamation"></i>
                            <span>{error}</span>
                        </div>
                    )}
                    <form
                    className="space-y-3 "
                    onSubmit={handleSubmit}
                    >
                        
                        <div>
                            <label
                            className="block font-semibold text-sky-500 mb-2"
                            >
                                Name
                            </label>
                            <input 
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="border rounded-xl w-full py-2.5 bg-sky-400/20 border-sky-400/50 focus:outline-none px-2"
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
                                Phone Number
                            </label>
                            <input 
                            type='tel'
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="border rounded-xl w-full py-2.5 bg-sky-400/20 border-sky-400/50"
                            />
                        </div>
                        <div
                        className="relative"
                        >
                            <label
                            className="block font-semibold text-sky-500 mb-2"
                            >
                                Password
                            </label>
                            <button
                            type='button'
                            onClick={() => setShowPassword((prev) => !prev)}
                            title={showPassword ? 'Hide password' : 'Show password'}
                            className="absolute text-slate-400 hover:text-slate-300 left-[250px] top-1/2"
                            >
                                {showPassword ? 
                                <i
                                className="fa-solid fa-eye"
                                ></i>
                                :
                                <i
                                className="fa-solid fa-eye-slash"
                                ></i>}
                            </button>
                            <input 
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="border rounded-xl w-full py-2.5 bg-sky-400/20 border-sky-400/50 focus:outline-none px-2"
                            />
                        </div>
                        <div
                        className="relative"
                        >
                            <label
                            className="block font-semibold text-sky-500 mb-2"
                            >
                                Confirm password
                            </label>
                            <button
                            type='button'
                            onClick={() => setShowPassword((prev) => !prev)}
                            title={showPassword ? 'Hide password' : 'show password'}
                            className="absolute text-slate-400 hover:text-slate-300"
                            >
                                {showPassword ? 
                                <i
                                className="fa-solid fa-eye"
                                >
                                </i> 
                                : 
                                <i
                                className="fa-solid fa-eye-slash"
                                >
                                </i>}
                            </button>
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