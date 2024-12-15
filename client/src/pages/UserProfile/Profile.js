/* eslint-disable react/jsx-pascal-case */
import { Fragment } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar.js';
import './Profile.scss';

function App() {
    return (
        <Fragment>
            {/* <div className="container">
                <Nav />
            </div> */}
            <div className="wrapper d-flex align-items-stretch" style={{ width: '100%' }}>
                <Sidebar />
                <div id="content" className="p-4 p-md-5 pt-5" style={{ backgroundColor: '#eee' }}>
                    <section className="mt-3" style={{ backgroundColor: '#eee' }}>
                        <div className="container">
                            <div className="row">
                                <Outlet />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            {/* <div>
        <Footer />
      </div> */}
        </Fragment>
    );
}

export default App;
