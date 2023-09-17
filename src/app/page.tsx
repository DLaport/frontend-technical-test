import React from 'react';
import UserTable from '../../components/UserTable'; // Importez le composant UserTable

const App = () => (
  <div data-testid="appContainer">
    <h1>Majelan Homework !</h1>
    
    {/* Le composant UserTable est utilisé ici */}
    <UserTable />
  </div>
);

export default App;