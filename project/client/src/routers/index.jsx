import { createBrowserRouter } from 'react-router-dom'
import todoRoutes from './TodoRoutes';
function Router() {
  return createBrowserRouter([todoRoutes]);
}

export default Router