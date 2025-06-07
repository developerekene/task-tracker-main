import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Index from './Routes/Index';

const AppEntry: React.FunctionComponent = () => {
    return (
        <BrowserRouter>
            <Index />
        </BrowserRouter>
    )
}

export default AppEntry