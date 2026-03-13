import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, User, Send, Paperclip } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import ParentLayout from './ParentLayout';
import {
  getAllConversations,
  getConversation,
  sendMessageWithAttachment,
  getInboxMessages,
  getSentMessages,
  getArchivedMessages,
  archiveMessage,
} from '@/services/messageServices';

const Messages = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const preselectedUserId = searchParams.get('userId');
  const [selectedConversationUser, setSelectedConversationUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('inbox');
  const [messageInput, setMessageInput] = useState('');
  const [attachment, setAttachment] = useState(null);

  const { data: conversationsData } = useQuery({
    queryKey: ['parent-conversations'],
    queryFn: getAllConversations,
    refetchInterval: 15000,
  });

  const conversations = useMemo(() => conversationsData?.conversations || [], [conversationsData]);

  useEffect(() => {
    if (preselectedUserId && !selectedConversationUser) {
      setSelectedConversationUser(preselectedUserId);
    }
  }, [preselectedUserId, selectedConversationUser]);

  const filteredConversations = useMemo(() => {
    if (!searchQuery) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter((item) => item.user?.fullName?.toLowerCase().includes(q));
  }, [conversations, searchQuery]);

  const { data: conversationData } = useQuery({
    queryKey: ['parent-conversation', selectedConversationUser],
    queryFn: () => getConversation(selectedConversationUser),
    enabled: Boolean(selectedConversationUser),
    refetchInterval: 15000,
  });

  const { data: inboxData } = useQuery({ queryKey: ['parent-inbox'], queryFn: getInboxMessages });
  const { data: sentData } = useQuery({ queryKey: ['parent-sent'], queryFn: getSentMessages });
  const { data: archivedData } = useQuery({ queryKey: ['parent-archived'], queryFn: getArchivedMessages });

  const folderMessages = useMemo(() => {
    if (activeTab === 'inbox') return inboxData?.messages || [];
    if (activeTab === 'sent') return sentData?.messages || [];
    return archivedData?.messages || [];
  }, [activeTab, inboxData, sentData, archivedData]);

  const sendMutation = useMutation({
    mutationFn: sendMessageWithAttachment,
    onSuccess: () => {
      setMessageInput('');
      setAttachment(null);
      queryClient.invalidateQueries({ queryKey: ['parent-conversations'] });
      queryClient.invalidateQueries({ queryKey: ['parent-conversation', selectedConversationUser] });
      queryClient.invalidateQueries({ queryKey: ['parent-inbox'] });
      queryClient.invalidateQueries({ queryKey: ['parent-sent'] });
      toast.success('Message sent');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to send message');
    },
  });

  const archiveMutation = useMutation({
    mutationFn: archiveMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent-inbox'] });
      queryClient.invalidateQueries({ queryKey: ['parent-sent'] });
      queryClient.invalidateQueries({ queryKey: ['parent-archived'] });
      queryClient.invalidateQueries({ queryKey: ['parent-conversation', selectedConversationUser] });
      toast.success('Message archived');
    },
  });

  const onSend = () => {
    if (!selectedConversationUser) {
      toast.error('Select a conversation first');
      return;
    }

    if (!messageInput.trim() && !attachment) {
      toast.error('Type a message or attach a file');
      return;
    }

    sendMutation.mutate({
      receiverId: selectedConversationUser,
      message: messageInput,
      attachment,
      relatedTo: 'general',
    });
  };

  return (
    <ParentLayout>
      <div className="flex h-[calc(100vh-70px)]">
        <div className="w-80 bg-white border-r border-[#E5E7EB]">
          <div className="p-4 border-b border-[#E5E7EB]">
            <div className="grid grid-cols-3 gap-2 mb-3">
              <button onClick={() => setActiveTab('inbox')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'inbox' ? 'bg-[#5B3DF5] text-white' : 'bg-gray-100 text-gray-700'}`}>Inbox</button>
              <button onClick={() => setActiveTab('sent')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'sent' ? 'bg-[#5B3DF5] text-white' : 'bg-gray-100 text-gray-700'}`}>Sent</button>
              <button onClick={() => setActiveTab('archived')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'archived' ? 'bg-[#5B3DF5] text-white' : 'bg-gray-100 text-gray-700'}`}>Archived</button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B3DF5] text-sm"
              />
            </div>
          </div>

          <div className="text-xs text-[#6B7280] px-4 py-2 border-b border-[#E5E7EB]">
            {activeTab === 'inbox' && `Inbox messages: ${folderMessages.length}`}
            {activeTab === 'sent' && `Sent messages: ${folderMessages.length}`}
            {activeTab === 'archived' && `Archived messages: ${folderMessages.length}`}
          </div>

          <div className="overflow-y-auto">
            {filteredConversations.map((chat) => (
              <div
                key={chat.user.id}
                onClick={() => setSelectedConversationUser(chat.user.id)}
                className={`p-4 border-b border-[#E5E7EB] cursor-pointer hover:bg-gray-50 ${selectedConversationUser === chat.user.id ? 'bg-blue-50 border-r-2 border-r-[#5B3DF5]' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#5B3DF5] to-[#7A5CFF] rounded-full flex items-center justify-center overflow-hidden">
                    {chat.user?.profilePic ? (
                      <img src={chat.user.profilePic} alt={chat.user.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-[#111827] truncate">{chat.user?.fullName || 'User'}</h3>
                      <span className="text-xs text-[#6B7280]">
                        {chat.lastMessage?.createdAt ? formatDistanceToNow(new Date(chat.lastMessage.createdAt), { addSuffix: true }) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7280] mb-1">{chat.user?.role || 'teacher'}</p>
                    <p className="text-sm text-[#6B7280] truncate">{chat.lastMessage?.message || 'No messages yet'}</p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-[#5B3DF5] rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">{chat.unreadCount}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {filteredConversations.length === 0 && <p className="text-sm text-[#6B7280] text-center py-8">No conversations found.</p>}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedConversationUser ? (
            <>
              <div className="p-4 bg-white border-b border-[#E5E7EB]">
                <h3 className="font-medium text-[#111827]">Conversation</h3>
                <p className="text-sm text-[#6B7280]">Live messages</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {(conversationData?.messages || []).map((message) => {
                  const mine = message.senderId !== selectedConversationUser;
                  return (
                    <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${mine ? 'bg-[#5B3DF5] text-white' : 'bg-gray-100 text-[#111827]'}`}>
                        {message.message && <p className="text-sm">{message.message}</p>}
                        {message.attachmentUrl && (
                          <a href={message.attachmentUrl} target="_blank" rel="noreferrer" className={`text-xs underline ${mine ? 'text-purple-200' : 'text-blue-600'}`}>
                            {message.attachmentName || 'Attachment'}
                          </a>
                        )}
                        <p className={`text-xs mt-1 ${mine ? 'text-purple-200' : 'text-[#6B7280]'}`}>
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </p>
                        <button onClick={() => archiveMutation.mutate(message.id)} className={`text-[10px] mt-1 ${mine ? 'text-purple-100' : 'text-[#6B7280]'}`}>
                          Archive
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 bg-white border-t border-[#E5E7EB]">
                <div className="flex items-center space-x-3">
                  <label className="p-2 text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer">
                    <Paperclip className="h-5 w-5" />
                    <input type="file" className="hidden" onChange={(event) => setAttachment(event.target.files?.[0] || null)} />
                  </label>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(event) => setMessageInput(event.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B3DF5] text-sm"
                      onKeyDown={(event) => event.key === 'Enter' && onSend()}
                    />
                  </div>
                  <button onClick={onSend} className="p-2 bg-[#5B3DF5] text-white rounded-lg hover:bg-[#4B2BBF] transition-colors">
                    <Send className="h-5 w-5" />
                  </button>
                </div>
                {attachment && <p className="text-xs text-[#6B7280] mt-2">Attachment: {attachment.name}</p>}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#6B7280]">Select a conversation to start chatting</div>
          )}
        </div>
      </div>
    </ParentLayout>
  );
};

export default Messages;
