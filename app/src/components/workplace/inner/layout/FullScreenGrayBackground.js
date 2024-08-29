import React from "react";
import styles from "./FullScreenGrayBackground.module.scss";
import { Outlet } from "react-router-dom";
import DetailBase from "./DetailBase";

const FullScreenGrayBackground = () => {
    return (
        <>
            <div className={styles.fullScreen}>
                <DetailBase />
            </div>
        </>
    );
};

export default FullScreenGrayBackground;
