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
        default: 0, 
        min: 0      
    },
    downloads: {
        type: Number,
        default: 0, 
        min: 0      
    },
    reports: { // Thêm trường reports là số
        type: Number,
        default: 0,
        min: 0
    }
});

const Audio = createModel("Audio", schema);  
export default Audio;
