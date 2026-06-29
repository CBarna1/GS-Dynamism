import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';

interface Message {
  id: number;
  sender_id: number;
  sender_role: string;
  recipient_id: number;
  content: string;
  read_at: string | null;
  created_at: string;
  SenderMentee?: { id: number; first_name: string; last_name: string; email: string };
  SenderMentor?: { id: number; User: { first_name: string; last_name: string; email: string } };
}

interface Conversation {
  matchId: number;
  otherPerson: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    senderRole: string;
  } | null;
  unreadCount: number;
}

interface User {
  id: number;
  email: string;
  role: string;
}

export default function MessagesPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Get user info from token
  useEffect(() => {
    const token = localStorage.getItem('mentee_token') || localStorage.getItem('mentor_token') || localStorage.getItem('admin_token');
    if (!token) {
      navigate('/');
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUser(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      navigate('/');
    }
  }, [navigate]);

  // Fetch conversations
  useEffect(() => {
    if (!user) return;
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, [user]);

  // Auto-select first conversation when available
  useEffect(() => {
    if (conversations.length > 0 && !selectedMatchId) {
      setSelectedMatchId(conversations[0].matchId);
    }
  }, [conversations, selectedMatchId]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('mentee_token') || localStorage.getItem('mentor_token') || localStorage.getItem('admin_token');
      const response = await axios.get('/api/messages/conversations/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(response.data.data);

      // Get unread count
      const countResponse = await axios.get('/api/messages/unread/count', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUnreadCount(countResponse.data.count);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected conversation
  useEffect(() => {
    if (!selectedMatchId || !user) return;
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Refresh every 3s
    return () => clearInterval(interval);
  }, [selectedMatchId, user]);

  const fetchMessages = async () => {
    if (!selectedMatchId) return;
    try {
      const token = localStorage.getItem('mentee_token') || localStorage.getItem('mentor_token') || localStorage.getItem('admin_token');
      const response = await axios.get(`/api/messages/${selectedMatchId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data.data);
      // Auto-scroll to bottom
      setTimeout(() => {
        const chatWindow = document.getElementById('message-list');
        if (chatWindow) chatWindow.scrollTop = chatWindow.scrollHeight;
      }, 100);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedMatchId || !user) return;

    setSending(true);
    try {
      const token = localStorage.getItem('mentee_token') || localStorage.getItem('mentor_token') || localStorage.getItem('admin_token');
      
      // Find recipient_id from conversation
      const conv = conversations.find(c => c.matchId === selectedMatchId);
      if (!conv) return;

      await axios.post(
        '/api/messages',
        {
          recipient_id: conv.otherPerson.id,
          match_id: selectedMatchId,
          content: newMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewMessage('');
      await fetchMessages();
      await fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-orange-50 to-white'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Left Panel: Conversations */}
      <div className={`w-full md:w-1/3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-400 to-orange-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Messages {unreadCount > 0 && <span className="text-sm bg-red-500 px-2 py-1 rounded-full ml-2">{unreadCount}</span>}</h2>
          <button
            onClick={() => {
              setIsDarkMode(!isDarkMode);
              localStorage.setItem('theme', !isDarkMode ? 'dark' : 'light');
            }}
            className="p-2 hover:bg-orange-500/30 rounded-lg transition"
            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className={`p-4 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.matchId}
                onClick={() => setSelectedMatchId(conv.matchId)}
                className={`p-4 border-b cursor-pointer transition ${
                  isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'
                } ${
                  selectedMatchId === conv.matchId
                    ? isDarkMode ? 'bg-orange-900/30 border-l-4 border-l-orange-500' : 'bg-orange-50 border-l-4 border-l-orange-500'
                    : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{conv.otherPerson.name}</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{conv.otherPerson.role}</p>
                    {conv.lastMessage && (
                      <p className={`text-sm truncate mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{conv.lastMessage.content}</p>
                    )}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel: Chat */}
      <div className={`hidden md:flex md:w-2/3 flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        {selectedMatchId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-400 to-orange-600 text-white">
              {conversations.find(c => c.matchId === selectedMatchId) && (
                <h2 className="text-lg font-bold">
                  {conversations.find(c => c.matchId === selectedMatchId)?.otherPerson.name}
                </h2>
              )}
            </div>

            {/* Messages */}
            <div id="message-list" className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {messages.length === 0 ? (
                <div className={`flex items-center justify-center h-full text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.sender_id === user?.id;
                  const senderName =
                    msg.SenderMentee?.first_name
                      ? `${msg.SenderMentee.first_name} ${msg.SenderMentee.last_name}`
                      : msg.SenderMentor?.User
                      ? `${msg.SenderMentor.User.first_name} ${msg.SenderMentor.User.last_name}`
                      : 'Unknown';

                  return (
                    <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwn
                            ? 'bg-orange-500 text-white rounded-br-none'
                            : isDarkMode ? 'bg-gray-700 text-gray-100 rounded-bl-none' : 'bg-gray-200 text-gray-900 rounded-bl-none'
                        }`}
                      >
                        {!isOwn && <p className="text-xs font-semibold mb-1 opacity-70">{senderName}</p>}
                        <p className="text-sm break-words">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className={`p-4 border-t flex-shrink-0 ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
              <div className="flex gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  autoFocus
                  rows={2}
                  className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 text-base resize-none ${
                    isDarkMode
                      ? 'bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400 focus:border-orange-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                  }`}
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold flex items-center gap-2"
                >
                  <span>📤</span>
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className={`flex items-center justify-center h-full flex-col gap-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <p className="text-lg">Select a conversation to start messaging</p>
            <p className="text-sm">Click on any name from the left to begin</p>
          </div>
        )}
      </div>

      {/* Mobile: Chat Modal */}
      {selectedMatchId && (
        <Dialog
          open={Boolean(selectedMatchId)}
          onClose={() => setSelectedMatchId(null)}
          className="md:hidden fixed inset-0 z-50"
        >
          <div className="fixed inset-0 bg-black/25" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className={`w-full h-full max-w-md rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} flex flex-col`}>
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-400 to-orange-600 text-white flex justify-between items-center">
                <h2 className="text-lg font-bold">
                  {conversations.find(c => c.matchId === selectedMatchId)?.otherPerson.name}
                </h2>
                <button
                  onClick={() => setSelectedMatchId(null)}
                  className="text-white hover:bg-orange-500/20 p-2 rounded"
                >
                  ✕
                </button>
              </div>

              <div id="message-list-mobile" className={`flex-1 overflow-y-auto p-4 space-y-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {messages.length === 0 ? (
                  <div className={`flex items-center justify-center h-full text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isOwn = msg.sender_id === user?.id;
                    const senderName =
                      msg.SenderMentee?.first_name
                        ? `${msg.SenderMentee.first_name} ${msg.SenderMentee.last_name}`
                        : msg.SenderMentor?.User
                        ? `${msg.SenderMentor.User.first_name} ${msg.SenderMentor.User.last_name}`
                        : 'Unknown';

                    return (
                      <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            isOwn
                              ? 'bg-orange-500 text-white rounded-br-none'
                              : isDarkMode ? 'bg-gray-700 text-gray-100 rounded-bl-none' : 'bg-gray-200 text-gray-900 rounded-bl-none'
                          }`}
                        >
                          {!isOwn && <p className="text-xs font-semibold mb-1 opacity-70">{senderName}</p>}
                          <p className="text-sm break-words">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSendMessage} className={`p-4 border-t flex-shrink-0 ${isDarkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex gap-2 flex-col">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    autoFocus
                    rows={2}
                    className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-200 text-base resize-none ${
                      isDarkMode
                        ? 'bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400 focus:border-orange-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold w-full flex items-center justify-center gap-2"
                  >
                    <span>📤</span>
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  );
}
