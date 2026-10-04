'use client'
import React, { useState } from 'react';
import { Home, Search, Mail, Settings, User, Heart, Star, Camera } from 'lucide-react';

export interface DockItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
}

const defaultDockItems: DockItem[] = [
  { id: 'home', icon: <Home size={20} />, label: 'Home' },
  { id: 'search', icon: <Search size={20} />, label: 'Search' },
  { id: 'mail', icon: <Mail size={20} />, label: 'Mail' },
  { id: 'camera', icon: <Camera size={20} />, label: 'Camera' },
  { id: 'favorites', icon: <Star size={20} />, label: 'Favorites' },
  { id: 'profile', icon: <User size={20} />, label: 'Profile' },
  { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
];

export interface DockItemProps {
  item: DockItem;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

export const DockItemComponent: React.FC<DockItemProps> = ({ item, isHovered, onHover }) => {
  const content = (
    <div
      className={`
        relative flex items-center justify-center
        w-14 h-14 rounded-2xl
        bg-white/5 backdrop-blur-[2px]
        border border-white/10
        transition-all duration-300 ease-out
        cursor-pointer
        shadow-none
        ${isHovered 
          ? 'scale-110 bg-white/10 border-white/20 -translate-y-1.5 shadow-xl shadow-white/10' 
          : 'hover:scale-105 hover:bg-white/7 hover:-translate-y-0.5'
        }
      `}
      onClick={item.onClick}
      style={{
        boxShadow: isHovered
          ? '0 4px 24px 0 rgba(255,255,255,0.08)'
          : undefined,
        transitionProperty: 'box-shadow, transform, background, border-color'
      }}
    >
      <div className={`
        text-white transition-all duration-300
        ${isHovered ? 'scale-105 drop-shadow-[0_1px_4px_rgba(255,255,255,0.10)]' : ''}
      `}>
        {item.icon}
      </div>
    </div>
  );

  return (
    <div
      className="relative group"
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
    >
      {item.href ? (
        <a
          href={item.href}
          target={item.href.startsWith('http') ? '_blank' : undefined}
          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="block outline-none"
        >
          {content}
        </a>
      ) : (
        content
      )}
      
      {/* Tooltip */}
      <div className={`
        absolute -top-10 left-1/2 transform -translate-x-1/2
        px-2.5 py-1 rounded-md
        bg-black/70 backdrop-blur
        text-white text-xs font-normal
        border border-white/5
        transition-all duration-200
        pointer-events-none
        whitespace-nowrap
        ${isHovered 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-1'
        }
        shadow-sm
      `}>
        {item.label}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
          <div className="w-2 h-2 bg-black/70 rotate-45 border-r border-b border-white/5"></div>
        </div>
      </div>
    </div>
  );
};

export interface MinimalistDockProps {
  items?: DockItem[];
  className?: string;
}

const MinimalistDock: React.FC<MinimalistDockProps> = ({ items = defaultDockItems, className = '' }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className={`relative ${className}`}>
      {/* Dock Container */}
      <div className={`
        flex items-end gap-4 px-7 py-5
        rounded-2xl
        bg-black/40 backdrop-blur-xl
        border border-white/10
        shadow-2xl
        transition-all duration-500 ease-out
        ${hoveredItem ? 'scale-105' : ''}
      `}>
        {items.map((item) => (
          <DockItemComponent
            key={item.id}
            item={item}
            isHovered={hoveredItem === item.id}
            onHover={setHoveredItem}
          />
        ))}
      </div>

      {/* Soft Ambient Depth Glow underneath */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 h-12 w-[85%] rounded-full bg-black/90 blur-xl"
      />

      {/* Reflection Effect with smooth fade to transparent */}
      <div 
        className="absolute top-full left-0 right-0 mt-1 h-32 overflow-hidden pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.1) 50%, transparent 95%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.1) 50%, transparent 95%)',
        }}
      >
        <div className={`
          flex items-start gap-4 px-7 py-5
          rounded-2xl
          bg-black/20 backdrop-blur-xl
          border border-white/5
          opacity-25
          transform scale-y-[-1]
          transition-all duration-500 ease-out
          ${hoveredItem ? 'scale-105 scale-y-[-1.05]' : ''}
        `}>
          {items.map((item) => (
            <div
              key={`reflection-${item.id}`}
              className={`
                flex items-center justify-center
                w-14 h-14 rounded-2xl
                bg-white/5
                transition-all duration-300 ease-out
                ${hoveredItem === item.id 
                  ? 'scale-125 -translate-y-2' 
                  : ''
                }
              `}
            >
              <div className="text-white/50">
                {item.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinimalistDock;
