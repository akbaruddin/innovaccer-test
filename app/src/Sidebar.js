import React from 'react';
import { Heading, Text } from '@innovaccer/design-system';
import { Link } from "react-router-dom";

export default function Sidebar(props) {
  return (
    <div>
      <Heading className="p-5">Patients</Heading>
      <div>
        <Link to="/" className={"w-100 px-5 py-4 d-block link " + (props.type === 'home' ? 'active': '') }>
          <Text >Home</Text>
        </Link>
        <Link to="/upload" className={"w-100 px-5 py-4 d-block link " + (props.type === 'upload' ? 'active': '') }>
          <Text >Upload Data</Text>
        </Link>
      </div>
    </div>
  )
}
