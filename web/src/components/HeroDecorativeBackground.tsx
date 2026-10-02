"use client";

import React from "react";

export function HeroDecorativeBackground() {
  return (
    <div
      aria-hidden="true"
      className="hero-decorative-bg pointer-events-none select-none absolute inset-0 z-0 overflow-hidden w-full h-full"
    >
      {/* 1. Organic Flowing Wave / Blob Shapes */}
      <svg
        className="absolute inset-0 w-full h-full preserve-3d"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Light Mode Gradients */}
          <linearGradient id="blob-grad-left" x1="0%" y1="0%" x2="60%" y2="100%">
            <stop offset="0%" stopColor="#d5e8dc" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#e8f3ec" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fbf9f5" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="blob-grad-left-deep" x1="0%" y1="20%" x2="40%" y2="80%">
            <stop offset="0%" stopColor="#c2ddcb" stopOpacity="0.65" />
            <stop offset="70%" stopColor="#dbeee1" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#fbf9f5" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="blob-grad-right" x1="100%" y1="0%" x2="40%" y2="90%">
            <stop offset="0%" stopColor="#d8ebe0" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#edf6f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fbf9f5" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="blob-grad-bottom" x1="30%" y1="100%" x2="85%" y2="40%">
            <stop offset="0%" stopColor="#e2efe6" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#f1f7f3" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#fbf9f5" stopOpacity="0" />
          </linearGradient>

          {/* Dark Mode Gradients */}
          <linearGradient id="dark-blob-grad-left" x1="0%" y1="0%" x2="60%" y2="100%">
            <stop offset="0%" stopColor="#1e3324" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#17271c" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#131412" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="dark-blob-grad-right" x1="100%" y1="0%" x2="40%" y2="90%">
            <stop offset="0%" stopColor="#223a2a" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#18271e" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#131412" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="dark-blob-grad-bottom" x1="30%" y1="100%" x2="85%" y2="40%">
            <stop offset="0%" stopColor="#1a2e20" stopOpacity="0.35" />
            <stop offset="70%" stopColor="#152119" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#131412" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* --- Background Wave Layer (Light theme) --- */}
        <g className="dark:hidden">
          {/* Sweeping Left Organic Hill Wave */}
          <path
            d="M-100,-50 C120,-20 280,180 200,420 C130,620 -50,700 -120,950 L-100,-50 Z"
            fill="url(#blob-grad-left-deep)"
          />
          {/* Secondary Left Wave */}
          <path
            d="M-50,-80 C240,-40 360,260 290,560 C220,820 50,920 -80,1000 L-150,-50 Z"
            fill="url(#blob-grad-left)"
          />
          {/* Top-Right & Center Dune Wave */}
          <path
            d="M850,-100 C1100,-40 1450,120 1700,40 C1750,220 1680,680 1420,860 C1160,820 980,520 850,340 C740,190 710,-60 850,-100 Z"
            fill="url(#blob-grad-right)"
          />
          {/* Bottom Horizon Gentle Flow */}
          <path
            d="M320,920 C540,780 820,760 1150,830 C1380,880 1560,760 1720,700 L1720,950 L300,950 Z"
            fill="url(#blob-grad-bottom)"
          />
        </g>

        {/* --- Background Wave Layer (Dark theme) --- */}
        <g className="hidden dark:inline">
          <path
            d="M-50,-80 C240,-40 360,260 290,560 C220,820 50,920 -80,1000 L-150,-50 Z"
            fill="url(#dark-blob-grad-left)"
          />
          <path
            d="M850,-100 C1100,-40 1450,120 1700,40 C1750,220 1680,680 1420,860 C1160,820 980,520 850,340 C740,190 710,-60 850,-100 Z"
            fill="url(#dark-blob-grad-right)"
          />
          <path
            d="M320,920 C540,780 820,760 1150,830 C1380,880 1560,760 1720,700 L1720,950 L300,950 Z"
            fill="url(#dark-blob-grad-bottom)"
          />
        </g>
      </svg>

      {/* 2. Top-Right Dot-Grid Texture (6 cols x 4 rows) */}
      <div className="absolute top-[12%] right-[22%] sm:right-[26%] lg:right-[28%] xl:right-[30%] opacity-45 dark:opacity-30">
        <svg width="120" height="72" viewBox="0 0 120 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          {[0, 24, 48, 72, 96, 120].map((x) =>
            [0, 24, 48, 72].map((y) => (
              <circle
                key={`dot-top-${x}-${y}`}
                cx={x}
                cy={y}
                r="2.2"
                className="fill-[var(--accent-sage)] dark:fill-[var(--accent-sage)]"
              />
            ))
          )}
        </svg>
      </div>

      {/* 3. Middle-Right Dot-Grid Texture (4 cols x 3 rows near deal card flank) */}
      <div className="hidden md:block absolute top-[52%] left-[50%] lg:left-[48%] opacity-35 dark:opacity-25">
        <svg width="72" height="48" viewBox="0 0 72 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {[0, 24, 48, 72].map((x) =>
            [0, 24, 48].map((y) => (
              <circle
                key={`dot-mid-${x}-${y}`}
                cx={x}
                cy={y}
                r="2.2"
                className="fill-[var(--accent-sage)] dark:fill-[var(--accent-sage)]"
              />
            ))
          )}
        </svg>
      </div>

      {/* 4. Four-Point Sparkle / Star Accents */}
      {/* Sparkle 1: Near Top-Right Dot Grid */}
      <div className="absolute top-[16%] right-[18%] sm:right-[22%] lg:right-[23%] text-[var(--accent-sage)] dark:text-[var(--accent-sage)] opacity-85">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
        </svg>
      </div>

      {/* Sparkle 2: Far Top-Right */}
      <div className="hidden sm:block absolute top-[28%] right-[3%] lg:right-[4%] text-[var(--accent-sage)] dark:text-[var(--accent-sage)] opacity-70">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
        </svg>
      </div>

      {/* Sparkle 3: Subtle Left Accent */}
      <div className="hidden lg:block absolute top-[10%] left-[8%] text-[var(--accent-sage)] dark:text-[var(--accent-sage)] opacity-40">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
        </svg>
      </div>

      {/* 5. Dashed Connecting Curved Line with Directional Endpoint */}
      <div className="hidden lg:block absolute top-[36%] left-[49%] xl:left-[51%] w-24 h-16 pointer-events-none">
        <svg width="96" height="64" viewBox="0 0 96 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 52 C30 50 56 34 84 12"
            stroke="var(--accent-sage)"
            strokeWidth="1.6"
            strokeDasharray="4 4"
            strokeLinecap="round"
            className="opacity-60 dark:opacity-50"
          />
          <circle cx="86" cy="11" r="3.5" fill="var(--accent-sage)" className="opacity-80 dark:opacity-70" />
        </svg>
      </div>

      {/* 6. Original Bottom-Right Vector Illustration (Desk, Stack of Books, Laptop, Floating UI Cards, Foliage) */}
      <div className="hidden md:block absolute bottom-0 right-0 sm:right-2 lg:right-4 xl:right-8 w-[320px] sm:w-[380px] lg:w-[460px] xl:w-[500px] h-[240px] sm:h-[280px] lg:h-[320px] xl:h-[350px]">
        <svg
          viewBox="0 0 520 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          <defs>
            {/* Soft shadows & surfaces */}
            <filter id="card-soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.1" floodColor="#1b1b18" />
            </filter>
            <filter id="card-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.06" floodColor="#1b1b18" />
            </filter>
            <linearGradient id="laptop-screen-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f4fbf6" />
              <stop offset="100%" stopColor="#e1efe5" />
            </linearGradient>
            <linearGradient id="dark-laptop-screen-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1f2c22" />
              <stop offset="100%" stopColor="#162219" />
            </linearGradient>
          </defs>

          {/* Tabletop / Desk Base */}
          <polygon
            points="140,345 520,345 520,360 110,360"
            className="fill-[#e8decb] dark:fill-[#252822] opacity-75"
          />
          <polygon
            points="110,340 520,340 520,345 140,345"
            className="fill-[#f1e9dc] dark:fill-[#2d3029]"
          />

          {/* --- Stack of Books (Left of Laptop) --- */}
          <g transform="translate(135, 248)">
            {/* Bottom Book (Olive/Forest Green) */}
            <g>
              {/* Spine/Cover */}
              <rect x="0" y="44" width="130" height="24" rx="4" className="fill-[#39503d] dark:fill-[#2e4332]" />
              {/* Pages */}
              <rect x="18" y="48" width="112" height="16" rx="2" className="fill-[#fbf9f4] dark:fill-[#383d33]" />
              <line x1="22" y1="53" x2="126" y2="53" stroke="#e7dfd2" strokeWidth="1" className="dark:stroke-[#292d25]" />
              <line x1="22" y1="59" x2="126" y2="59" stroke="#e7dfd2" strokeWidth="1" className="dark:stroke-[#292d25]" />
              {/* Bookmark Ribbon */}
              <path d="M42,50 L42,76 L48,70 L54,76 L54,50 Z" className="fill-[#e5a84b] opacity-90" />
            </g>

            {/* Top Book (Sage/Earthy Green) */}
            <g transform="translate(8, 20)">
              {/* Spine/Cover */}
              <rect x="0" y="0" width="118" height="22" rx="4" className="fill-[#4d6b52] dark:fill-[#3d5642]" />
              {/* Pages */}
              <rect x="16" y="4" width="102" height="14" rx="2" className="fill-[#fdfcfa] dark:fill-[#383d33]" />
              <line x1="20" y1="9" x2="114" y2="9" stroke="#e7dfd2" strokeWidth="1" className="dark:stroke-[#292d25]" />
              {/* Gold foil debossed accent lines on spine */}
              <line x1="3" y1="3" x2="3" y2="19" stroke="#d5b376" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
              <line x1="7" y1="3" x2="7" y2="19" stroke="#d5b376" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            </g>
          </g>

          {/* --- Open Laptop (Modern Thin Bezel) --- */}
          <g transform="translate(245, 175)">
            {/* Laptop Display (Tilted Back) */}
            <g>
              {/* Outer Lid Bezel */}
              <rect
                x="28"
                y="0"
                width="196"
                height="136"
                rx="9"
                className="fill-[#2a302c] dark:fill-[#1a1d1b]"
              />
              {/* Screen Area */}
              <rect
                x="35"
                y="8"
                width="182"
                height="120"
                rx="5"
                className="fill-[url(#laptop-screen-grad)] dark:fill-[url(#dark-laptop-screen-grad)]"
              />
              {/* Camera dot */}
              <circle cx="126" cy="4" r="1.5" className="fill-[#515c54]" />

              {/* Screen Content UI Preview (Course video & code placeholder) */}
              <rect x="44" y="18" width="100" height="10" rx="3" className="fill-[#38513d]/25 dark:fill-[#7da885]/30" />
              <rect x="44" y="34" width="70" height="6" rx="2" className="fill-[#38513d]/15 dark:fill-[#7da885]/20" />
              <rect x="44" y="44" width="85" height="6" rx="2" className="fill-[#38513d]/15 dark:fill-[#7da885]/20" />
              <rect x="44" y="54" width="60" height="6" rx="2" className="fill-[#38513d]/15 dark:fill-[#7da885]/20" />
              
              {/* Progress bar on screen */}
              <rect x="44" y="70" width="110" height="5" rx="2.5" className="fill-[#d0dfd4] dark:fill-[#2d3f32]" />
              <rect x="44" y="70" width="80" height="5" rx="2.5" className="fill-[#3f5844] dark:fill-[#7da885]" />

              {/* Mini video thumbnail box on right side of screen */}
              <rect x="160" y="24" width="48" height="42" rx="4" className="fill-[#cce2d2] dark:fill-[#263d2c]" />
              <polygon points="180,40 180,50 190,45" className="fill-[#3f5844] dark:fill-[#a4d4ad]" />
            </g>

            {/* Laptop Base (Keyboard & Trackpad) */}
            <g transform="translate(0, 134)">
              {/* Base Wedge Body */}
              <polygon
                points="16,0 236,0 252,18 0,18"
                className="fill-[#e2ded6] dark:fill-[#232724]"
              />
              <polygon
                points="0,18 252,18 252,22 0,22"
                className="fill-[#c9c5bd] dark:fill-[#1b1d1b]"
              />
              {/* Keyboard Inset */}
              <polygon
                points="36,2 216,2 226,10 26,10"
                className="fill-[#d1ccc4] dark:fill-[#1c1f1d]"
              />
              {/* Trackpad */}
              <polygon
                points="106,12 146,12 148,16 104,16"
                className="fill-[#d7d2ca] dark:fill-[#282d29]"
              />
            </g>
          </g>

          {/* --- Floating Card 1: Course / Book Icon Card (Floating left of laptop screen) --- */}
          <g
            transform="translate(260, 110) rotate(-4)"
            filter="url(#card-soft-shadow)"
          >
            <rect
              x="0"
              y="0"
              width="72"
              height="72"
              rx="14"
              className="fill-white dark:fill-[#1f231f] stroke-[#e4ddd2] dark:stroke-[#343b34]"
              strokeWidth="1.2"
            />
            {/* Book Icon */}
            <g transform="translate(18, 17)" className="text-[#38513d] dark:text-[#9bc7a2]">
              <path
                d="M17 3C13 1.5 5 1.5 2 4.2V29C5 26.5 13 26.5 17 28M17 3C21 1.5 29 1.5 32 4.2V29C29 26.5 21 26.5 17 28M17 3V28"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
          </g>

          {/* --- Floating Card 2: Video Play / Course Card (Floating right of laptop screen) --- */}
          <g
            transform="translate(345, 140) rotate(3)"
            filter="url(#card-soft-shadow)"
          >
            <rect
              x="0"
              y="0"
              width="66"
              height="62"
              rx="13"
              className="fill-white dark:fill-[#1f231f] stroke-[#e4ddd2] dark:stroke-[#343b34]"
              strokeWidth="1.2"
            />
            {/* Play Button Icon */}
            <polygon
              points="25,19 25,43 44,31"
              className="fill-[#3a543f] dark:fill-[#9bc7a2]"
            />
          </g>

          {/* --- Botanical Plant / Foliage Fronds (Arching on Right Edge) --- */}
          <g transform="translate(435, 110)">
            {/* Main Arching Stem 1 */}
            <path
              d="M35,210 Q40,110 55,20"
              stroke="#2e4834"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="dark:stroke-[#45634b]"
              fill="none"
            />
            {/* Leaves on Stem 1 */}
            {/* Leaf 1 (Top) */}
            <path
              d="M55,20 C65,10 70,25 55,30 C45,28 48,15 55,20 Z"
              className="fill-[#45694c] dark:fill-[#618d69]"
            />
            {/* Leaf 2 (Right) */}
            <path
              d="M53,45 C75,40 80,60 52,65 C48,58 48,48 53,45 Z"
              className="fill-[#38553e] dark:fill-[#537a5a]"
            />
            {/* Leaf 3 (Left) */}
            <path
              d="M50,75 C25,65 20,88 47,94 C51,88 50,78 50,75 Z"
              className="fill-[#4f7756] dark:fill-[#709d77]"
            />
            {/* Leaf 4 (Right) */}
            <path
              d="M47,110 C75,105 82,130 45,135 C42,126 42,114 47,110 Z"
              className="fill-[#38553e] dark:fill-[#537a5a]"
            />
            {/* Leaf 5 (Left) */}
            <path
              d="M43,145 C15,140 10,165 40,170 C44,162 43,149 43,145 Z"
              className="fill-[#4f7756] dark:fill-[#709d77]"
            />
            {/* Leaf 6 (Right bottom) */}
            <path
              d="M39,180 C68,178 72,205 38,208 C35,200 35,185 39,180 Z"
              className="fill-[#324c37] dark:fill-[#476a4e]"
            />

            {/* Secondary Shorter Stem 2 */}
            <path
              d="M48,210 Q65,140 82,70"
              stroke="#3b5a41"
              strokeWidth="2"
              strokeLinecap="round"
              className="dark:stroke-[#507457]"
              fill="none"
            />
            <path
              d="M82,70 C96,65 98,82 81,85 C75,80 77,72 82,70 Z"
              className="fill-[#5a8662] dark:fill-[#79a981]"
            />
            <path
              d="M75,105 C98,102 100,122 73,124 C68,118 70,108 75,105 Z"
              className="fill-[#45694c] dark:fill-[#618d69]"
            />
            <path
              d="M66,145 C90,146 92,168 64,166 C60,158 61,148 66,145 Z"
              className="fill-[#38553e] dark:fill-[#537a5a]"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
