import { createBrowserRouter } from 'react-router-dom'
import TodoRoutes from './TodoRoutes';
import AuthRoutes from './AuthRoutes';

function Router() {
  return createBrowserRouter([TodoRoutes, AuthRoutes]);
}

export default Router