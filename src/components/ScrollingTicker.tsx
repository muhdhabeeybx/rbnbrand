export function ScrollingTicker() {
  const messages = [
    "Minimal. Bold. Rooted in Home.",
    "Rain by Nurain", 
    "Left Home to Feed Home",
    "For the Hustlers. For the Dreamers.",
    "Wear the Movement."
  ];

  return (
    <div className="bg-black text-white py-3 overflow-hidden">
      <div className="whitespace-nowrap animate-marquee">
        <div className="inline-flex items-center space-x-8">
          {/* Repeat messages for continuous scroll */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="inline-flex items-center space-x-8">
              {messages.map((message, index) => (
                <span key={index} className="text-sm font-medium tracking-wide">
                  {message} // 
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        `
      }} />
    </div>
  );
}