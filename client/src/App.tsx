import { Component, ErrorInfo, ReactNode } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import IndustrialLanding from "@/pages/industrial-landing";
import { LeadsDashboard } from "@/pages/leads-dashboard";
import PrivacyPolicy from "@/pages/privacy-policy";
import UserAgreement from "@/pages/user-agreement";
import NotFound from "@/pages/not-found";

// --- ГЛОБАЛЬНЫЙ ПЕРЕХВАТЧИК ОШИБОК ---
interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Глобальный сбой приложения:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Используем инлайновые стили, чтобы исключить падение из-за Tailwind
      return (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#990000",
            color: "white",
            minHeight: "100vh",
            width: "100vw",
            fontFamily: "monospace",
            zIndex: 9999,
            position: "relative",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              marginBottom: "15px",
              fontWeight: "bold",
            }}
          >
            СБОЙ ANDROID ВЕРСИИ
          </h1>
          <p
            style={{
              fontSize: "16px",
              marginBottom: "15px",
              backgroundColor: "rgba(0,0,0,0.3)",
              padding: "10px",
            }}
          >
            {this.state.error?.toString()}
          </p>
          <pre
            style={{
              backgroundColor: "rgba(0,0,0,0.8)",
              padding: "15px",
              overflowX: "auto",
              fontSize: "12px",
              whiteSpace: "pre-wrap",
            }}
          >
            {this.state.error?.stack}
          </pre>
          <p style={{ marginTop: "20px", fontWeight: "bold" }}>
            Сделайте скриншот и отправьте разработчику.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={IndustrialLanding} />
      <Route path="/admin/leads" component={LeadsDashboard} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/user-agreement" component={UserAgreement} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
