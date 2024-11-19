import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Heart, Siren, Timer } from "lucide-react";
import { useLocations } from "../hooks/locations";

const DashboardStats = () => {
    const { locations, getTodaysEmergenciesCount } = useLocations();

    const openEmergencies = locations.filter((loc) => loc.status === "OPEN").length;
    const resolvedEmergencies = locations.filter((loc) => loc.status === "RESOLVED").length;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Active emergencies:
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent className="text-2xl font-bold text-left">{openEmergencies}</CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Resolved emergencies:
                    </CardTitle>
                    <Heart className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent className="text-2xl font-bold text-left">{resolvedEmergencies}</CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total emergencies today:
                    </CardTitle>
                    <Siren className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent className="text-2xl font-bold text-left">{getTodaysEmergenciesCount()}</CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Average Response Time:
                    </CardTitle>
                    <Timer className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent className="text-2xl font-bold text-left">8.5m</CardContent>
            </Card>
        </div>
    );
};

export default DashboardStats;
