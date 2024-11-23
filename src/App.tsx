import "./App.css";

import DashboardStats from "./components/DashboardStats";
import DashboardHeader from "./components/DashboardHeader";
import EmergencyManagement from "./components/EmergencyManagement";
import AddButton from "./components/AddButton";
import RemoveButton from "./components/RemoveButton";

function App() {
	return (
		<div className="flex flex-col min-h-screen gap-2">
			<DashboardHeader />
			<div className="flex-1 space-y-4 p-8 pt-6">
				<DashboardStats />
				<EmergencyManagement />
        {/* Only use for marking project, removed in actual usage */}        
				<div className="flex justify-center space-x-4">
					<p>For marker convenience only {"->"}</p>
					<AddButton />
					<RemoveButton />
				</div>
			</div>
		</div>
	);
}

export default App;
