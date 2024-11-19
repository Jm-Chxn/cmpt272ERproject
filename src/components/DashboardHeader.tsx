import { Button } from "@/components/ui/button";
import { Clock, Moon, Sun, Users } from "lucide-react";
import { useDarkMode, useTime } from "@/hooks/ui-hooks";

const LiveClock = () => {
	const currentTime = useTime();
	return (
		<Button variant="secondary">
			<Clock />
			{currentTime}
		</Button>
	);
};

const DashboardHeader = () => {
	const { isDarkMode, toggleDarkMode } = useDarkMode();

	console.log("isDarkMode:", isDarkMode); // Logs dark mode status

	return (
		<div className="flex items-center justify-between">
			<h2 className="text-3xl font-bold tracking-tight ml-8">
				E-Comm Dashboard
			</h2>
			<div className="flex items-center gap-4 mr-8">
        <LiveClock />
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
