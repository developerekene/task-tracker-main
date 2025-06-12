import { createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { collection, doc, getDoc, setDoc, getDocs, updateDoc, deleteDoc, arrayUnion } from "firebase/firestore";
import toast from "react-hot-toast";
import { auth, db } from "../../../firbase-config";
import { RegisterFormData } from "../../utils/Types";
import { setTasks, Task } from "../slices/task";
import { resetUserData, setUserData } from "../slices/user";
import { store } from "../store";
import axios from 'axios';

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
                task: {
                    tasks: []
                },
                notification: {
                    notifications: []
                },
                settings: {
                    language: ""
                }
            },
        };

        await setDoc(userDocRef, database);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
            const fetchedUserData = userSnapshot.data();
            const primaryInformation = fetchedUserData?.user?.primaryInformation;
            const taskInformation = fetchedUserData?.user?.task?.tasks;

            store.dispatch(setUserData(primaryInformation));
            store.dispatch(setTasks(taskInformation));

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

    // async handleUserRegistration(userData: RegisterFormData) {
    //     const registerUser = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    //     const user = registerUser.user;
    //     const currentDateTime = getCurrentDateTime();

    //     await updateProfile(user, {
    //         displayName: `${userData.firstName} ${userData.lastName}`,
    //     });

    //     const userDocRef = doc(collection(db, "database"), user.uid);

    //     const database = {
    //         user: {
    //             primaryInformation: {
    //                 firstName: userData.firstName,
    //                 lastName: userData.lastName,
    //                 initials: `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase(),
    //                 uniqueId: user.uid,
    //                 email: userData.email,
    //                 isLoggedIn: true,
    //                 agreedToTerms: true,
    //                 middleName: "",
    //                 phone: "",
    //                 gender: "",
    //                 dateOfBirth: "",
    //                 disability: false,
    //                 disabilityType: "",
    //                 photoUrl: "",
    //                 educationalLevel: "",
    //                 referralName: "",
    //                 secondaryEmail: "",
    //                 securityQuestion: "",
    //                 securityAnswer: "",
    //                 verifiedEmail: false,
    //                 verifyPhoneNumber: false,
    //                 twoFactorSettings: false,
    //                 streetNumber: "",
    //                 streetName: "",
    //                 city: "",
    //                 state: "",
    //                 country: ""
    //             },
    //             location: {
    //                 currentdateTime: currentDateTime,
    //             },
    //             task: {
    //                 tasks: []
    //             },
    //             notification: {
    //                 notifications: []
    //             },
    //             settings: {
    //                 language: ""
    //             }
    //         },
    //     };

    //     try {
    //         // Send to Python encryption service
    //         const response = await axios.post('http://localhost:5000/encrypt', database);
    //         const encryptedData = response.data.encrypted;

    //         // Store encrypted string instead of plain object
    //         await setDoc(userDocRef, { encrypted: encryptedData });

    //         const userSnapshot = await getDoc(userDocRef);

    //         if (userSnapshot.exists()) {
    //             await sendEmailVerification(user);
    //             toast.success(`Your Account has been successfully created`, {
    //                 style: { background: '#4BB543', color: '#fff' },
    //             });
    //         } else {
    //             toast.error('User Information does not exist 🚫', {
    //                 style: { background: '#ff4d4f', color: '#fff' },
    //             });
    //         }
    //     } catch (error) {
    //         toast.error("Encryption or registration failed");
    //         console.error("Error:", error);
    //     }

    //     return registerUser;
    // }

    async handleUserLogin(email: string, password: string) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userDocRef = doc(collection(db, "database"), userCredential.user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const updatedData = userDocSnap.data();
                console.log(updatedData);
                const primaryInformation = updatedData?.user?.primaryInformation;
                const locationInformation = updatedData?.user?.location;
                const taskInformation = updatedData?.user?.task?.tasks;
                const notificationInformation = updatedData?.user?.notification.notifications;
                const settingsInformation = updatedData?.user?.settings;

                // Dispatching to the store
                store.dispatch(setTasks(taskInformation));
                store.dispatch(setUserData(primaryInformation));

                toast.success(`We have successfully logged you into your account.`, {
                    style: {
                        background: '#4BB543',
                        color: '#fff',
                    },
                });
            } else {
                throw new Error("User information does not exist in database.");
            }


        } catch (err: any) {
            toast.error(err.message || "Login failed", {
                style: {
                    background: '#ff4d4f',
                    color: '#fff',
                },
            });
            throw err;
        }
    }

    async handleUserSignout(): Promise<void> {
        await signOut(auth).then(() => {
            store.dispatch(resetUserData());
            toast.success(`You have successfully signed out of your Account`, {
                style: {
                    background: '#4BB543',
                    color: '#fff',
                },
            })
        }).catch((err) => {
            toast.error(`Error creating your Account - ${err.message}`, {
                style: {
                    background: '#ff4d4f',
                    color: '#fff',
                },
            })
        })
    }

    async handlePasswordReset(email: string): Promise<void> {
        // Sending password reset email
        await sendPasswordResetEmail(auth, email).then(() => {
            toast.success(`Password reset email sent to: ${email}. Please check your inbox.`, {
                style: {
                    background: '#4BB543',
                    color: '#fff',
                },
            });
        }).catch((error: any) => {
            toast.error(`${error.message}`, {
                style: {
                    background: '#ff4d4f',
                    color: '#fff',
                },
            });
        });
    }

    async handleGetTasks(userId: string) {
        const snapshot = await getDocs(collection(db, 'users', userId, 'tasks'));

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || '',   // Provide fallback if needed
                desc: data.desc || '',
                dateCreated: data.dateCreated || '',
                dateModified: data.dateModified || '',
                dateDeleted: data.dateDeleted || '',
                completed: data.completed ?? false,
            };
        });
    };

    async handleCreateTask(userId: string, task: Task) {
        const userDocRef = doc(db, 'database', userId);

        // Add the new task atomically to the tasks array inside user.task.tasks
        await updateDoc(userDocRef, {
            'user.task.tasks': arrayUnion({
                id: task.id,
                title: task.title,
                desc: task.desc,
                dateCreated: task.dateCreated,
                dateModified: task.dateModified,
                dateDeleted: task.dateDeleted || null,
                completed: task.completed ?? false,
            }),
        });

        // Fetch the updated user document with tasks
        const updatedUserDoc = await getDoc(userDocRef);
        if (!updatedUserDoc.exists()) {
            throw new Error('User document not found');
        }

        // Extract the tasks array from user.task.tasks
        const updatedTasks: Task[] = updatedUserDoc.data()?.user?.task?.tasks ?? [];

        // Dispatch to Redux store to update task slice
        store.dispatch(setTasks(updatedTasks));
    }

    async handleUpdateTask(userId: string, taskId: string, updates: Partial<Task>) {
        const userDocRef = doc(db, 'database', userId);

        // Get the current user doc data
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
            throw new Error('User document not found');
        }

        // Extract current tasks array
        const tasks: Task[] = userDoc.data()?.user?.task?.tasks ?? [];

        // Update the target task in the array
        const updatedTasks = tasks.map(task => {
            if (task.id === taskId) {
                return { ...task, ...updates, dateModified: new Date().toISOString() };
            }
            return task;
        });

        // Write the updated tasks array back to Firestore
        await updateDoc(userDocRef, {
            'user.task.tasks': updatedTasks,
        });

        // Dispatch the updated tasks array to Redux
        store.dispatch(setTasks(updatedTasks));
    }

    async handleDeleteTask(userId: string, taskId: string) {
        const userDocRef = doc(db, 'database', userId);

        // Fetch the current user document
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
            throw new Error('User document not found');
        }

        // Get current tasks
        const tasks: Task[] = userDoc.data()?.user?.task?.tasks ?? [];

        // Filter out the task to delete
        const updatedTasks = tasks.filter(task => task.id !== taskId);

        // Update Firestore with new tasks array
        await updateDoc(userDocRef, {
            'user.task.tasks': updatedTasks,
        });

        // Update Redux store
        store.dispatch(setTasks(updatedTasks));
    }

    async updatePrimaryInformation(partialUpdateData: Partial<RegisterFormData>) {
        try {
            const currentUser = auth.currentUser;

            if (!currentUser) {
                toast.error("User not authenticated", {
                    style: { background: '#ff4d4f', color: '#fff' },
                });
                return;
            }

            const userId = currentUser.uid;
            const userDocRef = doc(db, "database", userId);
            const userSnapshot = await getDoc(userDocRef);

            if (!userSnapshot.exists()) {
                toast.error("User not found", {
                    style: { background: '#ff4d4f', color: '#fff' },
                });
                return;
            }

            const currentData = userSnapshot.data();
            const updatedPrimaryInfo = {
                ...currentData.user.primaryInformation,
                ...partialUpdateData,
            };

            await updateDoc(userDocRef, {
                "user.primaryInformation": updatedPrimaryInfo,
            });

            // ✅ Update Redux state
            store.dispatch(setUserData(updatedPrimaryInfo));

            toast.success("User information updated successfully", {
                style: { background: '#4BB543', color: '#fff' },
            });

        } catch (error: any) {
            console.error("Failed to update user information:", error.message);
            toast.error("Failed to update user information", {
                style: { background: '#ff4d4f', color: '#fff' },
            });
        }
    }

    async updateUserSettings(partialSettingsUpdate: Partial<{}>) {
        try {
            const currentUser = auth.currentUser;

            if (!currentUser) {
                toast.error("User not authenticated", {
                    style: { background: '#ff4d4f', color: '#fff' },
                });
                return;
            }

            const userId = currentUser.uid;
            const userDocRef = doc(db, "database", userId);
            const userSnapshot = await getDoc(userDocRef);

            if (!userSnapshot.exists()) {
                toast.error("User not found", {
                    style: { background: '#ff4d4f', color: '#fff' },
                });
                return;
            }

            const currentData = userSnapshot.data();

            // Merge existing settings with the partial update
            const updatedSettings = {
                ...currentData.user.settings,
                ...partialSettingsUpdate,
            };

            // Update only the settings field in Firestore
            await updateDoc(userDocRef, {
                "user.settings": updatedSettings,
            });

            // Optionally update Redux or app state here if you have a corresponding action
            // store.dispatch(setUserSettings(updatedSettings));

            toast.success("User settings updated successfully", {
                style: { background: '#4BB543', color: '#fff' },
            });

        } catch (error: any) {
            console.error("Failed to update user settings:", error.message);
            toast.error("Failed to update user settings", {
                style: { background: '#ff4d4f', color: '#fff' },
            });
        }
    }



}

export const authService = new AuthService()