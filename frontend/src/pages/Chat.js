"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { SocketContext } from "../context/SocketContext"
import { getChatHistory, sendMessage } from "../services/api"
import "./Chat.css"

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const { user } = useContext(AuthContext)
  const { socket } = useContext(SocketContext)

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const chatData = await getChatHistory()
        setMessages(chatData.messages || [])
        setLoading(false)
      } catch (err) {
        setError("Failed to load chat history")
        setLoading(false)
      }
    }

    fetchChatHistory()
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (data) => {
        if (data.isAdmin) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              sender: { _id: "admin", firstName: "Support" },
              content: data.message,
              timestamp: data.timestamp,
            },
          ])
        }
      })

      return () => {
        socket.off("newMessage")
      }
    }
  }, [socket])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    try {
      await sendMessage(newMessage)

      // Add message to UI immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: { _id: user._id, firstName: user.firstName },
          content: newMessage,
          timestamp: new Date(),
        },
      ])

      setNewMessage("")
    } catch (err) {
      setError("Failed to send message")
    }
  }

  if (loading) {
    return <div className="loading">Loading chat...</div>
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <h1>Customer Support</h1>
          <p>We're here to help! Send us a message and we'll get back to you as soon as possible.</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-chat">
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender._id === user._id ? "message-user" : "message-admin"}`}>
                <div className="message-content">{msg.content}</div>
                <div className="message-info">
                  <span className="message-sender">{msg.sender._id === user._id ? "You" : "Support"}</span>
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            required
          />
          <button type="submit" className="btn btn-primary">
            Send
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chat

