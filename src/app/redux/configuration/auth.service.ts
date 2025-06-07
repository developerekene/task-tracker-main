import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { auth, db } from "../../../firbase-config";
import { RegisterFormData } from "../../utils/Types";
import { setUserData } from "../slices/user";
import { store } from "../store";

const getCurrentDateTime = () => {
    const now = new Date();

    const year = now.getFullYear(); // Retrieves the full year (e.g., 2024)
    const month = now.getMonth() + 1; // Retrieves the month (0-11), adding 1 to make it 1-12
    const date = now.getDate(); // Retrieves the day of the month (1-31)
    const hours = now.getHours(); // Retrieves the hour (0-23)
    const minutes = now.getMinutes(); // Retrieves the minutes (0-59)
    const seconds = now.getSeconds(); // Retrieves the seconds (0-59)

    // Formatting the date and time as strings
    const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    return {
        year,
        month,
        date,
        time: formattedTime,
        formattedDateTime: `${formattedDate} ${formattedTime}`
    };
}

export class AuthService {

    async handleUserRegistration(userData: RegisterFormData) {
        const registerUser = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
        const user = registerUser.user;
        const currentDateTime = getCurrentDateTime();
        await updateProfile(user, {
            displayName: `${userData.firstName} ${userData.lastName}`,
        });

        const userDocRef = doc(collection(db, "database"), user.uid);

        const database = {
            user: {
                primaryInformation: {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    initials: `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase(),
                    uniqueId: user.uid,
                    email: userData.email,
                    isLoggedIn: true,
                    agreedToTerms: true,
                    middleName: "",
                    phone: "",
                    gender: "",
                    dateOfBirth: "",
                    disability: false,
                    disabilityType: "",
                    photoUrl: "",
                    educationalLevel: "",
                    referralName: "",
                    secondaryEmail: "",
                    securityQuestion: "",
                    securityAnswer: "",
                    verifiedEmail: false,
                    verifyPhoneNumber: false,
                    twoFactorSettings: false,
                    role: "",
                    streetNumber: "",
                    streetName: "",
                    city: "",
                    state: "",
                    country: ""
                },
                location: {
                    // locationFromDevice: locationData,
                    currentdateTime: currentDateTime,
                },
            },
        };

        await setDoc(userDocRef, database);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
            const fetchedUserData = userSnapshot.data();
            const primaryInformation = fetchedUserData.user.primaryInformation;

            store.dispatch(setUserData({ ...primaryInformation, role: fetchedUserData.user.primaryInformation.role }));

            // ✅ Send email only after DB is confirmed written
            await sendEmailVerification(user);

            toast.success(`Your Account has been successfully created`, {
                style: { background: '#4BB543', color: '#fff' },
            });
        } else {
            toast.error('User Information does not exist 🚫', {
                style: { background: '#ff4d4f', color: '#fff' },
            });
        }

        return registerUser
    }
    async handleUserLogin(email: string, password: string) {
        const registerUser = await signInWithEmailAndPassword(auth, email, password);
        const user = registerUser.user;
    }
}

export const authService = new AuthService()