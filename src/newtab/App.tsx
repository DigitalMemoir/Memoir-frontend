import { HashRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import NewTabPage from '../pages/new-tab/NewTabPage';
import OnboardingPage from '../pages/onboarding/OnboardingPage';
import DefaultLayout from '../layouts/DefaultLayout';
import TodaysKeywordsPage from '../pages/todays-keywords/TodaysKeywordsPage';
import Calendar from '../pages/daily-summary/Calendar';
import NoSearchbarLayout from '../layouts/NoSearchbarLayout';
import RootLayout from '../layouts/RootLayout';
import LoginPage from '../pages/login/LoginPage';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../states/useAuthStore';
import { useEffect } from 'react';
import VisitedSites from '../pages/visited-sites/VisitedSites';

const queryClient = new QueryClient();

function App() {
  const checkLoginStatus = useAuthStore((state) => state.checkLoginStatus);

  useEffect(() => {
    checkLoginStatus();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route element={<DefaultLayout />}>
              <Route path={'/'} element={<NewTabPage />} />
              <Route
                path={'/todays-keyword'}
                element={<TodaysKeywordsPage />}
              />
              <Route path={'/visited-sites'} element={<VisitedSites />} />
            </Route>
            <Route element={<NoSearchbarLayout />}>
              <Route path={'/daily-summary'} element={<Calendar />} />
            </Route>
          </Route>
          <Route path={'/onboarding'} element={<OnboardingPage />} />
          <Route path={'/login'} element={<LoginPage />} />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
