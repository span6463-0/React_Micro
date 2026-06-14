import { useParams, Link, useNavigate } from 'react-router-dom';

const ItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - replace with RTK Query
  const item = {
    id: parseInt(id),
    name: 'Product A',
    description: 'This is a detailed description of the product. It includes features, specifications, and other relevant information.',
    category: 'Electronics',
    price: 299.99,
    status: 'Active',
    sku: 'PROD-001-A',
    stock: 150,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      // TODO: Dispatch delete action
      navigate('/items');
    }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li><Link to="/items" className="hover:text-blue-600">Items</Link></li>
          <li>/</li>
          <li className="text-gray-900 font-medium">{item.name}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
          <p className="text-sm text-gray-500 mt-1">SKU: {item.sku}</p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Link
            to={`/items/${id}/edit`}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Details</h2>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Category</dt>
                <dd className="text-sm font-medium text-gray-900">{item.category}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Status</dt>
                <dd>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {item.status}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Activity</h2>
            <div className="space-y-4">
              <ActivityItem
                title="Item updated"
                description="Price changed from $249.99 to $299.99"
                time="Jan 20, 2024 at 2:45 PM"
              />
              <ActivityItem
                title="Item created"
                description="Item was added to the catalog"
                time="Jan 15, 2024 at 10:30 AM"
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Pricing & Stock</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Price</dt>
                <dd className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Stock</dt>
                <dd className="text-sm font-medium text-gray-900">{item.stock} units</dd>
              </div>
            </dl>
          </div>

          {/* Metadata */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Metadata</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">{new Date(item.createdAt).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Last Updated</dt>
                <dd className="text-sm text-gray-900">{new Date(item.updatedAt).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">ID</dt>
                <dd className="text-sm text-gray-900 font-mono">{item.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ title, description, time }) => (
  <div className="flex gap-3">
    <div className="w-2 h-2 mt-2 rounded-full bg-blue-600 flex-shrink-0" />
    <div>
      <p className="text-sm font-medium text-gray-900">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
      <p className="text-xs text-gray-400 mt-1">{time}</p>
    </div>
  </div>
);

export default ItemDetail;
