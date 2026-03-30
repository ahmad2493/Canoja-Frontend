import { createContext, useContext, useState, useEffect } from "react";
import { getToken, removeToken, setToken, setRefreshToken, removeRefreshToken } from "../services/admin";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = getToken();
		if (token) {
			try {
				const decoded = jwtDecode(token);
				setUser(decoded);
			} catch {
				removeToken();
				setUser(null);
			}
		}
		setLoading(false);
	}, []);

	const login = (token, userData, refreshToken) => {
		setToken(token);
		if (refreshToken) {
			setRefreshToken(refreshToken);
		}
		setUser(userData);
	};

	const updateUser = (userData) => {
		setUser(userData);
	};

	const logout = () => {
		removeToken();
		removeRefreshToken();
		setUser(null);
	};

	if (loading) {
		return null; // or a loading spinner
	}

	return (
		<AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user }}>{children}</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
