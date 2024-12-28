import { Category } from "../model/category.model";
import Audio from "../model/audio.model";
import { ObjectId } from "mongodb";



export const getAllCategories = async () => {
    const categories = await Category.find({});
    return categories.map((category) => {
        return {
            id: category._id,
            name: category.name,
            description: category.description
        };
    });
};

export const filter = async ({q , page , limit ,field ,sort}) =>{
    q = q ? {"$regex" : q , "$options" : "i" } : null;
    
    const filter = {
       ...(q && {$or : [ {name : q} , {description : q} ]})
    }

    const jump = (page-1)*limit; 

    const categories = await Category.find(filter)
       .skip(jump)
       .limit(limit)
       .sort({[field] : sort});

    return categories.map((category)=>{
        return {
            id : category._id,
            name : category.name,
            description : category.description
        }
    })
}

export const create = async ({name , description}) => {
    const category = new Category({
        name,
        description
    })

    return await category.save();
}

export const detail = async ({id}) => {
    return await Category.findById(id);
}

export const update = async ({id , name ,description}) => {
    const category = await Category.findById(id);
    name ? category.name = name : "";
    description ? category.description = description : "";
    return await category.save();
}

export const remove = async ({id}) => {
    const category = await Category.findById(id);
    Promise.all(category.sounds.map(async (audio_id) => {
        await Audio.findByIdAndUpdate(
            {_id: new ObjectId(audio_id)},
            { $pull: {categories: id}},
        );
    }));
    
    return await Category.deleteOne({_id: id})
}