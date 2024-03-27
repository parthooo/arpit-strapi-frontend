import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/SignIn';
// import BlogDetail from './pages/blogDetails/BlogDetails';
import ArticlePage from './pages/articlePage/ArticlePage';
import BlogList from './pages/bloglist/BlogList';
import LoginRedirect from '../src/pages/LoginRedirect';
import PrivateRoute from './utils/PrivateRoute';
import HomePage from './pages/HomePage';
import Bookmark from './pages/bookmark/Bookmark';

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/connect/:providerName/article-series" element={<LoginRedirect />} />
          <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
          <Route path="/article-series" element={<PrivateRoute><BlogList /></PrivateRoute>} />
          {/* <Route path="/article/:id" element={<PrivateRoute><BlogDetail /></PrivateRoute>} /> */}
          <Route path="/article/:id" element={<PrivateRoute><ArticlePage /></PrivateRoute>} />
         <Route path="/bookmark" element={<PrivateRoute><Bookmark /></PrivateRoute>} />
        </Routes>
      </Layout>
    </>
  )
}

export default App
