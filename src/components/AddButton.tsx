import { Button } from "@/components/ui/button";
import {
	useLocations,
	generateRandomEmergencyLocation,
} from "@/hooks/locations";

const RemoveButton = () => {
	const { addLocation } = useLocations();

	return (
		<Button
			className="flex items-center"
			variant="secondary"
			onClick={() => {
				const randomLocation = generateRandomEmergencyLocation();
				addLocation(randomLocation);
			}}
		>
			Add Random
		</Button>
	);
};

export default RemoveButton;
