import React, { useState } from 'react';
import { StickyNote, Plus, Tag, Search, User, Calendar } from 'lucide-react';

interface Note {
  id: string;
  client: string;
  clientPhone: string;
  content: string;
  tags: string[];
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}

export default function QuickNotes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [newNote, setNewNote] = useState('');
  const [newNoteTags, setNewNoteTags] = useState<string[]>([]);
  const [showAddNote, setShowAddNote] = useState(false);

  // Mock notes data
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      client: 'Sarah Johnson',
      clientPhone: '+1 (555) 123-4567',
      content: 'Prefers morning appointments. Mentioned interest in premium package during last call.',
      tags: ['VIP', 'Premium Interest'],
      timestamp: '2025-01-16 10:30 AM',
      priority: 'high'
    },
    {
      id: '2',
      client: 'Mike Chen',
      clientPhone: '+1 (555) 987-6543',
      content: 'First-time client. Needs to reschedule due to work conflict. Very polite and understanding.',
      tags: ['New Client', 'Reschedule'],
      timestamp: '2025-01-16 09:15 AM',
      priority: 'medium'
    },
    {
      id: '3',
      client: 'Emma Wilson',
      clientPhone: '+1 (555) 456-7890',
      content: 'Called to confirm appointment. Asked about additional services. Send follow-up email with service menu.',
      tags: ['Follow-Up Required', 'Service Inquiry'],
      timestamp: '2025-01-15 4:45 PM',
      priority: 'medium'
    },
    {
      id: '4',
      client: 'David Brown',
      clientPhone: '+1 (555) 222-3333',
      content: 'Hot lead from referral. Very interested but wants to think it over. Follow up in 2 days.',
      tags: ['Hot Lead', 'Referral'],
      timestamp: '2025-01-15 2:20 PM',
      priority: 'high'
    }
  ]);

  const allTags = ['all', ...Array.from(new Set(notes.flatMap(note => note.tags)))];
  
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = selectedTag === 'all' || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const addNote = () => {
    if (newNote.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        client: 'Manual Entry',
        clientPhone: '',
        content: newNote.trim(),
        tags: newNoteTags,
        timestamp: new Date().toLocaleString(),
        priority: 'medium'
      };
      setNotes([note, ...notes]);
      setNewNote('');
      setNewNoteTags([]);
      setShowAddNote(false);
    }
  };

  const toggleTag = (tag: string) => {
    setNewNoteTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="glass-panel p-6 rounded-2xl h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
            <StickyNote className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Quick Notes & Tags</h2>
            <p className="text-gray-400 text-sm">Client notes & tagging system</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddNote(!showAddNote)}
          className="flex items-center space-x-2 px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Note</span>
        </button>
      </div>

      {/* Add Note Form */}
      {showAddNote && (
        <div className="mb-6 p-4 bg-black/30 rounded-xl border border-gray-700">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your note here..."
            className="w-full px-4 py-3 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 resize-none"
            rows={3}
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-wrap gap-2">
              {['Hot Lead', 'Follow-Up Required', 'VIP', 'Reschedule', 'New Client'].map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2 py-1 rounded text-xs border transition-colors ${
                    newNoteTags.includes(tag)
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                      : 'bg-gray-700/50 text-gray-400 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAddNote(false)}
                className="px-3 py-1 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addNote}
                disabled={!newNote.trim()}
                className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
          />
        </div>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-4 py-2 bg-black/30 border border-gray-600 rounded-lg text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
        >
          {allTags.map(tag => (
            <option key={tag} value={tag} className="bg-gray-800">
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-yellow-400">{notes.length}</div>
          <div className="text-xs text-gray-400">Total Notes</div>
        </div>
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-red-400">{notes.filter(n => n.priority === 'high').length}</div>
          <div className="text-xs text-gray-400">High Priority</div>
        </div>
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-blue-400">{notes.filter(n => n.tags.includes('Follow-Up Required')).length}</div>
          <div className="text-xs text-gray-400">Follow-Ups</div>
        </div>
        <div className="text-center p-3 bg-black/20 rounded-xl border border-gray-700">
          <div className="text-lg font-bold text-green-400">{notes.filter(n => n.tags.includes('Hot Lead')).length}</div>
          <div className="text-xs text-gray-400">Hot Leads</div>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="p-4 bg-black/30 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {note.client !== 'Manual Entry' && (
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-blue-400" />
                  </div>
                )}
                <span className="text-white font-medium">{note.client}</span>
                <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(note.priority)}`}>
                  {note.priority} priority
                </span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>{note.timestamp}</span>
              </div>
            </div>

            {note.clientPhone && (
              <div className="text-sm text-gray-400 mb-2">{note.clientPhone}</div>
            )}

            <p className="text-gray-300 text-sm mb-3">{note.content}</p>

            {note.tags.length > 0 && (
              <div className="flex items-center space-x-2">
                <Tag className="w-3 h-3 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded text-xs border border-blue-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}