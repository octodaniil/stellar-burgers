import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { useSelector } from '@store';
import { FC } from 'react';
import { TProtectedRouteProps } from './type';

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const { isAuthChecked, data: user } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  const isUserAuthenticated = !!(user.email && user.name);
  const { from } = location.state || { from: { pathname: '/' } };

  if (onlyUnAuth && isUserAuthenticated) {
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && !isUserAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
