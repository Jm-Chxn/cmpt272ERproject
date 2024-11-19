import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Camera, Upload } from "lucide-react";
import { type EmergencyLocation, useLocations } from "@/hooks/locations";

interface EmergencyFormProps {
	onClose: () => void;
}

const EmergencyForm: React.FC<EmergencyFormProps> = ({ onClose }) => {
	const validatePhoneNumber = (phone: string) => {
		const cleaned = phone.replace(/\D/g, "");
		return cleaned.length === 10;
	};

	const [formData, setFormData] = useState({
		emergencyType: "",
		location: "",
		name: "",
		phone: "",
		comments: "",
		imageUrl: "",
	});
	const [imageUploadMethod, setImageUploadMethod] = useState<"url" | "upload">(
		"url",
	);
	const [previewUrl, setPreviewUrl] = useState<string>("");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const { addLocation } = useLocations();

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const objectUrl = URL.createObjectURL(file);
			setPreviewUrl(objectUrl);
			setFormData((prev) => ({ ...prev, imageUrl: objectUrl }));
		}
	};

	const handleUrlInput = (value: string) => {
		setFormData((prev) => ({ ...prev, imageUrl: value }));
		setPreviewUrl(value);
	};

	const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!validatePhoneNumber(formData.phone)) {
			alert("Please enter a valid 10-digit phone number");
			return;
		}
		const currentTime = Date.now();

		const newEmergency: EmergencyLocation = {
			id: crypto.randomUUID(),
			witness: {
				name: formData.name,
				phoneNumber: formData.phone,
			},
			emergencyType: formData.emergencyType,
			location: {
				place: formData.location,
				lat: 49.2827,
				lng: -123.1207,
			},
			pictureLink: formData.imageUrl || "/api/placeholder/400/300",
			comment: formData.comments,
			time: currentTime,
			formattedTime: new Date().toLocaleString(),
			status: "OPEN",
		};

		addLocation(newEmergency);
		setIsDialogOpen(false);
		setFormData({
			emergencyType: "",
			location: "",
			name: "",
			phone: "",
			comments: "",
			imageUrl: "",
		});
		setPreviewUrl("");
		setImageFile(null);

		onClose();
	};

	return (
		<DialogContent className="h-[90vh] max-h-screen overflow-hidden">
			<DialogHeader>
				<DialogTitle>Report Emergency</DialogTitle>
				<DialogDescription>
					Please provide details about the emergency.
				</DialogDescription>
			</DialogHeader>
			<ScrollArea className="h-full pr-4">
				<form onSubmit={handleFormSubmit} className="space-y-4">
					{/* Emergency Type */}
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
								<SelectItem value="shooting">Shooting</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Location */}
					<div className="space-y-2">
						<Label htmlFor="location">Location</Label>
						<Input
							id="location"
							type="text"
							value={formData.location}
							onChange={(e) => handleInputChange("location", e.target.value)}
							placeholder="Enter location"
						/>
					</div>

					{/* Name */}
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							type="text"
							value={formData.name}
							onChange={(e) => handleInputChange("name", e.target.value)}
							placeholder="Enter your name"
						/>
					</div>

					{/* Phone */}
					<div className="space-y-2">
						<Label htmlFor="phone">Phone Number</Label>
						<Input
							id="phone"
							type="tel"
							value={formData.phone}
							onChange={(e) => handleInputChange("phone", e.target.value)}
							placeholder="(604) 555-0123"
							maxLength={14}
							className={
								!validatePhoneNumber(formData.phone) &&
								formData.phone.length > 0
									? "border-red-500"
									: ""
							}
						/>
						{!validatePhoneNumber(formData.phone) &&
							formData.phone.length > 0 && (
								<p className="text-sm text-red-500">
									Please enter a valid 10-digit phone number
								</p>
							)}
					</div>

					{/* Image Upload */}
					<div className="space-y-2">
						<Label>Image</Label>
						<div className="flex space-x-2 mb-2">
							<Button
								type="button"
								variant={imageUploadMethod === "url" ? "default" : "outline"}
								onClick={() => setImageUploadMethod("url")}
								className="flex-1"
							>
								URL
							</Button>
							<Button
								type="button"
								variant={imageUploadMethod === "upload" ? "default" : "outline"}
								onClick={() => setImageUploadMethod("upload")}
								className="flex-1"
							>
								<Upload className="w-4 h-4 mr-2" />
								Upload
							</Button>
						</div>
						{imageUploadMethod === "url" ? (
							<Input
								type="url"
								placeholder="Enter image URL"
								value={formData.imageUrl}
								onChange={(e) => handleUrlInput(e.target.value)}
							/>
						) : (
							<div className="border-2 border-dashed rounded-lg p-4 text-center">
								<input
									type="file"
									accept="image/*"
									className="hidden"
									id="image-upload"
									onChange={handleImageUpload}
								/>
								<label
									htmlFor="image-upload"
									className="cursor-pointer flex flex-col items-center"
								>
									<Camera className="w-8 h-8 mb-2 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">
										Click to upload image
									</span>
								</label>
							</div>
						)}
						{previewUrl && (
							<div className="mt-2">
								<img
									src={previewUrl}
									alt="Preview"
									className="max-w-full h-48 object-cover rounded-md"
									onError={() => setPreviewUrl("")}
								/>
							</div>
						)}
					</div>

					{/* Comments */}
					<div className="space-y-2">
						<Label htmlFor="comments">Additional comments</Label>
						<Textarea
							id="comments"
							value={formData.comments}
							onChange={(e) => handleInputChange("comments", e.target.value)}
							placeholder="Please provide any additional information..."
						/>
					</div>

					{/* Submit and Cancel buttons */}
					<div className="flex gap-2 pt-4 justify-between">
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit">Submit Report</Button>
					</div>
				</form>
			</ScrollArea>
		</DialogContent>
	);
};

export default EmergencyForm;
