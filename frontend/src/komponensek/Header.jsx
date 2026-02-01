import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <>
            <nav className="pa3 pa4-ns">
                <div className="tc pb3">
                    <NavLink
                        className={({ isActive }) => "link dim gray f6 f5-ns dib mr3" + (isActive ? " active" : "")}
                        to="/"
                    >
                        Kezdőlap
                    </NavLink>
                    <NavLink
                        className={({ isActive }) => "link dim gray f6 f5-ns dib mr3" + (isActive ? " active" : "")}
                        to="/zenekarok"
                    >
                        A rock zene nagy csapatai
                    </NavLink>
                    <NavLink
                        className={({ isActive }) => "link dim gray f6 f5-ns dib mr3" + (isActive ? " active" : "")}
                        to="/hozzaadasEgyuttes"
                    >
                        Együttes feltöltés
                    </NavLink>
                </div>
            </nav>
        </>
    );
};

export default Header;