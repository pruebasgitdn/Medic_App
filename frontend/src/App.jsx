import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import PatientLogin from "./pages/PatientLogin";
import About from "./pages/About";
import NavBar from "./components/NavBar";
import Register from "./pages/Register";
import UserPanel from "./components/UserPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import { useContext, useEffect } from "react";
import { Context } from "./main";
import PatientHistory from "./pages/PatientHistory";
import Profile from "./pages/Profile";
import AppointmentForm from "./pages/AppointmentForm";
import PatientAppointments from "./pages/PatientAppointments";
import EditPatientProfile from "./components/EditPatientProfile";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorPanel from "./components/DoctorPanel";
import DoctorProfile from "./pages/DoctorProfile";
import EditDoctorProfile from "./components/EditDoctorProfile";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorPatients from "./pages/DoctorPatients";
import ContactForm from "./components/ContactForm";
import DoctorHistory from "./pages/DoctorHistory";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./components/AdminPanel";
import AdminProfile from "./pages/AdminProfile";
import EditAdminProfile from "./components/EditAdminProfile";
import AdminNewAdmin from "./pages/AdminNewAdmin";
import AdminDoctors from "./pages/AdminDoctors";
import FormNewDoctor from "./components/FormNewDoctor";
import AdminPatients from "./pages/AdminPatients";
import AdminAppointments from "./pages/AdminAppointments";
import AdminMessages from "./pages/AdminMessages";
import SupportForm from "./components/SupportForm";
import AdminSupport from "./pages/AdminSupport";
import PatientSupport from "./pages/PatientSupport";
import DoctorSupports from "./pages/DoctorSupports";

function App() {
  const { setUser, setIsAuthenticated, user, isAuthenticated, role, setRole } =
    useContext(Context);

  const isAuth = () => {
    const user = localStorage.getItem("user");
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    return user && isAuthenticated === "true";
  };

  const isDoctorAuth = () => {
    const doctor = localStorage.getItem("doctor");
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    return doctor && isAuthenticated === "true";
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedIsAuthenticated = localStorage.getItem("isAuthenticated");
    const storedRole = localStorage.getItem("role");

    //Si encuentra el ususario y autenticacion...
    if (storedUser && storedIsAuthenticated === "true") {
      //Actualizar contexto
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
      setRole(storedRole);
    } else {
      setIsAuthenticated(false);
    }
    console.log("APP.JSX ", storedIsAuthenticated);
    console.log("APP.JSX ", storedUser);
    console.log("APP.JSX ", storedRole);
  }, [setUser, setIsAuthenticated, setRole]);

  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          {/* RUTAS GENRALES */}
          <Route path="/" element={<Home />} />
          <Route path="/patientlogin" element={<PatientLogin />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/patientregister" element={<Register />} />
          <Route path="/doctorlogin" element={<DoctorLogin />} />
          <Route path="/adminlogin" element={<AdminLogin />} />

          {/* RUTA PACIENTE/USER */}
          <Route
            path="/userpanel"
            element={role === "patient" ? <UserPanel /> : <Navigate to="/" />}
          >
            <Route path="history" element={<PatientHistory />} />
            <Route path="profile" element={<Profile />} />
            <Route path="appointment" element={<AppointmentForm />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="editprofile" element={<EditPatientProfile />} />
            {/* <Route path="supportt" element={<SupportForm />} /> */}
            <Route path="support" element={<PatientSupport />} />
          </Route>

          {/* RUTA DEL DOCTOR */}
          <Route
            path="/doctorpanel"
            element={role === "doctor" ? <DoctorPanel /> : <Navigate to="/" />}
          >
            <Route path="profile" element={<DoctorProfile />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="editprofile" element={<EditDoctorProfile />} />
            <Route path="patients" element={<DoctorPatients />} />
            <Route path="history" element={<DoctorHistory />} />
            {/* <Route path="support" element={<SupportForm />} /> */}
            <Route path="support" element={<DoctorSupports />} />
          </Route>

          <Route
            path="/adminpanel"
            element={role === "admin" ? <AdminPanel /> : <Navigate to="/" />}
          >
            <Route path="profile" element={<AdminProfile />} />
            <Route path="editprofile" element={<EditAdminProfile />} />
            <Route path="newadmin" element={<AdminNewAdmin />} />
            <Route path="newdoctor" element={<AdminDoctors />} />
            <Route path="formdoctor" element={<FormNewDoctor />} />
            <Route path="patients" element={<AdminPatients />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="support" element={<AdminSupport />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
