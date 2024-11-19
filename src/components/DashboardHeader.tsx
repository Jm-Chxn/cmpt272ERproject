import { Button } from "@/components/ui/button";
import { Clock, Moon, Sun, Users } from "lucide-react";
import { useDarkMode, useTime } from "@/hooks/ui-hooks";

const DashboardHeader = () => {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const currentTime = useTime();

    console.log("isDarkMode:", isDarkMode); // Logs dark mode status
    console.log("currentTime:", currentTime); // Logs the current time value

    return (
        <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight ml-8">E-Comm Dashboard</h2>
            <div className="flex items-center gap-4 mr-8">
                <Button variant="secondary">
                    <Clock />
                    {currentTime}
                </Button>
                <Button variant="secondary">
                    <Users />
                    Active: 8
                </Button>
                <Button
                    onClick={() => {
                        console.log("Dark mode button clicked");
                        toggleDarkMode();
                    }}
                    variant="secondary"
                    className="ml-auto flex items-center"
                >
                    {isDarkMode ? <Moon /> : <Sun />}
                </Button>
            </div>
        </div>
    );
};

export default DashboardHeader;
