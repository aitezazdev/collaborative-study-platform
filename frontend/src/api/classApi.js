import instance from "./axios";

export const createClass = async(data)=>{
    try {
        const response = await instance.post('/class/create' , data);
        return response.data
    } catch (error) {
        console.log(error);
    }
}