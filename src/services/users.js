import dayjs from "dayjs";
import bcrypt from "bcrypt"
import { Messages } from "../constants/index.js";
import * as Modals from "../modals/index.js";
import { generateToken, hashOTP, sendEmail } from "../utils/index.js";

const signUp = async (data) => {
    try {
        const { name, email, password } = data;

        const verifiedUser = await Modals.User.findOne({ email, isEmailVerified: true })


        if (verifiedUser) {
            throw new Error(Messages.en.USER_ALREADY_VERIFIED)
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        // 3️⃣ Create or update unverified user
        await Modals.User.findOneAndUpdate(
            { email },
            {
                name, email, password: hashedPassword, isEmailVerified: false
            },
            {
                upsert: true, returnDocument: 'after', setDefaultsOnInsert: true
            }

        )
        let OTP = Math.floor(1000 + Math.random() * 9000);
        const hashedOtp = hashOTP(OTP);
        const expiresAt = dayjs().add(10, "minutes").toDate();

        await Modals.OTP.findOneAndUpdate(
            { email },
            { otp: hashedOtp, expiresAt },
            { upsert: true, returnDocument: 'after' }
        )

        if (email) {
            await sendEmail(email, OTP)
        }

        return {
            message: Messages.en.OTP_SEND,
            statusCode: 200,
        }


    } catch (error) {
        throw error;
    }
};


const verify = async (data) => {
    try {
        const { email, otp } = data;
        const hashedOtp = hashOTP(otp)

        const otpData = await Modals.OTP.findOne({ email })

        if (!otpData) {
            throw new Error(Messages.en.OTP_EXPIRED)
        }

        const findUser = await Modals.User.findOne({ email, isEmailVerified: true })

        if (findUser) {
            throw new Error(Messages.en.USER_ALREADY_EXISTS)
        }

        if (otpData && otpData.otp !== hashedOtp) {
            throw new Error(Messages.en.INVALID_OTP)
        }

        if (otpData) {
            const user = await Modals.User.findOneAndUpdate(
                { email },
                { isEmailVerified: true },
                { returnDocument: 'after', lean: true }
            );

            if (!user) {
                throw new Error(Messages.en.USER_NOT_FOUND);
            }

            await Modals.OTP.deleteOne({ email });

            const token = generateToken({ _id: user._id });
            console.log(token, 'token')

            return {
                message: Messages.en.OTP_VERIFIED,
                statusCode: 200,
                data: {
                    ...user, token
                }
            };
        }


    } catch (error) {
        throw error;
    }
}

export { signUp, verify };
