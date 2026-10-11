import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversation_id: {
    type: String, 
    required: true,
    index: true
  },
  sender_id: {
    type: String,
    required: true,
    index: true
  },
  receiver_id: {
    type: String,
    required: true,
    index: true
  },

  type: {
    type: String,
    enum: ['text', 'image'],
    default: 'text'
  },

  content: {
    type: String,
    required: true
  },

  is_read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

messageSchema.index({ conversation_id: 1, created_at: -1 });
messageSchema.index({ sender_id: 1, receiver_id: 1, created_at: -1 });

export const Message = mongoose.model('Message', messageSchema);