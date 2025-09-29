import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authApi, User, ApiError } from "@/lib/api";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (googleToken: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // User is not authenticated, which is fine
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (googleToken: string): Promise<boolean> => {
    try {
      const response = await authApi.login(googleToken);
      setUser(response.user);

      toast.success("Welcome!");

      return true;
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error("Login failed");
      } else {
        toast.error("Login failed");
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      toast("You have been successfully logged out");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear user on client side even if server request fails
      setUser(null);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
