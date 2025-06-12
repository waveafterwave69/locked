import { Route, Routes } from 'react-router-dom'
import { routesConfig } from './routes/routesConfig'

const App: React.FC = () => {
    return (
        <>
            <div className="container">
                <Routes>
                    {routesConfig.map(({ page, url }) => (
                        <Route path={url} element={page} />
                    ))}
                </Routes>
            </div>
        </>
    )
}

export default App
