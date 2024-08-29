import React from "react";
import { Outlet } from "react-router-dom";
import styles from './InnerContent.module.scss';

const InnerContent = () => {
    return (
        <div className={styles['content-box']} >
            <Outlet />
        </div>
    );
};

export default InnerContent;
