import { Server } from 'socket.io';

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8000'],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('🔌 Client connected:', socket.id);

        socket.on('join_meeting', (meetingId) => {
            socket.join(meetingId);
            console.log(`Socket ${socket.id} joined meeting ${meetingId}`);
        });

        socket.on('leave_meeting', (meetingId) => {
            socket.leave(meetingId);
            console.log(`Socket ${socket.id} left meeting ${meetingId}`);
        });

        socket.on('disconnect', () => {
            console.log('❌ Client disconnected:', socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
