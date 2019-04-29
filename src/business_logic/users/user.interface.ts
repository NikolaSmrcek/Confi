interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  password: string;
  phoneNumber: string;
  address?: {
    street: string,
    city: string,
    country: string,
  };
}

export default User;
