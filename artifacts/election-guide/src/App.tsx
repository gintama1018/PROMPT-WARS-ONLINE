import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";

// Pages
import Home from "@/pages/home";
import WhatIsElection from "@/pages/what-is-election";
import Timeline from "@/pages/timeline";
import HowToVote from "@/pages/how-to-vote";
import YourRights from "@/pages/your-rights";
import AskTheGuide from "@/pages/ask-the-guide";
import Quiz from "@/pages/quiz";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/what-is-election" component={WhatIsElection} />
        <Route path="/timeline" component={Timeline} />
        <Route path="/how-to-vote" component={HowToVote} />
        <Route path="/your-rights" component={YourRights} />
        <Route path="/ask-the-guide" component={AskTheGuide} />
        <Route path="/quiz" component={Quiz} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
