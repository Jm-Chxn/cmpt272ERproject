import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Heart, Siren, Timer } from "lucide-react";
import { useLocations } from "../hooks/locations";

const DashboardStats = () => {
	const { locations, getTodaysEmergenciesCount, getAverageResponseTime } = useLocations();

	const openEmergencies = locations.filter(
		(loc) => loc.status === "OPEN",
	).length;
	const resolvedEmergencies = locations.filter(
		(loc) => loc.status === "RESOLVED",
	).length;
	const averageResponseTime = getAverageResponseTime();

    const formatDuration = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Active emergencies:
					</CardTitle>
					<AlertTriangle className="h-4 w-4 text-red-500" />
				</CardHeader>
				<CardContent className="text-2xl font-bold text-left">
					{openEmergencies}
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Resolved emergencies:
					</CardTitle>
					<Heart className="h-4 w-4 text-green-500" />
				</CardHeader>
				<CardContent className="text-2xl font-bold text-left">
					{resolvedEmergencies}
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Total emergencies today:
					</CardTitle>
					<Siren className="h-4 w-4 text-orange-500" />
				</CardHeader>
				<CardContent className="text-2xl font-bold text-left">
					{getTodaysEmergenciesCount()}
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">
						Average Response Time:
					</CardTitle>
					<Timer className="h-4 w-4 text-blue-500" />
				</CardHeader>
				<CardContent className="text-2xl font-bold text-left">                    
					{averageResponseTime > 0
                        ? formatDuration(averageResponseTime)
                        : "N/A"}</CardContent>
			</Card>
		</div>
	);
};

export default DashboardStats;
