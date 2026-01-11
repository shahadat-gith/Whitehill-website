
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { useAppContext } from "./context/AppContext";
import AdminLayout from "./components/AdminLayout/AdminLayout";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Settings from "./pages/Settings/Settings";
import PageNotFound from "./pages/PageNotFound/PageNotFound";



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
                  <Route path="/settings" element={<Settings />} />

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
