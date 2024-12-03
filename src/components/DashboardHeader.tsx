import { Button } from "@/components/ui/button";
import { useDarkMode, useTime } from "@/hooks/ui-hooks";
import { Clock, Moon, Sun } from "lucide-react";

const DashboardHeader = () => {
	const { isDarkMode, toggleDarkMode } = useDarkMode();
	const currentTime = useTime();

	return (
		<div className="flex items-center justify-between">
			<h2 className="text-3xl font-bold tracking-tight ml-8">
				Emergency Dashboard
			</h2>
			<div className="flex items-center gap-4 mr-8">
				<Button variant="secondary">
					<Clock />
					{currentTime}
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
