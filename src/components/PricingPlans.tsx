import React from 'react';
import { Check, Crown } from 'lucide-react';

const PricingPlans = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Basic resume analysis',
        'Limited suggestions',
        'Basic templates',
        '1 cover letter per month',
      ],
      buttonText: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$12',
      period: 'per month',
      features: [
        'Advanced AI analysis',
        'Unlimited suggestions',
        'Premium templates',
        'Unlimited cover letters',
        'Priority support',
        'Industry-specific keywords',
      ],
      buttonText: 'Start Pro Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: '$49',
      period: 'per month',
      features: [
        'Everything in Pro',
        'Custom templates',
        'API access',
        'Dedicated support',
        'Team collaboration',
        'Analytics dashboard',
      ],
      buttonText: 'Contact Sales',
      highlighted: false,
    },
  ];

  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl p-8 ${
              plan.highlighted
                ? 'bg-indigo-600 text-white transform scale-105'
                : 'bg-white'
            } shadow-xl`}
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-sm opacity-80">/{plan.period}</span>
              </div>
              <button
                className={`w-full py-2 px-4 rounded-lg transition ${
                  plan.highlighted
                    ? 'bg-white text-indigo-600 hover:bg-gray-100'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
            <div className="mt-8 space-y-4">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PricingPlans;