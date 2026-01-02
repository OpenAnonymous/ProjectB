import { createModel } from "./base";
import { Schema } from "mongoose";

const schema = new Schema({
    name : String,
    password : String,
    email : String,
    avatarUrl : String,
    bio : String,
    likedAudio : Array,
    reportAudio : Array,
    uploadedAudio : Array,
    downloadedAudio : Array
})

export const User = createModel("User", schema);