import { User } from "@/typed";

export const registerUser = async (user: User) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        credentials: "include",
      }
    );

    return response;
  } catch (error) {
    console.log("error:", error);
  }
};

export const loginUser = async (user: { email: string; password: string }) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
        credentials: "include",
      }
    );
    return response;
  } catch (error) {
    console.log("error:", error);
  }
};

export const getToken = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/token`,
      {
        method: "GET",
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .catch((err) => console.log(err));

    return response;
  } catch (err) {
    console.log(err);
  }
};

export const logout = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (name: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user?name=${name}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};
