import "./App.css";

import DashboardStats from "./components/DashboardStats";
import DashboardHeader from "./components/DashboardHeader";
import EmergencyManagement from "./components/EmergencyManagement";
import RemoveButton from "./components/RemoveButton";

function App() {

	return (
		<div className="flex flex-col min-h-screen gap-2">
			<DashboardHeader />
			<div className="flex-1 space-y-4 p-8 pt-6">
				<DashboardStats />
				<EmergencyManagement />
				<div className="flex justify-center space-x-2">
          <RemoveButton />
				</div>
			</div>
		</div>
	);
}

export default App;
