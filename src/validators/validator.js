import mongoose from "mongoose";


export const is_Valid_RequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
  };
  

  export const is_Valid_String = function (value) {
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };
  

  export const is_Valid_ObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}