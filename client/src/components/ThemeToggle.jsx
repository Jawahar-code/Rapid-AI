import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button 
            onClick={toggleTheme}
            className="w-10 h-10 rounded-lg flex justify-center items-center bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition cursor-pointer"
            aria-label="Toggle Dark Mode"
        >
            {theme === 'dark' ? <Moon className="w-5 h-5 text-slate-300" /> : <Sun className="w-5 h-5 text-gray-600" />}
        </button>
    );
};

export default ThemeToggle;
