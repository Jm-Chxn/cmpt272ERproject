import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Camera, Upload } from "lucide-react";

interface EmergencyFormProps {
    onSubmit: (formData: any) => void;
    onClose: () => void;
}

const EmergencyForm: React.FC<EmergencyFormProps> = ({ onSubmit, onClose }) => {
    const [formData, setFormData] = useState({
        emergencyType: "",
        location: "",
        name: "",
        phone: "",
        comments: "",
        imageUrl: "",
    });
    const [imageUploadMethod, setImageUploadMethod] = useState<'url' | 'upload'>('url');
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Report Emergency</DialogTitle>
                <DialogDescription>Please provide details about the emergency.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Emergency Type */}
                <div className="space-y-2">
                    <Label>Emergency Type</Label>
                    <Select value={formData.emergencyType} onValueChange={(value) => handleInputChange("emergencyType", value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select type of emergency" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fire">Fire</SelectItem>
                            <SelectItem value="medical">Medical</SelectItem>
                            <SelectItem value="shooting">Shooting</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {/* Other form fields here... */}
            </form>
        </DialogContent>
    );
};

export default EmergencyForm;
