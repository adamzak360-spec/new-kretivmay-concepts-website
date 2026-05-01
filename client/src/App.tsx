import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Portfolio from "./pages/Portfolio";
import Photography from "./pages/Photography";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPortfolio from "./pages/admin/Portfolio";
import AdminPhotography from "./pages/admin/Photography";
import AdminServices from "./pages/admin/Services";
import AdminMessages from "./pages/admin/Messages";
import AdminSettings from "./pages/admin/Settings";
import Layout from "./components/Layout";
import SimpleAdminRoute from "./components/SimpleAdminRoute";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/services"} component={Services} />
      <Route path={"/services/:slug"} component={ServiceDetail} />
      <Route path={"/portfolio"} component={Portfolio} />
      <Route path={"/photography"} component={Photography} />
      <Route path={"/contact"} component={Contact} />
      
      {/* Admin Routes */}
      <Route path={"\admin/login"}>
        {() => <AdminLogin />}
      </Route>
      <Route path={"\admin/dashboard"}>
        {() => <SimpleAdminRoute><AdminDashboard /></SimpleAdminRoute>}
      </Route>
      <Route path={"\admin/portfolio"}>
        {() => <SimpleAdminRoute><AdminPortfolio /></SimpleAdminRoute>}
      </Route>
      <Route path={"\admin/photography"}>
        {() => <SimpleAdminRoute><AdminPhotography /></SimpleAdminRoute>}
      </Route>
      <Route path={"\admin/services"}>
        {() => <SimpleAdminRoute><AdminServices /></SimpleAdminRoute>}
      </Route>
      <Route path={"\admin/messages"}>
        {() => <SimpleAdminRoute><AdminMessages /></SimpleAdminRoute>}
      </Route>
      <Route path={"\admin/settings"}>
        {() => <SimpleAdminRoute><AdminSettings /></SimpleAdminRoute>}
      </Route>

      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Layout>
            <Router />
          </Layout>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
