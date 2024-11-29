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
import { useEffect, useRef, useState } from "react";

interface PasswordPromptProps {
	location: EmergencyLocation;
	onClose: () => void;
	isDelete: boolean;
	isOpen: boolean;
}

export const PasswordPrompt: React.FC<PasswordPromptProps> = ({
	location,
	onClose,
	isDelete,
	isOpen,
}) => {
	const [isValidPassword, setIsValidPassword] = useState(true);
	const { removeLocation, markAsResolved } = useLocations();
	const passwordRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (!isOpen) {
			setIsValidPassword(true);
		}
	}, [isOpen]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const password = passwordRef.current?.value;
		if (!password) return;
		const isPasswordValid = await checkPassword(password);
		if (isPasswordValid) {
			isDelete ? removeLocation(location) : markAsResolved(location.id);
			setIsValidPassword(true);
			onClose();
		} else {
			setIsValidPassword(false);
		}
	};

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
			<form className="flex items-center gap-4" onSubmit={handleSubmit}>
				<Input
					className={`w-full ${!isValidPassword ? "border-red-500" : ""}`}
					id="password"
					type="password"
					ref={passwordRef}
					placeholder="Enter Password"
				/>
				<Button type="submit" variant="destructive">
					{isDelete ? "Delete" : "Resolve"}
				</Button>
			</form>
			{!isValidPassword && (
				<p className="text-sm text-red-500">Invalid Password!</p>
			)}
		</DialogContent>
	);
};
