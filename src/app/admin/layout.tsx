import './admin.css';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';
import { SaveButton } from './components/SaveButton';
import { AdminAuthGuard } from './components/AdminAuthGuard';

export const metadata = {
  title: 'Admin TV Masjid',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <div className="admin-container">
        <AdminSidebar />
        <div className="admin-content">
          <AdminHeader />
          <div className="admin-body">
            {children}
          </div>
          <SaveButton />
        </div>
      </div>
    </AdminAuthGuard>
  );
}
