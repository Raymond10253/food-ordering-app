import { useMemo, useState } from "react";
import { useEffect } from "react";

   const FALLBACK_RESTAURAUNTS = [
    {
        id: 1,
        name: 'Savannah Flame Grill',
        cuisine: 'Burgers',
        rating: 4.8,
        reviews_count: 214,
        delivery_time: '20-30 min',
        delivery_fee: 150,
        image: '',
        featured: true,
        menu: [
            {
                id: 101,
                restaurant_id: 1,
                restaurant_name: 'Savannah Flame Grill',
                name: 'Double Nyama Smash Burger',
                description: 'Double aged beef patties, smoked cheddar, caramelized onions, house burger sauce.',
                price: 850,
                category: 'Mains',
                popular: true,
                image: '',
            },
            {
                id: 102,
                restaurant_id: 1,
                restaurant_name: 'Savannah Flame Grill',
                name: 'Peri-Peri Loaded Masala Fries',
                description: 'Crispy skin-on fries tossed in spicy masala glaze, spring onions, and garlic aioli.',
                price: 400,
                category: 'Sides',
                popular: true,
                image: '',
            },
        ],
    },
    {
        id: 2,
        name: 'Napoli woodfire pizza',
        cuisine: 'Pizza',
        rating: 4.7,
        reviews_count: 104,
        delivery_time: '30-40 min',
        delivery_fee: 100,
        image: '',
        featured: true,
        menu: [
            {
                id: 201,
                restaurant_id: 2,
                restaurant_name: 'Napoli woodfire pizza',
                name: 'spicy peparonni pizza',
                description: '',
                price: 1200,
                category: 'Mains',
                popular: true,
                image: '',
            },
            {
                id: 202,
                restaurant_id: 2,
                restaurant_name: 'Napoli woodfire pizza',
                name: '',
                description: '',
                price: 1000,
                category: 'Sides',
                popular: true,
                image: '',
            },
        ],
    },
    {
        id: 3,
        name: 'Swahili coastal chicken',
        cuisine: '',
        rating: 4.5,
        reviews_count: 200,
        delivery_time: 100,
        delivery_fee: 150,
        image: '',
        featured: true,
        menu: [
            {
                id: 301,
                restaurant_id: 3,
                restaurant_name: 'Swahili coastal chicken',
                name: '',
                description: '',
                price: 600,
                category: 'Mains',
                popular: false,
                image: '',
            }
        ],
    },
   ];

   const CATEGORIES = ['All', 'Burgers', 'Pizza', 'Local & Pilau', 'Healthy'];

   export default function Home({
    onAddToCart = () => {},
    onSelectRestaurant = null,
    cartCount = 0,
    onOpenCart = () => {},
   }) {
    const [restaurants, setRestaurants] = useState(FALLBACK_RESTAURAUNTS);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('rating');
    const [activeRestaurant, setActiveRestaurant] = useState(null);
    const [loading,setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchRestaurants = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/restaurants');
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted && Array.isArray(data) && data.length > 0) {
                        setRestaurants(data);
                    }
                }
            } catch {

            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchRestaurants();
        return () => {
            isMounted = false;
        };
    }, []);

    const allMenuItems = useMemo(() => {
        return restaurants
        .filter((rest) => {
            const matchesCategory =
                selectedCategory === 'All' ||
                rest.cuisine.toLowerCase() === selectedCategory.toLowerCase();
            const q = searchQuery.trim().toLowerCase();
            if(!q) return matchesCategory;

            const matchesRestName = rest.name.toLowerCase().includes(q);
            const matchesCuisine = rest.cuisine.toLowerCase().includes(q);
            const matchesDish = (rest.menu || []).some((m) =>
                m.name.toLowerCase().includes(q));
            return matchesCategory && (matchesRestName || matchesCuisine || matchesDish);
        })
        .sort((a, b) => {
            if (sortBy === 'rating') return b.rating - a.rating;
            if (sortBy === 'fee') return a.delivery_fee - b.delivery_fee;
            return 0;
        });
    }, [restaurants, setSelectedCategory, searchQuery, sortBy]);

    const matchingDishes = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return [];
        return allMenuItems.filter(
            (item) =>
                item.name.toLowerCase().includes(q) ||
            (item.description && item.description.toLowerCase().includes(q))
        );
    }, [allMenuItems, searchQuery]);

    const popularDishes = useMemo(() => {
        return allMenuItems.filter((item) => item.popular).slice(0, 4);
    }, [allMenuItems]);

    const handleRestaurantClick = (restaurant) => {
        if (onSelectRestaurant) {
            onSelectRestaurant(restaurant);
        } else {
            setActiveRestaurant(restaurant);
        }
    };

    return (
        <div
        className="min-h-screen bg-slate-950 text-slate-100"
        >
            <section
            className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-t0-br from-slate-900 via-slate-950 to-sky-850/20"
            >
                <div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16"
                >
                    <div
                    className="max-w-2xl"
                    >
                        <div
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/20 border border-sky-400/20 text-sky-300 text-xs font-semibold mb-4"
                        >
                            <i 
                            className="fa-solid fa-fire-flame-curved"
                            ></i>
                            Fast Delivery . Freshly Prepared
                        </div>
                        <h1
                        className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4"
                        >
                            Craving something <span className="text-sky-400">delicious</span> right now?
                        </h1>
                        <p
                        className="text-slate-400 text-base sm:text-lg mb-8"
                        >
                            Explore top local kitchens, coastal favourites, woodfire pizzas, and smash burgers delivered hot to your door.
                        </p>

                        <div
                        className="flex flex-col sm:flex-row gap-3"
                        >
                            <div
                            className="relative flex-1"
                            >
                                <i
                                className="fa-solid fa-magnifying-glass text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"
                                ></i>
                                <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) =>setSearchQuery(e.target.value)}
                                placeholder="Search burgers, pilau, pizza or restaurants..."
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 transition shadow-lg"
                                />
                                {searchQuery && (
                                    <button
                                    type='button'
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            {cartCount > 0 && (
                                <button
                                type="button"
                                onClick={onOpenCart}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-sky-400 hover:bg-sky-500 text-white font-bold transition shadow-lg shadow-sky-500/20"
                                >
                                    <i
                                    className="fa-solid fa-shopping-bag"
                                    ></i>
                                    Cart ({cartCount})
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <main
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10"
            >
                {searchQuery.trim() !== '' && (
                    <section
                    className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6"
                    >
                        <h2
                        className="text-lg font-bold mb-4 flex items-center gap-2"
                        >
                            <i 
                            className="fa-solid fa-utensils text-sky-400"
                            ></i>
                            Matching dishes ({matchingDishes.length})

                        </h2>

                        {matchingDishes.length === 0 ? (
                            <p
                            className="text-sm text-slate-400"
                            >
                                No exact dish matches for "{searchQuery}". Try searching another keyword.
                            </p>
                        ) : (
                            <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                {matchingDishes.map((item) => (
                                    <div
                                    key={item.id}
                                    className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition"
                                    >
                                        <div
                                        className="min-w-0"
                                        >
                                            <p
                                            className="text-xs text-sky-300 font-medium mb-0.5"
                                            >
                                                {item.restaurant_name}
                                            </p>
                                            <h3
                                            className="font-semibold text-slate-100 truncate"
                                            >
                                                {item.name}
                                            </h3>
                                            <p
                                            className="text-xs text-slate-400 line-clamp-1 mt-0.5"
                                            >
                                                {item.description}
                                            </p>
                                            <p
                                            className="text-sm font-bold text-white mt-2"
                                            >
                                                KES {item.price}
                                            </p>
                                        </div>

                                        <button>
                                            <i
                                            className="fa-solid fa-plus"
                                            ></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    )
    }
    
   
