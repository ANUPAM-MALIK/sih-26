import { Link } from 'react-router-dom';
import { Database, Plus } from 'lucide-react';
import { PageHeader } from '../components/common';
export function ModulePage({ title, description }: { title: string; description: string }) { return <><PageHeader title={title} description={description} action="Add record" /><div className="empty-module panel"><div className="empty-module-icon"><Database size={22} /></div><h2>Module ready for connected data</h2><p>This MVP surface is wired to the canonical case model. Add or sync records to see the operational view here.</p><div className="empty-actions"><button className="button button-primary"><Plus size={16} /> Add demo record</button><Link to="/integrations" className="button button-secondary">View adapters</Link></div></div></>; }
