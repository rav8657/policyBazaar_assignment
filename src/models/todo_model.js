import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    list: {
        type: String,
        required: true
    },
    task: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true

    },
    status: {
        type: String,
        default: 'To-do',
        enum: ['To-do','In progress', 'Completed']
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

});

export default mongoose.model('todo', todoSchema);
