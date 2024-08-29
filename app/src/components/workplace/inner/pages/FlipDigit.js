import React, { useEffect, useRef } from 'react';
import styles from './CommuteRecord.module.scss'; // 스타일 모듈을 가져옵니다

const FlipDigit = ({ value }) => {
    const digitRefs = useRef([]);
    const previousValueRef = useRef(value);

    useEffect(() => {
        const currentDigits = value.toString().padStart(2, '0').split('');
        const previousDigits = previousValueRef.current.toString().padStart(2, '0').split('');

        currentDigits.forEach((digit, index) => {
            if (digit !== previousDigits[index]) {
                if (digitRefs.current[index]) {
                    digitRefs.current[index].classList.add(styles.flip);
                    const timer = setTimeout(() => {
                        if (digitRefs.current[index]) {
                            digitRefs.current[index].classList.remove(styles.flip);
                        }
                    }, 600); // 애니메이션 시간과 일치
                    // Cleanup function to clear the timer
                    return () => clearTimeout(timer);
                }
            }
        });

        previousValueRef.current = value;
    }, [value]);

    const digits = value.toString().padStart(2, '0').split('');

    return (
        <div className={styles.flipDigits}>
            {digits.map((digit, index) => (
                <div
                    key={index}
                    className={styles.flipDigit}
                    ref={(el) => (digitRefs.current[index] = el)}
                >
                    <div className={styles.flipTop}>{digit}</div>
                    <div className={styles.flipBottom}>{digit}</div>
                </div>
            ))}
        </div>
    );
};

export default FlipDigit;
