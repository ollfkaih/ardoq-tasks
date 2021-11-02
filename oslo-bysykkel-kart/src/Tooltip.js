import React from "react";

const Tooltip = ({name, num_bikes_available, num_docks_available}) => (
    <div id={'tooltip'}>
      <h3 className='name'> {name} </h3>
      <h4 className='row-title'> Available bikes: <strong>{num_bikes_available}</strong> </h4>
      <h4 className='row-title'> Available parking docks: <strong>{num_docks_available}</strong></h4>
    </div>
  );

export default Tooltip;