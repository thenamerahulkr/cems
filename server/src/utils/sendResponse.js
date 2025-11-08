export const sendResponse = (res, success, message, data = {}) => {
  res.json({ success, message, data });
};
