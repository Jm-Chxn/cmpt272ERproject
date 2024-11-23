import { Button } from "@/components/ui/button";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { EmergencyLocation } from "@/hooks/locations";
import { useLocations } from "@/hooks/locations";
import { checkPassword } from "@/lib/MD5";
import { useRef } from "react";

interface PasswordPromptProps {
	location: EmergencyLocation;
	onClose: () => void;
	isDelete: boolean;
}

export const PasswordPrompt: React.FC<PasswordPromptProps> = ({
	location,
	onClose,
	isDelete,
}) => {
	const { removeLocation, markAsResolved } = useLocations();
	const passwordRef = useRef<HTMLInputElement>(null);

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>
					{isDelete ? "Confirm Delete" : "Confirm Resolved"}
				</DialogTitle>
				<DialogDescription>
					{isDelete
						? "Are you sure you want to delete this location? This action cannot be undone."
						: "Are you sure you want to mark this location as resolved? This action cannot be undone."}
				</DialogDescription>
			</DialogHeader>
			<form
				className="flex items-center gap-4"
				onSubmit={async (e) => {
					e.preventDefault();
					const password = passwordRef.current?.value;
					if (!password) return;
					if (await checkPassword(password)) {
						isDelete ? removeLocation(location) : markAsResolved(location.id);
						onClose();
					} else {
						alert("Invalid Password!");
					}
				}}
			>
				<Input
					className="w-full"
					id="password"
					type="text"
					ref={passwordRef}
					placeholder="Enter Password"
				/>
				<Button type="submit" variant={"destructive"}>
					{isDelete ? "Delete" : "Resolve"}
				</Button>
			</form>
		</DialogContent>
	);
};
