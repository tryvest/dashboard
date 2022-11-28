import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CircularProgress } from '@mui/material';
import NotFound from '../pages/general/Page404';
import { BUSINESS, TRYVESTOR } from '../UserTypes';
import { selectUserType } from '../features/userSlice';
import { auth } from '../firebase';

export const CustomSelectRouter = (props) => {
  const { businessPage, tryvestorPage, unauthPage } = props;
  const userType = useSelector((state) => state?.user?.user?.userType);
  const [user, loading, error] = useAuthState(auth);
  if (userType === TRYVESTOR) {
    if (tryvestorPage !== undefined) {
      return tryvestorPage;
    }
    return <NotFound />;
  }
  if (!loading && userType === BUSINESS) {
    if (businessPage !== undefined) {
      return businessPage;
    }
    return <NotFound />;
  }

  if (!loading && !user) {
      if (unauthPage !== undefined) {
          return unauthPage;
      }
      return <Navigate to={"/"} replace/>;
      // return <Navigate to={"/404"} replace/>;
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <CircularProgress />
    </div>
  );
};
