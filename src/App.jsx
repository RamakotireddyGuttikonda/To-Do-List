import { BrowserRouter as Router , Routes , Route  } from "react-router-dom";
import CurrentTasks from "./CurrentTasks";
import PreviousTasks from "./previousTasks";
function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<CurrentTasks/>}/>
        <Route path="/previousTasks" element={<PreviousTasks/>}/>
      </Routes>
    </Router>
  )
}
export default App;