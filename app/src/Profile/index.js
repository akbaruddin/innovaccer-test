import React, { useEffect, useState } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { Row, Column, Card, Avatar, PageHeader, Breadcrumbs } from '@innovaccer/design-system';
import Sidebar from '../Sidebar';
import { ajaxInstance } from '../api'
import './Profile.css';

function Profile(props) {
  const [user, setUserData] = useState([])
  let { userId } = useParams();

  useEffect(() => {
    ajaxInstance
      .get(`patients/${userId}`)
      .then(resp => {
        setUserData(resp.data[0])
      })
  }, [userId])

  const navOptions = {
    title: "Patient Details",
    breadcrumbs: (
      <Breadcrumbs
        list={[
          {
            label: 'Home',
            link: '/'
          }
        ]}
        onClick={link => props.history.push(link)}
      />
    )
  }

  return (
    <div style={{ height: "100vh" }}>
      <Row className="h-100">
        <Column size={2}>
          <Sidebar />
        </Column>
        <Column size={10}>
          <div className="p-5">
            <PageHeader {...navOptions} />
            <Card className="w-100 p-5 mt-5" shadow="medium">
              <Row>
                <Column size={2}>
                  <Avatar appearance="primary" firstName={user.firstName} lastName={user.lastName} className="larger" tooltipPosition="bottom" withTooltip />
                </Column>
                <Column size={10} className="pl-5">
                  <div className="">
                    <strong>Name:</strong> {user.firstName} {user.lastName}
                  </div>
                  <div className="pt-5">
                    <strong>Gender:</strong> {user.gender?.toUpperCase()}
                  </div>
                  <div className="pt-5">
                    <strong>Age:</strong> {user.age}
                  </div>
                  <div className="pt-5">
                    <strong>Contact:</strong> {user.contact}
                  </div>
                </Column>
              </Row>
            </Card>
          </div>
        </Column>
      </Row>
    </div>
  )
}

export default withRouter(Profile);
