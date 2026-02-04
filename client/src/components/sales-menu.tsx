export function SalesMenu() {
  const menuItems = [
    {
      icon: "🏗",
      title: "КУПИТЬ",
      description: "Готовый арендный бизнес",
      accent: true,
    },
    {
      icon: "📦",
      title: "ОТВЕТ. ХРАНЕНИЕ",
      description: "Складские услуги",
      accent: false,
    },
    {
      icon: "🤝",
      title: "АРЕНДА",
      description: "Производство и гараж спецтехники",
      accent: false,
    },
    {
      icon: "💼",
      title: "ПАРТНЕРСТВО",
      description: "Инвестиции и доли",
      accent: false,
    },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                item.accent
                  ? "border-2 border-amber-500 ring-2 ring-amber-100"
                  : "border border-gray-200"
              }`}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3
                className={`text-lg font-bold mb-2 ${
                  item.accent ? "text-amber-600" : "text-slate-800"
                }`}
              >
                {item.title}
              </h3>
              <p className="text-slate-600 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
