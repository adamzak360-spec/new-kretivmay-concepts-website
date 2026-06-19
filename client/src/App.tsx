import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import Home from "./pages/Home";
import About from "./pages/About";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Portfolio from "./pages/Portfolio";
import Photography from "./pages/Photography";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPortfolio from "./pages/admin/Portfolio";
import AdminPhotography from "./pages/admin/Photography";
import AdminServices from "./pages/admin/Services";
import AdminMessages from "./pages/admin/Messages";
import AdminSettings from "./pages/admin/Settings";
import Layout from "./components/Layout";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/about"} component={About} />
      <Route path={"/services"} component={Shop} />
      <Route path={"/shop/:slug"} component={ProductDetail} />
      <Route path={"/categories"} component={Portfolio} />
      <Route path={"/portfolio"} component={Portfolio} />
      <Route path={"/photography"} component={Photography} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/checkout"} component={Checkout} />
      
      {/* Keep old service routes for backward compatibility or future use */}
      <Route path={"/old-services"} component={Services} />
      <Route path={"/services/:slug"} component={ProductDetail} />
      
      {/* Admin Routes */}
      <Route path={"/admin/login"}>
        {() => <AdminLogin />}
      </Route>
      <Route path={"/admin/dashboard"}>
        {() => <ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>}
      </Route>
      <Route path={"/admin/portfolio"}>
        {() => <ProtectedAdminRoute><AdminPortfolio /></ProtectedAdminRoute>}
      </Route>
      <Route path={"/admin/photography"}>
        {() => <ProtectedAdminRoute><AdminPhotography /></ProtectedAdminRoute>}
      </Route>
      <Route path={"/admin/services"}>
        {() => <ProtectedAdminRoute><AdminServices /></ProtectedAdminRoute>}
      </Route>
      <Route path={"/admin/messages"}>
        {() => <ProtectedAdminRoute><AdminMessages /></ProtectedAdminRoute>}
      </Route>
      <Route path={"/admin/settings"}>
        {() => <ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>}
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
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Layout>
              <Router />
            </Layout>
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
