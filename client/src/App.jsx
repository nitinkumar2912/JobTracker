import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Analytics } from './pages/Analytics';
import { ApplicationCreate } from './pages/ApplicationCreate';
import { ApplicationDetail } from './pages/ApplicationDetail';
import { ApplicationEdit } from './pages/ApplicationEdit';
import { Applications } from './pages/Applications';
import { Board } from './pages/Board';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { Profile } from './pages/Profile';
import { Register } from './pages/Register';

export const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="applications" element={<Applications />} />
        <Route path="applications/new" element={<ApplicationCreate />} />
        <Route path="applications/:id" element={<ApplicationDetail />} />
        <Route path="applications/:id/edit" element={<ApplicationEdit />} />
        <Route path="board" element={<Board />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>
);
