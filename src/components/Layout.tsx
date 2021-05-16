import React from 'react'
import { NavBar } from './NavBar';
import Wrapper from './Wrapper';

interface LayoutProps {

}

export const Layout: React.FC<LayoutProps> = ({children}) => {
        return (
            <>
            <NavBar />
            {children}
            </>
        );
}