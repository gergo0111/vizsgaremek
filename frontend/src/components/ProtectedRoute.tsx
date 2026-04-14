import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../lib/auth';

type Props = {
  children: JSX.Element;
};

export default function ProtectedRoute({ children }: Props) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}
