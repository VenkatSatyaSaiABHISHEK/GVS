import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import TeacherLayout from './TeacherDashboard/TeacherLayout';
import {
  getAllConversations,
  getConversation,
  sendMessageWithAttachment,
  getInboxMessages,
  getSentMessages,
  getArchivedMessages,
  archiveMessage,
} from '@/services/messageServices';
import { Plus, Paperclip, Send, Inbox, Archive, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const TeacherMessages = () => {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const preselectedUserId = searchParams.get('userId');
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedConversationUser, setSelectedConversationUser] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [attachment, setAttachment] = useState(null);

  const { data: conversationsData } = useQuery({
    queryKey: ['teacher-conversations'],
    queryFn: getAllConversations,
    refetchInterval: 15000,
  });

  const conversations = conversationsData?.conversations || [];

  useEffect(() => {
    if (preselectedUserId && !selectedConversationUser) {
      setSelectedConversationUser(preselectedUserId);
    }
  }, [preselectedUserId, selectedConversationUser]);

  const { data: conversationData } = useQuery({
    queryKey: ['teacher-conversation', selectedConversationUser],
    queryFn: () => getConversation(selectedConversationUser),
    enabled: Boolean(selectedConversationUser),
    refetchInterval: 15000,
  });

  const { data: inboxData } = useQuery({
    queryKey: ['teacher-inbox'],
    queryFn: getInboxMessages,
  });

  const { data: sentData } = useQuery({
    queryKey: ['teacher-sent'],
    queryFn: getSentMessages,
  });

  const { data: archivedData } = useQuery({
    queryKey: ['teacher-archived'],
    queryFn: getArchivedMessages,
  });

  const sendMutation = useMutation({
    mutationFn: sendMessageWithAttachment,
    onSuccess: () => {
      setMessageInput('');
      setAttachment(null);
      queryClient.invalidateQueries(['teacher-conversations']);
      queryClient.invalidateQueries(['teacher-conversation', selectedConversationUser]);
      queryClient.invalidateQueries(['teacher-inbox']);
      queryClient.invalidateQueries(['teacher-sent']);
      toast.success('Message sent');
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || 'Failed to send message');
    },
  });

  const archiveMutation = useMutation({
    mutationFn: archiveMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(['teacher-inbox']);
      queryClient.invalidateQueries(['teacher-sent']);
      queryClient.invalidateQueries(['teacher-archived']);
      toast.success('Message archived');
    },
  });

  const folderMessages = useMemo(() => {
    if (activeTab === 'inbox') return inboxData?.messages || [];
    if (activeTab === 'sent') return sentData?.messages || [];
    return archivedData?.messages || [];
  }, [activeTab, inboxData, sentData, archivedData]);

  const onSend = () => {
    if (!selectedConversationUser) {
      toast.error('Select a conversation first');
      return;
    }

    if (!messageInput && !attachment) {
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
    <TeacherLayout>
      <div className="p-6 bg-[#F7F8FC] min-h-screen">
        <div className="bg-white rounded-3xl shadow-md overflow-hidden h-[calc(100vh-140px)]">
          <div className="flex h-full">
            <div className="w-96 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button onClick={() => setActiveTab('inbox')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'inbox' ? 'bg-[#6C5DD3] text-white' : 'bg-gray-100 text-gray-700'}`}>Inbox</button>
                  <button onClick={() => setActiveTab('sent')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'sent' ? 'bg-[#6C5DD3] text-white' : 'bg-gray-100 text-gray-700'}`}>Sent</button>
                  <button onClick={() => setActiveTab('archived')} className={`px-3 py-2 rounded-lg text-sm ${activeTab === 'archived' ? 'bg-[#6C5DD3] text-white' : 'bg-gray-100 text-gray-700'}`}>Archived</button>
                </div>
                <button className="w-full bg-[#6C5DD3] text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-semibold">
                  <Plus className="w-5 h-5" /> New Message
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.user.id}
                    onClick={() => setSelectedConversationUser(conversation.user.id)}
                    className={`w-full p-3 rounded-xl text-left ${selectedConversationUser === conversation.user.id ? 'bg-[#6C5DD3] bg-opacity-10 border border-[#6C5DD3]' : 'hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-sm">{conversation.user.fullName || 'User'}</p>
                      {conversation.unreadCount > 0 && <span className="text-xs bg-[#6C5DD3] text-white rounded-full px-2 py-0.5">{conversation.unreadCount}</span>}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{conversation.lastMessage?.message || 'No messages yet'}</p>
                  </button>
                ))}

                {conversations.length === 0 && <p className="text-sm text-gray-500 text-center py-8">No conversations yet.</p>}
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{selectedConversationUser ? 'Chat' : 'Message Center'}</h3>
                  <p className="text-sm text-gray-500">Inbox • Sent • Archived</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {selectedConversationUser ? (
                  (conversationData?.messages || []).map((message) => {
                    const mine = message.senderId !== selectedConversationUser;
                    return (
                      <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-xl p-3 ${mine ? 'bg-[#6C5DD3] text-white' : 'bg-gray-100 text-gray-800'}`}>
                          {message.message && <p className="text-sm">{message.message}</p>}
                          {message.attachmentUrl && (
                            <a href={message.attachmentUrl} target="_blank" rel="noreferrer" className={`text-xs underline ${mine ? 'text-white' : 'text-blue-600'}`}>
                              {message.attachmentName || 'Attachment'}
                            </a>
                          )}
                          <p className={`text-[10px] mt-1 ${mine ? 'text-white/80' : 'text-gray-500'}`}>
                            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                          </p>
                          <button
                            onClick={() => archiveMutation.mutate(message.id)}
                            className={`text-[10px] mt-1 inline-flex items-center gap-1 ${mine ? 'text-white/90' : 'text-gray-600'}`}
                          >
                            <Archive className="w-3 h-3" /> Archive
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-16 text-gray-400">
                    <Inbox className="w-16 h-16 mx-auto mb-4" />
                    <p>Select a conversation to start chatting</p>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-2">
                  {activeTab === 'inbox' && `Inbox messages: ${folderMessages.length}`}
                  {activeTab === 'sent' && `Sent messages: ${folderMessages.length}`}
                  {activeTab === 'archived' && `Archived messages: ${folderMessages.length}`}
                </div>
                <div className="flex items-end gap-3">
                  <textarea
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                    placeholder="Type your message..."
                    rows={2}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none"
                  />
                  <label className="p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <Paperclip className="w-5 h-5 text-gray-600" />
                    <input type="file" className="hidden" onChange={(event) => setAttachment(event.target.files?.[0] || null)} />
                  </label>
                  <button onClick={onSend} className="bg-[#6C5DD3] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#5B4DC2] inline-flex items-center gap-2">
                    <Send className="w-5 h-5" /> Send
                  </button>
                </div>
                {attachment && <p className="text-xs text-gray-500 mt-2 inline-flex items-center gap-1"><Mail className="w-3 h-3" /> {attachment.name}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeacherLayout>
  );
};

export default TeacherMessages;
