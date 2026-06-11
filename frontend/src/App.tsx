import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Semana1Page from './pages/Semana1Page';
import DescriptionMatchStartPage from './pages/DescriptionMatchStartPage';
import DescriptionMatchGamePage from './pages/DescriptionMatchGamePage';
import RescataPulgarcitoStartPage from './pages/RescataPulgarcitoStartPage';
import RescataPulgarcitoGamePage from './pages/RescataPulgarcitoGamePage';
import SortBySizeStartPage from './pages/SortBySizeStartPage';
import SortBySizeGamePage from './pages/SortBySizeGamePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/semana/:semanaId" element={<Semana1Page />} />
        <Route path="/semana/:semanaId/description-match" element={<DescriptionMatchStartPage />} />
        <Route path="/semana/:semanaId/description-match/play" element={<DescriptionMatchGamePage />} />
        <Route path="/semana/:semanaId/rescata-pulgarcito" element={<RescataPulgarcitoStartPage />} />
        <Route path="/semana/:semanaId/rescata-pulgarcito/play" element={<RescataPulgarcitoGamePage />} />
        <Route path="/semana/:semanaId/sort-by-size" element={<SortBySizeStartPage />} />
        <Route path="/semana/:semanaId/sort-by-size/play" element={<SortBySizeGamePage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
