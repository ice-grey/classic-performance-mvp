
import React from 'react';
import { SubscriptionTier } from '../types';
import { Check, Crown, Music, Zap, Archive, Headphones } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: () => void;
  currentTier: SubscriptionTier;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan, currentTier }) => {
  const plans = [
    {
      name: 'Free Enthusiast',
      price: '$0',
      description: 'The essentials for every music lover.',
      features: ['Daily recommendation', 'Basic YouTube links', '7-day archive history', 'Standard program notes'],
      button: 'Current Plan',
      tier: SubscriptionTier.FREE,
      highlight: false
    },
    {
      name: 'Premium Connoisseur',
      price: '$4.99',
      period: '/month',
      description: 'An immersive experience for the true listener.',
      features: ['FLAC Hi-Fi streaming links', 'Full 365-day archive access', 'In-depth historical analysis', 'Printable PDF program notes', 'Offline reading mode', 'No advertisement'],
      button: 'Upgrade to Premium',
      tier: SubscriptionTier.PREMIUM,
      highlight: true
    }
  ];

  return (
    <div className="py-12 animate-in fade-in duration-1000">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-4 font-bold">Choose Your Journey</h2>
        <p className="text-stone-400 text-lg italic serif">Support the curation of art and history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`relative p-8 md:p-10 rounded-[2.5rem] flex flex-col transition-all duration-500 hover:scale-[1.02]
              ${plan.highlight 
                ? 'bg-stone-900 text-white shadow-2xl ring-4 ring-[#9A84A1]/20' 
                : 'bg-white border border-stone-100 text-stone-900 shadow-xl'}`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#9A84A1] text-white px-6 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className={`text-2xl font-bold mb-2 ${plan.highlight ? 'text-[#9A84A1]' : 'text-stone-900'}`}>{plan.name}</h3>
              <div className="flex items-baseline space-x-1">
                <span className="text-5xl font-black">{plan.price}</span>
                <span className="text-lg opacity-60 font-medium">{plan.period}</span>
              </div>
              <p className={`mt-4 text-sm leading-relaxed ${plan.highlight ? 'text-white/60' : 'text-stone-500'}`}>
                {plan.description}
              </p>
            </div>

            <ul className="flex-grow space-y-4 mb-10">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start text-sm font-medium">
                  <Check className={`w-5 h-5 mr-3 flex-shrink-0 ${plan.highlight ? 'text-[#9A84A1]' : 'text-[#9A84A1]'}`} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => plan.tier === SubscriptionTier.PREMIUM && onSelectPlan()}
              disabled={currentTier === plan.tier}
              className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-lg active:scale-95
                ${plan.highlight 
                  ? 'bg-[#9A84A1] text-white hover:bg-white hover:text-stone-900' 
                  : 'bg-stone-100 text-stone-900 hover:bg-stone-200 disabled:opacity-50'}`}
            >
              {currentTier === plan.tier ? 'Current Membership' : plan.button}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-20 max-w-2xl mx-auto text-center space-y-8 bg-stone-50 p-12 rounded-[2rem] border border-stone-100">
        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-stone-400">THE PREMIUM ADVANTAGES</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-2">
            <Headphones className="w-6 h-6 mx-auto text-[#9A84A1]" />
            <p className="text-[10px] font-bold uppercase text-stone-400">Hi-Fi Audio</p>
          </div>
          <div className="space-y-2">
            <Archive className="w-6 h-6 mx-auto text-[#9A84A1]" />
            <p className="text-[10px] font-bold uppercase text-stone-400">Archive</p>
          </div>
          <div className="space-y-2">
            <Music className="w-6 h-6 mx-auto text-[#9A84A1]" />
            <p className="text-[10px] font-bold uppercase text-stone-400">Curated</p>
          </div>
          <div className="space-y-2">
            <Zap className="w-6 h-6 mx-auto text-[#9A84A1]" />
            <p className="text-[10px] font-bold uppercase text-stone-400">No Ads</p>
          </div>
        </div>
      </div>
    </div>
  );
};