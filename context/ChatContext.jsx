import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({children}) => {
    const [messages, setMessages] = useState([]); // Changed from message to messages for consistency
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const {socket, axios} = useContext(AuthContext);
    
    // function to get all users for sidebar
    const getUsers = async () => {
        try {
            const {data} = await axios.get("/api/messages/users");
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages || {}); // Added fallback to empty object
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    // function to get messages for selected user
    const getMessages = async (userId) => {
        try {
            const {data} = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages); // Changed to setMessages
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    }

    // function to send message to selected user
    const sendMessage = async (messageData) => {
        if (!selectedUser) {
            toast.error("No user selected");
            return;
        }
        
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages, data.newMessage]);
                return data.newMessage; // Return the new message for potential use
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            return null;
        }
    }

    // function to subscribe to messages for selected user
    const subscribeToMessages = () => {
        if(!socket) return;

        socket.on("newMessage", (newMessage) => {
            if(selectedUser && newMessage.senderId === selectedUser._id){
                // For current chat
                setMessages(prev => [...prev, {...newMessage, seen: true}]);
                axios.post(`/api/messages/mark/${newMessage._id}`).catch(console.error);
            } else {
                // For other users
                setUnseenMessages(prev => ({
                    ...prev, 
                    [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1
                }));
            }
        });
    }

    // function to unsubscribe from messages
    const unsubscribeFromMessages = () => {
        if(socket) socket.off("newMessage");
    }

    useEffect(() => {
        subscribeToMessages();
        return unsubscribeFromMessages; // Fixed typo in function name
    }, [socket, selectedUser]);

    const value = {
        messages, // Changed from message to messages
        users, 
        selectedUser, 
        getUsers, 
        getMessages, 
        sendMessage, 
        setSelectedUser, 
        unseenMessages, 
        setUnseenMessages,
    }

    return ( 
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}