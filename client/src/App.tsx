import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import HotelListingPage from "@/pages/hotel-listing-page";
import HotelDetailPage from "@/pages/hotel-detail-page";
import BookingPage from "@/pages/booking-page";
import UserDashboardPage from "@/pages/user-dashboard-page";
import AdminDashboardPage from "@/pages/admin-dashboard-page";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";
import Layout from "./components/layout/Layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/hotels" component={HotelListingPage} />
      <Route path="/hotels/:id" component={HotelDetailPage} />
      <ProtectedRoute path="/booking" component={BookingPage} />
      <ProtectedRoute path="/dashboard" component={UserDashboardPage} />
      <ProtectedRoute path="/admin" component={AdminDashboardPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <Layout>
        <Router />
      </Layout>
    </TooltipProvider>
  );
}

export default App;
