import React from "react";
import styles from "./DetailBase.module.scss";
import InnerHeader from "./InnerHeader";
import ContentSection from "./ContentSection";
import InnerNavi from "./InnerNavi";
const DetailBase = () => {
    return (
        <div className={styles.fullScreen}>
            <InnerNavi />
            <ContentSection />
        </div>
    );
};

export default DetailBase;
