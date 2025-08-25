import { ImageWithFallback } from "./figma/ImageWithFallback";

export function LifestyleEditorial() {
  const editorialImages = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1584216338898-f34d78201414?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHN0cmVldCUyMHN0eWxlJTIwZmFzaGlvbiUyMGVkaXRvcmlhbHxlbnwxfHx8fDE3NTU5Mzg1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      text: "For the Hustlers.",
      subtext: "Those who grind in silence"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1648249895357-51185b5c4d8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBwaG90b2dyYXBoeSUyMGJsYWNrJTIwd2hpdGUlMjB5b3V0aHxlbnwxfHx8fDE3NTU5Mzg1NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      text: "For the Dreamers.",
      subtext: "Who see beyond the present"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1736712957897-b54ce0bbfdee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZWRpdG9yaWFsJTIwbW9kZWwlMjBzdHJlZXQlMjBzdHlsZXxlbnwxfHx8fDE3NTU4OTUzMTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      text: "For Home.",
      subtext: "Never forget where you came from"
    }
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="text-center mb-12 px-6 pt-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Lifestyle</h2>
          <p className="text-xl text-gray-600">A movement, not just a brand</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          {editorialImages.map((item, index) => (
            <div
              key={item.id}
              className="relative aspect-[4/5] overflow-hidden group cursor-pointer"
            >
              <ImageWithFallback
                src={item.image}
                alt={`Editorial ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 transition-opacity duration-500 group-hover:bg-black/40"></div>

              {/* Text overlay */}
              <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
                <div className="transform transition-transform duration-500 group-hover:scale-105">
                  <h3 className="text-3xl lg:text-4xl font-bold mb-2 tracking-tight">
                    {item.text}
                  </h3>
                  <p className="text-sm lg:text-base opacity-90 font-light tracking-wide">
                    {item.subtext}
                  </p>
                </div>
              </div>

              {/* Decorative line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          ))}
        </div>

        {/* Padding bottom */}
        <div className="pb-12"></div>
      </div>
    </section>
  );
}
