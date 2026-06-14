import { Routes, Route } from 'react-router-dom';
import ItemList from './pages/ItemList';
import ItemDetail from './pages/ItemDetail';
import ItemCreate from './pages/ItemCreate';

const App = () => {
  return (
    <div className="p-6">
      <Routes>
        <Route index element={<ItemList />} />
        <Route path="create" element={<ItemCreate />} />
        <Route path=":id" element={<ItemDetail />} />
        <Route path=":id/edit" element={<ItemCreate />} />
      </Routes>
    </div>
  );
};

export default App;
