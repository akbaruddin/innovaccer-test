import React, { useRef, useState } from 'react'
import { Row, Column, Card, Button, PageHeader, Message } from '@innovaccer/design-system';
import Sidebar from '../Sidebar';
import { ajaxInstance } from '../api'

function Upload() {
  const fileField = useRef(null)
  const [buttonText, setButtonText] = useState('Upload');
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);

  const uploadFile = () => {
    setButtonText('Uploading...');
    const formData = new FormData();
    formData.append('file', fileField.current.files[0]);
    ajaxInstance.post('patients', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
    .then(res => {
      setButtonText('Upload');
      console.log(res)
      if (res.status === 200) {
        fileField.current.value = null
        setSuccess(true);
      } else {
        setFail(true);
      }

      setTimeout(() => {
        setSuccess(false);
        setFail(false);
      }, 2000)
    })
  }

  return (
    <div style={{ height: "100vh" }}>
      <Row className="h-100">
        <Column size={2}>
          <Sidebar type="upload" />
        </Column>
        <Column size={10}>
          <PageHeader title="Upload Details of Patients" />
          <div className="p-5">
            <Card className="p-5">
              <div className="pt-6">
                <label>
                  <input type="file" ref={fileField} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                </label>
              </div>
              <div className="pt-6">
                <Button onClick={uploadFile}>
                  { buttonText }
                </Button>
              </div>
            </Card>

            <div className="pt-10">
              { success && (<Message appearance="success" navigationPosition="center" title="Your file has been successfully uploaded."></Message>)}
              { fail && (<Message appearance="alert" navigationPosition="center" title="Your file has some error."></Message>)}
            </div>
          </div>
        </Column>
      </Row>
    </div>
  )
}

export default Upload;
