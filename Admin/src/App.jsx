
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAppContext } from "./context/AppContext";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Projects from "./pages/Projects/Projects";
import ProjectDetails from "./pages/Projects/ProjectDetails";
import Investments from "./pages/Investments/Investments";
import InvestmentDetails from "./pages/Investments/InvestmentDetails";
import PaymentHistory from "./pages/PaymentHistory/PaymentHistory";
import PaymentDetails from "./pages/PaymentHistory/PaymentDetails";
import Users from "./pages/Users/Users";
import UserDetails from "./pages/Users/UserDetails";



const ProtectedAdminRoute = ({ children }) => {
  const { token } = useAppContext();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const { token } = useAppContext();

  return (
    <>
      <Toaster
        position="top-center"
      />

      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <Login />}
        />

        <Route
          path="/*"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Home />} />


                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:projectId" element={<ProjectDetails />} />

                  <Route path="/users" element={<Users/>} />
                  <Route path="/users/:userId" element={<UserDetails/>} />

                  <Route path="/investments" element={<Investments/>} />
                  <Route path="/investments/:investmentId" element={<InvestmentDetails/>} />

                  <Route path="/payment-history" element={<PaymentHistory/>}/>
                  <Route path="/payment-history/:paymentId" element={<PaymentDetails />} />

                  <Route path="/*" element={<PageNotFound/>}/>
                </Routes>
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
