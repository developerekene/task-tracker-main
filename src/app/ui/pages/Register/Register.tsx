import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../redux/configuration/auth.service';
import { RegisterFormData } from '../../../utils/Types';

const Register: React.FC = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateForm = (): string | null => {
        const { firstName, lastName, email, password, confirmPassword } = formData;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

        if (!firstName.trim()) return 'First name is required.';
        if (!lastName.trim()) return 'Last name is required.';
        if (!emailRegex.test(email)) return 'Invalid email format.';
        if (!passwordRegex.test(password)) {
            return 'Password must be at least 8 characters long, include a number, an uppercase and a lowercase letter.';
        }
        if (password !== confirmPassword) return 'Passwords do not match.';

        return null;
    };

    const handleRegister = async (): Promise<void> => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            await authService.handleUserRegistration(formData);
            // You can also store/display firstName/lastName in Firestore or profile update
            navigate('/');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred.');
            }
        }
    };

    return (
        <div>
            <h2>Register</h2>

            <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
            />
            <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
            />
            <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
            />
            <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
            />
            <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
            />

            <button onClick={handleRegister}>Register</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Register;