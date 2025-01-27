import MainPage from "@/pages/main";
import { GameProvider } from "@/shared/store";
import "@/shared/utils/array";
import { type ReactNode } from 'react';

const App = (): ReactNode => (
	<GameProvider>
		<MainPage />
	</GameProvider>
)

export default App;
