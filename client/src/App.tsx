import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import IdeaPhase from "@/pages/IdeaPhase";
import BuildPhase from "@/pages/BuildPhase";
import GrowPhase from "@/pages/GrowPhase";
import ManagePhase from "@/pages/ManagePhase";
import StoragePage from "@/pages/StoragePage";
import ResourceLibraryPage from "@/pages/ResourceLibraryPage";
import { StartupPipelinePage } from "@/pages/StartupPipelinePage";
import TranslationPage from "@/pages/TranslationPage";
import BusinessToolsPage from "@/pages/BusinessToolsPage";

function Router() {
  const [initialFetchCompleted, setInitialFetchCompleted] = useState(false);
  const [lifecyclePhases, setLifecyclePhases] = useState([]);
  
  useEffect(() => {
    // Fetch lifecycle phases on app load
    const fetchPhases = async () => {
      try {
        const response = await fetch('/api/lifecycle-phases');
        if (response.ok) {
          const data = await response.json();
          setLifecyclePhases(data);
        }
      } catch (error) {
        console.error('Failed to fetch lifecycle phases:', error);
      } finally {
        setInitialFetchCompleted(true);
      }
    };

    fetchPhases();
  }, []);

  if (!initialFetchCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-slate-600">Loading 360 Business Magician...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/phases/idea" component={IdeaPhase} />
          <Route path="/phases/build" component={BuildPhase} />
          <Route path="/phases/grow" component={GrowPhase} />
          <Route path="/phases/manage" component={ManagePhase} />
          <Route path="/storage" component={StoragePage} />
          <Route path="/resources" component={ResourceLibraryPage} />
          <Route path="/startup-pipeline" component={StartupPipelinePage} />
          <Route path="/translation" component={TranslationPage} />
          <Route path="/business-tools" component={BusinessToolsPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
