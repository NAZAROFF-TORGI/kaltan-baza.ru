import { YandexMap } from "./yandex-map";

export function LocationSection() {
  const transportationFeatures = [
    "15 мин до федеральной трассы М53",
    "5 мин до ж/д станции Калтан",
    "Прямые подъездные пути"
  ];

  const industrialNeighbors = [
    { name: "ЮК ГРЭС", distance: "3 км", icon: "fas fa-bolt" },
    { name: "Разрез Калтанский угольный", distance: "2 км", icon: "fas fa-mountain" },
    { name: "Шахта Тайлепская", distance: "5 км", icon: "fas fa-hard-hat" },
    { name: "Разрез Корчакольский", distance: "7 км", icon: "fas fa-industry" }
  ];

  return (
    <section id="location" className="py-16 bg-white" data-testid="location-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="location-title">
            Стратегическое расположение
          </h2>
          <p className="text-muted-foreground text-lg" data-testid="location-subtitle">
            В центре промышленного кластера Кузбасса
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            {/* Yandex Interactive Map */}
            <YandexMap />
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center" data-testid="transportation-title">
                <i className="fas fa-road text-primary mr-3"></i>
                Транспортная доступность
              </h3>
              <ul className="space-y-2 text-muted-foreground" data-testid="transportation-list">
                {transportationFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center" data-testid={`transport-feature-${index}`}>
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center" data-testid="neighbors-title">
                <i className="fas fa-industry text-primary mr-3"></i>
                Промышленные соседи
              </h3>
              <ul className="space-y-2 text-muted-foreground" data-testid="neighbors-list">
                {industrialNeighbors.map((neighbor, index) => (
                  <li key={index} className="flex items-center" data-testid={`neighbor-${index}`}>
                    <i className={`${neighbor.icon} text-primary mr-2`}></i>
                    {neighbor.name} - {neighbor.distance}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-accent/10 p-6 rounded-lg border border-accent/20" data-testid="strategic-advantage">
              <h4 className="font-semibold text-accent mb-2">Стратегическое преимущество</h4>
              <p className="text-sm text-muted-foreground">
                Расположение в центре крупнейшего угольного кластера России обеспечивает постоянный поток потенциальных клиентов и партнеров
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}