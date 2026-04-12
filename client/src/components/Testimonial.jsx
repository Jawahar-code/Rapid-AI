import React from 'react'

const Testimonial = () => {
    const row1Data = [
        {
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
            name: 'Amy Smith',
            handle: '@amy_ai',
            date: 'March 20, 2026',
            content: "The AI Article Generator is a lifesaver. I drafted a 2000-word blog post in under 10 minutes. The flow is so natural!"
        },
        {
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
            name: 'Dan Cook',
            handle: '@dan_creates',
            date: 'March 24, 2026',
            content: "I've tried many AI image tools, but Rapid.ai's Image Creator understands complex prompts way better. My workflow is 2x faster."
        },
        {
            image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200',
            name: 'Lisa Ray',
            handle: '@lisa_jobs',
            date: 'March 28, 2026',
            content: "The Resume Analyzer gave me specific keywords I was missing. I got three interview calls the same week I updated my CV!"
        }
    ];

    const row2Data = [
        {
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
            name: 'Mark Bell',
            handle: '@mark_pro',
            date: 'March 15, 2026',
            content: "The Background Remover is pixel-perfect. It handles hair and transparent objects effortlessly. Best tool in my stack."
        },
        {
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
            name: 'Emma Hall',
            handle: '@emma_writes',
            date: 'March 31, 2026',
            content: "Generating blog titles used to be so hard. Now I get 10 great ideas in seconds. Rapid.ai is truly impressive!"
        },
        {
            image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200',
            name: 'Sam West',
            handle: '@sam_tech',
            date: 'April 2, 2026',
            content: "As a developer, I love how clean the UI is. Everything just works exactly how you expect it to. Highly recommended."
        }
    ];

    const CreateCard = ({ card }) => (
        <div className="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
            <div className="flex gap-2 text-left">
                <img className="size-11 rounded-full object-cover" src={card.image} alt="User Image" />
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <p className="font-medium text-slate-900 dark:text-white">{card.name}</p>
                        <svg className="mt-0.5" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.555.72a4 4 0 0 1-.297.24c-.179.12-.38.202-.59.244a4 4 0 0 1-.38.041c-.48.039-.721.058-.922.129a1.63 1.63 0 0 0-.992.992c-.071.2-.09.441-.129.922a4 4 0 0 1-.041.38 1.6 1.6 0 0 1-.245.59 3 3 0 0 1-.239.297c-.313.368-.47.551-.56.743-.213.444-.213.96 0 1.404.09.192.247.375.56.743.125.146.187.219.24.297.12.179.202.38.244.59.018.093.026.189.041.38.039.48.058.721.129.922.163.464.528.829.992.992.2.071.441.09.922.129.191.015.287.023.38.041.21.042.411.125.59.245.078.052.151.114.297.239.368.313.551.47.743.56.444.213.96.213 1.404 0 .192-.09.375-.247.743-.56.146-.125.219-.187.297-.24.179-.12.38-.202.59-.244a4 4 0 0 1 .38-.041c.48-.039.721-.058.922-.129.464-.163.829-.528.992-.992.071-.2.09-.441.129-.922a4 4 0 0 1 .041-.38c.042-.21.125-.411.245-.59.052-.078.114-.151.239-.297.313-.368.47-.551.56-.743.213-.444.213-.96 0-1.404-.09-.192-.247-.375-.56-.743a4 4 0 0 1-.24-.297 1.6 1.6 0 0 1-.244-.59 3 3 0 0 1-.041-.38c-.039-.48-.058-.721-.129-.922a1.63 1.63 0 0 0-.992-.992c-.2-.071-.441-.09-.922-.129a4 4 0 0 1-.38-.041 1.6 1.6 0 0 1-.59-.245A3 3 0 0 1 7.445.72C7.077.407 6.894.25 6.702.16a1.63 1.63 0 0 0-1.404 0c-.192.09-.375.247-.743.56m4.07 3.998a.488.488 0 0 0-.691-.69l-2.91 2.91-.958-.957a.488.488 0 0 0-.69.69l1.302 1.302c.19.191.5.191.69 0z" fill="#2196F3" />
                        </svg>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{card.handle}</span>
                </div>
            </div>
            <p className="text-sm py-4 text-gray-800 dark:text-slate-300 text-left leading-relaxed">"{card.content}"</p>
            <div className="flex items-center justify-between text-slate-500 text-xs uppercase tracking-tight">
                <p>Twitter / X</p>
                <p>{card.date}</p>
            </div>
        </div>
    );

    return (
        <section className="pt-10 pb-20 bg-white dark:bg-slate-900 overflow-hidden text-center transition-colors">
            <style>{`
                @keyframes marqueeScroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .marquee-inner {
                    animation: marqueeScroll 40s linear infinite; /* Slowed down to 40s */
                }
                .marquee-reverse {
                    animation-direction: reverse;
                }
            `}</style>

            <div className="mb-14 px-4">
                <h2 className='text-slate-700 dark:text-white text-[42px] font-semibold mb-3 leading-tight'>Loved by Creators</h2>
                <p className='text-gray-500 dark:text-slate-400 max-w-lg mx-auto'>
                    Don't just take our word for it. Here's what our users are saying about Rapid.ai.
                </p>
            </div>

            {/* Centered container that limits view to 3-4 cards */}
            <div className="max-w-6xl mx-auto">
                {/* Row 1 */}
                <div className="flex overflow-hidden mb-8 relative">
                    <div className="absolute left-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none bg-linear-to-r from-white dark:from-slate-900 to-transparent"></div>
                    <div className="absolute right-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none bg-linear-to-l from-white dark:from-slate-900 to-transparent"></div>
                    
                    <div className="marquee-inner flex min-w-max">
                        {[...row1Data, ...row1Data, ...row1Data].map((card, index) => (
                            <CreateCard key={`r1-${index}`} card={card} />
                        ))}
                    </div>
                </div>

                {/* Row 2 */}
                <div className="flex overflow-hidden relative">
                    <div className="absolute left-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none bg-linear-to-r from-white dark:from-slate-900 to-transparent"></div>
                    <div className="absolute right-0 top-0 h-full w-20 md:w-32 z-10 pointer-events-none bg-linear-to-l from-white dark:from-slate-900 to-transparent"></div>

                    <div className="marquee-inner marquee-reverse flex min-w-max">
                        {[...row2Data, ...row2Data, ...row2Data].map((card, index) => (
                            <CreateCard key={`r2-${index}`} card={card} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Testimonial  