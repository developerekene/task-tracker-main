/** @jsxImportSource @emotion/react */
import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import toast from 'react-hot-toast';
import { FaUnlockAlt } from 'react-icons/fa';

import { authService } from '../../../redux/configuration/auth.service';
import { RoutePath } from '../../Routes/Index';

// Reuse styled components from Login
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

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string>('');
    const [textBtn, setTextBtn] = useState<string>('Reset Password');

    const navigate = useNavigate();

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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleReset = async () => {
        if (!email) {
            setError('Email is required.');
            return;
        }

        setTextBtn('Processing...');
        setError('');

        try {
            await authService.handlePasswordReset(email).then(() => {
                toast.success('Password reset link sent!', {
                    style: { background: '#4BB543', color: '#fff' },
                });
                navigate(RoutePath.Login)
            })

        } catch (err: any) {
            const message = err instanceof Error ? err.message : 'Something went wrong.';
            setError(message);
            toast.error(message, {
                style: { background: '#ff4d4f', color: '#fff' },
            });
        } finally {
            setTextBtn('Reset Password');
        }
    };

    return (
        <Container>
            <Left>
                <BackButton onClick={() => navigate(RoutePath.Home)}>← Back to Home</BackButton>
                <IconContainer>
                    {/* @ts-ignore */}
                    <FaUnlockAlt color="#4a90e2" />
                </IconContainer>
                <Credit
                    href="https://www.linkedin.com/in/ekenedilichukwu-okoli"
                    target="_blank"
                    rel="noopener noreferrer"
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
                        Reset Password
                    </motion.h2>

                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleChange}
                        variants={inputVariants}
                    />

                    {error && (
                        <motion.p
                            variants={inputVariants}
                            style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}
                        >
                            {error}
                        </motion.p>
                    )}

                    <SubmitButton
                        onClick={handleReset}
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
                        Remembered your password?{' '}
                        <span
                            style={{ color: '#4a90e2', cursor: 'pointer' }}
                            onClick={() => navigate(RoutePath.Login)}
                        >
                            Go to Login
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

export default ForgotPassword;