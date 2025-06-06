/** @jsxImportSource @emotion/react */
import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { FaSignInAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { authService } from '../../../redux/configuration/auth.service';
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
            margin-top: 30px;
        }
    }
`;

const Credit = styled.a`
    text-align: center;
    color: #888;
    font-size: 0.9rem;
    text-decoration: none;
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

const Login: React.FC = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string>('');
    const [textBtn, setTextBtn] = useState<string>('Login');

    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

    const handleLogin = async () => {
        const { email, password } = formData;
        if (!email || !password) {
            setError('Both email and password are required.');
            return;
        }
        setTextBtn("Fetching your Information...")

        try {
            await authService.handleUserLogin(formData.email, formData.password);
            toast.success('Login successful', {
                style: { background: "#4BB543", color: "#fff" },
            });
            await startCountdown(5, (value) => {
                setTextBtn(`Fetch Successful, Redirecting In ${value}`);
            }).then(() => {
                navigate(RoutePath.Dashboard)
            });

        } catch (err: unknown) {
            setTextBtn("Login")
            const message = err instanceof Error ? err.message : 'Login failed.';
            setError(message);
            toast.error(message, {
                style: { background: "#ff4d4f", color: "#fff" },
            });
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, when: 'beforeChildren', staggerChildren: 0.2 },
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
                    <FaSignInAlt color="#4a90e2" />
                </IconContainer>
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
                <FormWrapper initial="hidden" animate="visible" variants={containerVariants}>
                    <motion.h2
                        variants={inputVariants}
                        style={{ textAlign: 'center', marginBottom: '20px', fontSize: '2rem' }}
                    >
                        Welcome Back
                    </motion.h2>

                    <div css={{ position: 'relative', marginBottom: '15px' }}>
                        <Input
                            name="email"
                            placeholder="Email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            variants={inputVariants}
                        />
                    </div>

                    <div css={{ position: 'relative', marginBottom: '10px' }}>
                        <Input
                            name="password"
                            placeholder="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={handleChange}
                            variants={inputVariants}
                            css={{ paddingRight: '40px' }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(prev => !prev)}
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
                            }}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    {/* Forgot Password Link */}
                    <motion.p
                        variants={inputVariants}
                        style={{
                            textAlign: 'right',
                            marginBottom: '20px',
                            fontSize: '0.85rem',
                            color: '#4a90e2',
                            cursor: 'pointer',
                        }}
                        onClick={() => navigate(RoutePath.ForgotPassword)}
                    >
                        Forgot Password?
                    </motion.p>

                    {error && (
                        <motion.p
                            variants={inputVariants}
                            style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}
                        >
                            {error}
                        </motion.p>
                    )}

                    <SubmitButton
                        onClick={handleLogin}
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
                        Don't have an account?{' '}
                        <span
                            style={{ color: '#4a90e2', cursor: 'pointer' }}
                            onClick={() => navigate(RoutePath.Register)}
                        >
                            Register
                        </span>
                    </motion.p>
                </FormWrapper>
                <CreditMobile
                    href="https://www.linkedin.com/in/ekenedilichukwu-okoli"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <p>&copy; 2025 built by Ekenedilichukwu Okoli</p>
                </CreditMobile>
            </Right>
        </Container>
    );
};

export default Login;