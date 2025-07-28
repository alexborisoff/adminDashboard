import { Routes, Route, Navigate } from "react-router";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { UsersPage } from "./pages/UsersPage";


export const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/dashboard" element={<DashboardPage/>}/>
            <Route path="/users" element={<UsersPage/>}/>
            <Route path="*" element={<Navigate to='/dashboard' replace/>}/>
        </Routes>
    );
};
