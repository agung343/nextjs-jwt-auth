import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import User from "@/app/models/user.model";
import { connectDB } from "@/app/db/config";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        connectDB()
        const body = await request.json()
        const {email, password} = body

        if (!email || !password) {
            return NextResponse.json(
                {message: "Invalid Credential"},
                {status: 422}
            )
        }

        const user = await User.findOne({email: email})
        if (!user) {
            return NextResponse.json(
                {message: "Invalid Credential"},
                {status: 409}
            )
        }

        const matchPassword = await bcrypt.compare(password, user.password)
        if (!matchPassword) {
            return NextResponse.json(
                {message: "Invalid Credential"},
                {status: 409}
            )
        }

        const token = jwt.sign({
            name: user.name,
            userId: user._id.toString()
        }, "secret key", {expiresIn: "2h"})

        const response = NextResponse.json(
            {message: "user successfully login"},
            {status: 200}
        )
        response.cookies.set("token", token)
        return response;
    } catch (error) {
        return NextResponse.json(
            {message: "An Error Ocurred"},
            {status: 500}
        )
    }
}