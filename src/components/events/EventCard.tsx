'use client';

import React from 'react';
import Link from 'next/link';
import { Event, RSVPStatus } from '@/types';
import { useApp } from '@/lib/store/app-context';
import { Calendar, Clock, MapPin, Video, Check, HelpCircle, X, ExternalLink, CalendarPlus } from 'lucide-react';

interface EventCardProps {
  event: Event;
  detailed?: boolean;
}

export function EventCard({ event, detailed = false }: EventCardProps) {
  const { currentUser, setRSVP, getEventRSVP, getEventAttendees } = useApp();
  const currentRSVP = getEventRSVP(event.id);
  const attendees = getEventAttendees(event.id);

  const formatBadges: Record<string, { bg: string; text: string; label: string }> = {
    Abuja: { bg: 'bg-[#FFA5D5] border-[#5B2302]/30', text: 'text-[#5B2302]', label: 'Gathering' },
    Online: { bg: 'bg-[#F6EEE9] border-[#5B2302]/20', text: 'text-[#5B2302]', label: 'Online' },
    Hybrid: { bg: 'bg-[#FFA5D5] border-[#5B2302]/30', text: 'text-[#5B2302]', label: 'In-Person & Stream' },
  };

  const badgeStyle = formatBadges[event.format] || formatBadges.Hybrid;

  // Add to Calendar helper
  const handleCalendarExport = () => {
    const title = encodeURIComponent(`Good Company: ${event.title}`);
    const details = encodeURIComponent(`${event.description}\n\nVenue: ${event.venue}`);
    const location = encodeURIComponent(event.venue);
    
    // Format YYYYMMDDTHHMMSS
    const eventDateClean = event.event_date.replace(/-/g, '');
    const startClean = event.start_time.replace(':', '') + '00';
    const endClean = event.end_time.replace(':', '') + '00';
    const dates = `${eventDateClean}T${startClean}/${eventDateClean}T${endClean}`;
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    window.open(googleUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="editorial-card rounded-2xl p-6 flex flex-col justify-between h-full relative border-2 border-[#5B2302] bg-[#FFFCF7]">
      <div>
        {/* Header tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B2302] font-body">
            {event.event_type}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border font-body ${badgeStyle.bg} ${badgeStyle.text}`}
          >
            {badgeStyle.label}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-block uppercase text-lg sm:text-xl text-[#5B2302] mb-2 leading-tight">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#5B2302]/85 leading-relaxed mb-4 font-body font-medium">
          {event.description}
        </p>

        {/* Date, Time, Venue */}
        <div className="space-y-2 py-3 border-y border-[#5B2302]/15 text-xs text-[#5B2302]/85 mb-4 font-body">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#5B2302] shrink-0" />
            <span className="font-bold">
              {new Date(event.event_date + 'T00:00:00').toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#5B2302] shrink-0" />
            <span>
              {event.start_time} – {event.end_time} ({event.timezone || 'WAT'})
            </span>
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-[#5B2302] shrink-0 mt-0.5" />
            <span>{event.venue}</span>
          </div>

          {/* Private Online Link */}
          {currentUser && (currentRSVP === 'going' || currentRSVP === 'maybe') && event.private_online_link && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-[#FFA5D5]/20 border border-[#FFA5D5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-[#5B2302]" />
                <span className="font-bold text-[#5B2302]">Member Link:</span>
              </div>
              <a
                href={event.private_online_link}
                target="_blank"
                rel="noreferrer"
                className="font-extrabold text-xs text-[#5B2302] underline hover:text-[#3D1600] flex items-center gap-1 uppercase"
              >
                Join Room <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* RSVP Section */}
      <div>
        {currentUser ? (
          <div className="space-y-3 font-body">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#5B2302]">Your RSVP Status:</span>
              <button
                type="button"
                onClick={handleCalendarExport}
                className="text-[11px] text-[#5B2302] hover:underline flex items-center gap-1 font-bold uppercase"
              >
                <CalendarPlus className="w-3.5 h-3.5" /> Add to Calendar
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setRSVP(event.id, 'going')}
                className={`py-2 px-2 text-xs rounded-xl font-extrabold uppercase border transition-all flex items-center justify-center gap-1 ${
                  currentRSVP === 'going'
                    ? 'bg-[#5B2302] text-[#F6EEE9] border-[#5B2302]'
                    : 'bg-[#FFFCF7] text-[#5B2302] border-[#5B2302]/30 hover:bg-[#F6EEE9]'
                }`}
              >
                <Check className="w-3.5 h-3.5" /> Going
              </button>
              <button
                type="button"
                onClick={() => setRSVP(event.id, 'maybe')}
                className={`py-2 px-2 text-xs rounded-xl font-extrabold uppercase border transition-all flex items-center justify-center gap-1 ${
                  currentRSVP === 'maybe'
                    ? 'bg-[#FFA5D5] text-[#5B2302] border-[#5B2302]'
                    : 'bg-[#FFFCF7] text-[#5B2302] border-[#5B2302]/30 hover:bg-[#F6EEE9]'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" /> Maybe
              </button>
              <button
                type="button"
                onClick={() => setRSVP(event.id, 'not_going')}
                className={`py-2 px-2 text-xs rounded-xl font-extrabold uppercase border transition-all flex items-center justify-center gap-1 ${
                  currentRSVP === 'not_going'
                    ? 'bg-stone-300 text-stone-800 border-stone-400'
                    : 'bg-[#FFFCF7] text-[#5B2302] border-[#5B2302]/30 hover:bg-[#F6EEE9]'
                }`}
              >
                <X className="w-3.5 h-3.5" /> Pass
              </button>
            </div>

            <p className="text-[11px] text-[#5B2302]/70 text-center font-bold">
              {attendees.going.length} confirmed reader{attendees.going.length === 1 ? '' : 's'} attending
            </p>
          </div>
        ) : (
          <div className="bg-[#F6EEE9] p-3 rounded-xl border border-[#5B2302]/20 text-center font-body">
            <p className="text-xs text-[#5B2302]/85 mb-2">
              RSVP and private discussion links are reserved for approved members.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/apply"
                className="text-xs font-bold text-[#5B2302] underline underline-offset-2 hover:text-[#3D1600] uppercase"
              >
                Apply to Join
              </Link>
              <span className="text-[#5B2302]/30">·</span>
              <Link
                href="/login"
                className="text-xs font-bold text-[#5B2302]/70 hover:text-[#5B2302] uppercase"
              >
                Member Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
