'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store/app-context';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { DemoPersonaBanner } from '@/components/navigation/DemoPersonaBanner';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { LittleTeacup, StarFlair } from '@/components/ui/Illustrations';
import { PreferredFormat } from '@/types';
import { Sparkles, Eye, EyeOff } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser, updateProfile, addToast } = useApp();

  const [firstName, setFirstName] = useState(currentUser?.first_name || '');
  const [displayName, setDisplayName] = useState(currentUser?.display_name || '');
  const [city, setCity] = useState(currentUser?.city || 'Abuja');
  const [country, setCountry] = useState(currentUser?.country || 'Nigeria');
  const [favouriteBook, setFavouriteBook] = useState(currentUser?.favourite_book || '');
  const [currentlyReading, setCurrentlyReading] = useState(currentUser?.currently_reading || '');
  const [preferredFormat, setPreferredFormat] = useState<PreferredFormat>(currentUser?.preferred_format || 'both');
  const [directoryVisible, setDirectoryVisible] = useState(currentUser?.directory_visible || false);
  const [avatarColor, setAvatarColor] = useState(currentUser?.avatar_color || '#F5D978');

  const avatarColors = ['#F5D978', '#DFA6A0', '#A9B5A0', '#C9795F', '#FFF9F0'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    updateProfile(currentUser.id, {
      first_name: firstName.trim() || currentUser.first_name,
      display_name: displayName.trim() || currentUser.display_name,
      city: city.trim(),
      country: country.trim(),
      favourite_book: favouriteBook.trim(),
      currently_reading: currentlyReading.trim(),
      preferred_format: preferredFormat,
      directory_visible: directoryVisible,
      avatar_color: avatarColor,
    });

    addToast('Welcome to Good Company! Your reading profile is set.', 'success');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F0] text-[#25211D]">
      <DemoPersonaBanner />
      <Navbar />

      <main className="flex-1 py-14 max-w-xl mx-auto px-4 sm:px-6 w-full">
        <div className="paper-card rounded-3xl p-6 sm:p-10 border border-[#25211D]/12 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#F5D978] flex items-center justify-center mx-auto text-[#25211D]">
              <LittleTeacup className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C9795F]">
              First Time Welcome
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#25211D]">
              Complete Your Reading Identity
            </h1>
            <p className="text-xs sm:text-sm text-[#25211D]/75 font-sans">
              Keep it simple. Good Company does not have public profiles or followers—just a quiet mark in the room.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 font-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#25211D]/90 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F0] border border-[#25211D]/20 text-sm outline-none focus:border-[#C9795F]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#25211D]/90 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Amaka O."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F0] border border-[#25211D]/20 text-sm outline-none focus:border-[#C9795F]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#25211D]/90 mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F0] border border-[#25211D]/20 text-sm outline-none focus:border-[#C9795F]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#25211D]/90 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F0] border border-[#25211D]/20 text-sm outline-none focus:border-[#C9795F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#25211D]/90 mb-1">
                Favourite Book
              </label>
              <input
                type="text"
                required
                value={favouriteBook}
                onChange={(e) => setFavouriteBook(e.target.value)}
                placeholder="The one you will always defend"
                className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F0] border border-[#25211D]/20 text-sm outline-none focus:border-[#C9795F]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#25211D]/90 mb-1">
                Currently Reading
              </label>
              <input
                type="text"
                value={currentlyReading}
                onChange={(e) => setCurrentlyReading(e.target.value)}
                placeholder="What is on your nightstand right now?"
                className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F0] border border-[#25211D]/20 text-sm outline-none focus:border-[#C9795F]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#25211D]/90 mb-1.5">
                Avatar Bookmark Palette
              </label>
              <div className="flex items-center gap-3">
                {avatarColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setAvatarColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-7 h-7 rounded-full border border-[#25211D]/20 transition-transform ${
                      avatarColor === color ? 'ring-2 ring-[#25211D] ring-offset-2 scale-110' : 'hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Directory Visibility Toggle */}
            <div className="p-4 rounded-2xl bg-[#FFF9F0] border border-[#25211D]/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#25211D] flex items-center gap-1.5">
                  {directoryVisible ? <Eye className="w-4 h-4 text-[#C9795F]" /> : <EyeOff className="w-4 h-4 text-stone-400" />}
                  Member Directory Participation
                </span>
                <input
                  type="checkbox"
                  checked={directoryVisible}
                  onChange={(e) => setDirectoryVisible(e.target.checked)}
                  className="rounded text-[#25211D] focus:ring-[#C9795F] w-4 h-4"
                />
              </div>
              <p className="text-[11px] text-[#25211D]/70 leading-relaxed">
                By default, you are private. If enabled, your display name, city, and reading choices appear in our members-only directory card list. Your email and phone are never exposed.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#25211D] text-[#FFF9F0] hover:bg-[#3d3731] font-medium text-sm transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <StarFlair className="w-3.5 h-3.5 text-[#F5D978]" />
              Enter Good Company Dashboard
            </button>
          </form>
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}
