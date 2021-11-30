import React, { useEffect } from 'react';
import { useState } from 'react';
import { useLocation, useHistory } from 'react-router';
import { ClimbingBoxLoader } from 'react-spinners';
import { Row, Col, Card, Container } from 'reactstrap';
import hero2 from '../assets/images/hero-bg/hero-2.jpg';
import usersServices from '../services/usersService';
import toastr from 'toastr';
import debug from 'sabio-debug';

const _logger = debug.extend('login');

export default function ConfirmReg() {
  const history = useHistory();
  const urlParam = useLocation().search;

  const [ isEmailConfirmed, setIsEmailConfirmed ] = useState(false);

  useEffect(() => {
    let token = null;
    _logger('param:', urlParam);
    if (urlParam !== '') {
      token = urlParam.split('=')[1];
      usersServices.confirmReg(token).then(onConfirmSuccess).catch(onConfirmFail);
    }
  }, []);

  const onConfirmSuccess = (data) => {
    toastr['success']('Congratulations! Your email has been confirmed. Please log in.');
    setIsEmailConfirmed(true);
    setTimeout(() => history.push('/login'), 3000);
    _logger(data);
  };

  const onConfirmFail = (error) => {
    toastr['error'](
      'Something went wrong. Your email has not been confirmed. Please try again.'
    );
    setIsEmailConfirmed(false);
    _logger(error);
  };

  const successMessage = (
    <p className="font-size-lg mb-0 mt-5 text-black-50">
      Success! You will be redirected to the log in page in 3 seconds...
    </p>
  );

  const failMessage = (
    <p className="font-size-lg mb-0 mt-5 text-black-50">
      Something went wrong. Please contact the web administrator.
    </p>
  );

  return (
    <div className="app-wrapper min-vh-100 bg-white">
      <div className="hero-wrapper w-100 bg-composed-wrapper bg-midnight-bloom min-vh-100">
        <div className="flex-grow-1 w-100 d-flex align-items-center">
          <div
            className="bg-composed-wrapper--image opacity-6"
            style={{ backgroundImage: 'url(' + hero2 + ')' }}
          />
          <div className="bg-composed-wrapper--bg bg-second opacity-7" />
          <div className="bg-composed-wrapper--content p-3 p-md-5">
            <Container>
              <Card className="rounded-sm modal-content p-3 bg-white-10">
                <Card className="rounded-sm overflow-hidden shadow-xxl font-size-sm p-3 p-sm-0">
                  <Row className="no-gutters">
                    <Col
                      lg="12"
                      className="d-flex align-items-center justify-content-center flex-column"
                    >
                      <div className="divider-v divider-v-lg d-none d-lg-block" />
                      <div className="text-center mt-4">
                        <h1 className="font-size-xxl mb-1 mt-5 font-weight-bold">
                          Verifying Email
                        </h1>
                        <div className="p-5 m-5">
                          <ClimbingBoxLoader color={'var(--primary)'} loading={true} />
                          <br />
                          <br />
                          <div />
                          <p className="font-size-lg mb-0 mt-5 text-black-50">
                            Please wait while we verify your email.
                          </p>
                          {isEmailConfirmed ? successMessage : failMessage}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Card>
            </Container>
          </div>
        </div>
        <div className="hero-footer w-100 pb-4">
          <Container>
            <div className="py-3 font-size-xs text-center">
              <div className="text-center d-block mb-3 mb-md-0 text-white">
                Copyright &copy; World Print
              </div>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
}
