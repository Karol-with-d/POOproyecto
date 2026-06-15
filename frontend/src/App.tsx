import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import Semana1Page from './pages/Semana1Page';
import Semana2Page from './pages/Semana2Page';
import Semana3Page from './pages/Semana3Page';
import Semana4Page from './pages/Semana4Page';
import OxidacionPage from './pages/OxidacionPage';
import FermentacionPage from './pages/FermentacionPage';
import Semana5Page from './pages/Semana5Page';
import Semana6Page from './pages/Semana6Page';
import SuperpoderesStartPage from './pages/SuperpoderesStartPage';
import SuperpoderesGamePage from './pages/SuperpoderesGamePage';
import SemillasGamePage from './pages/SemillasGamePage';
import BusquedaGamePage from './pages/BusquedaGamePage';
import QuizIntroPage from './pages/QuizIntroPage';
import DescriptionMatchStartPage from './pages/DescriptionMatchStartPage';
import DescriptionMatchGamePage from './pages/DescriptionMatchGamePage';
import RescataPulgarcitoStartPage from './pages/RescataPulgarcitoStartPage';
import RescataPulgarcitoGamePage from './pages/RescataPulgarcitoGamePage';
import SortBySizeStartPage from './pages/SortBySizeStartPage';
import SortBySizeGamePage from './pages/SortBySizeGamePage';
import ColeccionandoObjetosGamePage from './pages/ColeccionandoObjetosGamePage';
import CajaMisteriosaGamePage from './pages/CajaMisteriosaGamePage';
import FabricaMisteriosaGamePage from './pages/FabricaMisteriosaGamePage';
import ReflectionCardsStartPage from './pages/ReflectionCardsStartPage';
import ReflectionCardsGamePage from './pages/ReflectionCardsGamePage';
import BuildItStartPage from './pages/BuildItStartPage';
import BuildItGamePage from './pages/BuildItGamePage';
import HechoDeStartPage from './pages/HechoDeStartPage';
import HechoDeGamePage from './pages/HechoDeGamePage';
import Semana1QuizPage from './pages/Semana1QuizPage';
import SimilitudesGamePage from './pages/SimilitudesGamePage';
import MovimientoGamePage from './pages/MovimientoGamePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/semana/2" element={<Semana2Page />} />
        <Route path="/semana/3" element={<Semana3Page />} />
        <Route path="/semana/4" element={<Semana4Page />} />
        <Route path="/semana/4/oxidacion" element={<OxidacionPage />} />
        <Route path="/semana/4/fermentacion" element={<FermentacionPage />} />
        <Route path="/semana/5" element={<Semana5Page />} />
        <Route path="/semana/5/semillas" element={<SemillasGamePage />} />
        <Route path="/semana/5/busqueda" element={<BusquedaGamePage />} />
        <Route path="/semana/5/quiz" element={<QuizIntroPage />} />
        <Route path="/semana/1/quiz" element={<Semana1QuizPage />} />
        <Route path="/semana/5/superpoderes" element={<SuperpoderesStartPage />} />
        <Route path="/semana/5/superpoderes/play" element={<SuperpoderesGamePage />} />
        <Route path="/semana/6" element={<Semana6Page />} />
        <Route path="/semana/6/similitudes" element={<SimilitudesGamePage />} />
        <Route path="/semana/6/movimiento" element={<MovimientoGamePage />} />
        <Route path="/semana/:semanaId" element={<Semana1Page />} />
        <Route path="/semana/:semanaId/description-match" element={<DescriptionMatchStartPage />} />
        <Route path="/semana/:semanaId/description-match/play" element={<DescriptionMatchGamePage />} />
        <Route path="/semana/:semanaId/rescata-pulgarcito" element={<RescataPulgarcitoStartPage />} />
        <Route path="/semana/:semanaId/rescata-pulgarcito/play" element={<RescataPulgarcitoGamePage />} />
        <Route path="/semana/:semanaId/sort-by-size" element={<SortBySizeStartPage />} />
        <Route path="/semana/:semanaId/sort-by-size/play" element={<SortBySizeGamePage />} />
        <Route path="/semana/2/coleccionando-objetos/play" element={<ColeccionandoObjetosGamePage />} />
        <Route path="/semana/2/caja-misteriosa/play" element={<CajaMisteriosaGamePage />} />
        <Route path="/semana/2/fabrica-misteriosa/play" element={<FabricaMisteriosaGamePage />} />
        <Route path="/semana/:semanaId/reflection-cards" element={<ReflectionCardsStartPage />} />
        <Route path="/semana/:semanaId/reflection-cards/play" element={<ReflectionCardsGamePage />} />
        <Route path="/semana/:semanaId/build-it" element={<BuildItStartPage />} />
        <Route path="/semana/:semanaId/build-it/play" element={<BuildItGamePage />} />
        <Route path="/semana/:semanaId/hecho-de" element={<HechoDeStartPage />} />
        <Route path="/semana/:semanaId/hecho-de/play" element={<HechoDeGamePage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
