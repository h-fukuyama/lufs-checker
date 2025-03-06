import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MatrixTable from "./components/MatrixTable";
import ChannelPage from "./components/ChannelPage";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const basePath = `${process.env.REACT_APP_API_BASE_URL}`
function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Router>
                <Routes>
                    <Route path="/" element={<MatrixTable basePath={basePath} />} />
                    <Route path="/:channel" element={<ChannelPage basePath={basePath} />} />
                </Routes>
            </Router>
        </LocalizationProvider>
    );
}

export default App;