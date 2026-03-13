import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, User, Send, Paperclip, Phone, Video } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import SchoolLayout from './SchoolLayout';
import {
  getAllConversations,
  getConversation,
  sendMessageWithAttachment,
  getInboxMessages,
  getSentMessages,
  getArchivedMessages,
  archiveMessage,
} from '@/services/messageServices';

const SchoolMessages = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedConversationUser, setSelectedConversationUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState(null);

  const { data: conversationsData } = useQuery({
    queryKey: ['school-conversations'],
    queryFn: getAllConversations,
    refetchInterval: 15000,
  });

  const conversations = useMemo(() => conversationsData?.conversations || [], [conversationsData]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter((item) => item.user?.fullName?.toLowerCase().includes(q));
  }, [conversations, searchQuery]);

  const { data: conversationData } = useQuery({
    queryKey: ['school-conversation', selectedConversationUser],
    queryFn: () => getConversation(selectedConversationUser),
    enabled: Boolean(selectedConversationUser),
    refetchInterval: 15000,
  });

  const { data: inboxData } = useQuery({ queryKey: ['school-inbox'], queryFn: getInboxMessages });
  const { data: sentData } = useQuery({ queryKey: ['school-sent'], queryFn: getSentMessages });
  const { data: archivedData } = useQuery({ queryKey: ['school-archived'], queryFn: getArchivedMessages });

  const folderMessages = useMemo(() => {
    if (activeTab === 'inbox') return inboxData?.messages || [];
    if (activeTab === 'sent') return sentData?.messages || [];
    return archivedData?.messages || [];
  }, [activeTab, inboxData, sentData, archivedData]);

  const sendMutation = useMutation({
    mutationFn: sendMessageWithAttachment,
    onSuccess: () => {
      setNewMessage('');
      setAttachment(null);
      queryClient.invalidateQueries({ queryKey: ['school-conversations'] });
      queryClient.invalidateQueries({ queryKey: ['school-conversation', selectedConversationUser] });
      queryClient.invalidateQueries({ queryKey: ['school-inbox'] });
      queryClient.invalidateQueries({ queryKey: ['school-sent'] });
      toast.success('Message sent');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to send message');
    },
  });

  const archiveMutation = useMutation({
    mutationFn: archiveMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school-inbox'] });
      queryClient.invalidateQueries({ queryKey: ['school-sent'] });
      queryClient.invalidateQueries({ queryKey: ['school-archived'] });
      queryClient.invalidateQueries({ queryKey: ['school-conversation', selectedConversationUser] });
      toast.success('Message archived');
    },
  });

  const selectedConversation = conversations.find((item) => item.user?.id === selectedConversationUser);

  const handleSendMessage = () => {
    if (!selectedConversationUser) {
      toast.error('Select a conversation first');
      return;
    }

    if (!newMessage.trim() && !attachment) {
      toast.error('Type a message or attach a file');
      return;
    }

    sendMutation.mutate({
      receiverId: selectedConversationUser,
      message: newMessage,
      attachment,
      relatedTo: 'general',
    });
  };

  return (
    <SchoolLayout>
      <div className="h-[calc(100vh-80px)] bg-[#F8F9FA]">
        <div className="flex h-full">
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Messages</h2>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button onClick={() => setActiveTab('inbox')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'inbox' ? 'bg-[#6C5CE7] text-white' : 'bg-gray-100 text-gray-700'}`}>Inbox</button>
                <button onClick={() => setActiveTab('sent')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'sent' ? 'bg-[#6C5CE7] text-white' : 'bg-gray-100 text-gray-700'}`}>Sent</button>
                <button onClick={() => setActiveTab('archived')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'archived' ? 'bg-[#6C5CE7] text-white' : 'bg-gray-100 text-gray-700'}`}>Archived</button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                />
              </div>
            </div>

            <div className="text-xs text-gray-500 px-4 py-2 border-b border-gray-100">
              {activeTab === 'inbox' && `Inbox messages: ${folderMessages.length}`}
              {activeTab === 'sent' && `Sent messages: ${folderMessages.length}`}
              {activeTab === 'archived' && `Archived messages: ${folderMessages.length}`}
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((chat) => (
                <div
                  key={chat.user.id}
                  onClick={() => setSelectedConversationUser(chat.user.id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversationUser === chat.user.id ? 'bg-[#6C5CE7] bg-opacity-10 border-r-4 border-r-[#6C5CE7]' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {chat.user?.profilePic ? (
                        <img src={chat.user.profilePic} alt={chat.user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">{chat.user?.fullName || 'User'}</h3>
                        <span className="text-xs text-gray-500">
                          {chat.lastMessage?.createdAt
                            ? formatDistanceToNow(new Date(chat.lastMessage.createdAt), { addSuffix: true })
                            : ''}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{chat.user?.role || 'teacher'}</p>
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage?.message || 'No messages yet'}</p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-[#6C5CE7] rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-bold">{chat.unreadCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {filteredConversations.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">No conversations found.</p>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {selectedConversationUser ? (
              <>
                <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#6C5CE7] to-[#8B7FE8] rounded-full flex items-center justify-center overflow-hidden">
                      {selectedConversation?.user?.profilePic ? (
                        <img src={selectedConversation.user.profilePic} alt={selectedConversation.user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{selectedConversation?.user?.fullName || 'User'}</h3>
                      <p className="text-sm text-gray-500">{selectedConversation?.user?.role || 'teacher'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-500 hover:text-[#6C5CE7] hover:bg-gray-100 rounded-lg transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-[#6C5CE7] hover:bg-gray-100 rounded-lg transition-colors">
                      <Video className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {(conversationData?.messages || []).map((message) => {
                    const mine = message.senderId === message.sender?.id && message.senderId !== selectedConversationUser;
                    return (
                      <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${mine ? 'bg-[#6C5CE7] text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                          {message.message && <p className="text-sm">{message.message}</p>}
                          {message.attachmentUrl && (
                            <a href={message.attachmentUrl} target="_blank" rel="noreferrer" className={`text-xs underline ${mine ? 'text-white' : 'text-blue-600'}`}>
                              {message.attachmentName || 'Attachment'}
                            </a>
                          )}
                          <p className={`text-xs mt-1 ${mine ? 'text-purple-200' : 'text-gray-500'}`}>
                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                          </p>
                          <button
                            onClick={() => archiveMutation.mutate(message.id)}
                            className={`text-[10px] mt-1 ${mine ? 'text-white/90' : 'text-gray-600'}`}
                          >
                            Archive
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-white p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <label className="p-2 text-gray-500 hover:text-[#6C5CE7] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                      <Paperclip className="w-5 h-5" />
                      <input type="file" className="hidden" onChange={(event) => setAttachment(event.target.files?.[0] || null)} />
                    </label>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(event) => setNewMessage(event.target.value)}
                        placeholder="Type your message..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                        onKeyDown={(event) => event.key === 'Enter' && handleSendMessage()}
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      className="p-2 bg-[#6C5CE7] text-white rounded-lg hover:bg-[#5A4FCF] transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  {attachment && <p className="text-xs text-gray-500 mt-2">Attachment: {attachment.name}</p>}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No conversation selected</h3>
                  <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SchoolLayout>
  );
};

export default SchoolMessages;
