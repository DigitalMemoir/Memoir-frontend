import { HashRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import NewTabPage from '../pages/new-tab/NewTabPage';
import OnboardingPage from '../pages/onboarding/OnboardingPage';
import DefaultLayout from '../layouts/DefaultLayout';
import TodaysKeywordsPage from '../pages/todays-keywords/TodaysKeywordsPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path={'/'} element={<NewTabPage />} />
          <Route path={'/todays-keyword'} element={<TodaysKeywordsPage />} />
        </Route>
        <Route path={'/onboarding'} element={<OnboardingPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
