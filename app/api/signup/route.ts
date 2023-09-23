import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"
import User from "@/app/models/user.model";
import { connectDB } from "@/app/db/config";

export async function POST(request: Request) {
    try {        
        connectDB()
        const body = await request.json()
        const {name, email, password} = body;
        if (!name || !email || !password) {
            return NextResponse.json(
                {message: "Invalid field"},
                {status: 400}
            )
        }

        const existingEmail = await User.findOne({email: email})
        if (existingEmail) {
            return NextResponse.json(
                {message: "Email already exist"},
                {status: 400}
            )
        }
        const saltRound = Math.floor(Math.random() * (Math.random() * 10 + 10) *10 + 10);
        const hashPassword = await bcrypt.hash(password, saltRound)

        const newUser = new User({
            name: name,
            email: email,
            password: hashPassword
        })

        const user = await newUser.save()
        const response = NextResponse.json(
            {message: "created new user"},
            {status: 201}
        )
        return response;
    } catch (error) {
        return NextResponse.json(
            {message: error},
            {status: 500}
        )
    }
}