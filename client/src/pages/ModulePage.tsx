import { Link } from 'react-router-dom';
import { Database, Plus } from 'lucide-react';
import { PageHeader } from '../components/common';
export function ModulePage({ title, description }: { title: string; description: string }) { return <><PageHeader title={title} description={description} /><div className="empty-module panel"><div className="empty-module-icon"><Database size={22} /></div><h2>Backend module available</h2><p>This module is backed by persistent compensation, possession, and R&amp;R records. Operational write APIs are exposed while the compact demo surface is being expanded.</p><Link to="/reports" className="button button-secondary">View database-backed reports</Link></div></>; }
