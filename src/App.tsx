import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { Alert, Button, Container, Col, Row, Table } from 'react-bootstrap';
import constants from './helpers/en';

function App() {
  const [userData, setUserData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    fetchData();
    const lSData = localStorage.getItem('userData');
    const items = JSON.parse(lSData || '{}');
    if (items) {
      setUserData(items);
    }
  }, []);

  const fetchData = async () => {
    const options = {
      method: 'GET',
      url: `${process.env.REACT_APP_API_BASE_URL}api`,
    };
    await axios
      .request(options)
      .then(function ({ data }: { data: Response }) {
        let apiResponse: any = data;
        setUserData(apiResponse?.results);
      })
      .catch(function (error: any) {
        setErrorMessage(error?.message);
      });
  };

  const handleRefreshBtnClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    setLoader(true);
    await fetchData();
    setLoader(false);
  };

  return (
    <div className="App">
      <div className="App-header">
        <section className="main-content p-5 w-100">
          <Container>
            <Row className="mb-5">
              <Col md={7}>
                <h1>{constants.USER_DETAILS_LABEL}</h1>
              </Col>
              <Col>
                <Button onClick={handleRefreshBtnClick} disabled={loader}>
                  {constants.REFRESH_BUTTON_LABEL}
                </Button>
              </Col>
            </Row>

            {errorMessage && (
              <Row className="mb-5">
                <Alert
                  variant="danger"
                  onClose={() => setErrorMessage('')}
                  dismissible
                >
                  <Alert.Heading>
                    {constants.ERROR_ALERT_HEADING_LABEL}
                  </Alert.Heading>
                  <p>{errorMessage}</p>
                </Alert>
              </Row>
            )}

            <Row>
              <Col>
                <Table striped bordered hover variant="dark">
                  <thead>
                    <tr>
                      <th>{constants.NAME_FIELD_TEXT}</th>
                      <th>{constants.EMAIL_FIELD_TEXT}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(userData) && userData.length > 0 ? (
                      userData.map((rowData: any, index: number) => {
                        return (
                          <tr key={index}>
                            <td>{`${rowData?.name?.title}. ${rowData?.name?.first} ${rowData?.name?.last}`}</td>
                            <td>{rowData?.email}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={2}>{constants.No_RECORDS_FOUND_LABEL}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </div>
  );
}

export default App;
