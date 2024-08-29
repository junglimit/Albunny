import React from "react";
import InnerNavi from "./InnerNavi";
import { Outlet } from "react-router-dom";
import InnerContent from "./InnerContent";
import InnerHeader from "./InnerHeader";
import styles from "./ContentSection.module.scss";

const ContentSection = () => {
    return (
        <div className={styles.fullScreen}>
            <InnerHeader />
            <InnerContent />
        </div>
    );
};

export default ContentSection;
