'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store/app-context';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { DemoPersonaBanner } from '@/components/navigation/DemoPersonaBanner';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { LittleTeacup, BookmarkFlair } from '@/components/ui/Illustrations';
import { SearchNormal1, Eye, EyeSlash, Location, BookSquare, Lock, ArrowLeft } from 'iconsax-react';

export default function MemberDirectoryPage() {
  const { currentUser, profiles, toggleDirectoryVisibility } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Access check
  if (!currentUser || currentUser.membership_status !== 'active') {
    return (
      <div className="min-h-screen flex flex-col bg-[#F6EEE9] text-[#5B2302]">
        <DemoPersonaBanner />
        <Navbar />
        <main className="flex-1 py-20 flex items-center justify-center font-body px-4">
          <div className="editorial-card rounded-3xl p-8 text-center max-w-md mx-auto space-y-4 bg-[#FFFCF7] border-2 border-[#5B2302]">
            <Lock size={32} color="#5B2302" variant="Bold" className="mx-auto" />
            <h1 className="font-block text-2xl uppercase">Member Directory</h1>
            <p className="text-xs text-[#5B2302]/80">
              Available exclusively to approved Good Company members.
            </p>
            <Link
              href="/login"
              className="clean-btn inline-block px-5 py-2.5 rounded-full bg-[#5B2302] text-[#F6EEE9] text-xs font-bold uppercase"
            >
              Sign In
            </Link>
          </div>
        </main>
        <Footer />
        <ToastContainer />
      </div>
    );
  }

  // Filter members: Must have directory_visible = true AND membership_status = 'active'
  const visibleMembers = profiles.filter(
    (p) =>
      p.membership_status === 'active' &&
      p.directory_visible &&
      (p.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.favourite_book.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F6EEE9] text-[#5B2302]">
      <DemoPersonaBanner />
      <Navbar />

      <main className="flex-1 py-10 sm:py-16 font-body">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B2302]/70 hover:text-[#5B2302] transition-colors"
            >
              <ArrowLeft size={14} color="currentColor" /> Back to Dashboard
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#5B2302] block">
                  Private Community
                </span>
                <h1 className="font-block text-3xl sm:text-4xl uppercase text-[#5B2302] leading-tight">
                  Member Directory
                </h1>
                <p className="text-xs sm:text-sm text-[#5B2302]/85 max-w-xl mt-1">
                  Opt-in only. Readers who have chosen to be visible in our private club roll.
                </p>
              </div>

              {/* Privacy Toggle Card */}
              <div className="editorial-card p-4 rounded-2xl border-2 border-[#5B2302] bg-[#FFFCF7] flex items-center justify-between gap-4 sm:max-w-xs w-full">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold uppercase text-[#5B2302] block">
                    Your Privacy Preference
                  </span>
                  <span className="text-[11px] text-[#5B2302]/70 block">
                    {currentUser.directory_visible
                      ? 'You are currently visible to members'
                      : 'You are hidden from the directory'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleDirectoryVisibility(!currentUser.directory_visible)}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold uppercase transition-colors shrink-0 ${
                    currentUser.directory_visible
                      ? 'bg-[#FFA5D5] text-[#5B2302] border border-[#5B2302]'
                      : 'bg-[#5B2302] text-[#F6EEE9] border border-[#5B2302]'
                  }`}
                >
                  {currentUser.directory_visible ? 'Visible' : 'Hidden'}
                </button>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, city, or favourite book..."
              className="w-full px-4 py-2.5 pl-10 rounded-xl bg-[#FFFCF7] border border-[#5B2302]/25 focus:border-[#5B2302] outline-none text-xs sm:text-sm text-[#5B2302]"
            />
            <SearchNormal1 size={16} color="#5B2302" className="absolute left-3.5 top-3 opacity-60" />
          </div>

          {/* Directory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleMembers.length > 0 ? (
              visibleMembers.map((member) => (
                <div
                  key={member.id}
                  className="editorial-card rounded-2xl p-6 border-2 border-[#5B2302] bg-[#FFFCF7] space-y-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-[#5B2302] border border-[#5B2302]/30 shrink-0"
                        style={{ backgroundColor: member.avatar_color || '#FFA5D5' }}
                      >
                        {member.first_name[0]}
                      </div>
                      <div>
                        <h3 className="font-block uppercase text-base text-[#5B2302]">
                          {member.display_name}
                        </h3>
                        <p className="text-xs text-[#5B2302]/70 flex items-center gap-1 font-bold">
                          <Location size={12} color="#5B2302" variant="Bold" />
                          {member.city}, {member.country}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs border-t border-[#5B2302]/15 pt-3">
                      <div>
                        <span className="font-bold text-[#5B2302] block mb-0.5 uppercase text-[10px]">
                          Defend with their life:
                        </span>
                        <p className="font-script text-lg text-[#5B2302]">
                          {member.favourite_book || 'Pride & Prejudice'}
                        </p>
                      </div>

                      {member.currently_reading && (
                        <div>
                          <span className="font-bold text-[#5B2302]/70 block mb-0.5 uppercase text-[10px]">
                            Currently Reading:
                          </span>
                          <p className="text-xs text-[#5B2302]/90">
                            {member.currently_reading}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#5B2302]/15 flex items-center justify-between text-[11px] text-[#5B2302]/60 font-bold uppercase">
                    <span>
                      Member since {new Date(member.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-[#5B2302]">
                      {member.preferred_format === 'both' ? 'Hybrid' : member.preferred_format === 'abuja' ? 'Abuja' : 'Online'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full editorial-card rounded-2xl p-10 text-center bg-[#FFFCF7] border border-[#5B2302]/20">
                <p className="font-script text-xl text-[#5B2302]/70">
                  No members found matching that search.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}
