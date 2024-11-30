import {
  ConstructorPage,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  Feed,
  ProfileOrders,
  NotFound404
} from '@pages';
import '../../index.css';
import { useEffect } from 'react';
import { useDispatch } from '@store';
import { fetchUser, fetchIngredients, resetOrderModalData } from '@slices';
import styles from './app.module.css';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { background?: Location };

  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleModalClose = () => {
    navigate(-1);
    dispatch(resetOrderModalData());
  };

  const protectedRoutes = [
    { path: '/login', element: <Login />, onlyUnAuth: true },
    { path: '/register', element: <Register />, onlyUnAuth: true },
    { path: '/forgot-password', element: <ForgotPassword />, onlyUnAuth: true },
    { path: '/reset-password', element: <ResetPassword />, onlyUnAuth: true },
    { path: '/profile', element: <Profile /> },
    { path: '/profile/orders', element: <ProfileOrders /> },
    { path: '/profile/orders/:number', element: <OrderInfo /> }
  ];

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={state?.background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        {protectedRoutes.map(({ path, element, onlyUnAuth }, index) => (
          <Route
            key={index}
            path={path}
            element={
              <ProtectedRoute onlyUnAuth={onlyUnAuth}>{element}</ProtectedRoute>
            }
          />
        ))}
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {state?.background && (
        <>
          <Routes>
            <Route
              path='/ingredients/:id'
              element={
                <Modal title='Детали ингредиента' onClose={handleModalClose}>
                  <IngredientDetails />
                </Modal>
              }
            />
          </Routes>
          <Routes>
            <Route
              path='/feed/:number'
              element={
                <Modal title='Детали заказа' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Routes>
          <Routes>
            <Route
              path='/profile/orders/:number'
              element={
                <Modal title='Детали заказа' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Routes>
        </>
      )}
    </div>
  );
};

export default App;
