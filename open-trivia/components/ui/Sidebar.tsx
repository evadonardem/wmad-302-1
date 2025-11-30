import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Grid, Heart, Settings, UserCircle2, Zap } from 'lucide-react';

interface NavItemProps {
  item: {
    name: string;
    icon: React.ElementType;
    path: string;
  };
}

const NavItem: React.FC<NavItemProps> = ({ item }) => (
  <NavLink
    to={item.path}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
        isActive 
          ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20' 
          : 'text-slate-500 hover:text-foreground hover:bg-foreground/5'
      }`
    }
  >
    <item.icon className="w-5 h-5 relative z-10" />
    <span className="font-medium relative z-10">{item.name}</span>
    {/* Glow Effect on Hover */}
    <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </NavLink>
);

export const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Categories', icon: Grid, path: '/categories' },
    { name: 'Favorites', icon: Heart, path: '/favorites' },
  ];

  const settingsItems = [
    { name: 'Preferences', icon: Settings, path: '/preferences' },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 hidden md:flex flex-col border-r border-border bg-background/95 backdrop-blur-xl z-50 transition-colors duration-300">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
            <Zap className="w-6 h-6 text-white fill-current" />
          </div>
          <h1 className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-slate-400">
            Open Trivia
          </h1>
        </div>
        <p className="text-xs text-slate-500 ml-1">For every Juan</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto">
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Application</h3>
          <div className="space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Settings</h3>
          <div className="space-y-2">
            {settingsItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </div>
        </div>
      </nav>

      {/* Footer User Profile */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/5 cursor-pointer transition-colors">
          <UserCircle2 className="w-10 h-10 text-slate-400" />
          <div>
            <p className="text-sm font-bold text-foreground">Guest User</p>
            <p className="text-xs text-slate-500">Free Account</p>
          </div>
        </div>
        <div className="mt-4 text-center">
            <p className="text-[10px] text-slate-400">WMAD-302 Group ? © 2025</p>
        </div>
      </div>
    </aside>
  );
};