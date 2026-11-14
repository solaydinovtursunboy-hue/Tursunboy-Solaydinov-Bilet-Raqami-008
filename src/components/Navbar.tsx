import React from 'react';

interface NavbarProps {
  onOrderClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOrderClick }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-zinc-50/85 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        <a
          href="#top"
          className="font-display text-lg font-bold tracking-tight text-zinc-950 whitespace-nowrap shrink-0 dark:text-zinc-50"
        >
          A4 Market
        </a>

        <nav
          aria-label="Asosiy navigatsiya"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600 dark:text-zinc-400"
        >
          <a
            href="#taqqoslash"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-zinc-950 hover:underline hover:underline-offset-8 dark:hover:text-zinc-50"
          >
            Taqqoslash
          </a>
          <a
            href="#kalkulyator"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-zinc-950 hover:underline hover:underline-offset-8 dark:hover:text-zinc-50"
          >
            Kalkulyator
          </a>
          <a
            href="#buyurtma"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-zinc-950 hover:underline hover:underline-offset-8 dark:hover:text-zinc-50"
          >
            Buyurtma
          </a>
          <a
            href="#shartlar"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-zinc-950 hover:underline hover:underline-offset-8 dark:hover:text-zinc-50"
          >
            Shartlar
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOrderClick}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 whitespace-nowrap shrink-0 dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-zinc-950"
          >
            Buyurtma berish
          </button>
        </div>
      </div>
    </header>
  );
};
