'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store/app-context';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { DemoPersonaBanner } from '@/components/navigation/DemoPersonaBanner';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { LittleTeacup, StarFlair } from '@/components/ui/Illustrations';
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { profiles, applications, setCurrentUser, addToast } = useApp();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleMagicLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);

    const existingProfile = profiles.find((p) => p.email.toLowerCase() === cleanEmail);

    if (existingProfile) {
      if (existingProfile.membership_status === 'suspended') {
        setErrorMessage('Your membership is currently suspended. Please contact the curator.');
        setIsSubmitting(false);
        return;
      }
      if (existingProfile.membership_status === 'former_member') {
        setErrorMessage('This account is registered as a former member. Please submit a new application to rejoin.');
        setIsSubmitting(false);
        return;
      }

      setTimeout(() => {
        setIsSubmitting(false);
        setMagicLinkSent(true);
        setCurrentUser(existingProfile);
        addToast(`Magic link confirmed! Welcome back, ${existingProfile.first_name}.`, 'success');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      }, 600);
      return;
    }

    const app = applications.find((a) => a.email.toLowerCase() === cleanEmail);
    if (app) {
      if (app.status === 'pending') {
        setErrorMessage('Your membership application is currently under review by our curators.');
      } else if (app.status === 'waitlisted') {
        setErrorMessage('Your application is currently on our waitlist. Thank you for your patience.');
      } else if (app.status === 'declined') {
        setErrorMessage('We were unable to approve this membership application at this time.');
      }
      setIsSubmitting(false);
      return;
    }

    setErrorMessage('We could not find an approved membership for this email. Please submit an application first.');
    setIsSubmitting(false);
  };

  const handleQuickSignIn = (emailAddress: string) => {
    setEmail(emailAddress);
    const profile = profiles.find((p) => p.email.toLowerCase() === emailAddress.toLowerCase());
    if (profile) {
      setCurrentUser(profile);
      addToast(`Signed in as ${profile.display_name}.`, 'success');
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6EEE9] text-[#5B2302]">
      <DemoPersonaBanner />
      <Navbar />

      <main className="flex-1 py-14 sm:py-20 flex items-center justify-center font-body">
        <div className="max-w-md w-full mx-auto px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B2302]/70 hover:text-[#5B2302] mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Good Company
          </Link>

          <div className="editorial-card rounded-3xl p-6 sm:p-10 border-2 border-[#5B2302] bg-[#FFFCF7] space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#FFA5D5] flex items-center justify-center mx-auto text-[#5B2302] border border-[#5B2302]">
                <LittleTeacup className="w-6 h-6" />
              </div>
              <h1 className="font-block text-2xl sm:text-3xl uppercase text-[#5B2302] leading-tight">
                Member Sign In
              </h1>
              <p className="text-xs sm:text-sm text-[#5B2302]/80">
                Enter your approved email to access the member sanctuary.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-100 border border-red-300 text-xs text-red-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {magicLinkSent ? (
              <div className="p-4 rounded-xl bg-[#F6EEE9] border border-[#5B2302]/20 text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-[#5B2302] mx-auto" />
                <h4 className="font-block uppercase text-sm text-[#5B2302]">
                  Magic Link Verified!
                </h4>
                <p className="text-xs text-[#5B2302]/80">
                  Redirecting to your dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
                <div>
                  <label htmlFor="member-email-input" className="block text-xs font-bold uppercase text-[#5B2302] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="member-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="amaka@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F6EEE9] border border-[#5B2302]/25 focus:border-[#5B2302] outline-none text-xs sm:text-sm text-[#5B2302]"
                    />
                    <Mail className="w-4 h-4 text-[#5B2302]/50 absolute right-3.5 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="clean-btn w-full py-3 rounded-full bg-[#5B2302] text-[#F6EEE9] hover:bg-[#3D1600] font-extrabold text-xs uppercase flex items-center justify-center gap-2"
                >
                  <StarFlair className="w-3.5 h-3.5 text-[#FFA5D5]" />
                  {isSubmitting ? 'Verifying membership...' : 'Send Magic Link'}
                </button>
              </form>
            )}

            {/* Quick Demo Switcher */}
            <div className="pt-4 border-t border-[#5B2302]/15 space-y-2.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B2302]/60 block text-center">
                Quick Demo Sign-In
              </span>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickSignIn('amaka@example.com')}
                  className="w-full py-2 px-3 rounded-xl bg-[#F6EEE9] hover:bg-[#FFA5D5]/30 border border-[#5B2302]/15 text-xs text-[#5B2302] font-bold text-left flex items-center justify-between transition-colors"
                >
                  <span>Amaka O. (Approved Member)</span>
                  <span className="text-[10px] uppercase font-bold text-[#5B2302]">Sign In &rarr;</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSignIn('chidi@example.com')}
                  className="w-full py-2 px-3 rounded-xl bg-[#F6EEE9] hover:bg-[#FFA5D5]/30 border border-[#5B2302]/15 text-xs text-[#5B2302] font-bold text-left flex items-center justify-between transition-colors"
                >
                  <span>Chidi E. (Approved Member · Online)</span>
                  <span className="text-[10px] uppercase font-bold text-[#5B2302]">Sign In &rarr;</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickSignIn('zainab@readwithgoodcompany.com')}
                  className="w-full py-2 px-3 rounded-xl bg-[#F6EEE9] hover:bg-[#FFA5D5]/30 border border-[#5B2302]/15 text-xs text-[#5B2302] font-bold text-left flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#5B2302]" />
                    Zainab B. (Curator & Admin)
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#5B2302]">Sign In &rarr;</span>
                </button>
              </div>
            </div>

            <div className="text-center pt-2 text-xs text-[#5B2302]/80">
              Not a member yet?{' '}
              <Link
                href="/apply"
                className="font-bold text-[#5B2302] underline underline-offset-4 hover:text-[#3D1600]"
              >
                Apply for membership
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}
