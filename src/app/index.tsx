import {type ReactNode} from 'react'
import MainPage from "@/pages/main";
import {GameProvider} from "@/shared/store";
import "@/shared/utils/array"

const App = (): ReactNode => (
	<GameProvider>
		<MainPage />
	</GameProvider>
)

export default App;
