import { useContext } from "react";
import AuthContext from "../context/AuthContext";

export default function useAuth() {
  const { user, loading, login, logout, register, refreshUser } = useContext(AuthContext);
  return { user, loading, login, logout, register, refreshUser };
}
