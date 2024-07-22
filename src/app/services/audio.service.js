import Audio from "../model/audio.model" 
import FileUpload from "@/utils/handlers/audioUpload";
import { APP_URL_API } from "@/config";
import { Category } from "../model/category.model";
import { ObjectId } from "mongodb";
import { User } from "../model/user.model";
import { Types } from "mongoose";

export function toObjectId(id) {
    if (Types.ObjectId.isValid(id)) {
      if (id instanceof Types.ObjectId) {
        return id; 
      } else {
        return new Types.ObjectId(id);
      }
    } else {
      throw new Error('Invalid ID');
    }
}

export const filterAudio = async ({ q , page , limit , field , sort})=>{
    q = q ? { "$regex" : q , "$options" : "i"} : null;
    
    const filter = {
        ...(q && {$or : [ {name : q} , {description : q} ]})
    }
    const jump = (page-1)*limit; 

    const audios = await Audio.find(filter)
        .skip(jump)
        .limit(limit)
        .sort({[field] : sort});

    return audios.map((audio)=>{
        audio.sourceUrl = APP_URL_API + audio.sourceUrl
        if(audio.thumnailUrl)
        audio.thumnailUrl = APP_URL_API + audio.thumnailUrl
        return audio;
    })
}

export const createAudio = async (req) =>{
    try {
        const { name, description,thumnail, sound, categories } = req.body;
        const { email } = req.curentUser;
        const user = await User.findOne({ email : email });

        const audio = new Audio({_id:new ObjectId()});
        audio.name = name;
        audio.description = description;
        audio.categories = categories;
        Promise.all(categories.map(async (category_id) =>{
            await Category.findByIdAndUpdate(
                category_id,
                { $push : {sounds : audio._id}}
            )
        }))
        
        await User.findByIdAndUpdate(
            user._id,
            {$push : { uploadedAudio : audio._id}}
        )

        if (thumnail instanceof FileUpload){
            audio.thumnailUrl = thumnail.save();
        }
        if (sound instanceof FileUpload) {
            audio.sourceUrl = sound.save();
        }
        return await audio.save();
    }
    catch (err) {
        return new Error("failed to save audio: " + err.message);
    }
}

export const detailAudio = async ({id})=>{
    const audio =  await Audio.findById(id);
    audio.sourceUrl = APP_URL_API + audio.sourceUrl
    audio.thumnailUrl = APP_URL_API + audio.thumnailUrl

    return audio;
}

export const updateAudio = async ({body,curentUser})=>{

    try {
    const {id,name,description,thumnail,sound,categories} = body
    const { email } = curentUser;
    const user = await User.findOne({email :email })
    if(user){
        if(user.uploadedAudio){
            const isSoundOfUser = user.uploadedAudio.filter(item => item === toObjectId(body.id));
            if(!isSoundOfUser) return false
        }
    }
    const audio = await Audio.findById(id);
    name? audio.name = name : "";
    description? audio.description = description : "";

    Promise.all(audio.categories.map(async (category_id) => {
        await Category.findByIdAndUpdate(
            category_id,
            { $pull: {sounds: toObjectId(id)}},
        );
    }));

    categories? audio.categories = categories : "";
    if(categories)
    Promise.all(categories.map(async (category_id) => {
        await Category.findByIdAndUpdate(
            category_id,
            { $push: {sounds: toObjectId(id)}}
        );
    }));

    if (thumnail instanceof FileUpload) {
        FileUpload.remove(audio.thumnailUrl);
        audio.thumnailUrl = thumnail.save();
    }

    if (sound instanceof FileUpload) {
        FileUpload.remove(audio.sourceUrl);
        audio.sourceUrl = sound.save();
    }

    return await audio.save();
} catch (err) {
    throw new Error("Failed to update audio: " + err.message);
}
}

export const removeAudio = async ({body,curentUser})=>{
    
 try {
    const user = await User.findOne({ email : curentUser.email });
    if(user.uploadedAudio){
        const isSoundOfUser = user.uploadedAudio.filter(item => item === toObjectId(body.id));
        if(!isSoundOfUser) return false
    }
    const id = body.id;
    const audio = await Audio.findById(id);
    Promise.all(audio.categories.map(async (category_id) => {
        await Category.findByIdAndUpdate(
            category_id,
            { $pull: {sounds: toObjectId(id)}},
        );
    }));
    
    await User.updateOne(
        {email:curentUser.email},
        {$pull: { uploadedAudio : toObjectId(id)}}
    )
    if(audio.sourceUrl)
    FileUpload.remove(audio.sourceUrl);
    if(audio.thumnailUrl)
    FileUpload.remove(audio.thumnailUrl);

    return await Audio.findByIdAndDelete(toObjectId(id));
} catch (err) {
    throw new Error("Failed to remove audio: " + err.message);
}
}