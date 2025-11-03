import React, { useState } from "react";

const FeaturedOpportunities = () => {
    const [formData, setFormData] = useState({
        name: '',
        message: ''
    });

    const steps = [
        {
            icon: "fa-user",
            name: "Register",
            color: "bg-amber-100 text-amber-700",
            desc: "Create your account"
        },
        {
            icon: "fa-file-alt",
            name: "KYC",
            color: "bg-pink-100 text-pink-700",
            desc: "Complete verification"
        },
        {
            icon: "fa-chart-bar",
            name: "Analyze",
            color: "bg-blue-100 text-blue-700",
            desc: "Review opportunities"
        },
        {
            icon: "fa-handshake",
            name: "Invest",
            color: "bg-green-100 text-green-700",
            desc: "Start your investment journey"
        }
    ];

    const opportunities = [
        {
            title: "Luxury Apartments",
            desc: "Invest in premium real estate starting from just ₹25 Lakhs.",
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop",
            color: "bg-blue-50"
        },
        {
            title: "AgriTech Harvesters",
            desc: "Early-stage funding opportunity for AI-driven agriculture startups.",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop",
            color: "bg-pink-50"
        },
        {
            title: "AgriTech Estate",
            desc: "Fractional investment available for AgriTech project — Unit A1.",
            image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=250&fit=crop",
            color: "bg-amber-50"
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Thank you for your interest! We will contact you soon.');
        setFormData({ name: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-t-2xl p-6 md:p-8 flex justify-between items-center shadow-lg">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">Featured Opportunities</h1>

                </div>

                {/* Main Content */}
                <div className="bg-white rounded-b-2xl shadow-xl overflow-hidden">
                    <div className="grid lg:grid-cols-3 gap-8 p-6 md:p-8">
                        {/* Left Section - Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* How It Works */}
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 mb-2">How It Works</h2>
                                <p className="text-slate-600 mb-6">
                                    Want to explore investment options?<br />
                                    Fill out the quick form to get started.
                                </p>

                                {/* Steps Flow */}
                                <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-8 mb-4 shadow-sm">
                                    <div className="relative">
                                        {/* Connection Line */}
                                        <div className="absolute top-8 md:top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-200" style={{ width: 'calc(100% - 60px)', left: '30px', maxWidth: 'calc(100% - 80px)', marginLeft: '40px' }}></div>

                                        <div className="grid grid-cols-4 gap-2 md:gap-6 relative">
                                            {steps.map((step, index) => (
                                                <div key={index} className="flex flex-col items-center gap-2 md:gap-3">
                                                    <div className="relative">
                                                        <div className={`w-16 h-16 md:w-24 md:h-24 rounded-xl md:rounded-2xl ${step.color} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative z-10`}>
                                                            <i className={`fas ${step.icon} text-xl md:text-3xl`}></i>
                                                        </div>
                                                        <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-8 md:h-8 bg-white border-2 border-slate-800 rounded-full flex items-center justify-center font-bold text-xs md:text-sm text-slate-800 shadow-md z-20">
                                                            {index + 1}
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="font-bold text-slate-800 text-xs md:text-sm mb-0.5 md:mb-1">{step.name}</p>
                                                        <p className="text-[10px] md:text-xs text-slate-500 leading-tight hidden md:block">
                                                            {step.desc}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-slate-200">
                                        <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <i className="fas fa-credit-card text-base md:text-lg"></i>
                                                <span className="text-xs md:text-sm font-medium">Accepted Payments:</span>
                                            </div>
                                            <span className="text-[10px] md:text-xs text-slate-500">UPI • Cards • Net Banking • Wallets</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Opportunities Grid */}
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-4">Investment Options</h3>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {opportunities.map((item, index) => (
                                        <div key={index} className={`${item.color} rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer`}>
                                            <div className="relative h-40 overflow-hidden">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-bold text-slate-800 mb-2">{item.title}</h4>
                                                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Enquiry Form */}
                        <div className="lg:col-span-1">
                            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-lg sticky top-8">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <i className="fas fa-envelope"></i>
                                    Quick Enquiry
                                </h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Your Name"
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <textarea
                                            placeholder="Your Message"
                                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none"
                                            rows="4"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-white text-slate-800 font-semibold py-3 rounded-lg hover:bg-slate-100 transition-all transform hover:scale-105 active:scale-95 shadow-md"
                                    >
                                        Submit Enquiry
                                    </button>
                                </form>
                                <p className="text-xs text-white/60 mt-4 text-center">
                                    <i className="fas fa-shield-alt mr-1"></i>
                                    Your information is secure and confidential
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedOpportunities;