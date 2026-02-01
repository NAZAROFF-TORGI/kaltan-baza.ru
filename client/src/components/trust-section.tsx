import { Button } from "@/components/ui/button";
import { DocumentDownloadModal } from "./document-download-modal";

interface TrustSectionProps {
  onDocumentDownload: (document: string) => void;
}

export function TrustSection({ onDocumentDownload }: TrustSectionProps) {
  const trustFeatures = [
    {
      icon: "fas fa-handshake",
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      title: "Прямая продажа от собственника",
      description: "Никаких посредников и комиссий. Работаем напрямую с покупателем для максимально выгодных условий.",
      testId: "direct-sale"
    },
    {
      icon: "fas fa-file-contract",
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      title: "Полный пакет документов",
      description: "Все документы готовы к сделке. Выписка из ЕГРН, технический паспорт, разрешения.",
      testId: "documents"
    },
    {
      icon: "fas fa-certificate",
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
      title: "Юридическая чистота",
      description: "Объект не обременен долгами, спорами или арестами. Гарантируем безопасную сделку.",
      testId: "legal-clean"
    }
  ];

  const documents = [
    {
      title: "Выписка из ЕГРН",
      subtitle: "Актуальная от 22.03.2022",
      filename: "egrn-excerpt",
      testId: "egrn-document"
    },
    {
      title: "Технический паспорт",
      subtitle: "С экспликацией помещений",
      filename: "technical-passport",
      testId: "tech-passport"
    },
    {
      title: "Планировки объекта",
      subtitle: "Детальные чертежи",
      filename: "floor-plans",
      testId: "floor-plans"
    }
  ];

  return (
    <section className="py-16 bg-white" data-testid="trust-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="trust-title">
            Гарантия надежности
          </h2>
          <p className="text-muted-foreground text-lg" data-testid="trust-subtitle">
            Прямая продажа от собственника с полным пакетом документов
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {trustFeatures.map((feature, index) => (
              <div 
                key={index}
                className="flex items-start space-x-4"
                data-testid={feature.testId}
              >
                <div className={`${feature.bgColor} p-3 rounded-full`}>
                  <i className={`${feature.icon} ${feature.iconColor} text-xl`}></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2" data-testid={`${feature.testId}-title`}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground" data-testid={`${feature.testId}-description`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4" data-testid="documents-title">
              Официальные документы для скачивания
            </h3>
            
            {documents.map((doc, index) => (
              <DocumentDownloadModal
                key={index}
                documentType={doc.filename}
                documentTitle={doc.title}
                triggerClassName="w-full"
              >
                <Button
                  variant="outline"
                  className="w-full p-4 h-auto justify-between hover:shadow-md transition-shadow"
                  data-testid={doc.testId}
                >
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-file-pdf text-red-500 text-2xl"></i>
                    <div className="text-left">
                      <div className="font-medium" data-testid={`${doc.testId}-title`}>
                        {doc.title}
                      </div>
                      <div className="text-sm text-muted-foreground" data-testid={`${doc.testId}-subtitle`}>
                        {doc.subtitle}
                      </div>
                    </div>
                  </div>
                  <i className="fas fa-download text-primary"></i>
                </Button>
              </DocumentDownloadModal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
