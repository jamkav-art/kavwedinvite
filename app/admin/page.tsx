import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Logic to check authentication would go here
  redirect('/admin/dashboard');
}
