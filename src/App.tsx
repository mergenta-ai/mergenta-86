import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { AdminRoute } from "@/components/auth/AdminRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Plans from "./pages/Plans";
import Billing from "./pages/Billing";
import MemoryGuide from "./pages/MemoryGuide";
import AdminDashboard from "./pages/AdminDashboard";
import EmailDashboard from "./pages/EmailDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthWrapper>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/plans" element={<Plans />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/memory-guide" element={<MemoryGuide />} />
              <Route path="/emails" element={<EmailDashboard />} />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthWrapper>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
