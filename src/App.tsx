import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import {
  homeOutline,
  clipboardOutline,
  chatbubblesOutline,
  callOutline,
  personOutline
} from 'ionicons/icons';
import { clearOtpContext } from './services/otpContext';

/* Lazy-loaded Pages */
const LoginPage = lazy(() => import('./pages/LoginPage'));
const OtpPage = lazy(() => import('./pages/OtpPage'));
const BasvuruKontroluPage = lazy(() => import('./pages/BasvuruKontroluPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const IslemlerPage = lazy(() => import('./pages/IslemlerPage'));
const IslemDetayPage = lazy(() => import('./pages/IslemDetayPage'));
const DestekPage = lazy(() => import('./pages/DestekPage'));
const IletisimPage = lazy(() => import('./pages/IletisimPage'));
const ProfilPage = lazy(() => import('./pages/ProfilPage'));


setupIonicReact();

// PrivateRoute Component
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuth = localStorage.getItem('bezmialem_auth') === 'true';
  
  if (!isAuth) {
    return <Redirect to="/login" />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // LocalStorage'dan auth durumunu oku
    const savedAuth = localStorage.getItem('bezmialem_auth');
    return savedAuth === 'true';
  });

  useEffect(() => {
    // Auth durumu değiştiğinde localStorage'a kaydet
    localStorage.setItem('bezmialem_auth', isLoggedIn.toString());
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('bezmialem_auth');
    clearOtpContext();
  };

  return (
    <IonApp>
      <IonReactRouter>
        <Suspense fallback={<div className="page-loading">Loading...</div>}>
          {!isLoggedIn ? (
            <IonRouterOutlet animated={false}>
              <Route exact path="/login">
                <LoginPage onLogin={handleLogin} />
              </Route>
              <Route exact path="/otp">
                <OtpPage onVerified={handleLogin} />
              </Route>
              <Route exact path="/basvuru-kontrolu">
                <BasvuruKontroluPage />
              </Route>
              <Route exact path="/">
                <Redirect to="/login" />
              </Route>
            </IonRouterOutlet>
          ) : (
            <IonTabs>
              <IonRouterOutlet animated={false}>
                <Route exact path="/dashboard">
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                </Route>
                <Route exact path="/islemler">
                  <PrivateRoute>
                    <IslemlerPage />
                  </PrivateRoute>
                </Route>
                <Route exact path="/islemler/:id">
                  <PrivateRoute>
                    <IslemDetayPage />
                  </PrivateRoute>
                </Route>
                <Route exact path="/destek">
                  <PrivateRoute>
                    <DestekPage />
                  </PrivateRoute>
                </Route>
                <Route exact path="/iletisim">
                  <PrivateRoute>
                    <IletisimPage />
                  </PrivateRoute>
                </Route>
                <Route exact path="/profil">
                  <PrivateRoute>
                    <ProfilPage onLogout={handleLogout} />
                  </PrivateRoute>
                </Route>
                <Route exact path="/">
                  <Redirect to="/dashboard" />
                </Route>
              </IonRouterOutlet>

              <IonTabBar slot="bottom" className="custom-tab-bar">
                <IonTabButton tab="dashboard" href="/dashboard">
                  <IonIcon icon={homeOutline} />
                  <IonLabel>Ana Sayfa</IonLabel>
                </IonTabButton>
                <IonTabButton tab="islemler" href="/islemler">
                  <IonIcon icon={clipboardOutline} />
                  <IonLabel>İşlemler</IonLabel>
                </IonTabButton>
                <IonTabButton tab="destek" href="/destek">
                  <IonIcon icon={chatbubblesOutline} />
                  <IonLabel>Destek</IonLabel>
                </IonTabButton>
                <IonTabButton tab="iletisim" href="/iletisim">
                  <IonIcon icon={callOutline} />
                  <IonLabel>İletişim</IonLabel>
                </IonTabButton>
                <IonTabButton tab="profil" href="/profil">
                  <IonIcon icon={personOutline} />
                  <IonLabel>Profil</IonLabel>
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          )}
        </Suspense>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
