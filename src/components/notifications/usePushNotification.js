// Path: frontend/src/components/notifications/usePushNotification.js
import { useState, useEffect } from "react";

const usePushNotification = () => {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if ("Notification" in window && permission !== "granted") {
      Notification.requestPermission().then((perm) => setPermission(perm));
    }
  }, []);

  const sendNotification = (title, options = {}) => {
    if (permission === "granted") {
      new Notification(title, options);
    } else {
      console.log("Notification permission not granted");
    }
  };

  return { permission, sendNotification };
};

export default usePushNotification;
