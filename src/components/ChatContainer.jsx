import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {
  const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext)
  const { authUser, onlineUsers } = useContext(AuthContext)
  const scrollEnd = useRef()
  const [input, setInput] = useState('')

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (input.trim() === "") return
    await sendMessage({ text: input.trim() })
    setInput("")
  }

  const handleSendImage = async (e) => {
    const file = e.target.files[0]
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file")
      return
    }
    const reader = new FileReader()
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result })
      e.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  // Load messages when user is selected
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id)
    }
  }, [selectedUser])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  if (!selectedUser) {
    return (
      <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden h-full'>
        <img src={assets.logo_icon} alt="App logo" className='max-w-16' />
        <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
      </div>
    )
  }

  return (
    <div className='h-full overflow-hidden relative backdrop-blur-lg flex flex-col'>
      {/* Header */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={selectedUser.profilePic || assets.avatar_icon} alt="Profile" className='w-8 rounded-full' />
        <p className='flex-1 text-lg text-white flex items-center gap-2'>
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="Back arrow"
          className='md:hidden max-w-7 cursor-pointer'
        />
      </div>

      {/* Chat messages */}
      <div className='flex-1 overflow-y-auto p-3 pb-6'>
        {messages?.map((msg, index) => {
          if (!msg || !msg.senderId) return null
          
          const isCurrentUser = msg.senderId === authUser._id
          
          return (
            <div
              key={index}
              className={`flex items-end gap-2 mb-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Sender avatar (for received messages) */}
              {!isCurrentUser && (
                <div className='text-center text-xs'>
                  <img
                    src={selectedUser?.profilePic || assets.avatar_icon}
                    alt="Sender"
                    className='w-7 rounded-full'
                  />
                  <p className='text-gray-500'>
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>
              )}

              {/* Message content */}
              {msg.image ? (
                <img
                  src={msg.image}
                  alt="Message"
                  className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden'
                />
              ) : (
                <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg text-white ${
                  isCurrentUser ? 'bg-blue-500 rounded-br-none' : 'bg-gray-700 rounded-bl-none'
                }`}>
                  {msg.text}
                </p>
              )}

              {/* Current user avatar (for sent messages) */}
              {isCurrentUser && (
                <div className='text-center text-xs'>
                  <img
                    src={authUser?.profilePic || assets.avatar_icon}
                    alt="You"
                    className='w-7 rounded-full'
                  />
                  <p className='text-gray-500'>
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>
              )}
            </div>
          )
        })}
        <div ref={scrollEnd} />
      </div>

      {/* Message input */}
      <div className='flex items-center gap-3 p-3 border-t border-stone-500'>
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage(e)}
            type="text"
            placeholder='Type a message...'
            className='flex-1 text-sm p-2 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent'
          />
          <input 
            type="file" 
            id='image' 
            accept='image/png,image/jpeg' 
            hidden 
            onChange={handleSendImage}
          />
          <label htmlFor="image" className='cursor-pointer'>
            <img src={assets.gallery_icon} alt="Attach" className='w-5 mr-2' />
          </label>
        </div>
        <button 
          onClick={handleSendMessage}
          disabled={!input.trim()}
          className='focus:outline-none disabled:opacity-50'
        >
          <img src={assets.send_button} alt="Send" className='w-7 cursor-pointer' />
        </button>
      </div>
    </div>
  )
}

export default ChatContainer