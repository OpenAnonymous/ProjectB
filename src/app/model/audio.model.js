import { createModel } from "./base";
import { Schema } from "mongoose";

const schema = new Schema({
    name: String,
    description: String,
    authorId: String,
    thumnailUrl: String,
    sourceUrl: String,
    categories: Array,
    likes: {
        type: Number,
        default: 0, // Mặc định là 0 khi tạo mới
        min: 0      // Đảm bảo không âm
    },
    downloads: {
        type: Number,
        default: 0, // Mặc đ��nh là 0 khi tạo mới
        min: 0      // Đảm bảo không ��m
    }
});

const Audio = createModel("Audio", schema);  
export default Audio;
