import { Button } from "@/components/ui/button";
import { useLocations } from "@/hooks/locations";

const RemoveButton = () => {
	const { removeLocation, locations } = useLocations();

	const handleRemoveRandomLocation = () => {
		const randomIndex = Math.floor(Math.random() * locations.length);
		removeLocation(locations[randomIndex]);
	};

	return (
		<Button
			className="flex items-center"
			variant="secondary"
			onClick={handleRemoveRandomLocation}
		>
			Remove Random
		</Button>
	);
};

export default RemoveButton;
