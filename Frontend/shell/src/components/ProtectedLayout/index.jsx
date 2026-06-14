import AppSidebar from '../AppSidebar';

const ProtectedLayout = ({ children }) => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <AppSidebar />
      <main className="flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
};

export default ProtectedLayout;
