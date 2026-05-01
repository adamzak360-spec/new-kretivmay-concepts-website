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
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPortfolio from "./pages/admin/Portfolio";
import AdminServices from "./pages/admin/Services";
import AdminBlog from "./pages/admin/Blog";
import AdminMessages from "./pages/admin/Messages";
import AdminTestimonials from "./pages/admin/Testimonials";
import AdminSettings from "./pages/admin/Settings";
import AdminHero from "./pages/admin/Hero";
import AdminAbout from "./pages/admin/About";
import Layout from "./components/Layout";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

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
      <Route path={"/admin/dashboard"}>
        {() => <ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>}
      </Route>
      <Route path={"/admin/portfolio"}>
        {() => <ProtectedAdminRoute><AdminPortfolio /></ProtectedAdminRoute>}
      </Route>
      <Route path={"/admin/services"}>
        {() => <ProtectedAdminRoute><AdminServices /></ProtectedAdminRoute>}
      </Route>
      <Route path={"/admin/blog"}>
        {() => <ProtectedAdminRoute><AdminBlog /></ProtectedAdminRoute>}
      </Route>
      <Route path={"/admin/testimonials"}>
        {() => <ProtectedAdminRoute><AdminTestimonials /></ProtectedAdminRoute>}
      </Route>
      <Route path={"/admin/messages"}>
        {() => <ProtectedAdminRoute><AdminMessages /></ProtectedAdminRoute>}
      </Route>
      <Route path={"/admin/settings"}>
        {() => <ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>}
      </Route>
      <Route path={"/admin/hero"}>
        {() => <ProtectedAdminRoute><AdminHero /></ProtectedAdminRoute>}
      </Route>
      <Route path={"/admin/about"}>
        {() => <ProtectedAdminRoute><AdminAbout /></ProtectedAdminRoute>}
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
