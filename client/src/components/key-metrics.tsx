export function KeyMetrics() {
  const metrics = [
    {
      icon: "fas fa-warehouse",
      value: "1300 м²",
      label: "Площадь помещений",
      testId: "metric-area"
    },
    {
      icon: "fas fa-map-marked-alt",
      value: "2600 м²",
      label: "Земельный участок",
      testId: "metric-land"
    },
    {
      icon: "fas fa-bolt",
      value: "200+ кВт",
      label: "Эл. мощность",
      testId: "metric-power"
    },
    {
      icon: "fas fa-arrows-alt-v",
      value: "9 м",
      label: "Высота потолков",
      testId: "metric-height"
    },
    {
      icon: "fas fa-tools",
      value: "3-5 т",
      label: "Кран-балки",
      testId: "metric-crane"
    },
    {
      icon: "fas fa-tint",
      value: "100%",
      label: "Автономность",
      testId: "metric-autonomy"
    }
  ];

  return (
    <section id="specs" className="py-16 bg-white" data-testid="key-metrics-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="metrics-title">
            Ключевые характеристики
          </h2>
          <p className="text-muted-foreground text-lg" data-testid="metrics-subtitle">
            Все необходимое для запуска производства
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className="bg-card p-6 rounded-lg border text-center hover:shadow-lg transition-shadow animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={metric.testId}
            >
              <i className={`${metric.icon} text-primary text-3xl mb-4`}></i>
              <div className="text-2xl font-bold text-foreground" data-testid={`${metric.testId}-value`}>
                {metric.value}
              </div>
              <div className="text-muted-foreground" data-testid={`${metric.testId}-label`}>
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
