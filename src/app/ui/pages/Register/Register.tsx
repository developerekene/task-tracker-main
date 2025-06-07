/** @jsxImportSource @emotion/react */
import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { authService } from '../../../redux/configuration/auth.service';
import { RegisterFormData } from '../../../utils/Types';
import { FaUserPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { RoutePath } from '../../Routes/Index';

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    min-height: 100vh;
    background-color: #0d0d0d;
    color: #ffffff;

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const Left = styled.div`
display: flex;
flex-direction: column;
justify-content: space-between;
padding: 40px;
background-color: #111;
border-right: 1px solid #222;

@media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid #222;
}
`;

const Right = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding: 40px;
position: relative;
`;

const BackButton = styled.button`
    padding: 10px 20px;
    background-color: #4a90e2;
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    width: fit-content;
`;

const IconContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;

    svg {
        width: 100px;
        height: 100px;

        @media (max-width: 768px) {
            width: 40px;
            height: 40px;
            marginTop: 30px;
        }
    }
`;

const Credit = styled.a`
    text-align: center;
    color: #888;
    font-size: 0.9rem;
    text-decoration: none;
`;

const FormWrapper = styled(motion.div)`
    background-color: #1a1a1a;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 100%;

    @media (max-width: 768px) {
        padding: 30px 20px;
    }
`;

const Input = styled(motion.input)`
    width: 100%;
    padding: 12px 16px;
    margin-bottom: 15px;
    background-color: #2a2a2a;
    border: 1px solid #444;
    border-radius: 10px;
    color: #fff;
    font-size: 1rem;
`;

const SubmitButton = styled(motion.button)`
    width: 100%;
    padding: 12px 16px;
    background-color: #4a90e2;
    border: none;
    border-radius: 10px;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 10px;
`;

const CreditMobile = styled(Credit)`
    display: none;

    @media (max-width: 768px) {
        display: block;
        margin-top: auto;
        margin-bottom: 0;
        padding-top: 20px;
    }
`;

const Register: React.FC = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [textBtn, setTextBtn] = useState<string>('Register');

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

    const startCountdown = (seconds: number, onTick: (value: number) => void): Promise<void> => {
        return new Promise((resolve) => {
            let count = seconds;

            const interval = setInterval(() => {
                onTick(count);
                if (count <= 0) {
                    clearInterval(interval);
                    resolve();
                }
                count--;
            }, 1000);
        });
    }

    const handleRegister = async (): Promise<void> => {
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }
        setTextBtn("Registering your Information");

        try {
            await authService.handleUserRegistration(formData).then(async () => {
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                })
                toast.success("User created", {
                    style: { background: "#4BB543", color: "#fff" },
                });
                await startCountdown(5, (value) => {
                    setTextBtn(`User Created, Redirecting In ${value}`);
                }).then(() => {
                    navigate(RoutePath.Dashboard)
                });
            })
        } catch (err: unknown) {
            setTextBtn(`Register`);
            toast.error(err instanceof Error ? err.message : 'An unknown error occurred.', {
                style: { background: "#ff4d4f", color: "#fff" },
            });
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, when: "beforeChildren", staggerChildren: 0.2 }
        },
    };

    const inputVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <Container>
            <Left>
                <BackButton onClick={() => navigate('/')}>← Back to Home</BackButton>
                <IconContainer>
                    {/* @ts-ignore */}
                    <FaUserPlus color="#4a90e2" />
                </IconContainer>
                {/* Hide Credit on left side on mobile */}
                <Credit
                    href="https://www.linkedin.com/in/ekenedilichukwu-okoli"
                    target="_blank"
                    rel="noopener noreferrer"
                    css={{ display: 'block', '@media(max-width: 768px)': { display: 'none' } }}
                >
                    <p>&copy; 2025 built by Ekenedilichukwu Okoli</p>
                </Credit>
            </Left>

            <Right>
                <FormWrapper
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.h2
                        variants={inputVariants}
                        style={{ textAlign: 'center', marginBottom: '20px', fontSize: '2rem' }}
                    >
                        Create Your Account
                    </motion.h2>

                    {[
                        { name: "firstName", placeholder: "First Name", type: "text" },
                        { name: "lastName", placeholder: "Last Name", type: "text" },
                        { name: "email", placeholder: "Email", type: "email" },
                        { name: "password", placeholder: "Password", type: showPassword ? "text" : "password" },
                        { name: "confirmPassword", placeholder: "Confirm Password", type: showConfirmPassword ? "text" : "password" },
                    ].map(({ name, placeholder, type }) => {
                        const isPasswordField = name === "password";
                        const isConfirmPasswordField = name === "confirmPassword";

                        return (
                            <div key={name} css={{ position: 'relative', marginBottom: '15px' }}>
                                <Input
                                    name={name}
                                    placeholder={placeholder}
                                    type={type}
                                    value={(formData as any)[name]}
                                    onChange={handleChange}
                                    variants={inputVariants}
                                    css={{ paddingRight: (isPasswordField || isConfirmPasswordField) ? '40px' : undefined }}
                                />
                                {(isPasswordField || isConfirmPasswordField) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (isPasswordField) setShowPassword(prev => !prev);
                                            else setShowConfirmPassword(prev => !prev);
                                        }}
                                        css={{
                                            position: 'absolute',
                                            top: '50%',
                                            right: '12px',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: '#aaa',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            userSelect: 'none',
                                            padding: 0,
                                        }}
                                        aria-label={`Toggle ${name} visibility`}
                                    >
                                        {((isPasswordField && showPassword) || (isConfirmPasswordField && showConfirmPassword)) ? 'Hide' : 'Show'}
                                    </button>
                                )}
                            </div>
                        );
                    })}

                    {error && (
                        <motion.p
                            variants={inputVariants}
                            style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}
                        >
                            {error}
                        </motion.p>
                    )}

                    <SubmitButton
                        onClick={handleRegister}
                        variants={inputVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {textBtn}
                    </SubmitButton>

                    <motion.p
                        variants={inputVariants}
                        style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}
                    >
                        Already have an account?{" "}
                        <span
                            style={{ color: '#4a90e2', cursor: 'pointer' }}
                            onClick={() => navigate(RoutePath.Login)}
                        >
                            Login
                        </span>
                    </motion.p>
                </FormWrapper>
                <CreditMobile
                    href="https://www.linkedin.com/in/ekenedilichukwu-okoli"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <p>&copy; 2025 built by Ekenedilichukkwu Okoli</p>
                </CreditMobile>
            </Right>
        </Container>
    );
};

export default Register;