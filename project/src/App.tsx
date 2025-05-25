import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Repositories } from './pages/Repositories';
import { RepositoryDetails } from './pages/RepositoryDetails';
import { Analysis } from './pages/Analysis';
import { NotFound } from './pages/NotFound';
import { Layout } from './components/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="repositories" element={<Repositories />} />
        <Route path="repositories/:repoName" element={<RepositoryDetails />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;