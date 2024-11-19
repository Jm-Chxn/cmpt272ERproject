import { type EmergencyLocation } from "@/hooks/locations";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { checkPassword } from "@/lib/MD5";
import { useLocations } from "@/hooks/locations";

interface PasswordPromptProps {
    location: EmergencyLocation;
    onClose: () => void;
}

export const PasswordPrompt: React.FC<PasswordPromptProps> = ({ location, onClose }) => {
    const { removeLocation } = useLocations();

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                    Are you sure you want to delete this location? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    variant="destructive"
                    onClick={async () => {
                        if (await checkPassword()) {
                            removeLocation(location);
                            onClose();
                        }
                    }}
                >
                    Delete
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}
