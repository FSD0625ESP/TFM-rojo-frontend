import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Tabs, TabsContent } from "../components/ui/tabs";
import { ResponsiveTabsNav } from "./ResponsiveTabsNav";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../context/AuthContext";
//usar el contexto de chat en lugar de crear socket local
import { useChat } from "../context/ChatContext";
import { ChatPanel } from "./ChatPanel";
import { PrivateChatPanel } from "./PrivateChatPanel";
import { buildApiUrl } from "../utils/apiUtils";
import { formatDateWithTimezone } from "../utils/dateUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { MessageCircle, MoreVertical, Trash2 } from "lucide-react";
import { IMG_DEFAULT } from "../constants/images";
import { toast } from "sonner";

export function StartCommunityContent() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  //obtener funciones y estado del contexto de chat
  const { roomCounts, getRoomCount, connected, conversations, startPrivateChat, loadPrivateHistory, deleteConversation } = useChat();
  const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") || "channels");
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(() => searchParams.get("conversation") || null);
  const [chatRooms, setChatRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const tabItems = [
    { label: "Channels", value: "channels", private: false },
    { label: "Chats", value: "chats", private: false },
  ];

  //cargar salas de chat desde la BD
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoadingRooms(true);
        const roomsUrl = buildApiUrl("/chat/rooms");
        const res = await fetch(roomsUrl, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setChatRooms(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Error loading chat rooms:", error);
      } finally {
        setLoadingRooms(false);
      }
    };

    loadRooms();
  }, []);

  //obtener conteos de salas cuando se conecta el socket y hay salas cargadas
  useEffect(() => {
    if (connected && chatRooms.length > 0) {
      //solicitar conteo de todas las salas usando el contexto
      chatRooms.forEach((room) => {
        getRoomCount(room.name);
      });
    }
  }, [connected, chatRooms, getRoomCount]);

  //manejar cambio de tab desde query params
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && (tabParam === "channels" || tabParam === "chats")) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  //abrir conversación si viene en query params
  useEffect(() => {
    const conversationParam = searchParams.get("conversation");
    if (conversationParam && conversations.length > 0) {
      const conversation = conversations.find(c => c.conversationId === conversationParam);
      if (conversation) {
        setSelectedConversationId(conversationParam);
        setActiveTab("chats");
        setChatOpen(true);
        loadPrivateHistory(conversationParam);
        //limpiar query params después de abrir
        setSearchParams({});
      }
    }
  }, [searchParams, conversations, loadPrivateHistory, setSearchParams]);

  //manejar cambio de tab
  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  //abrir conversación privada
  const handleOpenConversation = (conversationId) => {
    setSelectedConversationId(conversationId);
    setChatOpen(true);
    //cargar historial (esto marcará los mensajes como leídos en el backend)
    loadPrivateHistory(conversationId);
  };

  //manejar click en eliminar conversación
  const handleDeleteClick = (e, conversation) => {
    e.stopPropagation(); //evitar que se abra el chat
    setConversationToDelete(conversation);
    setShowDeleteDialog(true);
  };

  //confirmar eliminación de conversación
  const confirmDelete = async () => {
    if (!conversationToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteConversation(conversationToDelete.conversationId);

      //mostrar mensaje según si se eliminó permanentemente o no
      if (result?.permanentlyDeleted) {
        toast.success("Conversation and all messages permanently deleted");
      } else {
        toast.success("Conversation removed from your list");
      }

      setShowDeleteDialog(false);
      setConversationToDelete(null);

      //si la conversación eliminada estaba abierta, cerrar el diálogo
      if (selectedConversationId === conversationToDelete.conversationId) {
        setChatOpen(false);
        setSelectedConversationId(null);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast.error(error.message || "Failed to delete conversation");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <ResponsiveTabsNav
        items={tabItems}
        activeTab={activeTab}
        onChange={handleTabChange}
        navigateToRoute={false}
        basePath=""
        tabListClassName="grid w-full grid-cols-[1fr_1fr] sm:grid-cols-2 h-full sm:mb-2"
      />

      {/* Channels Tab */}
      <TabsContent value="channels" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Communication Rooms</CardTitle>
            <CardDescription>
              Explore channels and join active communities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingRooms ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Loading rooms...</p>
              </div>
            ) : chatRooms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {chatRooms.map((room) => (
                  <Card key={room.id || room.name} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>{room.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Region: {room.region}
                      </p>
                      {room.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {room.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent className="flex justify-between items-center">
                      <Badge variant="outline">
                        {roomCounts[room.name] ?? room.memberCount ?? 0} members
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedRoom(room.name);
                          setChatOpen(true);
                        }}
                      >
                        Enter
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No chat rooms available</p>
                <p className="text-sm">Rooms will appear here once created</p>
              </div>
            )}
            <Dialog open={chatOpen} onOpenChange={() => { }}>
              <DialogContent className="sm:max-w-2xl" showCloseButton={false} onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader>
                  <DialogTitle>
                    {selectedRoom ? `Chat Room: ${selectedRoom}` : "Chat Room not selected"}
                  </DialogTitle>
                  <div className="text-sm text-muted-foreground">
                    {roomCounts[selectedRoom] ?? 0} active members
                  </div>
                </DialogHeader>
                <div className="h-[60vh]">
                  <ChatPanel
                    room={selectedRoom || "community"}
                    onLeave={() => setChatOpen(false)}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Chats Tab */}
      <TabsContent value="chats" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>My Chats</CardTitle>
            <CardDescription>
              Conversations with your personal contacts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {conversations.length > 0 ? (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.conversationId}
                    onClick={() => handleOpenConversation(conversation.conversationId)}
                    className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={conversation.otherParticipant.avatar || IMG_DEFAULT.avatarGuest.src}
                        alt={conversation.otherParticipant.userName}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">
                            {conversation.otherParticipant.userName}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center text-xs bg-blue-500">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        {conversation.lastMessage && (
                          <p className="text-sm text-muted-foreground w-40 truncate">
                            {conversation.lastMessage.text}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {conversation.lastMessage && (
                        <span className="text-xs text-muted-foreground">
                          {formatDateWithTimezone(
                            conversation.lastMessageAt,
                            user?.preferences?.timezone || "Europe/Madrid"
                          )}
                        </span>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-50 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => handleDeleteClick(e, conversation)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete conversation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-sm">Start a chat from your matches!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialog para chat privado */}
        <Dialog open={chatOpen && selectedConversationId} onOpenChange={setChatOpen}>
          <DialogContent className="sm:max-w-2xl" showCloseButton={false} onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>
                {conversations.find(c => c.conversationId === selectedConversationId)?.otherParticipant.userName || "Chat"}
              </DialogTitle>
            </DialogHeader>
            <div className="h-[60vh]">
              {selectedConversationId && (
                <PrivateChatPanel
                  conversationId={selectedConversationId}
                  onLeave={() => {
                    setChatOpen(false);
                    setSelectedConversationId(null);
                  }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog de confirmación para eliminar conversación */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl">⚠️ Delete Conversation</DialogTitle>
              <DialogDescription className="text-lg mt-4">
                Are you sure you want to remove the conversation with{" "}
                <strong>{conversationToDelete?.otherParticipant?.userName}</strong> from your list?
                <br />
                <br />
                This conversation will be <strong>removed from your chat list</strong>.
                <br />
                <br />
                The conversation and all messages will be <strong>permanently deleted</strong> only when{" "}
                <strong>both you and {conversationToDelete?.otherParticipant?.userName}</strong> delete it.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-center gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setConversationToDelete(null);
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Removing..." : "Remove from my list"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TabsContent>
    </Tabs>
  );
}

