import { Link, useLocation, useParams } from 'react-router-dom';

const items = [
  { id: 1, name: 'Product A', category: 'Electronics', status: 'Active' },
  { id: 2, name: 'Product B', category: 'Clothing', status: 'Active' },
  { id: 3, name: 'Product C', category: 'Electronics', status: 'Draft' },
  { id: 4, name: 'Product D', category: 'Home', status: 'Active' },
  { id: 5, name: 'Product E', category: 'Sports', status: 'Archived' },
];

const statusDot = {
  Active: 'bg-green-500',
  Draft: 'bg-yellow-400',
  Archived: 'bg-gray-400',
};

const ItemsSidebar = () => {
  const location = useLocation();
  const { id } = useParams();
  const isListActive = location.pathname === '/items' || location.pathname === '/items/';
  const isCreateActive = location.pathname === '/items/create';

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-gray-200 min-h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Items
          </h2>
          <Link
            to="/items/create"
            className="p-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
            title="Create Item"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-2 py-2 flex-1 overflow-y-auto">
        {/* All Items link */}
        <Link
          to="/items"
          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium mb-1 transition-colors ${
            isListActive
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <svg className="w-4 h-4 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          All Items
        </Link>

        {/* Create Item link */}
        <Link
          to="/items/create"
          className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium mb-3 transition-colors ${
            isCreateActive
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <svg className="w-4 h-4 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Item
        </Link>

        {/* Divider */}
        <p className="px-3 mb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Recent Items
        </p>

        {/* Item list */}
        {items.map((item) => {
          const isActive = id === String(item.id);
          return (
            <Link
              key={item.id}
              to={`/items/${item.id}`}
              className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors mb-0.5 ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full mr-2 shrink-0 ${statusDot[item.status] || 'bg-gray-400'}`} />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default ItemsSidebar;
