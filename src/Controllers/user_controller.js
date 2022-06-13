import user_model from "../models/users_model.js";
import { is_Valid_RequestBody, is_Valid_String } from "../validators/validator.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const saltRounds = 10;


export const createUser = async (req, res) => {
    try {
        let { name, email, password, phone } = req.body;

        if (!is_Valid_RequestBody(req.body)) {
            return res.staus(400).send("Provide valid request body.");
        }
        if (!is_Valid_String(name)) {
            return res.staus(400).send("Provide valid name.");
        }
        if (!is_Valid_String(email)) {
            return res.staus(400).send("Provide valid email.");
        }
        if (!is_Valid_String(password)) {
            return res.staus(400).send("Provide valid password.");
        }
        if (!is_Valid_String(phone)) {
            return res.staus(400).send("Provide valid phone.");
        }

        //Checking wheather email is already used or not.
        const emailAlreadyUsed = await user_model.findOne({ email });
        if (emailAlreadyUsed) {
            return res.status(400).send(`${email} is already used.`);
        }

        //Email validation using regex

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
            return res.status(400).send("Invalid email id.");

        if (!(password.length >= 8 && password.length <= 15)) {
            return res.status(400).send({ status: false, message: "Password should be Valid min 8 and max 15 " });
        }

        password = await bcrypt.hash(password, saltRounds); //encrypting password by using bcrypt.


        //validating phone number of 10 digits only.
        if (phone) {
            if (!/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(phone)) {
                return res.status(400).send({ status: false, message: `Mobile should be a valid number` });
            }
            //searching phone in DB to maintain its uniqueness
            let isPhoneAlredyPresent = await user_model.findOne({ phone: phone })
            if (isPhoneAlredyPresent) {
                return res.status(400).send({ status: false, message: `Phone Number Already Present` });
            }
        }
        const userDetails = await user_model.create({
            name,
            email,
            password,
            phone
        });

        return res.status(200).send(`Congrats ${name}. You are now successfully registered.`);
    } catch (error) {
        res.status(500).send(error.message);
    }
};






export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;



        if (!is_Valid_RequestBody(req.body)) {
            return res.staus(400).send("Provide valid request body.");
        }

        if (!is_Valid_String(email)) {
            return res.staus(400).send("Provide valid email.");
        }
        if (!is_Valid_String(password)) {
            return res.staus(400).send("Provide valid password.");
        }

        //Email validation using regex

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
            return res.status(400).send("Invalid email id.");

        const findUser = await user_model.findOne({ email });


        if (!findUser) {
            return res.status(400).send("user not found");
        }

        if (!(password.length >= 8 && password.length <= 15)) {
            return res.status(400).send({ status: false, message: "Password should be Valid min 8 and max 15 " })
        }
        // Validation ends

        //finding user's details in DB to verify the credentials.
        const user = await user_model.findOne({ email });
        if (!user) {
            return res.status(401).send({ status: false, message: `Invalid login credentials` });
        }

        let hashedPassword = user.password

        //converting normal password to hashed value to match it with DB's entry by using compare function.
        const encryptedPassword = await bcrypt.compare(password, hashedPassword)

        if (!encryptedPassword) return res.status(401).send({ status: false, message: `Invalid login credentials` });

        //Creating JWT token through userId. 
        const token = jwt.sign({
            userId: user._id,
            iat: Math.floor(Date.now() / 1000),   //time of issuing the token.
            exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 7 //+ 60 * 30 setting token expiry time limit.
        }, process.env.SECRET_KEY)
        res.header("BearerToken", token);

        res.status(200).send({ status: true, msg: "user login successfully", data: { userId: user._id, token: token } });
    } catch (error) {
        res.status(500).send(error.message);
    }
};