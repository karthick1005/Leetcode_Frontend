import Login from "../pages/Login/Login";
import Problempage from "../pages/Problem/Problempage";
import ProblemList from "../pages/ProblemList/problemList";
import AdminPage from "../pages/Admin/AdminPage";

const routes = [
  {
    path: "/admin",
    element: <AdminPage />,
  },
  {
    path: "/:Id",
    element: <Problempage />,
  },
  {
    path: "/",
    element: <ProblemList />,
  },
  {
    path:"/login",
    element: <Login/>,
  },
  // {
  //   path: "/admin/login",
  //   element: <AdminLogin />,
  // },
  { path: "*", element: <div>404</div> },
];

export default routes;
