import { useEffect, useState } from "react";
import { CheckSquare, Check, Activity } from "lucide-react";
import { makeRequest, showMessage } from "../../lib/utils";

type User = {
  username: string
  verified: boolean
}

const Users = () => {
  const [filter, setFilter] = useState<'verified' | 'suspended' | 'all'>('all');
  const [search, setSearch] = useState('');

  const [users, setUsers] = useState<User[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    makeRequest("admin/user", "GET", undefined, true)
      .then((data) => setUsers(data.users))
  }, [])

  const filteredUsers = users.filter(u => (
    u.username.toLowerCase().includes(search.toLowerCase()) &&
    (filter === 'all' || (filter === 'verified') === u.verified)
  ));

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => {
    const pendingIds = filteredUsers.map(u => u.username);
    setSelectedIds(selectedIds.length === pendingIds.length ? [] : pendingIds);
  };

  const handleAction = (id: string, action: 'verify' | 'suspend') => {
    makeRequest(
      `admin/user/${id}`, action === 'verify' ? "PUT" : "DELETE",
      undefined, true
    ).then((data) => {
      showMessage(data.message)
      setUsers(users.map(u => u.username === id ? {username: id, verified: action === 'verify'} : u))
    })
  };

  const bulkAction = (action: 'verify' | 'suspend') => {
    makeRequest(
      "admin/user", action === 'verify' ? "PUT" : "DELETE",
      { users: selectedIds }, true
    ).then((data) => {
      showMessage(data.message)
      setUsers(users.map(u => selectedIds.includes(u.username) ? { ...u, verified: action === 'verify' } : u));
      setSelectedIds([]);
    })
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search username"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary w-[260px] transition-colors"
          />
        </div>
      </div>

      <div className="flex bg-card border border-border rounded-lg p-1 w-max">
        {(['verified', 'suspended', 'all'] as const).map(f => (
          <button
            key={f}
            onClick={() => { setFilter(f); setSelectedIds([]) }}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${filter === f ? 'bg-primary text-white' : 'text-secondary-foreground hover:text-foreground'}`}
          >
            <span className="capitalize">{f}</span>
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-lg">
        {selectedIds.length > 0 && filter !== "all" ? (
          <div className="bg-primary/10 border-b border-primary/20 p-3 flex justify-between items-center px-4 animate-in slide-in-from-top-2">
            <span className="text-sm font-medium text-primary">{selectedIds.length} {selectedIds.length > 1 ? 'users' : 'user'} selected</span>
            <button
              onClick={() => bulkAction(filter === 'suspended' ? 'verify' : 'suspend')}
              className="px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-hover transition-colors">
              {filter === 'suspended' ? 'Verify' : 'Suspend'} selected
            </button>
          </div>
        ) : <></>}

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground bg-background/50">
              {filter !== 'all' ? (
                <th className="p-4 w-12 text-center">
                  <button onClick={selectAll} className="text-muted-foreground hover:text-foreground">
                    <CheckSquare className="w-4 h-4" />
                  </button>
                </th>
              ) : <></>}
              <th className={`p-4 font-medium ${filter !== 'suspended' ? 'pl-6' : ''}`}>Username</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-muted-foreground">
                  {filter === 'suspended' ? "No suspended users. You're all caught up." : "No users found."}
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.username} className="border-b border-border/50 hover:bg-secondary/20 transition-colors group">
                  {filter !== 'all' ? (
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(user.username)}
                        onChange={() => toggleSelect(user.username)}
                        className="rounded border-border bg-background text-primary focus:ring-primary accent-primary w-4 h-4 cursor-pointer"
                      />
                    </td>
                  ) : <></>}
                  <td className={`p-4 flex items-center gap-3 font-medium text-foreground ${filter !== 'suspended' ? 'pl-6' : ''}`}>
                    {user.username}
                  </td>
                  <td className="p-4">
                    {user.verified ?
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-success/10 text-success rounded-full text-xs font-medium"><Check className="w-3 h-3" /> Verified</span> :
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-medium"><Activity className="w-3 h-3" /> Suspended</span>
                    }
                  </td>
                  <td className="p-4 text-right pr-6">
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      {user.verified ?
                        <button onClick={() => handleAction(user.username, 'suspend')} className="px-3 py-1.5 rounded-md text-xs font-medium border border-destructive text-destructive hover:bg-destructive/10 transition-colors">Suspend</button> :
                        <button onClick={() => handleAction(user.username, 'verify')} className="px-3 py-1.5 rounded-md text-xs font-medium bg-success text-white hover:bg-success/90 transition-colors">Verify</button>
                      }
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users