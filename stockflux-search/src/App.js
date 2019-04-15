import React from 'react';
import Search from './components/Search';
import Titlebar from './components/Titlebar';

const App = () => {
    return (
        <>
            <Titlebar/>
            <Search
                favourites={{ codes: [], names: {} }}
                selection={{}}
            />
        </>
    );
};

export default App;
