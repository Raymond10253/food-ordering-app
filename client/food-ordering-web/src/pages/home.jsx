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
        })
    }
    )}
    
   
