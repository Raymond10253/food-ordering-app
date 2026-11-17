import { useState } from "react";

export default function Checkout({
    cart = [],
    user = null,
    token = '',
    onOrderSuccess = () => {},
    onBack = () => {},
    onClearCart = () => {},
}){
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [deliveryNotes, setDeliveryNotes] = useState('');
    const [contactPhone, setContactPhone] = useState(user?.phone || '');

    const [paymentMethod, setPaymentMethod] = useState('mpesa');
    const [mpesaPhone, setMpesaPhone] = useState(user?.phone || '');
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: user?.name || '',
    });

    const [promoCode, setPromoCode] = useState('');
    const [discount, SetDiscount] = useState(0);
    const [promoMessage, setPromoMessage] = useState(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
    const deliveryFee = subtotal > 0 ? 150 : 0;
    const tax = subtotal * 0.08;
    const totalAmount = Math.max(0, subtotal + deliveryFee + tax - discount);

    const handleApplyPromo = (e) => {
        e.preventDefault();
        const code = promoCode.trim().toUpperCase();
        if (!code) return;

        if (code === 'WELCOME10') {
            const calcDiscount = subtotal * 0.1;
            SetDiscount(calcDiscount);
            setPromoMessage({
                type: 'success',
                text: '10% delivery applied'
            });
        } else if (code === 'FREEDEL') {
            SetDiscount(deliveryFee);
            setPromoMessage({
                type: 'success',
                text: 'Free delivery applied'
            })
        } else {
            SetDiscount(0);
            setPromoMessage({
                type: 'error',
                text: 'Invalid promo code. Try WELCOME10 or FREEDEL'
            });
        }
    };

    const validateForm = () => {
        if (cart.length === 0) {
            setError('Your cart is empty');
            return false;
        }
        if (!deliveryAddress.trim()) {
            setError('Please enter a delivery address');
            return false;
        }
        if (!contactPhone.trim()) {
            setError('Please provide a phone number for the rider');
            return false;
        }
        if (paymentMethod === 'mpesa' && !mpesaPhone.trim()) {
            setError('Please enter Mpesa phone number for the STK push');
            return false;
        }
        if (paymentMethod === 'card') {
            if (!cardDetails.number.trim() || !cardDetails.name.trim() || !cardDetails.expiry.trim() || !cardDetails.cvc.trim()){
                setError('Please provide credit/debit details');
                return false;
            }
        }
        setError('');
        return true;
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!validateForm) return;

        setIsSubmitting(true);
        setError('');

        const orderPayload = {
            restaurant_id: cart[0]?.restaurant_id || 1,
            items: cart.map((item) => ({
                menu_item_id: item.id,
                name: item.name,
                quantity: item.quantity,
                unit_price: Number(item.price),
            })),
            delivery_address: deliveryAddress.trim(),
            delivery_notes: deliveryNotes.trim(),
            contact_phone: contactPhone.trim(),
            payment_method: paymentMethod,
            payment_phone: paymentMethod === 'mpesa' ? mpesaPhone : null,
            subtotal: Number(subtotal.toFixed(2)),
            delivery_fee: Number(deliveryFee.toFixed(2)),
            tax: Number(tax.toFixed(2)),
            discount: Number(discount.toFixed(2)),
            total_amount: Number(totalAmount.toFixed(2)),
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify(orderPayload),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to place order. please try again.');
                
            }

            const data = await response.json();
            onClearCart();
            onOrderSuccess(data.order || { id: Date.now(), status: 'Order Confirmed', ...orderPayload });
        } catch (err) {
            if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
                const simulatedOrder = {
                    id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
                    status: 'Order Confirmed',
                    created_at: new Date().toISOString(),
                    ...orderPayload,
                };
                setTimeout(() => {
                    setIsSubmitting(false);
                    onClearCart();
                    onOrderSuccess(simulatedOrder);
                }, 900);
                return;
            }

            setError(err.message);
            setIsSubmitting(false);
        }
    };
/*

    if (cart.length === 0) {
        return (
            <div
            className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-slate-100 rounded-2xl border border-slate-800"
            >
                <div
                className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4 border border-slate-800"
                >
                    <i 
                    className="fa-solid fa-bag-shopping text-2xl text-sky-400"
                    ></i>
                </div>
                <h2
                className="font-semibold text-2xl mb-2"
                >
                    Your cart is empty
                </h2>
                <p
                className="text-slate-400 max-w-md mb-6"
                >
                    Add delicious meals from your favourite local restaurant before proceeding to checkout.
                </p>
                <button
                onClick={onBack}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold transition"
                >
                    <i
                    className="fa-solid fa-arrow-left"
                    ></i>
                    Browse menu
                </button>
            </div>
        );
    }
*/

    return (
        <div
        className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8"
        >
            <div
            className="max-w-6xl mx-auto"
            >
                <div
                className="flex items-center justify-between mb-8"
                >
                    <button
                    type='button'
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium"
                    >
                        <i
                        className="fa-solid fa-left-arrow"
                        ></i>
                        Back to Menu

                    </button>
                    <div
                    className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full"
                    >
                        <i 
                        className="fa-solid fa-shield-halved"
                        ></i>
                        <span
                        
                        >
                            Secure Encrypted Checkout
                        </span>
                    </div>
                </div>

                <h1
                className="text-3xl font-extrabold tracking-tight mb-8"
                >
                    Complete Your Order
                </h1>

                {error && (
                    <div
                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-sm"
                    >
                        <span>
                            {error}
                        </span>
                    </div>
                )}

                <form
                onSubmit={handlePlaceOrder}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                    
                    <div
                    className="lg:col-span-7 space-y-6"
                    >
                        <section
                        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6"
                        >
                            <div
                            className="flex items-center gap-3 mb-5"
                            >
                                <div
                                className="w-9 h-9 rounded-lg bg-sky-400/15 text-sky-400 flex items-center justify-center"
                                >
                                    <i 
                                    className="fa-solid fa-map-pin"
                                    ></i>
                                </div>
                                <div>
                                    <h2
                                    className="text-lg font-bold"
                                    >
                                        Delivery Details
                                    </h2>
                                    <p
                                    className="text-xs text-slate-400"
                                    >
                                        Where should the driver drop off your meal
                                    </p>
                                </div>
                            </div>
                            <div
                            className="space-y-4"
                            >
                                <div>
                                    <label
                                    className="block text-sm font-medium text-slate-300 mb-1.5"
                                    >
                                        Delivery Address
                                    </label>
                                    <input 
                                    type="text"
                                    required
                                    placeholder="e.g., Apartment 4b, Moi Avenue, Building Name"
                                    value={deliveryAddress}
                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-state-500 focus:outline-none focus:border-sky-400 transition"
                                    />
                                </div>
                                <div
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                >
                                    <label
                                    className="block text-sm font-medium text-slate-300 mb-1.5"
                                    >
                                       contact Phone 
                                    </label>
                                    <input 
                                    type="text"
                                    required
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
                                    />
                                </div>
                                <div>
                                    <label
                                    className="block text-sm font-medium text-slate-300 mb-1.5"
                                    >
                                       Estimated arrival 
                                    </label>
                                    <div
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-slate-300 flex items-center gap-2 text-sm"
                                    >
                                        <i 
                                        className="fa-regular fa-clock"
                                        ></i>
                                        <span>
                                            25-35min
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <label
                                    className="block text-sm font-medium text-slate-300 mb-1.5"
                                    >
                                       Delivery instuction (optional)
                                    </label>
                                    <textarea 
                                    rows={2}
                                    placeholder="gate code, landmarks or dropoffs preferences..."
                                    value={deliveryNotes}
                                    onChange={(e) => setDeliveryNotes(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
                                    ></textarea>
                                </div>
                            </div>
                        </section>
                        <section
                        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6"
                        >
                            <div
                            className="flex items-center justify-center"
                            >
                                <div>
                                    <i
                                    className="fa-solid fa-debit"
                                    ></i>
                                </div>
                                <div>
                                    <h2
                                    className="text-lg font-bold mb-3"
                                    >
                                        Payment method
                                    </h2>
                                    <p
                                    className="text-xs text-slate-400 mb-4"
                                    >
                                        Select which payment method you would like to use.
                                    </p>
                                </div>
                            </div>

                            <div
                            className="grid grid-cols-1 gap-3 mb-5"
                            >
                                <div
                                className="grid grid-cols-1 sm:grid-cols-3 gap-3"
                                >
                                   <button
                                type='button'
                                onClick={() => setPaymentMethod('mpesa')}
                                className={`p-4 rounded-xl border text-left transition flex flex-col gap-2 ${
                                    paymentMethod === 'mpesa'
                                    ? 'bg-emerald-500/10 border-emerald-500 text-white'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                                >
                                    <i 
                                    className="fa-solid fa-mobile-screen"
                                    ></i>
                                    <span
                                    className="font-semibold text-sm"
                                    >
                                        Mpesa Express
                                    </span>
                                </button>
                                <button
                                type='button'
                                onClick={() => setPaymentMethod('card')}
                                className={`p-4 rounded-xl border text-left transition flex flex-col gap-2 ${
                                    paymentMethod === 'card'
                                    ? 'bg-emerald-500/10 border-emerald-500 text-white'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                                >
                                    <i 
                                    className="fa-solid fa-credit-card"
                                    ></i>
                                    <span
                                    className="font-semibold text-sm"
                                    >
                                        Credit card
                                    </span>
                                </button>
                                <button
                                type='button'
                                onClick={() => setPaymentMethod('cash')}
                                className={`p-4 rounded-xl border text-left transition flex flex-col gap-2 ${
                                    paymentMethod === 'cash'
                                    ? 'bg-emerald-500/10 border-emerald-500 text-white'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                                >
                                    <i 
                                    className="fa-solid fa-money-bill-1-wave"
                                    ></i>
                                    <span
                                    className="font-semibold text-sm"
                                    >
                                        Cash
                                    </span>
                                </button> 
                                </div>
                                

                                {paymentMethod === 'mpesa' && (
                                    <div
                                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 w-full"
                                    >
                                        <label
                                        className="block text-sm font-medium text-slate-300"
                                        >
                                            M-pesa Phone Number
                                        </label>
                                        <input 
                                        type="tel"
                                        placeholder="07XXXXXXXX"
                                        value={mpesaPhone}
                                        onChange={(e) => setMpesaPhone(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                                        />
                                        <p
                                        className="text-xs text-slate-400"
                                        >
                                            You will receive an M-pesa prompt on your phone to enter pin upon clicking place order.
                                        </p>
                                    </div>
                                )}
                                {paymentMethod === 'card' && (
                                    <div
                                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                                    >
                                        <div>
                                            <label
                                            className="block text-sm font-medium text-slate-300 mb-1.5"
                                            >
                                                Cardholder's name
                                            </label>
                                            <input 
                                            type="text"
                                            placeholder="Enter your name"
                                            value={cardDetails.name}
                                            onChange={(e) => setCardDetails({...cardDetails, [e.target.name]: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                                            />
                                        </div>
                                        <div>
                                            <label
                                            className="block text-sm  font-medium text-slate-300 mb-1.5"
                                            >
                                                Card Number
                                            </label>
                                            <input 
                                            type="number"
                                            placeholder="Enter your Card number"
                                            value={cardDetails.number}
                                            onChange={(e) => setCardDetails({...cardDetails, [e.target.name]: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                                            />
                                        </div>
                                        <div>
                                            <label
                                            className="block text-sm font-medium text-slate-300 mb-1.5"
                                            >
                                                Expiry Date
                                            </label>
                                            <input 
                                            type='text'
                                            maxLength={5}
                                            value={cardDetails.expiry}
                                            placeholder="MM/YY"
                                            onChange={(e) => setCardDetails({...cardDetails, [e.target.name]: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                                            />
                                        </div>
                                        <div
                                        className="w-full"
                                        >
                                            <label
                                            className="block text-sm font-medium text-slate-300 mb-1.5"
                                            >
                                                CVC
                                            </label>
                                            <input 
                                            type="password"
                                            maxLength={4}
                                            value={cardDetails.cvc}
                                            onChange={(e) => setCardDetails({...cardDetails, [e.target.name]: e.target.value})}
                                            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
                                            />
                                        </div>
                                    </div>
                                )}
                                {paymentMethod === 'cash' && (
                                    <div
                                     className="text-slate-400"
                                    >
                                        Be ready with cash when the rider arrives.
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    <div
                    className="lg:col-span-5"
                    >
                        <div
                        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sticky top-6"
                        >
                            <div
                            className="flex items-center gap-2.5 mb-5 pb-4 border-b border-slate-800"
                            >
                                <i 
                                className="fa-solid fa-receipt text-xl"
                                ></i>
                                <h2
                                className="text-lg font-bold"
                                >
                                    Order summery
                                </h2>
                                <span
                                className="ml-auto text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full"
                                >
                                    {cart.reduce((acc, item) => acc + item.quantity, 0)} items
                                </span>
                            </div>

                            <div
                            className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-5"
                            >
                                {cart.map((item) => (
                                    <div
                                    key={item.id}
                                    className="justify-between gap-3 py-2 border-b border-slate-800 last:border-0"
                                    >
                                        <div
                                        className="flex items-center gap-3 min-w-0"
                                        >
                                            <span
                                            className="w-7 h-7 rounded-lg bg-slate-800 text-sky-400 font-bold text-xs flex items-center justify-center shrink-0"
                                            >
                                                {item.quantity}x
                                            </span>
                                            <div
                                            className="truncate"
                                            >
                                                <p
                                                className="text-sm font-medium text-slate-100 truncate"
                                                >
                                                    {item.name}
                                                </p>
                                                {item.restaurant_name && (
                                                    <p
                                                    className="text-xs text-slate-500 truncate"
                                                    >
                                                        {item.restaurant_name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <span
                                        className="text-sm font-semibold text-slate-200 shrink-0"
                                        >
                                            KES {(Number(item.price).toFixed(2))}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div
                            className="mb-5"
                            >
                                <div
                                className="flex gap-2"
                                >
                                    <input 
                                    type="text"
                                    placeholder="Promo code (e.g. WELCOME10)"
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value)}
                                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400"
                                    />
                                    <button
                                    type='button'
                                    onClick={handleApplyPromo}
                                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-200 transition"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {promoMessage && (
                                    <p
                                    className={`text-xs mt-1.5 ${
                                        promoMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'
                                    }`}
                                    >
                                        {promoMessage.text}
                                    </p>
                                )}
                            </div>

                            <div
                            className="space-y-2.5 text-sm border-t border-slate-800 pt-4 mb-6 flex justify-between"
                            >
                                <span
                                
                                >
                                    Subtotal
                                </span>
                                <span>
                                    KES {subtotal.toFixed(2)}
                                </span>
                            </div>
                            <div
                            className="flex justify-between text-slate-400"
                            >
                                <span
                                >
                                    Delivered Fee
                                </span>
                                <span>
                                    KES {deliveryFee.toFixed(2)}
                                </span>
                            </div>
                            <div
                            className="flex justify-between"
                            >
                                <span>
                                    Estimated Tax(8%)
                                </span>
                                <span>
                                    KES {tax.toFixed(2)}
                                </span>
                            </div>
                            {discount > 0 && (
                                <div
                                className="flex justify-between text-emerald-400 font-medium"
                                >
                                    <span>
                                        Promo discount
                                    </span>
                                    <span>
                                        - KES {discount.toFixed(2)}
                                    </span>
                                </div>
                            )}
                            <div
                            className="flex justify-between text-base font-bold text-white pt-3 border-t border-slate-800"
                            >
                                <span>
                                    Total
                                </span>
                                <span
                                className="text-sky-400"
                                >
                                    KES {totalAmount.toFixed(2)}
                                </span>
                            </div>
                        
                        <button
                        type='submit'
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-6 rounded-xl bg-sky-400 hover:bg-sky-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base shadow-lg shadow-sky-400/20 transition flex items-center justify-center gap-2 my-5"
                        >
                            {isSubmitting ? (
                                <>
                                   <i 
                                   className="fa-solid fa-spinner animate-spin"
                                   ></i>
                                   Processing Order...
                                </>
                            ) : (
                                <>
                                    <i 
                                    className="fa-solid fa-circle-check"
                                    ></i>
                                    Place Order . KES {totalAmount.toFixed(2)}
                                </>
                            )}
                        </button>
                        </div>
                    </div>
                    
                </form>
                </div>
                </div>
    )

}