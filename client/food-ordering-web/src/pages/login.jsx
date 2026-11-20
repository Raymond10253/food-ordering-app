import { useState } from "react"

export default function Login({
    onLoginSuccess = () => {},
    onSwitchToRegister = () => {},
}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password) {
            setError('Please enter all of your details.');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email: email.trim().toLocaleLowerCase(),
                    password,
                }),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.message || 'Invalid Email or Password.');
            }

            localStorage.setItem('cravedash_token', data.token);
            localStorage.setItem('cravedash_user', JSON.stringify(data.user));
            onLoginSuccess({user: data.user, token: data.token});
        } catch (err) {
            if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
                const mockUser = {
                    id: 1,
                    name: email.split('@')[0],
                    email: email.trim().toLowerCase(),
                };
                const mockToken = 'demo-jwt-token-' + Date.now();
                localStorage.setItem('cravedash_token', mockToken);
                localStorage.setItem('cravedash_user', JSON.stringify(mockUser));
                onLoginSuccess({user: mockUser, token: mockToken});
                return;
            }

            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDemoLogin = () => {
        const demoUser = {
            id: 99,
            name: 'Alex Kamau',
            email: 'alex@ccavedash.com',
            phone: '0712345678',
        };
        const demoToken = 'demo-jwt-tocken-instant';
        localStorage.setItem('cravedash_token', demoToken);
        localStorage.setItem('cravedash_user', JSON.stringify(demoToken));
        onLoginSuccess({user: demoUser, token: demoToken});
    };

    
    return(
        <>
        <div className="w-full flex justify-center items-center text-white fixed inset-0 z-50 bg-black/75 backdrop-blur-sm p-4">
        <div
        className="w-full"
        >
            <div className="px-4 shadow shadow-2xl rounded-2xl max-w-[300px] mx-auto bg-zinc-950 py-5">
                <div>
                    <h4
                    className="uppercase font-bold text-sky-400 text-xl"
                    >
                        log in
                    </h4>
                </div>
                {error && (
                    <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-red-400 text-sm">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        <span>{error}</span>
                    </div>
                )}
                <form
                className="space-y-3"
                onSubmit={handleSubmit}
                >
                    
                    
                    <div>
                        <label 
                        htmlFor=""
                        className="block font-semibold text-sky-400 mb-2"
                        >
                            Email
                        </label>
                        <input 
                        type="email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        className="border rounded-xl w-full py-2.5 bg-sky-400/20 border-sky-400/50 px-2"
                        />
                    </div>
                    <div className="relative">
                        <label 
                        htmlFor=""
                        className="block font-semibold text-sky-400 mb-2"
                        >
                            Password
                        </label>
                        <input 
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border rounded-xl w-full py-2.5 bg-sky-400/20 border-sky-400/50 px-2"
                        />
                        <button
                        type='button'
                        onClick={() => setShowPassword((prev) => !prev)}
                        title={showPassword ? 'Hide Password' : 'Show Password'}
                        className="absolute right-[10px] top-12 -translate-y-1/3 text-slate-500 hover:text-slate-300"
                        >
                            {showPassword ? <i className="fa-solid fa-eye-slash"></i> : <i className="fa-solid fa-eye"></i>}
                        </button>
                    </div>
                    <div
                    className="space-x-2 flex items-center"
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
                    disabled={isLoading}
                    className="uppercase font-bold py-2 rounded-md my-1 transition duration-500 hover:scale-105 w-full bg-sky-400 hover:bg-sky-500"
                    >
                       {isLoading ? (
                        <>
                            Signing In...
                        </>
                       ) : (
                        <>
                            Log In
                        </>
                       )}
                    </button>
                </form>

                <div className="mt-4">
                    <button
                    type='button'
                    onClick={handleDemoLogin}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200 text-sm font-semibold transition flex items-center justify-center"
                    >
                        Continue with Demo Account
                    </button>
                </div>

                <p className="text-center text-sm text-slate-400 mt-6">
                    Don't have an Account?{' '}
                    <button
                    type='button'
                    onClick={onSwitchToRegister}
                    className="text-sky-400 hover:text-sky-300 font-semibold transition"
                    >
                        Create One
                    </button>
                </p>
            </div>
            
        </div>
        </div>
            
        </>
    )
}