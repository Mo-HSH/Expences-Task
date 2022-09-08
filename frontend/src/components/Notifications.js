import React, { useContext, createContext, useState, useEffect, useMemo } from "react";
import styles from "./Notifications.module.css";

const NotificationContext = createContext({
    notify: () => {}, // noop
});

const typeClasses = {
    error: styles.error,
};

function Notification({ type, message, onClose }) {
    return (
        <div className={`${styles.notification} ${typeClasses[type]}`}>
            {message}
            <div className={styles.closeBtn} onClick={() => onClose()}>
                <svg width="11px" height="9px" viewBox="0 0 11 9">
                    <g
                        id="Page-1"
                        stroke="none"
                        stroke-width="1"
                        fill="none"
                        fill-rule="evenodd"
                    >
                        <polygon
                            id="x"
                            fill="#000000"
                            points="3.798 4.356 0.666 0 3.456 0 5.49 3.006 7.614 0 10.152 0 7.074 4.32 10.332 9 7.614 9 5.328 5.688 3.006 9 0.45 9"
                        ></polygon>
                    </g>
                </svg>
            </div>
        </div>
    );
}

export default function Notifications({ children }) {
    const [notification, setNotification] = useState(null);

    const contextValue = useMemo(
        () => ({
            notify: ({ message, type }) => setNotification({ message, type }),
        }),
        [setNotification]
    );

    useEffect(() => {
        setTimeout(() => {
            setNotification(null);
        }, 5000);
    }, [notification])

    return (
        <NotificationContext.Provider value={contextValue}>
            {notification && (
                <Notification
                    onClose={() => setNotification(null)}
                    type={notification.type}
                    message={notification.message}
                />
            )}
            {children}
        </NotificationContext.Provider>
    );
}

function useNotifications() {
    const context = useContext(NotificationContext);
    return {
        notifyError: (message) => context.notify({ type: "error", message }),
    };
}

export { useNotifications };
