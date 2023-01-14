const Type = {
  ERROR: "error notification",
  SUCCESS: "success notification",
};

const createAddNotification = (setNotification) => (message, type) => {
  if (!message || !(type in Type))
    setNotification({ message: null, type: null });

  setNotification({ message: message, type: type });
  setTimeout(() => setNotification(null), 5000);
};

export { Type, createAddNotification };
