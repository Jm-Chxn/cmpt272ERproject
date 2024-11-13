import "./App.css";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	AlertTriangle,
	Heart,
	Moon,
	Plus,
	Siren,
	Sun,
	Timer,
} from "lucide-react";
import { columns } from "./columns";
import LeafletMap from "./components/LeafletMap";
import { DataTable } from "./components/ui/data-table";
import { ScrollArea } from "./components/ui/scroll-area";
import { Switch } from "./components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	type EmergencyLocation,
	generateRandomEmergencyLocation,
	useLocations,
} from "./hooks/locations";

function App() {
	const {
		addLocation,
		removeLocation,
		locations,
		viewableLocations,
		getTodaysEmergenciesCount,
	} = useLocations();

	const [selectedLocation, setSelectedLocation] =
		useState<EmergencyLocation | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [formData, setFormData] = useState({
		emergencyType: "",
		location: "",
		name: "",
		phone: "",
		comments: "",
	});

	const openEmergenciesCount = locations.filter(
		(loc) => loc.status === "OPEN",
	).length;
	const resolvedEmergenciesCount = locations.filter(
		(loc) => loc.status === "RESOLVED",
	).length;

	const handleRowClick = (location: EmergencyLocation) => {
		console.log("Row clicked:", location);
		setSelectedLocation(location);
	};

	const [isDarkMode, setIsDarkMode] = useState(true);

	const toggleDarkMode = () => {
		setIsDarkMode((prev) => !prev);
		document.body.classList.toggle("dark", !isDarkMode);
	};

	//form data
	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		addLocation(generateRandomEmergencyLocation());
		setIsDialogOpen(false);
		setFormData({
			emergencyType: "",
			location: "",
			name: "",
			phone: "",
			comments: "",
		});
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	return (
		<>
			<div className="flex flex-col min-h-screen gap-2">
				<div className="flex items-center justify-between">
					<h2 className="text-3xl font-bold tracking-tight ml-8">
						E-Comm Dashboard
					</h2>
				</div>
				<div className="flex-1 space-y-4 p-8 pt-6">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Active emergencies:{" "}
								</CardTitle>
								<AlertTriangle className="h-4 w-4 text-red-500" />
							</CardHeader>
							<CardContent className="text-2xl font-bold text-left">
								{openEmergenciesCount}
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Resolved emergencies:{" "}
								</CardTitle>
								<Heart className="h-4 w-4 text-green-500" />
							</CardHeader>
							<CardContent className="text-2xl font-bold text-left">
								{resolvedEmergenciesCount}
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium">
									Total emergencies today:{" "}
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
									Average Response Time:{" "}
								</CardTitle>
								<Timer className="h-4 w-4 text-blue-500" />
							</CardHeader>
							<CardContent className="text-2xl font-bold text-left">
								8.5m
							</CardContent>
						</Card>
					</div>
					<div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
						<Card>
							<CardHeader className="text-left">
								<CardTitle className="text-xl font-bold">
									Emergency Location Map
								</CardTitle>
							</CardHeader>
							<CardContent>
								<LeafletMap selectedLocation={selectedLocation} />
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="flex flex-row items-center text-left justify-between pb-3">
								<CardTitle className="text-xl font-bold w-fit">
									Emergency Reports
								</CardTitle>
								<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
									<DialogTrigger asChild>
										<Button
											variant="outline"
											className="ml-auto flex items-center leading-none"
										>
											<Plus className="h-8 w-8 text-blue-400" />
											New Report
										</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>Report Emergency</DialogTitle>
											<DialogDescription>
												Please provide details about the emergency situation.
											</DialogDescription>
										</DialogHeader>
										<form onSubmit={handleFormSubmit} className="space-y-4">
											<div className="space-y-2">
												<Label>Emergency Type</Label>
												<Select
													value={formData.emergencyType}
													onValueChange={(value) =>
														handleInputChange("emergencyType", value)
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select type of emergency" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="fire">Fire</SelectItem>
														<SelectItem value="medical">Medical</SelectItem>
														<SelectItem value="accident">
															Vehicle Accident
														</SelectItem>
														<SelectItem value="crime">
															Crime in Progress
														</SelectItem>
													</SelectContent>
												</Select>
											</div>
											<div className="space-y-2">
												<Label htmlFor="location">Location</Label>
												<Input
													id="location"
													type="text"
													value={formData.location}
													onChange={(e) =>
														handleInputChange("location", e.target.value)
													}
													placeholder="Enter location"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="name">Name</Label>
												<Input
													id="name"
													type="text"
													value={formData.name}
													onChange={(e) =>
														handleInputChange("name", e.target.value)
													}
													placeholder="Enter your name"
												/>
											</div>
											<div className="space-y-2">
												<Label htmlFor="phone">Phone Number</Label>
												<Input
													id="phone"
													type="tel"
													value={formData.phone}
													onChange={(e) =>
														handleInputChange("phone", e.target.value)
													}
													placeholder="(604) 555-0123"
												/>
											</div>

											<div className="space-y-2">
												<Label htmlFor="details">Additional comments</Label>
												<Textarea
													id="details"
													value={formData.comments}
													onChange={(e) =>
														handleInputChange("details", e.target.value)
													}
													placeholder="Please provide any additional information..."
													className="h-24"
												/>
											</div>
											<div className="flex gap-2 pt-4 justify-between">
												<Button
													type="button"
													variant="outline"
													onClick={() => setIsDialogOpen(false)}
												>
													Cancel
												</Button>
												<Button type="submit">Submit Report</Button>
											</div>
										</form>
									</DialogContent>
								</Dialog>
							</CardHeader>
							<CardContent className="h-[50dvh] py-0">
								<ScrollArea className="h-full overflow-y-auto">
									<DataTable
										columns={columns}
										data={viewableLocations}
										onRowClick={handleRowClick}
									/>
								</ScrollArea>
							</CardContent>
						</Card>
					</div>
					<div className="flex justify-center space-x-2">
						<Button
							className="flex items-center"
							variant="secondary"
							onClick={() =>
								removeLocation(
									locations[Math.floor(Math.random() * locations.length)],
								)
							}
						>
							Remove Random
						</Button>
						<Button
							onClick={toggleDarkMode}
							variant="secondary"
							className="ml-auto flex items-center"
						>
							{isDarkMode ? <Moon /> : <Sun />}
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;

