import { HashRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import NewTabPage from '../pages/new-tab/NewTabPage';
import OnboardingPage from '../pages/onboarding/OnboardingPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path={'/'} element={<NewTabPage />} />
        <Route path={'/onboarding'} element={<OnboardingPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
