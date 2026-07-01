import { BrowserRouter, Routes, Route } from 'react-router';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import { LandingPage } from './pages/LandingPage';
import { SignIn } from './pages/SignIn';
import { Register } from './pages/Register';
import { Navbar } from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { OwnerLayout } from './pages/owner/OwnerLayout';
import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { MembersList } from './pages/owner/MembersList';
import { TrainersList } from './pages/owner/TrainersList';
import { ReportGenerator } from './pages/owner/ReportGenerator';
import { ReceptionistLayout } from './pages/receptionist/ReceptionistLayout';
import { ReceptionistDashboard } from './pages/receptionist/ReceptionistDashboard';
import { RecepMembers } from './pages/receptionist/RecepMembers';
import { CheckInDesk } from './pages/receptionist/CheckInDesk';
import { TrainerLayout } from './pages/trainer/TrainerLayout';
import { TrainerDashboard } from './pages/trainer/TrainerDashboard';
import { TrainerMembers } from './pages/trainer/TrainerMembers';
import { WorkoutTemplates } from './pages/trainer/WorkoutTemplates';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Owner Routes */}
            <Route path="/owner" element={<OwnerLayout />}>
              <Route path="dashboard" element={<OwnerDashboard />} />
              <Route path="members" element={<MembersList />} />
              <Route path="trainers" element={<TrainersList />} />
              <Route path="reports" element={<ReportGenerator />} />
            </Route>

            {/* Protected Receptionist Routes */}
            <Route path="/receptionist" element={<ReceptionistLayout />}>
              <Route path="dashboard" element={<ReceptionistDashboard />} />
              <Route path="members" element={<RecepMembers />} />
              <Route path="checkin" element={<CheckInDesk />} />
            </Route>

            {/* Protected Trainer Routes */}
            <Route path="/trainer" element={<TrainerLayout />}>
              <Route path="dashboard" element={<TrainerDashboard />} />
              <Route path="members" element={<TrainerMembers />} />
              <Route path="templates" element={<WorkoutTemplates />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
