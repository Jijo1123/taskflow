"use client"

import { createContext, useState, useEffect, useContext } from "react"
import io from "socket.io-client"
import { AuthContext } from "./AuthContext"

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const { user, isAuthenticated } = useContext(AuthContext)

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.REACT_APP_API_URL || "http://localhost:5000", {
      withCredentials: true,
    })

    newSocket.on("connect", () => {
      console.log("Socket connected")
      setConnected(true)

      // Join user room if authenticated
      if (isAuthenticated && user) {
        newSocket.emit("join", user._id)

        // Join admin room if user is admin
        if (user.role === "admin") {
          newSocket.emit("joinAdmin")
        }
      }
    })

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected")
      setConnected(false)
    })

    setSocket(newSocket)

    // Cleanup on unmount
    return () => {
      newSocket.disconnect()
    }
  }, [isAuthenticated, user])

  // Rejoin rooms when auth state changes
  useEffect(() => {
    if (socket && isAuthenticated && user) {
      socket.emit("join", user._id)

      if (user.role === "admin") {
        socket.emit("joinAdmin")
      }
    }
  }, [socket, isAuthenticated, user])

  return <SocketContext.Provider value={{ socket, connected }}>{children}</SocketContext.Provider>
}

