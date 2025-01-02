import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardLayout, FileManager, SecuritySettings, AnalyticsDashboard } from './components/Dashboard';
import {Login } from './components/ProtectedRoute/Login';
import { AuthProvider} from './components/ProtectedRoute/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';


// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/*" element={
//             <ProtectedRoute>
//               <DashboardLayout>
//                 <Routes>
//                   <Route path="/files" element={<FileManager />} />
//                   <Route path="/analytics" element={<AnalyticsDashboard />} />
//                   <Route path="/security" element={<SecuritySettings />} />
//                 </Routes>
//               </DashboardLayout>
//             </ProtectedRoute>
//           } />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;




// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/*" element={
//             <ProtectedRoute>
//               <DashboardLayout>
//                 <Routes>
//                   <Route path="/files" element={<FileManager />} />
//                   <Route path="/analytics" element={<AnalyticsDashboard />} />
//                   <Route path="/security" element={<SecuritySettings />} />
//                 </Routes>
//               </DashboardLayout>
//             </ProtectedRoute>
//           } />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;



function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="/files" element={<FileManager />} />
                  <Route path="/analytics" element={<AnalyticsDashboard />} />
                  <Route path="/security" element={<SecuritySettings />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;