import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import IndustrialLanding from "@/pages/industrial-landing";
import PreviewPage from "@/pages/preview-page";
import { LeadsDashboard } from "@/pages/leads-dashboard";
import PrivacyPolicy from "@/pages/privacy-policy";
import UserAgreement from "@/pages/user-agreement";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={IndustrialLanding} />
      <Route path="/preview" component={PreviewPage} />
      <Route path="/admin/leads" component={LeadsDashboard} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/user-agreement" component={UserAgreement} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
