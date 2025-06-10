/** @jsxImportSource @emotion/react */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import toast from 'react-hot-toast';
import { authService } from '../../../redux/configuration/auth.service';

const SettingsWrapper = styled(motion.div)`
    background-color: #1a1a1a;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    max-width: 600px;
    width: 100%;
    margin: auto;
    color: #fff;

    @media (max-width: 768px) {
        padding: 30px 20px;
    }
`;

const Section = styled.div`
    margin-bottom: 30px;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 10px;
    font-size: 1rem;
`;

const Select = styled.select`
    width: 100%;
    padding: 12px 16px;
    background-color: #2a2a2a;
    border: 1px solid #444;
    border-radius: 10px;
    color: #fff;
    font-size: 1rem;
`;

const Toggle = styled.button<{ active: boolean }>`
    width: 100%;
    padding: 12px 16px;
    background-color: ${({ active }) => (active ? '#4a90e2' : '#444')};
    border: none;
    border-radius: 10px;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 5px;
`;

const SaveButton = styled(motion.button)`
    width: 100%;
    padding: 12px 16px;
    background-color: #4bb543;
    border: none;
    border-radius: 10px;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 20px;

    &:hover {
        background-color: #3ea836;
    }
`;

const UserPreferencesSettings: React.FC = () => {
    const [language, setLanguage] = useState('en');
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const [notifications, setNotifications] = useState(true);
    const [text, setText] = useState("Save Settings");

    const handleSaveSettings = async () => {
        const settings = {
            language,
            theme,
            notifications,
        };

        await authService.updateUserSettings(settings)
            .then(() => {
                // TODO: Save to API/localStorage/Redux as needed
                console.log('Saving settings:', settings);

                toast.success('Settings saved successfully!', {
                    style: { background: '#4BB543', color: '#fff' },
                });
                setText("Settings Saved");
            })
            .catch((err) => {
                toast.error('Settings not saved!', {
                    style: { background: 'red', color: '#fff' },
                });
                setText("Save Settings")
            })


    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, when: 'beforeChildren', staggerChildren: 0.2 },
        },
    };

    return (
        <SettingsWrapper initial="hidden" animate="visible" variants={containerVariants}>
            <motion.h2 style={{ marginBottom: 30, fontSize: '1.8rem', textAlign: 'center' }}>
                Preferences
            </motion.h2>

            <Section>
                <Label htmlFor="language">Language</Label>
                <Select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="es">Spanish</option>
                </Select>
            </Section>

            <Section>
                <Label>Theme</Label>
                <Toggle
                    active={theme === 'dark'}
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Toggle>
            </Section>

            <Section>
                <Label>Notifications</Label>
                <Toggle
                    active={notifications}
                    onClick={() => setNotifications((prev) => !prev)}
                >
                    {notifications ? 'Enabled' : 'Disabled'}
                </Toggle>
            </Section>

            <SaveButton
                onClick={handleSaveSettings}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
            >
                {text}
            </SaveButton>
        </SettingsWrapper>
    );
};

export default UserPreferencesSettings;