import { Button } from "@/components/ui/button";
import { useDarkMode, useTime } from "@/hooks/ui-hooks";
import { Clock, Moon, Sun, Users } from "lucide-react";
import { useEffect, useState } from "react";

const DashboardHeader = () => {
	const { isDarkMode, toggleDarkMode } = useDarkMode();
	const currentTime = useTime();

	const [activeUsers, emulateActiveUsers] = useState(8);

	useEffect(() => {
		const interval = setInterval(
			() => {
				emulateActiveUsers((prev) => {
					const change = Math.random() < 0.5 ? -1 : 1;
					return Math.max(1, prev + change);
				});
			},
			Math.random() * 10000 + 20000,
		); // Random interval between 20-30 seconds

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex items-center justify-between">
			<h2 className="text-3xl font-bold tracking-tight ml-8">
				E-Comm Dashboard
			</h2>
			<div className="flex items-center gap-4 mr-8">
				<Button variant="secondary">
					<Clock />
					{currentTime}
				</Button>
				<Button variant="secondary">
					<Users />
					Active: {activeUsers}
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
