import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SafeIcon from "../components/common/SafeIcon";
import * as FiIcons from "react-icons/fi";

const { FiCheck, FiX, FiBarChart3, FiArrowRight } = FiIcons;

const pricingPlans = [
  {
    name: "Starter",
    // store base prices in EUR as numbers for conversion
    priceEUR: 0,
    period: "forever",
    description: "Perfect for individuals getting started with data analytics",
    features: [
      "Up to 3 data sources",
      "10 AI queries per month",
      "Basic visualizations",
      "Email support",
      "1GB data storage",
      "Standard connectors",
    ],
    limitations: [
      "No advanced analytics",
      "No team collaboration",
      "No API access",
      "No custom reports",
    ],
    popular: false,
    color: "gray",
  },
  {
    name: "Business",
    priceEUR: 500,
    period: "per month",
    description: "Ideal for growing teams and businesses",
    features: [
      "Unlimited data sources",
      "1000 AI queries per month",
      "Advanced visualizations",
      "Priority support",
      "50GB data storage",
      "All connectors included",
      "Team collaboration",
      "Custom dashboards",
      "Scheduled reports",
      "Advanced analytics",
    ],
    limitations: ["No API access", "Limited customization"],
    popular: true,
    color: "primary",
  },
  {
    name: "Enterprise",
    priceEUR: 1500,
    period: "per month",
    description: "Complete solution for large organizations",
    features: [
      "Everything in Business",
      "Unlimited AI queries",
      "White-label solution",
      "Dedicated support",
      "Unlimited data storage",
      "Full API access",
      "Custom integrations",
      "Advanced security",
      "SLA guarantees",
      "Training & onboarding",
      "Custom development",
    ],
    limitations: [],
    popular: false,
    color: "secondary",
  },
];

const Pricing = () => {
  const [currency, setCurrency] = useState("EUR");
  const [eurToNgn, setEurToNgn] = useState(null);
  const [loadingCurrency, setLoadingCurrency] = useState(true);
  const FALLBACK_EUR_TO_NGN = 1500; // fallback rate for approximate display if providers fail

  useEffect(() => {
    // detect user country by IP and fetch EUR->NGN rate if in Nigeria
    // also support a `forceCountry` query param for testing (e.g. ?forceCountry=NG)
    const detectCurrency = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const forced = params.get("forceCountry");
        if (forced) {
          const f = forced.toString().toUpperCase();
          if (f === "NG" || f === "NGN" || f === "NIGERIA") {
            setCurrency("NGN");
            try {
              let rate = null;
              try {
                const rateRes = await fetch(
                  "https://api.exchangerate.host/latest?base=EUR&symbols=NGN"
                );
                if (rateRes.ok) {
                  const rateJson = await rateRes.json();
                  rate = rateJson?.rates?.NGN ?? null;
                  console.log("Rate from exchangerate.host (forced):", rate);
                }
              } catch (err) {
                console.warn("Primary rate provider failed (forced)", err);
              }
              if (!rate) {
                try {
                  const r2 = await fetch(
                    "https://open.er-api.com/v6/latest/EUR"
                  );
                  if (r2.ok) {
                    const r2j = await r2.json();
                    rate = r2j?.rates?.NGN ?? null;
                    console.log("Rate from open.er-api (forced):", rate);
                  }
                } catch (err) {
                  console.warn("Fallback rate provider failed (forced)", err);
                }
              }
              if (rate) setEurToNgn(rate);
              else console.warn("No exchange rate available (forced)");
            } catch (err) {
              console.error("Failed to fetch exchange rate (forced)", err);
            }
            setLoadingCurrency(false);
            console.log("Currency forced to NGN via query param");
            return;
          }
        }

        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("Geo lookup failed");
        const data = await res.json();
        const countryCode = (data.country_code || "").toString().toUpperCase();
        const countryName = (data.country || "").toString().toLowerCase();
        // accept either ISO country code or country name
        if (countryCode === "NG" || countryName === "nigeria") {
          setCurrency("NGN");
          try {
            let rate = null;
            try {
              const rateRes = await fetch(
                "https://api.exchangerate.host/latest?base=EUR&symbols=NGN"
              );
              if (rateRes.ok) {
                const rateJson = await rateRes.json();
                rate = rateJson?.rates?.NGN ?? null;
                console.log("Rate from exchangerate.host:", rate);
              }
            } catch (err) {
              console.warn("Primary rate provider failed", err);
            }
            if (!rate) {
              try {
                const r2 = await fetch("https://open.er-api.com/v6/latest/EUR");
                if (r2.ok) {
                  const r2j = await r2.json();
                  rate = r2j?.rates?.NGN ?? null;
                  console.log("Rate from open.er-api:", rate);
                }
              } catch (err) {
                console.warn("Fallback rate provider failed", err);
              }
            }
            if (rate) setEurToNgn(rate);
            else console.warn("No exchange rate available");
          } catch (err) {
            console.error("Failed to fetch exchange rate", err);
          }
        } else {
          setCurrency("EUR");
        }
        console.log("Geo lookup result:", data);
      } catch (err) {
        console.error("Currency detection failed", err);
        setCurrency("EUR");
      } finally {
        setLoadingCurrency(false);
      }
    };

    detectCurrency();
  }, []);

  const formatPrice = (priceEur) => {
    // priceEur is a number
    if (currency === "NGN") {
      const rateUsed = eurToNgn ?? FALLBACK_EUR_TO_NGN;
      const ngnAmount = Math.round(priceEur * rateUsed);
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0,
      }).format(ngnAmount);
      if (!eurToNgn) {
        // indicate approximate amount when using fallback
        return `${formatted} (approx)`;
      }
      return formatted;
    }

    // default: show EUR
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(priceEur);
  };

  const displayPriceOrLoading = (priceEur) => {
    if (loadingCurrency) {
      // show EUR immediately while detecting to avoid empty UI
      return new Intl.NumberFormat("en-IE", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(priceEur);
    }
    return formatPrice(priceEur);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-900 dark:to-dark-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1751484427009-Datafys_Logo_-_Black_Font_Transparent-removebg-preview%20-%20Copy.png"
                alt="Datafy Logo"
                className="h-8 w-auto object-contain"
              />
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Simple, Transparent
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-400">
                Pricing
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Choose the perfect plan for your data analytics needs. Start free
              and scale as you grow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-white dark:bg-dark-800 rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
                  plan.popular
                    ? "border-primary-500 dark:border-primary-400"
                    : "border-gray-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-600"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {plan.description}
                    </p>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {displayPriceOrLoading(plan.priceEUR)}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300 ml-2">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center space-x-3"
                      >
                        <SafeIcon
                          icon={FiCheck}
                          className="w-5 h-5 text-green-500 flex-shrink-0"
                        />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation) => (
                      <div
                        key={limitation}
                        className="flex items-center space-x-3"
                      >
                        <SafeIcon
                          icon={FiX}
                          className="w-5 h-5 text-gray-400 flex-shrink-0"
                        />
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Link
                    to="/signup"
                    className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                      plan.popular
                        ? "bg-gradient-to-r from-primary-500 to-secondary-400 text-white hover:shadow-lg"
                        : "bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-dark-600"
                    }`}
                  >
                    <span>Get Started</span>
                    <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-dark-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to know about Datafy pricing
            </p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                question: "Can I switch plans at any time?",
                answer:
                  "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept all major credit cards, PayPal, and bank transfers for Enterprise customers.",
              },
              {
                question: "Is there a free trial?",
                answer:
                  "Yes, our Starter plan is free forever. You can also try Business or Enterprise features with a 14-day free trial.",
              },
              {
                question: "What happens to my data if I cancel?",
                answer:
                  "Your data remains accessible for 30 days after cancellation. You can export your data during this period.",
              },
              {
                question: "Do you offer custom enterprise solutions?",
                answer:
                  "Yes, we offer custom solutions for large enterprises. Contact our sales team to discuss your specific requirements.",
              },
            ].map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of companies using Datafy to make data-driven
              decisions
            </p>
            <Link
              to="/signup"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-all duration-200 inline-flex items-center space-x-2"
            >
              <span>Start Free Trial</span>
              <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
