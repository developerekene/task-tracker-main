import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../../firbase-config";
import { RegisterFormData } from "../../utils/Types";

export class AuthService {
    async handleUserRegistration(userData: RegisterFormData) {
        const registerUser = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        const user = registerUser.user;
        await updateProfile(user, {
            displayName: `${userData.firstName} ${userData.lastName}`,
        });
    }
    async handleUserLogin(email: string, password: string) {
        const registerUser = await createUserWithEmailAndPassword(auth, email, password);
        const user = registerUser.user;

    }
}

export const authService = new AuthService()