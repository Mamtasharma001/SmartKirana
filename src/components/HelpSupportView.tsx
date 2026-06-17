/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, X, Search, ChevronDown, ChevronUp, BookOpen, MessageSquare, PhoneCall, CheckCircle } from 'lucide-react';
import { MOCK_FAQS } from '../data';

interface HelpSupportViewProps {
  onClose: () => void;
}

export const HelpSupportView: React.FC<HelpSupportViewProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First expanded by default
  const [raisedTicket, setRaisedTicket] = useState(false);
  const [ticketMessage, setTicketMessage] = useState('');

  const displayFaqs = MOCK_FAQS.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketMessage) return;
    setRaisedTicket(true);
    setTimeout(() => {
      setTicketMessage('');
      setRaisedTicket(false);
      alert("✅ Help ticket created! A SmartKirana technical agent will reach you on your WhatsApp mobile within 15 mins.");
    }, 2000);
  };

  return (
    <div className="absolute inset-0 bg-white z-[150] flex flex-col overflow-hidden animate-fade-in select-none">
      
      {/* Colorful Header Section */}
      <div className="bg-blue-600 text-white px-5 py-4 shadow-sm flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <HelpCircle size={18} className="text-emerald-300" />
          <div>
            <h2 className="text-base font-extrabold tracking-tight">Help Desk & Guides</h2>
            <p className="text-[9.5px] text-blue-100">Resolve issue, look-up guide, raise ticket</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 bg-blue-700 rounded-full text-white cursor-pointer"
        >
          <X size={15} />
        </button>
      </div>

      {/* Main Help Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
        
        {/* Lookup search bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search FAQs, features, checkout limits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl outline-none font-semibold text-slate-800 pr-8"
          />
          <Search size={14} className="absolute right-3 top-3 text-slate-400" />
        </div>

        {/* FAQs Accordion items */}
        <div className="bg-white rounded-2xl border border-slate-150 p-3 space-y-2 shadow-xs">
          <div className="flex items-center gap-1.5 pb-2 border-b border-slate-50 mb-2">
            <BookOpen size={13} className="text-blue-500" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Frequently Asked Questions</h3>
          </div>

          {displayFaqs.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No results match your lookup keywords</p>
          ) : (
            displayFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className="border border-slate-50 rounded-xl overflow-hidden shadow-2xs">
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full py-3 px-3 bg-slate-50/50 hover:bg-slate-50 text-left flex justify-between items-center transition-colors cursor-pointer text-xs font-extrabold text-slate-700"
                  >
                    <span className="leading-snug pr-4">{faq.question}</span>
                    {isOpen ? <ChevronUp size={14} className="text-slate-500 shrink-0" /> : <ChevronDown size={14} className="text-slate-500 shrink-0" />}
                  </button>
                  
                  {isOpen && (
                    <div className="p-3 text-[11px] leading-snug text-slate-500 bg-white border-t border-slate-50">
                      <span className="text-[8.5px] uppercase bg-blue-50 text-blue-700 font-extrabold px-1.5 py-0.2 rounded mb-1.5 inline-block">
                        {faq.category}
                      </span>
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Support ticket submission form */}
        <div className="bg-white border border-slate-150 p-4 rounded-2xl shadow-xs">
          <div className="flex items-start gap-3 mb-3.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
              <MessageSquare size={16} />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide leading-tight">Need 1-on-1 Assistance?</h4>
              <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Submit a summary description here. We will WhatsApp push coordinates immediately!</p>
            </div>
          </div>

          {raisedTicket ? (
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-center text-xs font-semibold animate-pulse border border-emerald-100 flex flex-col items-center gap-1">
              <CheckCircle size={20} className="text-emerald-500" />
              <span>Registering support ticket with system coordinates...</span>
            </div>
          ) : (
            <form onSubmit={handleSupportTicket} className="space-y-2.5">
              <textarea
                placeholder="Describe your issue here... e.g. Billing totals do not sum properly, low stock notification delay..."
                required
                rows={3}
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-150 rounded-xl focus:bg-white outline-none text-slate-700 font-semibold"
              />
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 rounded-xl transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
              >
                <PhoneCall size={12} />
                <span>Submit Ticket for WhatsApp Support</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
