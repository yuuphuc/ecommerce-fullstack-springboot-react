export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  // Format Vietnam: 0912345678 hoặc +84912345678
  const re = /^(\+84|0)[3|5|7|8|9][0-9]{8}$/;
  return re.test(phone);
};

export const validatePassword = (password) => {
  // Ít nhất 6 ký tự, có chữ và số
  if (password.length < 6) {
    return "Mật khẩu phải có ít nhất 6 ký tự";
  }
  if (!/[a-zA-Z]/.test(password)) {
    return "Mật khẩu phải có ít nhất 1 chữ cái";
  }
  if (!/[0-9]/.test(password)) {
    return "Mật khẩu phải có ít nhất 1 chữ số";
  }
  return "";
};

export const validateUsername = (username) => {
  if (username.length < 3) {
    return "Username phải có ít nhất 3 ký tự";
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Username chỉ chứa chữ, số và dấu gạch dưới";
  }
  return "";
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return `${fieldName} không được để trống`;
  }
  return "";
};

export const validatePrice = (price) => {
  if (isNaN(price) || price < 0) {
    return "Giá phải là số dương";
  }
  return "";
};

export const validateQuantity = (quantity) => {
  if (isNaN(quantity) || quantity < 0 || !Number.isInteger(Number(quantity))) {
    return "Số lượng phải là số nguyên dương";
  }
  return "";
};