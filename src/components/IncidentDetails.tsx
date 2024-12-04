import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { EmergencyLocation } from "@/hooks/locations";
import {
	AlertTriangle,
	Clock,
	MapPin,
	MessageSquare,
	Phone,
	User,
	List,
} from "lucide-react";

export const IncidentDetails: React.FC<{ location: EmergencyLocation }> = ({
	location,
}) => {
	return (
		<Card>
			<CardHeader></CardHeader>
			<CardContent className="space-y-6">
				<div className="aspect-video overflow-hidden rounded-md">
					<img
						src={location.pictureLink}
						alt="Incident"
						className="object-cover w-full h-full"
					/>
				</div>
				<div className="grid gap-4">
				<div className="flex items-center space-x-4">
						<List className="w-5 h-5 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">Emergency Type</p>
							<p className="text-sm text-muted-foreground">
								{location.emergencyType}
							</p>
						</div>
					</div>
					<Separator />
					<div className="flex items-center space-x-4">
						<MapPin className="w-5 h-5 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">Location</p>
							<p className="text-sm text-muted-foreground">
								{location.location.place}
							</p>
						</div>
					</div>
					<Separator />
					<div className="flex items-center space-x-4">
						<Clock className="w-5 h-5 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">Time Reported</p>
							<p className="text-sm text-muted-foreground">
								{new Date(location.time).toLocaleString()}
							</p>
						</div>
					</div>
					<Separator />
					<div className="flex items-center space-x-4">
						<User className="w-5 h-5 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">Witness Name</p>
							<p className="text-sm text-muted-foreground">
								{location.witness.name}
							</p>
						</div>
					</div>
					<Separator />
					<div className="flex items-center space-x-4">
						<Phone className="w-5 h-5 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">Witness Phone Number</p>
							<p className="text-sm text-muted-foreground">
								{location.witness.phoneNumber}
							</p>
						</div>
					</div>
					<Separator />
					<div className="flex items-start space-x-4">
						<MessageSquare className="w-5 h-5 text-muted-foreground mt-0.5" />
						<div>
							<p className="text-sm font-medium">Comment</p>
							<p className="text-sm text-muted-foreground">
								{location.comment}
							</p>
						</div>
					</div>
					<Separator />
					<div className="flex items-center space-x-4">
						<AlertTriangle className="w-5 h-5 text-muted-foreground" />
						<div>
							<p className="text-sm font-medium">Status</p>
							<Badge
								variant={
									location.status.toLowerCase() === "open"
										? "destructive"
										: "outline"
								}
							>
								{location.status}
							</Badge>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
