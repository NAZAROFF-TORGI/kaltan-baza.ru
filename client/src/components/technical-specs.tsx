export function TechnicalSpecs() {
  const specifications = [
    {
      title: "Конструктив",
      icon: "fas fa-building",
      items: [
        "• Фундамент на сваях",
        "• Железобетонные перекрытия",
        "• Кирпичные стены",
        "• Бетонные полы"
      ],
      testId: "construction"
    },
    {
      title: "Отопление",
      icon: "fas fa-fire",
      items: [
        "• Автономная угольная котельная",
        "• Полная независимость",
        "• Экономичность эксплуатации",
        "• Надежность в любой сезон"
      ],
      testId: "heating"
    },
    {
      title: "Водоснабжение",
      icon: "fas fa-tint",
      items: [
        "• Собственная скважина",
        "• Постоянный водозабор",
        "• Техническая и питьевая вода",
        "• Независимость от сетей"
      ],
      testId: "water"
    },
    {
      title: "Безопасность",
      icon: "fas fa-shield-alt",
      items: [
        "• Видеонаблюдение по периметру",
        "• Внутренние камеры",
        "• Контроль доступа",
        "• Охранная сигнализация"
      ],
      testId: "security"
    }
  ];

  return (
    <section className="py-16 bg-muted" data-testid="technical-specs-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="specs-title">
            Технические характеристики
          </h2>
          <p className="text-muted-foreground text-lg" data-testid="specs-subtitle">
            Детальная информация о конструкции и оборудовании
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specifications.map((spec, index) => (
            <div 
              key={index}
              className="bg-card p-6 rounded-lg border hover:shadow-lg transition-shadow"
              data-testid={`spec-${spec.testId}`}
            >
              <h3 className="font-semibold text-lg mb-4 flex items-center" data-testid={`spec-${spec.testId}-title`}>
                <i className={`${spec.icon} text-primary mr-3`}></i>
                {spec.title}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground" data-testid={`spec-${spec.testId}-list`}>
                {spec.items.map((item, itemIndex) => (
                  <li key={itemIndex} data-testid={`spec-${spec.testId}-item-${itemIndex}`}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
