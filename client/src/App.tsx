import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";

// Components
import TopNavBar from "@/components/TopNavBar";
import Footer from "@/components/Footer";

// Pages
import Overview from "@/pages/Overview";
import Alerts from "@/pages/Alerts";
import Visualize from "@/pages/Visualize";
import SatelliteOps from "@/pages/SatelliteOps";
import Aviation from "@/pages/Aviation";
import HumanSpaceflight from "@/pages/HumanSpaceflight";
import DataSources from "@/pages/DataSources";
import ModelTraining from "@/pages/ModelTraining";
import Playbooks from "@/pages/Playbooks";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Main Pages */}
      <Route path="/" component={Overview} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/visualize" component={Visualize} />
      <Route path="/sources" component={DataSources} />
      <Route path="/model" component={ModelTraining} />
      
      {/* Operational Pages */}
      <Route path="/satellite-ops" component={SatelliteOps} />
      <Route path="/aviation" component={Aviation} />
      <Route path="/spaceflight" component={HumanSpaceflight} />
      
      {/* System Pages */}
      <Route path="/playbooks" component={Playbooks} />
      <Route path="/settings" component={Settings} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="geostorm-ui-theme">
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <TopNavBar />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
