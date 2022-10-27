import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import Admin from "../model/Admin.js";
import "dotenv/config";

async function getAdmin(req, res){
    try {
        const admin = req.cookies.adminCookie;
        
        console.log(admin, process.env.API_TOKEN);
        
        const data = jwt.verify(admin, process.env.API_TOKEN);
    
        const response = await User.findOne({
            username: data.username,
        });
    
        res.send(response);
    } catch (error) {
        res.json({status: 401, message: error.message});
    }
}

async function login(req, res){
    try {
        console.log(req.body.username, req.body.password);
        const admin = await Admin.findOne({
            username: req.body.username
        });

        console.log("ADMIN: ", admin);

        if(!admin){
            res.json({status: 403, message: "Failed to Verify your identity"});
            return;
        }
        
        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            admin.password
        );

        if(!passwordIsValid) {
            res.json({status: 403, message: "Invalid password!"});
            return;
        }

        res.json({status: 200, message: "Success to login"});

        // const userToken = jwt.sign(
        //     JSON.stringify({
        //         username: response.username,
        //     }),
        //     process.env.API_TOKEN
        // );

        // res.cookie("adminCookie", userToken, {
        //     httpOnly: true,
        //     // secure: process.env.ENVIRONMENT === "production",
        //     SameSite: true,
        // });

        // res.redirect("/");
        // res.json({status: 200, message: "Success to login", token: userToken});
       
    } catch (error) {
        res.json({status: 401, message: error.message});
    }
}

async function logout(req, res){
    res.cookie("adminCookie", null, {
        httpOnly: true,
        // secure: process.env.ENVIRONMENT === "production",
        SameSite: true,
        });
    res.clearCookie("adminCookie");
    res.redirect("/");
}

async function signup(req, res){
    try {
        const admin = new Admin ({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
            cookie: "",
            created_at: new Date().toJSON()
        })

        const result1 = await admin.save();

        res.json({status: 200, message: "Success to signup"});
    } catch (error) {
        res.json({status: 401, message: "Failed to signup"});
    }
}

const AdminController = {
    getAdmin,
    login,
    logout,
    signup
};

export default AdminController;
