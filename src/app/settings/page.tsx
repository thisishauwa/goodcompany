'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store/app-context';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { DemoPersonaBanner } from '@/components/navigation/DemoPersonaBanner';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { PreferredFormat } from '@/types';
import { ArrowLeft, Eye, EyeOff, LogOut, ShieldAlert, Check } from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const { currentUser, updateProfile, leaveClub } = useApp();

  const [firstName, setFirstName] = useState(currentUser?.first_name || '');
  const [displayName, setDisplayName] = useState(currentUser?.display_name || '');
  const [city, setCity] = useState(currentUser?.city || 'Abuja');
  const [country, setCountry] = useState(currentUser?.country || 'Nigeria');
  const [favouriteBook, setFavouriteBook] = useState(currentUser?.favourite_book || '');
  const [currentlyReading, setCurrentlyReading] = useState(currentUser?.currently_reading || '');
  const [preferredFormat, setPreferredFormat] = useState<PreferredFormat>(currentUser?.preferred_format || 'both');
  const [directoryVisible, setDirectoryVisible] = useState(currentUser?.directory_visible || false);
  const [avatarColor, setAvatarColor] = useState(currentUser?.avatar_color || '#FFA5D5');

  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F6EEE9] text-[#5B2302]">
        <DemoPersonaBanner />
        <Navbar />
        <main className="flex-1 py-20 text-center font-body">
          <p className="font-block text-xl uppercase">Please sign in to view settings.</p>
          <Link href="/login" className="text-xs text-[#5B2302] font-bold underline mt-3 inline-block uppercase">
            Sign In
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(currentUser.id, {
      first_name: firstName.trim(),
      display_name: displayName.trim(),
      city: city.trim(),
      country: country.trim(),
      favourite_book: favouriteBook.trim(),
      currently_reading: currentlyReading.trim(),
      preferred_format: preferredFormat,
      directory_visible: directoryVisible,
      avatar_color: avatarColor,
    });
  };

  const handleConfirmLeave = () => {
    leaveClub();
    router.push('/');
  };

  const colors = ['#FFA5D5', '#F5D978', '#DFA6A0', '#A9B5A0', '#C9795F'];

  return (
    <div className="min-h-screen flex flex-col bg-[#F6EEE9] text-[#5B2302]">
      <DemoPersonaBanner />
      <Navbar />

      <main className="flex-1 py-10 sm:py-16 font-body">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B2302]/70 hover:text-[#5B2302] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>

          <div className="editorial-card rounded-3xl p-6 sm:p-10 border-2 border-[#5B2302] bg-[#FFFCF7] space-y-6">
            <div className="border-b border-[#5B2302]/15 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#5B2302]">
                Account & Sanctuary
              </span>
              <h1 className="font-block text-3xl sm:text-4xl uppercase text-[#5B2302] leading-tight">
                Profile & Privacy
              </h1>
              <p className="text-xs text-[#5B2302]/80 mt-1">
                Customize how you appear in Good Company discussions and the member directory.
              </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Avatar color picker */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#5B2302] mb-2">
                  Avatar Color
                </label>
                <div className="flex items-center gap-3">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setAvatarColor(c)}
                      className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                        avatarColor === c ? 'border-[#5B2302] scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {avatarColor === c && <Check className="w-4 h-4 text-[#5B2302]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first-name-input" className="block text-xs font-bold uppercase text-[#5B2302] mb-1.5">
                    First Name
                  </label>
                  <input
                    id="first-name-input"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6EEE9] border border-[#5B2302]/25 focus:border-[#5B2302] outline-none text-xs sm:text-sm text-[#5B2302]"
                  />
                </div>

                <div>
                  <label htmlFor="display-name-input" className="block text-xs font-bold uppercase text-[#5B2302] mb-1.5">
                    Display Name (in discussion)
                  </label>
                  <input
                    id="display-name-input"
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6EEE9] border border-[#5B2302]/25 focus:border-[#5B2302] outline-none text-xs sm:text-sm text-[#5B2302]"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="settings-city-input" className="block text-xs font-bold uppercase text-[#5B2302] mb-1.5">
                    City
                  </label>
                  <input
                    id="settings-city-input"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6EEE9] border border-[#5B2302]/25 focus:border-[#5B2302] outline-none text-xs sm:text-sm text-[#5B2302]"
                  />
                </div>

                <div>
                  <label htmlFor="settings-country-input" className="block text-xs font-bold uppercase text-[#5B2302] mb-1.5">
                    Country
                  </label>
                  <input
                    id="settings-country-input"
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6EEE9] border border-[#5B2302]/25 focus:border-[#5B2302] outline-none text-xs sm:text-sm text-[#5B2302]"
                  />
                </div>
              </div>

              {/* Reading details */}
              <div>
                <label htmlFor="settings-fav-book-input" className="block text-xs font-bold uppercase text-[#5B2302] mb-1.5">
                  Favourite Book (defend with your life)
                </label>
                <input
                  id="settings-fav-book-input"
                  type="text"
                  value={favouriteBook}
                  onChange={(e) => setFavouriteBook(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6EEE9] border border-[#5B2302]/25 focus:border-[#5B2302] outline-none text-xs sm:text-sm text-[#5B2302]"
                />
              </div>

              <div>
                <label htmlFor="settings-currently-reading-input" className="block text-xs font-bold uppercase text-[#5B2302] mb-1.5">
                  Currently Reading
                </label>
                <input
                  id="settings-currently-reading-input"
                  type="text"
                  value={currentlyReading}
                  onChange={(e) => setCurrentlyReading(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6EEE9] border border-[#5B2302]/25 focus:border-[#5B2302] outline-none text-xs sm:text-sm text-[#5B2302]"
                />
              </div>

              {/* Directory Visibility Toggle */}
              <div className="p-4 rounded-2xl bg-[#F6EEE9] border border-[#5B2302]/20 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold uppercase text-[#5B2302] block">
                    Member Directory Visibility
                  </span>
                  <span className="text-[11px] text-[#5B2302]/70 block">
                    Allow other approved Good Company members to see your name, city, and favourite book.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDirectoryVisible(!directoryVisible)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase transition-colors shrink-0 ${
                    directoryVisible
                      ? 'bg-[#FFA5D5] text-[#5B2302] border border-[#5B2302]'
                      : 'bg-[#5B2302] text-[#F6EEE9] border border-[#5B2302]'
                  }`}
                >
                  {directoryVisible ? 'Visible' : 'Hidden'}
                </button>
              </div>

              {/* Submit */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="clean-btn px-6 py-2.5 rounded-full bg-[#5B2302] text-[#F6EEE9] hover:bg-[#3D1600] font-extrabold text-xs uppercase"
                >
                  Save Changes
                </button>
              </div>
            </form>

            {/* Leave club / Danger zone */}
            <div className="pt-6 border-t border-[#5B2302]/15 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold uppercase text-[#5B2302] block">Leave Good Company</span>
                <span className="text-[11px] text-[#5B2302]/70 block">
                  Withdraw membership and delete your directory presence.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setConfirmLeaveOpen(true)}
                className="text-red-700 hover:text-red-900 font-bold uppercase text-xs"
              >
                Leave Club
              </button>
            </div>
          </div>
        </div>

        {/* Modal: Confirm Leave */}
        {confirmLeaveOpen && (
          <div className="fixed inset-0 z-50 bg-[#3D1600]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="editorial-card rounded-2xl p-6 max-w-sm w-full border-2 border-[#5B2302] bg-[#FFFCF7] space-y-4">
              <h3 className="font-block uppercase text-xl text-[#5B2302]">
                Leave Good Company?
              </h3>
              <p className="text-xs text-[#5B2302]/85 leading-relaxed font-body">
                We’ll be sad to see you go. Your account status will be set to former member, and you will lose access to reading guides and discussion rooms.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmLeaveOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-bold uppercase text-[#5B2302]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmLeave}
                  className="px-4 py-2 rounded-full bg-red-700 text-white text-xs font-bold uppercase hover:bg-red-800"
                >
                  Confirm & Leave
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}
